<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected function casts(): array
    {
        return [
            'senha' => 'hashed', // Garante o hash automático
        ];
    }

    public function telephones() : HasMany {
        return $this->hasMany(Telephone::class, 'id_usuario', 'id_usuario');
    }
    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = []; //Somente para uso fora de produção
}
