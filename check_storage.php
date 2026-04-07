<?php
$dirs = [
    'storage',
    'storage/framework',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/framework/cache',
    'storage/logs',
    'bootstrap/cache'
];

echo "<html><body style='font-family:monospace; background:#111; color:#eee; padding:20px;'>";
echo "<h2>🔍 Verificação de Permissões e Estrutura</h2>";

foreach ($dirs as $dir) {
    echo "[$dir]: ";
    if (!is_dir($dir)) {
        echo "<span style='color:red;'>NÃO EXISTE</span> - Tentando criar... ";
        if (mkdir($dir, 0775, true)) {
            echo "<span style='color:green;'>CRIADO</span>";
        } else {
            echo "<span style='color:red;'>FALHOU</span>";
        }
    } else {
        echo "<span style='color:green;'>EXISTE</span>";
    }
    
    echo " | Writable: " . (is_writable($dir) ? "<span style='color:green;'>SIM</span>" : "<span style='color:red;'>NÃO</span>");
    echo "<br>";
}

echo "<h3>Environment Check</h3>";
echo "APP_KEY set: " . (env('APP_KEY') ? 'YES' : 'NO') . "<br>";
echo "Session Driver: " . config('session.driver') . "<br>";

echo "</body></html>";
