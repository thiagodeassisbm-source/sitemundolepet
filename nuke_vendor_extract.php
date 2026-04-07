<?php
$zipFile = 'vendor_linux.zip';
$targetDir = __DIR__;

echo "Renaming existing vendor folder...\n";
if (is_dir('vendor')) {
    rename('vendor', 'vendor_bkp_' . time());
}
echo "Extracting vendor_linux.zip...\n";

if (file_exists($zipFile)) {
    $zip = new ZipArchive;
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($targetDir);
        $zip->close();
        echo "✅ Extraído: $zipFile\n";
    } else {
        echo "❌ Erro ao abrir: $zipFile\n";
    }
} else {
    echo "⚠️ Arquivo não encontrado: $zipFile\n";
}
