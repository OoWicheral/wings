CREATE DATABASE Wings;
USE Wings;

/* Tabela de Usuários */
CREATE TABLE usuario(
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(11) NULL,
    nome VARCHAR(50) NOT NULL,
    senha VARCHAR(60) NOT NULL,
    email VARCHAR(150) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modificado_em TIMESTAMP NULL DEFAULT NULL,
    e_admin BOOLEAN DEFAULT FALSE NOT NULL,
    e_profissional BOOLEAN DEFAULT FALSE NOT NULL,
    status_usuario VARCHAR(8) NOT NULL,
    num_denuncias_usuario INT NOT NULL CHECK (num_denuncias_usuario > -1) ,
    tempo_suspensao DATE NULL,
    ultimo_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_nasc DATE NOT NULL
);

/* Tabela "especialização" usuario */
CREATE TABLE profissional(
	id_usuario INT PRIMARY KEY,
    crp_regiao CHAR(2) NOT NULL,
    crp_num VARCHAR(12) NOT NULL,
    cip VARCHAR(260) NOT NULL,
    regu_crp VARCHAR(260) NOT NULL,
    e_psi VARCHAR(260) NULL,
    registro_status VARCHAR(9) NOT NULL,
    data_expira_certificado DATE NOT NULL,
    e_psi_autorizacao BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT fk_usuario_profissional
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/* Tabela perfil "fraca", depende do usuario */
CREATE TABLE perfil(
	id_usuario INT,
	nome_perfil VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modificado_em TIMESTAMP NULL DEFAULT NULL,
    foto_perfil VARCHAR(260) NULL,
    bio_perfil VARCHAR(250) NULL,
    status_perfil VARCHAR(8) NOT NULL,
    CONSTRAINT fk_perfil_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/* Tabela telefones */
CREATE TABLE telefones(
	id_usuario INT,
    telefone VARCHAR(13) NOT NULL,
    CONSTRAINT fk_telefone_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/* Tabela denuncia */
CREATE TABLE denuncia(
	id_denuncia INT AUTO_INCREMENT PRIMARY KEY,
    motivo_denuncia VARCHAR(200) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_denuncia VARCHAR(10) NOT NULL,
    id_usuario_denunciou INT,
    id_usuario_denunciado INT,
    CONSTRAINT fk_denunciou
    FOREIGN KEY (id_usuario_denunciou) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_denunciado
    FOREIGN KEY (id_usuario_denunciado) REFERENCES usuario(id_usuario)
);

/* Tabela publicações */
CREATE TABLE publicacoes(
	id_publicacao INT AUTO_INCREMENT PRIMARY KEY,
    titulo_publicacao VARCHAR(50) NOT NULL,
    conteudo_publicacao VARCHAR(500) NOT NULL,
    img_anexo VARCHAR(260) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	modificado_em TIMESTAMP NULL DEFAULT NULL,
    status_publicacao VARCHAR(9) NOT NULL,
    id_usuario INT,
    CONSTRAINT fk_usuario_publicacao
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/* Tabela comentarios */
CREATE TABLE comentarios(
	id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    conteudo_comentario VARCHAR(150) NOT NULL,
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	modificado_em TIMESTAMP NULL DEFAULT NULL,
    status_comentario VARCHAR(8) NOT NULL,
    id_usuario INT,
    id_publicacao INT,
    CONSTRAINT fk_comentario_publicacao
    FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao),
    CONSTRAINT fk_comentario_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/* Tabela Chat Profissional */
CREATE TABLE chat_profissional(
	id_chat_profissional INT AUTO_INCREMENT PRIMARY KEY,
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

/* Tabela Participantes, referente ao chat com profissional */
CREATE TABLE participantes_chat_profissional(
	limpo_em TIMESTAMP NULL DEFAULT NULL,
    id_usuario INT,
    id_chat_profissional INT,
    CONSTRAINT fk_usuario_participante
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_participante_chat
    FOREIGN KEY (id_chat_profissional) REFERENCES chat_profissional(id_chat_profissional)
);

/* Tabela Mensagens, para mensagens enviada dentro do chat com o profissional */
CREATE TABLE mensagem_chat_profissional(
	id_msg INT AUTO_INCREMENT PRIMARY KEY,
    conteudo_msg VARCHAR(1000) NULL,
    anexo_msg VARCHAR(260) NULL,
    audio VARCHAR(260) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	modificado_em TIMESTAMP NULL DEFAULT NULL,
    id_usuario INT,
    id_chat_profissional INT,
    CONSTRAINT fk_mensagem_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_mensagem_chat
    FOREIGN KEY (id_chat_profissional) REFERENCES chat_profissional(id_chat_profissional)
);

/* Tabela Chat IA */
CREATE TABLE chat_ia(
	id_chat_ia INT AUTO_INCREMENT PRIMARY KEY,
    titulo_chat_ia VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	status_chat_ia VARCHAR(8) NOT NULL,
    id_usuario INT,
    CONSTRAINT fk_usuario_ia
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/* Tabela Mensagen, referente a mensagens trocadas dentro de um Chat IA */
CREATE TABLE mensagens_ia(
	id_msg INT AUTO_INCREMENT PRIMARY KEY,
    conteudo_msg VARCHAR(10000) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	modificado_em TIMESTAMP NULL DEFAULT NULL,
    id_usuario INT,
    id_chat INT,
    CONSTRAINT fk_mensagem_usuario_ia
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_mensagem_chat_ia
    FOREIGN KEY (id_chat) REFERENCES chat_ia(id_chat_ia)
);