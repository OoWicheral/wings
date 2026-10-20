<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
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

    /** AUTENTICAÇÃO JWT */
    // Funções padrão da biblioteca
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
