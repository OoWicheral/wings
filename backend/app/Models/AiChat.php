<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiChat extends Model
{
    protected $table = 'chat_ia';
    protected $primaryKey = 'id_chat_ia';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;
    const CREATED_AT = 'criado_em'; // Altera o nome padrão das colunas timestamps
    const UPDATED_AT = 'modificado_em';
}
