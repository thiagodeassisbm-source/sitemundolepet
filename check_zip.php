<?php
$zipFile = 'vendor_linux.zip';
if (file_exists($zipFile)) {
    echo "vendor_linux.zip exists! Size: " . filesize($zipFile) . "\n";
} else {
    echo "vendor_linux.zip DOES NOT EXIST!\n";
}
