<?php
echo "Listing root directory:\n";
print_r(scandir('.'));
echo "\nChecking vendor directory:\n";
if (is_dir('vendor')) {
    echo "Vendor exists.\n";
    $files = scandir('vendor');
    print_r($files);
} else {
    echo "Vendor DOES NOT EXPLIST.\n";
}
