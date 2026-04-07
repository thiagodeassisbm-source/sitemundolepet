<?php
function listFiles($dir, $depth = 0) {
    if ($depth > 3) return;
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        echo str_repeat('  ', $depth) . $item . (is_dir($path) ? ' (DIR)' : '') . "\n";
        if (is_dir($path)) listFiles($path, $depth + 1);
    }
}
echo "Scanning recursively:\n";
listFiles(__DIR__ . '/app/Http/Middleware');
