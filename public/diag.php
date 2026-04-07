<?php
// Diagnóstico: mostra o conteúdo REAL do app.blade.php no servidor
$base = dirname(__DIR__);
$bladeFile = $base . '/resources/views/app.blade.php';
$cacheDir  = $base . '/storage/framework/views/';
$cacheHash = sha1($bladeFile);
$cacheFile = $cacheDir . $cacheHash . '.php';

echo "<h2>Diagnóstico do Servidor</h2>";
echo "<p><strong>Base Path:</strong> $base</p>";
echo "<p><strong>Blade File Path:</strong> $bladeFile</p>";
echo "<p><strong>Blade Exists?</strong> " . (file_exists($bladeFile) ? 'SIM ✅' : 'NÃO ❌') . "</p>";
echo "<p><strong>Hash do cache esperado:</strong> $cacheHash</p>";
echo "<p><strong>Cache file path:</strong> $cacheFile</p>";
echo "<p><strong>Cache existe?</strong> " . (file_exists($cacheFile) ? 'SIM (precisa apagar!)' : 'NÃO (ok)') . "</p>";

echo "<h3>Conteúdo REAL do app.blade.php (linhas 40-60):</h3>";
if (file_exists($bladeFile)) {
    $lines = file($bladeFile);
    $total = count($lines);
    echo "<p>Total de linhas: $total</p>";
    echo "<pre style='background:#f0f0f0;padding:10px;border:1px solid #ccc;'>";
    foreach ($lines as $i => $line) {
        $n = $i + 1;
        echo htmlspecialchars("$n: $line");
    }
    echo "</pre>";
} else {
    echo "<p style='color:red'>ARQUIVO NÃO ENCONTRADO!</p>";
}

echo "<h3>Arquivos na pasta views/cache:</h3>";
if (is_dir($cacheDir)) {
    $files = glob($cacheDir . '*.php');
    echo "<p>Total: " . count($files) . " arquivo(s)</p>";
    foreach ($files as $f) {
        echo "<p>" . basename($f) . "</p>";
    }
} else {
    echo "<p>Pasta não encontrada: $cacheDir</p>";
}
