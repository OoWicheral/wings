<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    public function user(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'id_usuario', 'id_usuario');
    }
}
