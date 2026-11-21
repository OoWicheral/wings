<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Publication;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{   
    // GET /posts/{id_publicacao}/comments
    public function index($id_publicacao)
    {
        $publication = Publication::findOrFail($id_publicacao);

        $comments = Comment::with('user.profile')
            ->where('id_publicacao', $publication->id_publicacao)
            ->orderByDesc('criado_em')
            ->orderByDesc('id_comentario')
            ->cursorPaginate(15);

        return CommentResource::collection($comments);
    }

    // GET /posts/{id_publicacao}/comments/{id_comentario}
    public function show($id_publicacao, $id_comentario)
    {
        $publication = Publication::findOrFail($id_publicacao);
        $comment = Comment::with('user.profile')
            ->where('id_publicacao', $publication->id_publicacao)
            ->findOrFail($id_comentario);

        return new CommentResource($comment);
    }

    // POST /posts/{id_publicacao}/comments
    public function store(StoreCommentRequest $request, $id_publicacao)
    {
        $publication = Publication::findOrFail($id_publicacao);
        $validated = $request->validated();

        $comment = Comment::create([
            'conteudo_comentario' => $validated['content'],
            'id_usuario' => auth()->id(),
            'id_publicacao' => $publication->id_publicacao,
        ]);
        $comment->load('user.profile');

        return response()->json([
            'data' => new CommentResource($comment),
            'message' => 'Comentário criado com sucesso!',
        ], 201);
    }

    // PUT/PATCH /posts/{id_publicacao}/comments/{id_comentario}
    public function update(UpdateCommentRequest $request, $id_publicacao, $id_comentario)
    {
        $publication = Publication::findOrFail($id_publicacao);
        $comment = Comment::with('user.profile')
            ->where('id_publicacao', $publication->id_publicacao)
            ->where('id_usuario', auth()->id())
            ->findOrFail($id_comentario);

        $validated = $request->validated();

        $comment = DB::transaction(function () use ($comment, $validated) {
            if (isset($validated['content'])) {
                $comment->update([
                    'conteudo_comentario' => $validated['content'],
                ]);
            }

            return $comment->refresh();
        });

        return response()->json([
            'data' => new CommentResource($comment),
            'message' => 'Comentário atualizado com sucesso!',
        ], 200);
    }
}
