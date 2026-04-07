<?php
echo "Cleaning up...\n";

function deleteDir($dirPath) {
    if (!is_dir($dirPath)) return;
    $files = array_diff(scandir($dirPath), array('.', '..'));
    foreach ($files as $file) {
        $path = "$dirPath/$file";
        is_dir($path) ? deleteDir($path) : @unlink($path);
    }
    @rmdir($dirPath);
}

// 1. Delete incomplete vendor
if (is_dir('vendor') && !is_dir('vendor/symfony')) {
    echo "Deleting incomplete vendor...\n";
    deleteDir('vendor');
}

// 2. Rename backup to vendor
if (!is_dir('vendor')) {
    if (is_dir('vendor_bkp_1771908970')) {
        echo "Restoring vendor from vendor_bkp_1771908970...\n";
        rename('vendor_bkp_1771908970', 'vendor');
    } elseif (is_dir('vendor_bkp_1771908960')) {
        echo "Restoring vendor from vendor_bkp_1771908960...\n";
        rename('vendor_bkp_1771908960', 'vendor');
    }
}

// 3. Extract vendor_patch.zip
echo "Extracting patch...\n";
if (file_exists('vendor_patch.zip')) {
    $zip = new ZipArchive;
    if ($zip->open('vendor_patch.zip') === TRUE) {
        $zip->extractTo(__DIR__);
        $zip->close();
        echo "Patch extracted successfully.\n";
    } else {
        echo "Failed to extract patch.\n";
    }
} else {
    echo "vendor_patch.zip not found.\n";
}
