<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatProfessional extends Model
{
    protected $table = 'chat_profissional';
    protected $primaryKey = 'id_chat_profissional';

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = null;

    protected $fillable = [];

    // Um chat possui vários registros na tabela de participantes
    public function participants()
    {
        return $this->hasMany(ChatParticipants::class, 'id_chat_profissional', 'id_chat_profissional');
    }

    // Um chat possui várias mensagens
    public function messages()
    {
        return $this->hasMany(MessagesProfessional::class, 'id_chat_profissional', 'id_chat_profissional');
    }

    // Última mensagem, usada no resumo da lista de conversas.
    public function latestMessage()
    {
        return $this->hasOne(MessagesProfessional::class, 'id_chat_profissional', 'id_chat_profissional')
            ->latestOfMany('id_msg');
    }
}
