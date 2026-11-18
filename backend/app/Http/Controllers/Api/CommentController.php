<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Publication;

class CommentController extends Controller
{
    public function index($id_publicacao)
    {
        $publication = Publication::findOrFail($id_publicacao);

        $comments = Comment::where('id_publicacao', $publication->id_publicacao)
            ->orderByDesc('criado_em')
            ->orderByDesc('id_comentario')
            ->cursorPaginate(15);

        return CommentResource::collection($comments);
    }

    public function show($id_publicacao, $id_comentario)
    {
        $publication = Publication::findOrFail($id_publicacao);
        $comment = Comment::where('id_publicacao', $publication->id_publicacao)
            ->findOrFail($id_comentario);

        return new CommentResource($comment);
    }

    public function store(StoreCommentRequest $request, $id_publicacao)
    {
        $publication = Publication::findOrFail($id_publicacao);
        $validated = $request->validated();

        $comment = Comment::create([
            'conteudo_comentario' => $validated['content'],
            'id_usuario' => auth()->id(),
            'id_publicacao' => $publication->id_publicacao,
        ]);

        return response()->json([
            'data' => new CommentResource($comment),
            'message' => 'Comentário criado com sucesso!',
        ], 201);
    }
}
