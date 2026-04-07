<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Support\Facades\DB;

try {
    $tables = DB::select('SHOW TABLES');
    print_r($tables);
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
die();
