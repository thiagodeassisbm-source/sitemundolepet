<?php
require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

header('Content-Type: application/json');

$res = [
    'stats_counters_exists' => Schema::hasTable('stats_counters'),
    'video_clicks_count' => Schema::hasTable('stats_counters') ? DB::table('stats_counters')->where('key', 'video_clicks')->value('value') : 'TABLE NOT FOUND'
];

echo json_encode($res, JSON_PRETTY_PRINT);
