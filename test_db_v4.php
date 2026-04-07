<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$users = ["u315410518_mundo_lepet", "u315410518_mundo", "root"];
$dbs = ["u315410518_mundo_lepet", "mundo_lepet"];
$passwords = [
    'i:1PVQ?R',
    '3/jYoKZw&lDPpVtB',
    'Isadora!4163998',
    'MundoLePet2024!',
    ''
];
$hosts = ['localhost', '127.0.0.1'];

echo "<h1>Brute Force DB Test</h1>";
foreach ($hosts as $host) {
    foreach ($users as $user) {
        foreach ($dbs as $db) {
            foreach ($passwords as $pass) {
                try {
                    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 1]);
                    echo "✅ SUCCESS: host=$host, db=$db, user=$user, pass=" . substr($pass,0,2) . "...<br>";
                    // exit; // Vamos ver se tem mais de um que funciona
                } catch (Exception $e) {
                    // echo "❌ FAIL: host=$host, db=$db, user=$user<br>";
                }
            }
        }
    }
}
echo "Done.";
