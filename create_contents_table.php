<?php
echo "REAL PATH: " . __FILE__ . "<br>";
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

try {
    if (!Schema::hasTable('site_contents')) {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page');
            $table->string('section');
            $table->string('content_key');
            $table->text('content_value')->nullable();
            $table->timestamps();
            $table->unique(['page', 'section', 'content_key']);
        });
        echo "Table site_contents created successfully.\n";
    }

    if (!Schema::hasTable('google_accounts')) {
        Schema::create('google_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->text('access_token')->nullable();
            $table->string('refresh_token')->nullable();
            $table->string('property_id')->nullable();
            $table->string('site_url')->nullable();
            $table->string('client_id')->nullable();
            $table->string('client_secret')->nullable();
            $table->string('redirect_uri')->nullable();
            $table->string('api_key')->nullable();
            $table->timestamps();
        });
        echo "Table google_accounts created successfully.\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
die('Migration script finished.');
