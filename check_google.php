<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/vendor/autoload.php';

try {
    if (class_exists('Google\Client')) {
        echo "Google\Client found!\n";
        $client = new \Google\Client();
        echo "Instance created!\n";
    } else {
        echo "Google\Client NOT found!\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} catch (\Error $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
}

