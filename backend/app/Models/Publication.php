<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Publication extends Model
{
    protected $table = 'publicacoes';
    protected $primaryKey = 'id_publicacao';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'id_usuario',
        'titulo_publicacao',
        'conteudo_publicacao',
        'img_anexo',
        'status_publicacao',
    ];

    protected $attributes = [
        'status_publicacao' => 'ativo',
        'img_anexo' => '',
    ];

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'id_publicacao', 'id_publicacao');
    }
}
