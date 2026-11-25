<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MessagesProfessional extends Model
{
    protected $table = 'mensagem_chat_profissional';
    protected $primaryKey = 'id_msg';

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'modificado_em';

    protected $fillable = [
        'conteudo_msg',
        'anexo_msg',
        'audio',
        'id_usuario',
        'id_chat_profissional',
    ];

    // Os caminhos internos não vão para o cliente; só as URLs assinadas abaixo.
    protected $hidden = [
        'anexo_msg',
        'audio',
    ];

    protected $appends = ['anexo_url', 'audio_url'];

   public function getAnexoUrlAttribute()
    {
        return $this->anexo_msg
            ? route('chat.message.file', [
                'chatId'    => $this->id_chat_profissional,
                'messageId' => $this->id_msg,
                'type'      => 'anexo'
            ])
            : null;
    }

    public function getAudioUrlAttribute()
    {
        return $this->audio
            ? route('chat.message.file', [
                'chatId'    => $this->id_chat_profissional,
                'messageId' => $this->id_msg,
                'type'      => 'audio'
            ])
            : null;
    }

    // Pertence a um chat
    public function chat()
    {
        return $this->belongsTo(ChatProfessional::class, 'id_chat_profissional', 'id_chat_profissional');
    }

    // Quem enviou a mensagem
    public function sender()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }
}
