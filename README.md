# Wings: Crie Asas

O **Wings** é uma aplicação web criada para apoiar pessoas que enfrentam diferentes formas de dependência, oferecendo um espaço digital de acolhimento, orientação e conexão com ajuda profissional.

A proposta combina **Inteligência Artificial, acompanhamento profissional e uma comunidade de apoio** em um único ambiente. Por meio do chatbot de IA, os usuários podem buscar informações, esclarecer dúvidas e encontrar direcionamento para procurar ajuda especializada. Além disso, a plataforma conta com uma comunidade onde é possível compartilhar experiências, acompanhar jornadas de superação e encontrar inspiração em histórias de outras pessoas.

O Wings nasceu da necessidade de tornar o processo de busca por apoio **mais acessível, acolhedor e próximo da realidade de quem precisa de ajuda**. Mais do que uma aplicação web, o projeto busca utilizar a tecnologia para enfrentar um problema real e criar uma experiência que incentive pessoas a dar o primeiro passo em direção à recuperação.

> **Tecnologia para aproximar pessoas da ajuda que elas precisam.**

## Funcionalidades

Para cumprir sua proposta, o **Wings** reúne diferentes recursos voltados à busca por informação, interação com profissionais, compartilhamento de experiências e acompanhamento da jornada de seus usuários.

### Chatbot de IA

O Wings oferece um **chatbot baseado em Inteligência Artificial** para que os usuários possam conversar, esclarecer dúvidas e buscar orientações relacionadas às suas experiências.

A IA foi pensada como um **ponto de apoio e orientação inicial**, ajudando o usuário a compreender melhor sua situação e, quando necessário, direcionando-o para a busca de acompanhamento profissional. Ela **não substitui psicólogos ou outros profissionais da área da saúde**.

### Comunidade

A plataforma conta com uma **comunidade integrada**, criada para incentivar o compartilhamento de experiências e a construção de um ambiente de apoio entre os usuários.

Nela, os usuários podem criar **publicações sobre suas jornadas**, compartilhar conquistas, experiências e aprendizados, além de interagir com outras pessoas por meio de **comentários**.

A proposta é criar um espaço no qual diferentes histórias possam ser compartilhadas e servir como fonte de identificação, motivação e apoio.

### Contato com Profissionais

O Wings permite que usuários encontrem e iniciem **conversas com profissionais da área de psicologia** dentro da própria plataforma.

Essa funcionalidade busca aproximar pessoas que procuram ajuda de profissionais disponíveis para orientação e acompanhamento, tornando o processo de acesso ao suporte especializado mais simples e centralizado.

### Perfis de Usuário

A plataforma possui diferentes perfis de utilização, contemplando **pessoas que buscam apoio** e **profissionais de psicologia**.

Cada perfil possui informações e recursos adequados ao seu contexto de utilização, permitindo diferenciar as experiências e interações disponíveis para cada tipo de usuário.

### Jornada de Superação

A integração entre **IA, comunidade e profissionais de psicologia** permite que o Wings reúna diferentes formas de apoio em um único ambiente.

A plataforma busca acompanhar diferentes momentos da jornada do usuário, desde a busca inicial por informações e esclarecimento de dúvidas até a interação com profissionais e o compartilhamento de experiências com outras pessoas.

## Estrutura do Sistema

Além das funcionalidades oferecidas ao usuário, o Wings possui uma estrutura responsável por armazenar e organizar os dados necessários para o funcionamento da plataforma.

O sistema gerencia informações relacionadas a:

### Pessoas

Cadastro e gerenciamento dos dados dos usuários que utilizam a plataforma em busca de apoio.

### Profissionais de Psicologia

Cadastro e gerenciamento das informações dos profissionais, permitindo identificá-los e vinculá-los às interações realizadas dentro da plataforma.

### Publicações da Comunidade

Armazenamento das publicações compartilhadas pelos usuários, incluindo os conteúdos relacionados às suas experiências e jornadas de superação.

### Comentários

Registro dos comentários realizados nas publicações da comunidade, permitindo a interação entre os usuários.

### Conversas com a IA

Gerenciamento das conversas iniciadas entre os usuários e o chatbot de Inteligência Artificial.

### Mensagens com a IA

Armazenamento das mensagens enviadas durante as conversas com o chatbot, permitindo manter o histórico das interações.

### Conversas com Profissionais

Gerenciamento das conversas estabelecidas entre usuários e profissionais da área de psicologia.

### Mensagens entre Usuários e Profissionais

Registro das mensagens trocadas durante as conversas entre usuários e profissionais, mantendo o histórico de cada interação.

### Perfis

Gerenciamento das informações e características dos perfis de **pessoas** e **profissionais de psicologia**, permitindo diferenciar seus respectivos papéis dentro da plataforma.

## Tecnologias Utilizadas

O Wings foi desenvolvido utilizando uma arquitetura separada entre **Frontend, Backend e Banco de Dados**, permitindo organizar responsabilidades e facilitar a manutenção e evolução da aplicação.

### Frontend

* **React** — construção da interface e componentes da aplicação.
* **TypeScript** — tipagem estática e maior segurança durante o desenvolvimento.
* **HTML5** — estruturação dos elementos da aplicação.
* **CSS3 (Vanilla CSS)** — estilização e responsividade da interface.

### Backend

* **Laravel** — desenvolvimento da API, regras de negócio, autenticação e gerenciamento das operações do sistema.

### Banco de Dados

* **MySQL** — armazenamento e gerenciamento dos dados da aplicação.

### Visão geral da Stack

```text
┌─────────────────────────────────┐
│            FRONTEND             │
│ React + TypeScript + HTML + CSS │
└───────────────┬─────────────────┘
                │
                │ API / HTTP
                ▼
┌─────────────────────────────────┐
│            BACKEND              │
│             Laravel             │
└───────────────┬─────────────────┘
                │
                │
                ▼
┌─────────────────────────────────┐
│          BANCO DE DADOS         │
│              MySQL              │
└─────────────────────────────────┘
```

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas na sua máquina:
- [Git](https://git-scm.com)
- [PHP 8.5](https://php.net)
- [Composer](https://getcomposer.org)
- [Node.js 20.x](https://nodejs.org)
- Banco de dados configurado (MySQL)

## Como rodar o projeto

Clone o repositório e acesse a pasta raiz:
```bash
git clone https://github.com/OoWicheral/wings.git
cd wings
```

---

### 1. Back-end (Laravel)

Abra um terminal e acesse a pasta do back-end:
```bash
cd backend
```

Instale as dependências do PHP:
```bash
composer install
```

Copie o arquivo de variáveis de ambiente e gere a chave da aplicação:
```bash
cp .env.example .env
php artisan key:generate
```

> **Atenção:** Abra o arquivo `.env` gerado e preencha as credenciais do seu banco de dados (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

Execute as migrations do banco de dados:
```bash
php artisan migrate
```

Inicie o servidor do back-end:
```bash
php artisan serve
```

---

### 2. Front-end (Node.js)

Com o servidor do back-end rodando, abra um **novo terminal** na raiz do projeto e acesse a pasta do front-end:
```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O front-end estará acessível na porta exibida no terminal (geralmente `http://localhost:5173` ou `http://localhost:3000`).
