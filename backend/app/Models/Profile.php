<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $table = 'perfil';
    public $incrementing = false;
    protected $primaryKey = 'id_usuario';
    
    public $timestamps = true; 
    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    protected $attributes = [
        'status_perfil' => 'ativo', 
    ];

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }
}
