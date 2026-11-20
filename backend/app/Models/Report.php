<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $table = 'denuncia';
    protected $primaryKey = 'id_denuncia';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;
    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    protected $fillable = [
        'motivo_denuncia',
        'id_usuario_denunciou',
        'id_usuario_denunciado',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario_denunciou', 'id_usuario');
    }

    public function reportedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario_denunciado', 'id_usuario');
    }
}
