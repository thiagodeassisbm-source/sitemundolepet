<?php
require __DIR__ . '/bootstrap/app.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$account = \Illuminate\Support\Facades\DB::table('google_accounts')->first();
echo json_encode($account, JSON_PRETTY_PRINT);
