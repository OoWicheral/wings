<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Http\Resources\ProfileResource;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\DB;

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
            'avatar'        => 'foto_perfil',
            'statusProfile' => 'status_perfil',
        ];

        $data['id_usuario'] = $id;

        $saved = DB::transaction(function() use ($data) {
            return Profile::create($data);
        });

        return reponse()->json([
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
            'avatar'        => 'foto_perfil',
            'statusProfile' => 'status_perfil',
        ];

        foreach ($fieldMap as $requestKey => $dbColumn) {
            if (isset($validated[$requestKey])) {
                $data[$dbColumn] = $validated[$requestKey];
            }
        }

        $saved = DB::transaction(function() use ($profile, $data) {
            if (!empty($data)) {
                $profile->update($data);
            }
            return $profile;
        });

        return response()->json([
            'data'    => new ProfileResource($saved),
            'message' => 'Perfil Atualizado com Sucesso',
        ], 200);
    }

}
