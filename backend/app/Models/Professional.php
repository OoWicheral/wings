<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Professional extends Model
{
    protected $table = 'profissional';
    protected $primaryKey = 'id_usuario';
    public $incrementing = false;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'crp_regiao',
        'crp_num',
        'cip',
        'regu_crp',
        'e_psi',
        'registro_status',
        'data_expira_certificado',
        'e_psi_autorizacao',
        'id_usuario',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'id_usuario', 'id_usuario');
    }

    /*
      O banco ao vivo nomeia a coluna como data_expira_certified, enquanto o
      db/wing.sql usa data_expira_certificado. Este par accessor/mutator mantém
      o restante do código falando o nome do schema sem exigir um ALTER TABLE.
    */
    public function getDataExpiraCertificadoAttribute(): ?string
    {
        return $this->attributes['data_expira_certified']
            ?? $this->attributes['data_expira_certificado']
            ?? null;
    }

    public function setDataExpiraCertificadoAttribute($value): void
    {
        $this->attributes['data_expira_certified'] = $value;
    }
}
