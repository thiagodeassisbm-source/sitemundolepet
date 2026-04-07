<?php
if (function_exists('opcache_reset')) opcache_reset();
if (file_exists(__DIR__ . '/vendor/symfony/deprecation-contracts/function.php')) {
    echo "FILE EXISTS!\n";
} else {
    echo "FILE MISSING!\n";
}
