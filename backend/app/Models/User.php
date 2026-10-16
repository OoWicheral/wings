<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Notifications\Notifiable;



use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use Notifiable;
    
    protected function casts(): array
    {
        return [
            'senha' => 'hashed', // Garante o hash automático
        ];
    }

    public function telephones() : HasMany {
        return $this->hasMany(Telephone::class, 'id_usuario', 'id_usuario');
    }

    public function getAuthPassword() {
        return $this->senha;
    }

    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $guarded = []; //Somente para uso fora de produção
}
