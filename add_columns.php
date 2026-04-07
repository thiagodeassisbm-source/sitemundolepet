<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

echo "Adding columns to google_accounts...\n";

try {
    Schema::table('google_accounts', function (Blueprint $table) {
        if (!Schema::hasColumn('google_accounts', 'client_id')) {
            $table->text('client_id')->nullable();
        }
        if (!Schema::hasColumn('google_accounts', 'client_secret')) {
            $table->text('client_secret')->nullable();
        }
        if (!Schema::hasColumn('google_accounts', 'redirect_uri')) {
            $table->text('redirect_uri')->nullable();
        }
        if (!Schema::hasColumn('google_accounts', 'api_key')) {
            $table->text('api_key')->nullable();
        }
    });
    echo "Columns added successfully or already exist.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
