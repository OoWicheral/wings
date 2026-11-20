<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // GET /api/reports/mine -> Retorna todas as denúncias feitas pelo usuário autenticado
    public function authUserReports()
    {
        $reports = Report::where('id_usuario_denunciou', auth()->id())
            ->latest('criado_em')
            ->cursorPaginate(15);

        return ReportResource::collection($reports);
    }

    // GET /api/user/{id}/reports -> Retorna todas as denúncias em que um usuário foi denunciado
    public function anyUserReports($id)
    {
        $user = User::findOrFail($id);

        $reports = $user->reported()
            ->latest('criado_em')
            ->cursorPaginate(15);

        return ReportResource::collection($reports);
    }

    // GET /api/reports
    public function index()
    {
        $reports = Report::orderByDesc('criado_em')
            ->orderByDesc('id_denuncia')
            ->cursorPaginate(15);
        
        return ReportResource::collection($reports);
    }

    // GET /api/reports/{id_denuncia}
    public function show($id_denuncia)
    {
        $report = Report::findOrFail($id_denuncia);
        return new ReportResource($report);
    }

    // POST /api/reports
    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();

        $report = DB::transaction(function () use ($validated) {
            return Report::create([
                'motivo_denuncia' => $validated['report'],
                'id_usuario_denunciou' => auth()->id(),
                'id_usuario_denunciado' => $validated['reportedUserId'],
            ]);
        });

        return response()->json([
            'data' => new ReportResource($report),
            'message' => 'Denúncia registrada com sucesso!'
        ], 201);
    }

    // PUT/PATCH /api/reports/{id_denuncia}
    public function update(UpdateReportRequest $request, $id_denuncia)
    {
        $report = Report::where('id_usuario_denunciou', auth()->id())
            ->findOrFail($id_denuncia);

        $validated = $request->validated();

        $report = DB::transaction(function () use ($report, $validated) {
            $report->update([
                'motivo_denuncia' => $validated['report'],
            ]);

            return $report->refresh();
        });

        return response()->json([
            'data' => new ReportResource($report),
            'message' => 'Denúncia atualizada com sucesso!',
        ], 200);
    }
}