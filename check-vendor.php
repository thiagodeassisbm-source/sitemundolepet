<?php
$vendorExists = is_dir(__DIR__.'/vendor') ? 'Sim' : 'Não';
$autoloadExists = is_file(__DIR__.'/vendor/autoload.php') ? 'Sim' : 'Não';
$appExists = is_dir(__DIR__.'/app') ? 'Sim' : 'Não';

echo "Pasta vendor existe? $vendorExists\n";
echo "Arquivo autoload.php existe? $autoloadExists\n";
echo "Pasta app existe? $appExists\n";

if ($vendorExists === 'Sim') {
    echo "\nConteúdo de vendor (parcial):\n";
    print_r(array_slice(scandir(__DIR__.'/vendor'), 0, 10));
}
