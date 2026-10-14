<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Produtos</title>
</head>
<body>
  <h1> Catálogo de Produtos</h1>

  <ul>
    @foreach ($lista as $item)
      <li>
        <strong>{{ $item['nome'] }}</strong> — R$ {{ number_format($item['preco'], 2, ',', '.') }}
      </li>
    @endforeach
  </ul>
</body>
</html>