<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Http\Resources\ProfileResource;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreProfileRequest;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    // GET /api/user/{id}/profile
    public function show($id)
    {
        $profile = Profile::where('id_usuario', $id)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Perfil não encontrado para este usuário.'
            ], 404);
        }

        return response()->json([
            'data' => new ProfileResource($profile),
            'message' => 'Perfil encontrado com sucesso!'
        ], 200);
    }

    //POST /api/user/{id}/profile
    public function store(StoreProfileRequest $request, $id) {

        User::findOrFail($id);

        $exists = Profile::where('id_usuario', $id)->exists();
        if ($exists) {
            return response()->json([
                'message' => 'Este usuário já possui um perfil cadastrado'
            ], 400);
        }

        $validated = $request->validated();
        $data = [];

        $fieldMap = [
            'nameProfile'   => 'nome_perfil',
            'bio'           => 'bio_perfil',
            'statusProfile' => 'status_perfil',
        ];

        foreach ($fieldMap as $requestKey => $dbColumn) {
            if (isset($validated[$requestKey])) {
                $data[$dbColumn] = $validated[$requestKey];
            }
        }

        // Foto de perfil: arquivo enviado ou caminho já existente.
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('perfil', 'public');

            if ($avatarPath === false) {
                abort(500, 'Não foi possível salvar a foto de perfil.');
            }

            $data['foto_perfil'] = $avatarPath;
        } elseif (isset($validated['avatar']) && is_string($validated['avatar'])) {
            $data['foto_perfil'] = $validated['avatar'];
        }

        $data['id_usuario'] = $id;

        $saved = DB::transaction(function() use ($data) {
            return Profile::create($data);
        });

        return response()->json([
            'data'    => new ProfileResource($saved),
            'message' => 'Perfil criado com sucesso!',
        ], 201);
    }

    // UPDATE /api/user/{id}/profile
    public function update(UpdateProfileRequest $request, $id) {
        $profile = Profile::findOrFail($id);

        $validated = $request->validated();
        $data = [];

        $fieldMap = [
            'nameProfile'   => 'nome_perfil',
            'bio'           => 'bio_perfil',
            'statusProfile' => 'status_perfil',
        ];

        foreach ($fieldMap as $requestKey => $dbColumn) {
            if (isset($validated[$requestKey])) {
                $data[$dbColumn] = $validated[$requestKey];
            }
        }

        $oldAvatarPath = $profile->foto_perfil;
        $newAvatarPath = null;

        // Foto de perfil: arquivo enviado ou caminho já existente.
        if ($request->hasFile('avatar')) {
            $newAvatarPath = $request->file('avatar')->store('perfil', 'public');

            if ($newAvatarPath === false) {
                abort(500, 'Não foi possível salvar a foto de perfil.');
            }

            $data['foto_perfil'] = $newAvatarPath;
        } elseif (isset($validated['avatar']) && is_string($validated['avatar'])) {
            $data['foto_perfil'] = $validated['avatar'];
        }

        try {
            $saved = DB::transaction(function() use ($profile, $data) {
                if (!empty($data)) {
                    $profile->update($data);
                }
                return $profile->refresh();
            });
        } catch (\Throwable $exception) {
            if ($newAvatarPath !== null) {
                Storage::disk('public')->delete($newAvatarPath);
            }

            throw $exception;
        }

        // Remove a foto antiga quando ela foi substituída.
        if ($newAvatarPath !== null && $oldAvatarPath !== null
            && !Storage::disk('public')->delete($oldAvatarPath)) {
            Log::warning('Não foi possível remover a foto de perfil anterior.', [
                'user_id' => $id,
                'avatar_path' => $oldAvatarPath,
            ]);
        }

        return response()->json([
            'data'    => new ProfileResource($saved),
            'message' => 'Perfil Atualizado com Sucesso',
        ], 200);
    }

}
