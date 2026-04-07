<?php
die("CHECK VITE\n" . 
    "BASE: " . base_path() . "\n" .
    "PUBLIC: " . public_path() . "\n" .
    "MANIFEST EXPECTED: " . public_path('build/manifest.json') . "\n" .
    "EXISTS: " . (file_exists(public_path('build/manifest.json')) ? 'YES' : 'NO') . "\n" .
    "DIR BUILD: " . (is_dir(public_path('build')) ? 'YES' : 'NO') . "\n" .
    "FILES IN BUILD: " . (is_dir(public_path('build')) ? implode(', ', scandir(public_path('build'))) : 'N/A') . "\n"
);
