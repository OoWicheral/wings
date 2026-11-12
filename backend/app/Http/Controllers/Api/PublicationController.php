<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicationResource;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Http\Request;

class PublicationController extends Controller
{

    // GET /api/posts
    public function index()
    {
        $publications = Publication::orderByDesc('criado_em')
            ->orderByDesc('id_publicacao')
            ->paginate(15);

        return PublicationResource::collection($publications);
    }

    // GET /api/posts/mine
    public function authUserPosts()
    {
        $publications = Publication::where('id_usuario', auth()->id())
            ->latest('criado_em')
            ->paginate(15);

        return PublicationResource::collection($publications);
    }

    // GET /api/user/{id}/posts
    public function anyUserPosts($id)
    {
        $user = User::findOrFail($id);

        return PublicationResource::collection(
            $user->posts()->latest('criado_em')->paginate(15)
        );
    }

    // GET /api/posts/mine/{id_publicacao}
    public function authUserUniquePost($id_publicacao)
    {
        $publication = Publication::where('id_usuario', auth()->id())
            ->where('id_publicacao', $id_publicacao)
            ->firstOrFail();

        return new PublicationResource($publication);
    }

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Publication $publication)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $publication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Publication $publication)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Publication $publication)
    {
        //
    }
}
