<?php
/**
 * Diagnóstico do build no servidor.
 * Coloque este arquivo na MESMA pasta do index.php no servidor e acesse:
 * https://mundolepet.com.br/check-build.php
 * APAGUE depois de usar (segurança).
 */
header('Content-Type: text/plain; charset=utf-8');

$root = __DIR__;
$manifestPath = $root . '/build/manifest.json';

echo "=== Diagnóstico do build ===\n\n";
echo "1. Pasta do projeto (onde está index.php): $root\n\n";

if (!is_file($manifestPath)) {
    echo "2. ERRO: build/manifest.json NAO ENCONTRADO.\n";
    echo "   Caminho esperado: $manifestPath\n\n";
    echo "   O que fazer:\n";
    echo "   - No seu PC: rode 'npm run build' e suba a pasta build/ inteira.\n";
    echo "   - No servidor: a pasta deve ficar em: {$root}/build/\n";
    echo "   - Ou seja: dentro da pasta do site deve existir build/manifest.json\n";
    exit;
}

echo "2. build/manifest.json: ENCONTRADO\n";
$mtime = filemtime($manifestPath);
echo "   Última alteração do arquivo: " . date('Y-m-d H:i:s', $mtime) . "\n\n";

$manifest = json_decode(file_get_contents($manifestPath), true);
if (!$manifest) {
    echo "3. ERRO: manifest.json inválido (não é JSON).\n";
    exit;
}

echo "3. Entradas no manifest:\n";
foreach ($manifest as $key => $entry) {
    if (is_array($entry) && isset($entry['file'])) {
        echo "   - $key => " . $entry['file'] . "\n";
    }
}

echo "\n4. Teste no navegador:\n";
echo "   Abra: https://mundolepet.com.br/build/manifest.json\n";
echo "   Deve mostrar um JSON. Se der 404, a pasta build não está acessível pela URL.\n\n";
echo "5. Apague este arquivo (check-build.php) depois de resolver.\n";
