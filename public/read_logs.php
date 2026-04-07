<?php
$logPath = __DIR__ . '/../storage/logs/laravel.log';
if (!file_exists($logPath)) {
    // Try other paths
    $logPath = __DIR__ . '/storage/logs/laravel.log';
}

echo "<h1>Laravel Logs</h1>";
if (file_exists($logPath)) {
    $lines = array_slice(file($logPath), -150);
    echo "<pre style='background:#f4f4f4; padding:10px; border:1px solid #ddd; max-height: 80vh; overflow-y:auto;'>";
    foreach ($lines as $line) {
        echo htmlspecialchars($line);
    }
    echo "</pre>";
} else {
    echo "Log file not found at: $logPath";
}
