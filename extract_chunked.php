<?php
$zipFile = 'vendor_linux.zip';
$targetDir = __DIR__;
$stateFile = 'zip_state.txt';

if (!file_exists($zipFile)) {
    die("vendor_linux.zip not found!\n");
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $totalFiles = $zip->numFiles;
    $startIdx = file_exists($stateFile) ? (int)file_get_contents($stateFile) : 0;
    
    // Config: Extract 1500 files per run
    $chunkSize = 1500;
    $endIdx = min($startIdx + $chunkSize, $totalFiles);
    
    echo "Extracting from index $startIdx to $endIdx (Total: $totalFiles)...\n";
    
    $extracted = 0;
    for ($i = $startIdx; $i < $endIdx; $i++) {
        $filename = $zip->getNameIndex($i);
        $zip->extractTo($targetDir, $filename);
        $extracted++;
    }
    
    $zip->close();
    
    if ($endIdx >= $totalFiles) {
        echo "✅ Extraction COMPLETELY DONE!\n";
        if (file_exists($stateFile)) unlink($stateFile);
        echo "<script>console.log('Done');</script>";
    } else {
        file_put_contents($stateFile, $endIdx);
        echo "⏳ Extracted $extracted files this run. Progress: " . round(($endIdx / $totalFiles) * 100, 2) . "%\n";
        // Auto-refresh using JS
        echo "<script>setTimeout(() => window.location.reload(), 500);</script>";
    }
} else {
    echo "Failed to open zip file.\n";
}
