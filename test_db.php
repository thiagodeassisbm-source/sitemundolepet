<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$db_user = "u315410518_mundo_lepet";
$db_name = "u315410518_mundo_lepet";

$passwords = [
    'i:1PVQ?R',
    '3/jYoKZw&lDPpVtB',
    'Isadora!4163998'
];

$hosts = ['localhost', '127.0.0.1'];

echo "<html><body style='font-family:monospace; background:#111; color:#eee; padding:20px;'>";
echo "<h1>🗄️ Teste de Conexão DB v2</h1>";

foreach ($passwords as $pass) {
    echo "<h2>Testando senha: " . substr($pass, 0, 3) . "..." . "</h2>";
    foreach ($hosts as $host) {
        try {
            $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
            $pdo = new PDO($dsn, $db_user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]);
            echo "<span style='color:green;'>✅ CONECTADO com host=$host!</span><br>";
            exit;
        } catch (PDOException $e) {
            echo "<span style='color:red;'>❌ FALHA em $host: " . $e->getMessage() . "</span><br>";
        }
    }
}

echo "</body></html>";
