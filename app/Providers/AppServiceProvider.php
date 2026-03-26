<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Garante que o Laravel entenda que a raiz é a pasta pública
        $this->app->bind('path.public', function() {
            return base_path();
        });
    }

    public function boot(): void
    {
        // Força HTTPS se estiver em produção, caso contrário força HTTP para evitar erros locais
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        } else {
            URL::forceScheme('http');
        }
    }
}
