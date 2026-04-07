<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "<h1>SQL Table Check</h1>";
try {
    $tables = DB::select('SHOW TABLES');
    echo "<pre>";
    print_r($tables);
    echo "</pre>";

    if (DB::select("SHOW TABLES LIKE 'site_contents'")) {
        echo "Table 'site_contents' EXISTS.<br>";
        $count = DB::table('site_contents')->count();
        echo "Row count: $count<br>";
    } else {
        echo "Table 'site_contents' DOES NOT EXIST.<br>";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
