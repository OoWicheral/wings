<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatParticipants extends Model
{
    protected $table = 'participantes_chat_profissional';
    protected $primaryKey = null;
    public $incrementing = false;

    public $timestamps = false;

    protected $hidden = [
        'limpo_em',
        'id_chat_profissional', // Opcional: já vem no objeto pai do chat
    ];

    protected $fillable = [
        'id_usuario',
        'id_chat_profissional',
        'limpo_em',
    ];

    protected $casts = [
        'limpo_em' => 'datetime',
    ];

    public function chat()
    {
        return $this->belongsTo(ChatProfessional::class, 'id_chat_profissional', 'id_chat_profissional');
    }

    public function perfil()
    {
        return $this->belongsTo(Profile::class, 'id_usuario', 'id_usuario');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }
}
