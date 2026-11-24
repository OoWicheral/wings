<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProfessionalRequest;
use App\Http\Requests\UpdateProfessionalRequest;
use App\Http\Resources\ProfessionalResource;
use App\Models\Professional;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProfessionalController extends Controller
{
    // GET /api/professionals
    public function index()
    {
        $professionals = Professional::orderBy('id_usuario')->paginate(15);

        return ProfessionalResource::collection($professionals);
    }

    // GET /api/user/{id}/professional
    public function show($id)
    {
        $professional = Professional::findOrFail($id);

        return response()->json([
            'data' => new ProfessionalResource($professional),
            'message' => 'Profissional encontrado com sucesso.',
        ]);
    }

    // POST /api/user/{id}/professional
    public function store(StoreProfessionalRequest $request, $id)
    {
        $this->ensureOwner($id);

        if (Professional::where('id_usuario', $id)->exists()) {
            return response()->json([
                'message' => 'Este usuário já possui cadastro profissional.',
            ], 409);
        }

        $validated = $request->validated();
        $storedPaths = [];

        $data = [
            'id_usuario' => $id,
            'crp_regiao' => $validated['crpRegion'],
            'crp_num' => $validated['crpNumber'],
            'registro_status' => $validated['registerStatus'],
            'data_expira_certificado' => $validated['certificateExpiring'],
            'e_psi_autorizacao' => $validated['epsiAuth'],
        ];

        try {
            foreach ([
                'cip' => 'cip',
                'crpRegularity' => 'regu_crp',
                'ePsi' => 'e_psi',
            ] as $requestField => $databaseColumn) {
                if (!$request->hasFile($requestField)) {
                    continue;
                }

                $path = $request->file($requestField)->store('professionals', 'public');

                if ($path === false) {
                    abort(500, 'Não foi possível salvar um dos documentos profissionais.');
                }

                $storedPaths[] = $path;
                $data[$databaseColumn] = $path;
            }

            $professional = DB::transaction(function () use ($data) {
                return Professional::create($data);
            });
        } catch (Throwable $exception) {
            foreach ($storedPaths as $path) {
                if (!Storage::disk('local')->delete($path)) {
                    Log::warning('Não foi possível remover um documento após falha ao criar o cadastro profissional.', [
                        'user_id' => $id,
                        'file_path' => $path,
                    ]);
                }
            }

            throw $exception;
        }

        return response()->json([
            'data' => new ProfessionalResource($professional),
            'message' => 'Cadastro profissional criado com sucesso.',
        ], 201);
    }

    // PUT/PATCH /api/user/{id}/professional
    public function update(UpdateProfessionalRequest $request, $id)
    {
        $this->ensureOwner($id);

        $professional = Professional::findOrFail($id);
        $validated = $request->validated();

        $fieldMap = [
            'crpRegion' => 'crp_regiao',
            'crpNumber' => 'crp_num',
            'registerStatus' => 'registro_status',
            'certificateExpiring' => 'data_expira_certificado',
            'epsiAuth' => 'e_psi_autorizacao',
        ];

        $data = [];
        foreach ($fieldMap as $requestField => $databaseColumn) {
            if (array_key_exists($requestField, $validated)) {
                $data[$databaseColumn] = $validated[$requestField];
            }
        }

        $oldPaths = [];
        if (array_key_exists('ePsi', $validated) && $validated['ePsi'] === null) {
            $oldPaths[] = $professional->e_psi;
            $data['e_psi'] = null;
        }

        $storedPaths = [];
        try {
            foreach ([
                'cip' => 'cip',
                'crpRegularity' => 'regu_crp',
                'ePsi' => 'e_psi',
            ] as $requestField => $databaseColumn) {
                if (!$request->hasFile($requestField)) {
                    continue;
                }

                $path = $request->file($requestField)->store('professionals', 'public');

                if ($path === false) {
                    abort(500, 'Não foi possível salvar um dos documentos profissionais.');
                }

                $storedPaths[] = $path;
                $oldPaths[] = $professional->{$databaseColumn};
                $data[$databaseColumn] = $path;
            }

            $saved = DB::transaction(function () use ($professional, $data) {
                if ($data !== []) {
                    $professional->update($data);
                }

                return $professional->refresh();
            });
        } catch (Throwable $exception) {
            foreach ($storedPaths as $path) {
                if (!Storage::disk('local')->delete($path)) {
                    Log::warning('Não foi possível remover um documento após falha ao atualizar o cadastro profissional.', [
                        'user_id' => $id,
                        'file_path' => $path,
                    ]);
                }
            }

            throw $exception;
        }

        foreach (array_filter($oldPaths) as $path) {
            if (!Storage::disk('local')->delete($path)) {
                Log::warning('Não foi possível remover um documento profissional substituído.', [
                    'user_id' => $id,
                    'file_path' => $path,
                ]);
            }
        }

        return response()->json([
            'data' => new ProfessionalResource($saved),
            'message' => 'Cadastro profissional atualizado com sucesso.',
        ]);
    }

    private function ensureOwner($id): void
    {
        abort_unless((int) auth()->id() === (int) $id, 403);
    }
}
