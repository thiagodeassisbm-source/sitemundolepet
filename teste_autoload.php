<?php
header('Content-Type: text/plain');
if (file_exists('vendor/autoload.php')) {
    echo "Autoload exists.\n";
} else {
    echo "Autoload MISSING.\n";
}
if (is_dir('vendor/google')) {
    echo "Vendor Google exists.\n";
} else {
    echo "Vendor Google MISSING.\n";
}
