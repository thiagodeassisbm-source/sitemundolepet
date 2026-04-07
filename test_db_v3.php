<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$db_user = "u315410518_mundo_lepet";
$db_pass = 'i:1PVQ?R';
$db_name = "u315410518_mundo_lepet";

$hosts = ['localhost', '127.0.0.1', '147.79.84.227'];

echo "<h1>Testing DB Hosts</h1>";
foreach ($hosts as $host) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db_name", $db_user, $db_pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 2]);
        echo "✅ SUCCESS: $host<br>";
    } catch (Exception $e) {
        echo "❌ FAIL: $host - " . $e->getMessage() . "<br>";
    }
}
