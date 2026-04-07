<?php
echo "Current Path: " . __DIR__ . "\n";
echo "Root Path: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Files in current dir:\n";
print_r(scandir(__DIR__));
