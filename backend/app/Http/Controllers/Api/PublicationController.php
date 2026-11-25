<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicationResource;
use App\Models\Publication;
use App\Models\User;
use App\Http\Requests\StorePublicationRequest;
use App\Http\Requests\UpdatePublicationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{

    // GET /api/posts
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'cursor' => ['nullable', 'string'],
        ]);

        $search = trim($validated['search'] ?? '');

        $publications = Publication::with('user.profile')
            ->withCount('comments')
            ->when($search !== '', function ($query) use ($search) {
                $term = '%' . addcslashes($search, '%_\\') . '%';

                $query->where(function ($query) use ($term) {
                    $query->where('titulo_publicacao', 'like', $term)
                        ->orWhere('conteudo_publicacao', 'like', $term);
                });
            })
            ->orderByDesc('criado_em')
            ->orderByDesc('id_publicacao')
            ->cursorPaginate(15);

        return PublicationResource::collection($publications);
    }

    // GET /api/posts/search?q=term
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $term = $validated['q'];
        $publications = Publication::with('user.profile')
            ->withCount('comments')
            ->where(function ($query) use ($term) {
                $query->where('titulo_publicacao', 'like', "%{$term}%")
                    ->orWhere('conteudo_publicacao', 'like', "%{$term}%");
            })
            ->orderByDesc('criado_em')
            ->orderByDesc('id_publicacao')
            ->paginate(15);

        return PublicationResource::collection($publications);
    }

    // GET api/posts/{id}
    public function show($id_publicacao)
    {
        $publication = Publication::with('user.profile')
            ->withCount('comments')
            ->findOrFail($id_publicacao);
        return new PublicationResource($publication);
    }

    // GET /api/posts/mine
    public function authUserPosts()
    {
        $publications = Publication::with('user.profile')
            ->withCount('comments')
            ->where('id_usuario', auth()->id())
            ->latest('criado_em')
            ->paginate(15);

        return PublicationResource::collection($publications);
    }

    // GET /api/user/{id}/posts
    public function anyUserPosts($id)
    {
        $user = User::findOrFail($id);

        return PublicationResource::collection(
            $user->posts()
                ->with('user.profile')
                ->withCount('comments')
                ->latest('criado_em')
                ->paginate(15)
        );
    }

    // GET /api/posts/mine/{id_publicacao}
    public function authUserUniquePost($id_publicacao)
    {
        $publication = Publication::with('user.profile')
            ->withCount('comments')
            ->where('id_usuario', auth()->id())
            ->where('id_publicacao', $id_publicacao)
            ->firstOrFail();

        return new PublicationResource($publication);
    }

    // POST /api/posts
    public function store(StorePublicationRequest $request)
    {
        $validated = $request->validated();
        $imagePath = null;

        if ($request->hasFile('image')) {
            // Disco "public": é o mesmo usado pelo resource para montar a URL.
            $imagePath = $request->file('image')->store('publications', 'public');

            if ($imagePath === false) {
                abort(500, 'Não foi possível salvar a imagem da publicação.');
            }
        }

        try {
            $publication = DB::transaction(function () use ($validated, $imagePath) {
                return Publication::create([
                    'id_usuario' => auth()->id(),
                    'titulo_publicacao' => $validated['title'],
                    'conteudo_publicacao' => $validated['content'],
                    'img_anexo' => $imagePath ?? '',
                    'status_publicacao' => 'ativo',
                ]);
            });
            $publication->load('user.profile');
        } catch (\Throwable $exception) {
            if ($imagePath !== null) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $exception;
        }

        return response()->json([
            'data' => new PublicationResource($publication),
            'message' => 'Publicação criada com sucesso',
        ], 201);
    }

    // PUT / PATCH /api/posts/{id_publicacao}
    public function update(UpdatePublicationRequest $request, $id_publicacao)
    {
        $publication = Publication::where('id_usuario', auth()->id())
            ->findOrFail($id_publicacao);

        $validated = $request->validated();
        $data = [];

        $fieldMap = [
            'title' => 'titulo_publicacao',
            'content' => 'conteudo_publicacao',
            'statusPost' => 'status_publicacao',
        ];

        foreach ($fieldMap as $requestKey => $dbColumn) {
            if (isset($validated[$requestKey])) {
                $data[$dbColumn] = $validated[$requestKey];
            }
        }

        $oldImagePath = $publication->img_anexo;
        $newImagePath = null;

        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('publications', 'public');

            if ($newImagePath === false) {
                abort(500, 'Não foi possível salvar a imagem da publicação.');
            }

            $data['img_anexo'] = $newImagePath;
        }

        try {
            $saved = DB::transaction(function () use ($publication, $data) {
                if (!empty($data)) {
                    $publication->update($data);
                }

                return $publication->refresh();
            });
            $saved->load('user.profile');
        } catch (\Throwable $exception) {
            if ($newImagePath !== null && !Storage::disk('public')->delete($newImagePath)) {
                Log::warning('Não foi possível remover a nova imagem após falha ao atualizar publicação.', [
                    'publication_id' => $publication->id_publicacao,
                    'image_path' => $newImagePath,
                ]);
            }

            throw $exception;
        }

        if ($newImagePath !== null && $oldImagePath !== null
            && !Storage::disk('public')->delete($oldImagePath)) {
            Log::warning('Não foi possível remover a imagem antiga da publicação.', [
                'publication_id' => $publication->id_publicacao,
                'image_path' => $oldImagePath,
            ]);
        }

        return response()->json([
            'data' => new PublicationResource($saved),
            'message' => 'Publicação atualizada com sucesso',
        ], 200);
    }

    // DELETE /api/posts/{id_publicacao}
    public function destroy($id_publicacao)
    {
        $publication = Publication::where('id_usuario', auth()->id())
            ->findOrFail($id_publicacao);

        $imagePath = $publication->img_anexo;
        DB::transaction(function () use ($publication) {
            $publication->comments()->delete();
            $publication->delete();
        });

        if ($imagePath !== null && !Storage::disk('local')->delete($imagePath)) {
            Log::warning('Não foi possível remover a imagem da publicação excluída.', [
                'publication_id' => $publication->id_publicacao,
                'image_path' => $imagePath,
            ]);
        }

        return response()->json([
            'message' => 'Publicação excluída com sucesso',
        ], 200);
    }
}
