<?php
$dirs = scandir(__DIR__ . '/vendor');
foreach ($dirs as $dir) {
    if (stripos($dir, 'symfony') !== false) {
        echo "Dir in vendor: $dir\n";
    }
}

$dirs2 = scandir(__DIR__ . '/vendor/symfony');
foreach ($dirs2 as $dir) {
    if (stripos($dir, 'deprecation-contracts') !== false) {
        echo "Dir in vendor/symfony: $dir\n";
    }
}
