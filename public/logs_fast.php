<?php
$logPath = __DIR__.'/../storage/logs/laravel.log';
if (file_exists($logPath)) {
    $content = file_get_contents($logPath);
    echo nl2br(htmlspecialchars(substr($content, -5000)));
} else {
    echo "Log não encontrado em: $logPath";
}
