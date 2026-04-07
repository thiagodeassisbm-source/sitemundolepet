<?php
$viewsPath = __DIR__ . '/../storage/framework/views/';
if (!is_dir($viewsPath)) {
    $viewsPath = __DIR__ . '/storage/framework/views/';
}

$files = glob($viewsPath . '*.php');
$count = 0;
foreach($files as $file) {
    if(is_file($file)) {
        unlink($file);
        $count++;
    }
}
echo "<h1>Limpeza de Cache</h1>";
echo "<p>Foram apagados $count arquivos de cache do Blade.</p>";
echo "<p>Por favor, recarregue a página principal do site agora.</p>";
