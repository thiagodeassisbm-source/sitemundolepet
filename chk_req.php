<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
$file2 = '/home/u315410518/domains/mundolepet.com.br/public_html/vendor/composer/../symfony/deprecation-contracts/function.php';
try {
    require_once $file2;
    echo "REQUIRE SUCCESS!\n";
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
} catch (\Error $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
