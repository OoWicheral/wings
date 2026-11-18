<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    protected $table = 'comentarios';
    protected $primaryKey = 'id_comentario';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'id_comentario',
        'conteudo_comentario',
        'status_comentario',
        'id_usuario',
        'id_publicacao',
    ];

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'id_publicacao', 'id_publicacao');
    }


}
