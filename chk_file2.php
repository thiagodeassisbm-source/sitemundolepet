<?php
$file = __DIR__ . '/vendor/composer/../symfony/deprecation-contracts/function.php';
if (file_exists($file)) {
    echo "EXISTS\n";
} else {
    echo "MISSING\n";
    print_r(error_get_last());
}

$file2 = '/home/u315410518/domains/mundolepet.com.br/public_html/vendor/composer/../symfony/deprecation-contracts/function.php';
if (file_exists($file2)) {
    echo "EXISTS 2\n";
} else {
    echo "MISSING 2\n";
}
