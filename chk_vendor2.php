<?php
$filesArray = [
    'vendor/composer/autoload_real.php',
    'vendor/symfony/deprecation-contracts/function.php',
    'vendor/laravel/framework/src/Illuminate/Foundation/Application.php',
    'vendor/guzzlehttp/guzzle/src/Client.php'
];

foreach ($filesArray as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "$file - EXISTS\n";
    } else {
        echo "$file - MISSING\n";
    }
}
