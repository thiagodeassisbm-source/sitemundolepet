<?php
/**
 * Script de diagnóstico para servidor (erro 500).
 * Coloque na mesma pasta do index.php no servidor e acesse: https://mundolepet.com.br/debug-server.php
 * APAGUE este arquivo depois de resolver o problema (segurança).
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');

echo "=== Diagnóstico do servidor ===\n\n";

echo "1. PHP: " . PHP_VERSION . " - OK\n";

$root = __DIR__;
echo "2. Pasta do projeto (raiz): $root\n";

if (!file_exists($root . '/vendor/autoload.php')) {
    echo "\n*** ERRO: Pasta vendor/ não existe. ***\n";
    echo "No servidor, na pasta do projeto, rode:\n  composer install --no-dev --optimize-autoloader\n";
    exit;
}
echo "3. vendor/autoload.php - OK\n";

if (!file_exists($root . '/.env')) {
    echo "\n*** ERRO: Arquivo .env não encontrado. ***\n";
    echo "Copie .env.example para .env e preencha os dados do banco.\n";
    exit;
}
echo "4. .env - OK\n";

echo "\n5. Tentando carregar o Laravel...\n";
try {
    require $root . '/vendor/autoload.php';
    $app = require_once $root . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    echo "   Laravel carregado - OK\n";
} catch (Throwable $e) {
    echo "\n*** ERRO ao carregar Laravel ***\n";
    echo "Mensagem: " . $e->getMessage() . "\n";
    echo "Arquivo: " . $e->getFile() . " (linha " . $e->getLine() . ")\n";
    echo "\nStack trace:\n" . $e->getTraceAsString() . "\n";
    exit;
}

echo "\n6. Testando conexão com o banco...\n";
$env = [];
if (is_readable($root . '/.env')) {
    foreach (file($root . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (preg_match('/^([A-Z_]+)=(.*)$/', $line, $m)) {
            $env[$m[1]] = trim($m[2], " \t\"'");
        }
    }
}
$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbPort = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_DATABASE'] ?? '';
$dbUser = $env['DB_USERNAME'] ?? '';
$dbPass = $env['DB_PASSWORD'] ?? '';
try {
    $pdo = new PDO(
        "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "   Conexão MySQL - OK\n";
} catch (Throwable $e) {
    echo "\n*** ERRO de conexão com o banco ***\n";
    echo "Mensagem: " . $e->getMessage() . "\n";
    echo "Verifique no .env: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD\n";
    exit;
}

echo "\n=== Tudo OK até aqui. Se o site ainda der 500, o erro pode ser em uma rota específica. ===\n";
echo "\nApague este arquivo (debug-server.php) depois de resolver.\n";
