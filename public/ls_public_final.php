<?php
echo "Current Dir: " . __DIR__ . "\n";
echo "Files:\n";
print_r(scandir(__DIR__));
if (is_dir(__DIR__.'/build')) {
    echo "\nBuild Dir Files:\n";
    print_r(scandir(__DIR__.'/build'));
}
