<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

echo "<h1>Mundo Le Pet - Database Fix</h1>";

try {
    echo "Checking connection... ";
    DB::connection()->getPdo();
    echo "OK!<br>";

    if (!Schema::hasTable('site_contents')) {
        echo "Creating site_contents table... ";
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page');
            $table->string('section');
            $table->string('content_key');
            $table->text('content_value')->nullable();
            $table->timestamps();
            $table->unique(['page', 'section', 'content_key']);
        });
        echo "OK!<br>";
    } else {
        echo "Table site_contents already exists.<br>";
    }

    if (!Schema::hasTable('google_accounts')) {
        echo "Creating google_accounts table... ";
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
        echo "OK!<br>";
    }

    echo "<h2>DONE!</h2>";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}
echo "<p><a href='/'>Go to Home</a></p>";
