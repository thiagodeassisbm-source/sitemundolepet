<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

/*
|--------------------------------------------------------------------------
| Laravel Detective - quick production diagnosis
|--------------------------------------------------------------------------
| Place this file in the Laravel project root (same level as artisan).
| Access: https://seu-dominio.com.br/site/detective.php
| Delete this file after fixing the issue.
|--------------------------------------------------------------------------
*/

function out(string $line = ''): void
{
    echo $line . PHP_EOL;
}

function yesNo(bool $v): string
{
    return $v ? 'OK' : 'FALHA';
}

function maskValue(?string $value): string
{
    if ($value === null || $value === '') {
        return '(vazio)';
    }
    $len = strlen($value);
    if ($len <= 4) {
        return str_repeat('*', $len);
    }
    return substr($value, 0, 2) . str_repeat('*', max(2, $len - 4)) . substr($value, -2);
}

function parseEnv(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $rows = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    $data = [];
    foreach ($rows as $row) {
        $row = trim($row);
        if ($row === '' || str_starts_with($row, '#')) {
            continue;
        }
        $eq = strpos($row, '=');
        if ($eq === false) {
            continue;
        }
        $k = trim(substr($row, 0, $eq));
        $v = trim(substr($row, $eq + 1));
        $v = trim($v, "\"'");
        $data[$k] = $v;
    }
    return $data;
}

function checkWritable(string $path): bool
{
    return file_exists($path) && is_writable($path);
}

function lastLogLines(string $path, int $max = 40): array
{
    if (!is_file($path)) {
        return [];
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES) ?: [];
    $tail = array_slice($lines, -$max);
    return array_map(static function ($line) {
        $line = preg_replace('/(password\s*=\s*)([^,\s]+)/i', '$1***', (string) $line);
        $line = preg_replace('/(DB_PASSWORD=)(.*)/i', '$1***', $line);
        return $line;
    }, $tail);
}

$base = __DIR__;
$envPath = $base . '/.env';
$env = parseEnv($envPath);

out('=== LARAVEL DETECTIVE ===');
out('Data: ' . date('Y-m-d H:i:s'));
out('Base path: ' . $base);
out('');

out('[1] PHP');
out('PHP version: ' . PHP_VERSION);
out('pdo loaded: ' . yesNo(extension_loaded('pdo')));
out('pdo_mysql loaded: ' . yesNo(extension_loaded('pdo_mysql')));
out('');

out('[2] Estrutura de arquivos');
$checks = [
    '.env' => $base . '/.env',
    'vendor/autoload.php' => $base . '/vendor/autoload.php',
    'bootstrap/app.php' => $base . '/bootstrap/app.php',
    'public/index.php' => $base . '/public/index.php',
    'storage/' => $base . '/storage',
    'storage/logs/' => $base . '/storage/logs',
    'bootstrap/cache/' => $base . '/bootstrap/cache',
];
foreach ($checks as $label => $path) {
    out(str_pad($label, 24) . ': ' . yesNo(file_exists($path)));
}
out('');

out('[3] Permissões');
out('storage writable         : ' . yesNo(checkWritable($base . '/storage')));
out('storage/logs writable    : ' . yesNo(checkWritable($base . '/storage/logs')));
out('bootstrap/cache writable : ' . yesNo(checkWritable($base . '/bootstrap/cache')));
out('');

out('[4] .env (mascarado)');
out('APP_ENV      : ' . ($env['APP_ENV'] ?? '(ausente)'));
out('APP_DEBUG    : ' . ($env['APP_DEBUG'] ?? '(ausente)'));
out('APP_URL      : ' . ($env['APP_URL'] ?? '(ausente)'));
out('APP_KEY      : ' . maskValue($env['APP_KEY'] ?? ''));
out('DB_CONNECTION: ' . ($env['DB_CONNECTION'] ?? '(ausente)'));
out('DB_HOST      : ' . ($env['DB_HOST'] ?? '(ausente)'));
out('DB_PORT      : ' . ($env['DB_PORT'] ?? '(ausente)'));
out('DB_DATABASE  : ' . ($env['DB_DATABASE'] ?? '(ausente)'));
out('DB_USERNAME  : ' . maskValue($env['DB_USERNAME'] ?? ''));
out('DB_PASSWORD  : ' . maskValue($env['DB_PASSWORD'] ?? ''));
out('');

out('[5] Validação APP_KEY');
$appKey = $env['APP_KEY'] ?? '';
if ($appKey === '') {
    out('APP_KEY ausente');
} elseif (!str_starts_with($appKey, 'base64:') && strlen($appKey) < 16) {
    out('APP_KEY parece invalida');
} else {
    out('APP_KEY parece valida');
}
out('');

out('[6] Teste de banco (PDO)');
$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbPort = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_DATABASE'] ?? '';
$dbUser = $env['DB_USERNAME'] ?? '';
$dbPass = $env['DB_PASSWORD'] ?? '';

if ($dbName === '' || $dbUser === '') {
    out('Credenciais de DB incompletas no .env');
} elseif (!extension_loaded('pdo_mysql')) {
    out('Extensão pdo_mysql não carregada no PHP');
} else {
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5,
        ]);
        $stmt = $pdo->query('SELECT 1');
        $ok = (int) $stmt->fetchColumn() === 1;
        out('Conexao DB: ' . yesNo($ok));
    } catch (Throwable $e) {
        out('Conexao DB: FALHA');
        out('Erro PDO: ' . $e->getMessage());
    }
}
out('');

out('[7] Últimas linhas do laravel.log');
$logPath = $base . '/storage/logs/laravel.log';
if (!is_file($logPath)) {
    out('laravel.log não encontrado');
} else {
    $tail = lastLogLines($logPath, 40);
    if ($tail === []) {
        out('laravel.log vazio');
    } else {
        foreach ($tail as $line) {
            out($line);
        }
    }
}

out('');
out('Fim do diagnóstico. Remova detective.php após o uso.');
