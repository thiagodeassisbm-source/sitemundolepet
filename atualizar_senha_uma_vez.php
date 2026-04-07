<?php
/**
 * Rode UMA VEZ no servidor para gravar a senha em Bcrypt.
 * Acesse: https://mundolepet.com.br/atualizar_senha_uma_vez.php?key=mundolepet2024
 * Depois APAGUE este arquivo por segurança.
 *
 * Onde está no seu PC: na RAIZ do projeto (mesma pasta que app/, routes/, etc.)
 * Envie para o servidor na mesma pasta do index.php (ex.: public_html).
 */
header('Content-Type: text/html; charset=utf-8');

$chave = isset($_GET['key']) ? $_GET['key'] : '';
if ($chave !== 'mundolepet2024') {
    echo '<p>Acesso negado. Use a URL com ?key=mundolepet2024</p>';
    exit;
}

define('LARAVEL_START', microtime(true));
$base = file_exists(__DIR__ . '/vendor/autoload.php') ? __DIR__ : __DIR__ . '/..';
require $base . '/vendor/autoload.php';
$app = require_once $base . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

$novaSenha = 'MundoLePet2024!';

echo '<h1>Atualizar senha (Bcrypt)</h1>';

try {
    $hash = Hash::make($novaSenha);
    $user = DB::table('users')->where('id', 1)->first();

    if ($user) {
        DB::table('users')->where('id', 1)->update(['password' => $hash]);
        echo '<p><strong>Senha atualizada com sucesso.</strong></p>';
        echo '<p>Use para logar:</p>';
        echo '<ul><li>E-mail: <strong>' . htmlspecialchars($user->email) . '</strong></li>';
        echo '<li>Senha: <strong>' . htmlspecialchars($novaSenha) . '</strong></li></ul>';
    } else {
        echo '<p>Usuário com id=1 não encontrado. Primeiro usuário será atualizado.</p>';
        $user = DB::table('users')->orderBy('id')->first();
        if ($user) {
            DB::table('users')->where('id', $user->id)->update(['password' => $hash]);
            echo '<p><strong>Senha atualizada.</strong></p>';
            echo '<p>E-mail: <strong>' . htmlspecialchars($user->email) . '</strong><br>Senha: <strong>' . htmlspecialchars($novaSenha) . '</strong></p>';
        } else {
            echo '<p>Nenhum usuário no banco.</p>';
        }
    }
    echo '<p style="color:red;margin-top:20px;"><strong>IMPORTANTE: Apague este arquivo (atualizar_senha_uma_vez.php) do servidor agora.</strong></p>';
} catch (Throwable $e) {
    echo '<p>Erro: ' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '<p>Verifique se o .env no servidor está correto (conexão com o banco).</p>';
}
