<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // /api/ - GET
    public function index() 
    {
        try {
            $users = User::select('id_usuario', 'nome', 'email', 'data_nasc')->get();
            return (UserResource::collection($users))->additional([
                'message' => "Usuários encontrados com sucesso",
            ], 200);
        } catch (QueryException $e) {
            return reponse()->json([
                'message' => 'Erro ao carregar os dados do servidor',
                'error' => $e,
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro inesperado',
                'error' => $e,
            ], 500); 
        }
    }

    // /api/{id} - GET
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return (new UserResource($user))->additional([
                'message' => "Usuário $user->nome encontrado com sucesso",
            ], 200);
        } catch (\NotFoundHttpException $e) {
            return response()->json([
                'message' => "Usuário $id não existe",
                'error' => $e,
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro inesperado',
                'error' => $e,
            ], 500);
        }
    }
    
    // api/user - POST
    public function store(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:50',
                'email' => 'required|email|unique:usuario,email',
                'password' => 'required|string',
                'date' => 'required|date',
            ]);
            
            // Verifica se todos os campos foram validados
            if ($validator->fails()) {
                $errors = $validator->errors();

                return response()->json([
                    'error' => $errors->all(),
                    'message' => 'Erro ao tentar criar usuário' 
                ], 400);
            }

            $validadeRequest = $validator->validated();

            $user_created = User::create([
                'nome' => $validadeRequest['name'],
                'senha' => $validadeRequest['password'],
                'email' => $validadeRequest['email'],
                'data_nasc' => $validadeRequest['date'],
                'status_usuario' => 'Ativo',
                'num_denuncias_usuario' => 0,
            ]);
    
            return response()->json([
                'data' => $validadeRequest,
                'message' => "Conta criada com sucesso",
            ], 201);
        } catch (\QueryException $e)  { // Exception do banco de dados
            return response()->json([
                'message' => 'Erro ao criar conta',
                'error' => $e,
            ], 500);
        } catch (\Exception $e)  { // Exception inesperadas
            return response()->json([
                'message' => 'Ocorreu um erro inseperado',
                'error' => $e,
            ], 500);
        }
    } 
}
