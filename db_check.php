<?php
require __DIR__ . '/bootstrap/app.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use Illuminate\Support\Facades\DB;

$account = DB::table('google_accounts')->first();
echo "Account ID: " . ($account->id ?? 'null') . "\n";
echo "Email: " . ($account->email ?? 'null') . "\n";
echo "Access Token: " . ($account->access_token ? 'exists' : 'null') . "\n";
