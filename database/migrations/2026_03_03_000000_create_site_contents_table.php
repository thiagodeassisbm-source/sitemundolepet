<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
    }
};
