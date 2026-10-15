<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\User; // Tabela Usuario do banco de dados

use App\Models\Telephone; // Tabela Telefone do banco de dados

use App\Http\Resources\UserResource;

use App\Http\Requests\StoreUserRequest; // Validador de json enviado para POST

use App\Http\Requests\UpdateUserRequest; // Validador de json enviado para UPDATE

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // GET /api/user
    public function index() 
    {
        $users = User::select('id_usuario', 'nome', 'email', 'data_nasc')->get();
        
        return response()->json([
            'data' => UserResource::collection($users),
            'message' => 'Usuarios encontrados com sucesso',
        ]);
        return (UserResource::collection($users))->additional([
            
        ])->response()-setStatusCode(200);
    }

    // GET /api/user/{id}
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'data' => new UserResource($user),
            'message' => 'Usuário encontrado com sucesso!'
        ], 200);
    }
    
    // api/user - POST
    public function store(StoreUserRequest $request) {

    $user = DB::transaction(function() use ($request) {
        $user = User::create([
            'nome' => $request->name,
            'senha' => $request->password,
            'email' => $request->email,
            'data_nasc' => $request->date,
            'status_usuario' => 'Ativo',
            'num_denuncias_usuario' => 0,
        ]);

        if (isset($request['tel'])) {
                $cleanNumbers = preg_replace('/\D/', '', $request['tel']);
                
                if (strlen($cleanNumbers) == 11) {
                    $cleanNumbers = '55' . $cleanNumbers;
                }

                Telephone::create([
                    'id_usuario' => $user->id_usuario,
                    'telefone' => $cleanNumbers,
                ]);
            }

        return $user;
    });
       
        return response()->json([
            'data' => new UserResource($user),
            'message' => 'Conta criada com sucesso',
        ], 201);
    }

    // api/user/{id} - UPDATE
    public function update(UpdateUserRequest $request, $id) {
        $user = User::findOrFail($id);

        $validated = $request->validated();
        $data = [];

        $fieldMap = [
            'name' => 'nome' ,
            'email' => 'email',
            'cpf' => 'cpf',
            'date' => 'data_nasc',
            'password' => 'senha',
            'statusUser' => 'status_usuario',
            'numReport' => 'num_denuncias_usuario',
            'timeSusp' => 'tempo_suspensao',
            'isAdmin' => 'e_admin',
            'isProf' => 'e_profissional',
        ];

        foreach ($fieldMap as $requestKey => $dbColumn) {
            if (isset($validated[$requestKey]) && $requestKey != 'tel') {
                $data[$dbColumn] = $validated[$requestKey];
            } 
        }

        $saved = DB::transaction(function() use ($user, $data, $validated) {
            if (!empty($data)) {
                $user->update($data);
            }
            
            if (isset($validated['tel'])) {
                $cleanNumbers = preg_replace('/\D/', '', $validated['tel']);
                
                if (strlen($cleanNumbers) == 11) {
                    $cleanNumbers = '55' . $cleanNumbers;
                }

                Telephone::create([
                    'id_usuario' => $user->id_usuario,
                    'telefone' => $cleanNumbers,
                ]);
            }

            return $user;
        });
        

        return response()->json([
            'data' => new UserResource($saved),
            'message' => 'Usuário Atualizado com sucesso',
        ], 200);
    }
}
