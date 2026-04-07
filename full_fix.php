<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

// Boot the application (consoler kernel is safer to avoids running web middlewares)
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use App\Models\SiteContent;

echo "<h1>Mundo Le Pet - Full Fix</h1>";

try {
    // 1. Create tables
    echo "Creating tables...<br>";
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
        echo "- Table 'site_contents' created.<br>";
    } else { echo "- Table 'site_contents' already exists.<br>"; }
    
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
        echo "- Table 'google_accounts' created.<br>";
    } else { echo "- Table 'google_accounts' already exists.<br>"; }

    // 2. Seed data for SEO
    echo "Seeding basic SEO data...<br>";
    $data = [
        ['page' => 'site', 'section' => 'seo', 'content_key' => 'title', 'content_value' => 'Mundo Le Pet - Excelência em Medicina Veterinária Natural'],
        ['page' => 'site', 'section' => 'seo', 'content_key' => 'description', 'content_value' => 'Especialistas em Nutrologia e Dermatologia Pet em Goiânia. Atendimento focado em alimentação natural e bem-estar animal.'],
        ['page' => 'home', 'section' => 'hero', 'content_key' => 'title', 'content_value' => 'Saúde que vem do Coração'],
    ];
    foreach ($data as $item) {
        SiteContent::updateOrCreate(
            ['page' => $item['page'], 'section' => $item['section'], 'content_key' => $item['content_key']],
            ['content_value' => $item['content_value']]
        );
    }
    echo "- Data seeded.<br>";

    // 3. Clear cache
    echo "Clearing cache...<br>";
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    echo "- Cache cleared.<br>";

    echo "<h2>SUCCESS!</h2>";
    echo "<p><a href='/'>Go to Home (Refresh to see changes)</a></p>";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
