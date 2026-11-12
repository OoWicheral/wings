<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $table = 'publicacoes';
    protected $primaryKey = 'id_publicacao';
    public $incrementing = true;
    protected $keyType = 'int';
    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    public function user(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'id_usuario', 'id_usuario');
    }
}
