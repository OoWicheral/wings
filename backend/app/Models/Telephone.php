<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class telephone extends Model
{
    protected $table = 'telefones';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;
    protected $guarded = []; //Somente para uso fora de produção
}
