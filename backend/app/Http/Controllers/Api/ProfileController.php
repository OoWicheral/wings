<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Http\Resources\ProfileResource;

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
}
