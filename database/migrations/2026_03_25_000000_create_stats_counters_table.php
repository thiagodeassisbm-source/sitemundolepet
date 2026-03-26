<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stats_counters', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('key')->unique();
            $blueprint->bigInteger('value')->default(0);
            $blueprint->timestamps();
        });

        // Inicializar o contador de vídeos
        \Illuminate\Support\Facades\DB::table('stats_counters')->insert([
            'key' => 'video_clicks',
            'value' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stats_counters');
    }
};
