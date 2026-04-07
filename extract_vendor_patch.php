<?php
echo "Extracting vendor_patch.zip...\n";
$zipFile = 'vendor_patch.zip';
$targetDir = __DIR__;

if (file_exists($zipFile)) {
    $zip = new ZipArchive;
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($targetDir);
        $zip->close();
        echo "✅ Extraído: $zipFile\n";
        unlink($zipFile);
    } else {
        echo "❌ Erro ao abrir: $zipFile\n";
    }
} else {
    echo "⚠️ Arquivo não encontrado: $zipFile\n";
}
unlink(__FILE__);
