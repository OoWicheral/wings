<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProdutoController extends Controller
{
  public function index()
  {
    $produtos = [
      ['id' => 1, 'nome' => 'Teclado', 'preco' => 100],
      ['id' => 2, 'nome' => 'Torneira', 'preco' => 500],
      ['id' => 3, 'nome' => 'Esp32', 'preco' => 30],
    ];

    return view('produtos', ['lista' => $produtos]);
  }
}

?>