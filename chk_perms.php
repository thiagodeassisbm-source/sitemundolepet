<?php
$file = __DIR__ . '/vendor/symfony/deprecation-contracts/function.php';
echo "Perms: " . substr(sprintf('%o', fileperms($file)), -4) . "\n";
echo "Readable: " . (is_readable($file) ? 'Yes' : 'No') . "\n";
$content = file_get_contents($file);
echo "Content length: " . strlen($content) . "\n";
