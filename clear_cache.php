<?php
    echo 'Clearing cache...<br>';
    try {
        require 'vendor/autoload.php';
        $app = require_once 'bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
        $kernel->handle(Illuminate\Http\Request::capture());
        
        \Artisan::call('cache:clear');
        echo 'Cache cleared<br>';
        \Artisan::call('view:clear');
        echo 'View cleared<br>';
        \Artisan::call('config:clear');
        echo 'Config cleared<br>';
        \Artisan::call('route:clear');
        echo 'Route cleared<br>';
    } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
    }
    