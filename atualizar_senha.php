<?php
/**
 * Script para atualizar a senha do usuário no banco (bcrypt, compatível com Laravel).
 * Execute no terminal: php atualizar_senha.php
 * Depois use a senha exibida para fazer login.
 */

$novaSenha = 'MundoLePet2024!';

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

try {
    $hash = Hash::make($novaSenha);
    $user = DB::table('users')->where('id', 1)->first();

    if ($user) {
        DB::table('users')->where('id', 1)->update(['password' => $hash]);
        echo "Senha atualizada com sucesso.\n\n";
        echo "Use estas credenciais para logar:\n";
        echo "  E-mail: {$user->email}\n";
        echo "  Senha:  {$novaSenha}\n\n";
    } else {
        echo "Nenhum usuário com id=1 encontrado. Cole o SQL abaixo no phpMyAdmin:\n\n";
        echo "UPDATE users SET password = '" . addslashes($hash) . "' WHERE id = 1;\n\n";
        echo "Senha a usar no login: {$novaSenha}\n";
    }
} catch (Throwable $e) {
    echo "Erro (conexão com o banco?): " . $e->getMessage() . "\n\n";
    echo "--- SQL alternativo (cole no phpMyAdmin) ---\n";
    echo "Senha a usar no login: {$novaSenha}\n\n";
    echo "UPDATE users SET password = '" . addslashes(Hash::make($novaSenha)) . "' WHERE id = 1;\n";
}
