<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$vals = Illuminate\Support\Facades\DB::table('site_contents')->where('content_key', 'like', '%logo%')->get();
foreach($vals as $v) {
    echo $v->page . ' | ' . $v->section . ' | ' . $v->content_key . ' = ' . $v->content_value . PHP_EOL;
}
