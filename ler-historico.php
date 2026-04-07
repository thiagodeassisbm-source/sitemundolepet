<?php
$logPath = __DIR__ . '/storage/logs/laravel.log';
if (file_exists($logPath)) {
    $content = file_get_contents($logPath);
    preg_match_all('/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] production\.ERROR: (.*?)(?=\n|\[)/', $content, $matches);
    echo "ERROS ENCONTRADOS:\n";
    print_r(array_slice($matches[0], -2));
} else {
    echo "Log não encontrado.";
}
