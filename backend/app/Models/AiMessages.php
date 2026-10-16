<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiMessages extends Model
{
    protected $table = 'mensagens_ia';
    protected $primaryKey = 'id_msg';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;
    const CREATED_AT = 'criado_em'; // Altera o nome padrão das colunas timestamps
    const UPDATED_AT = 'modificado_em';
}
