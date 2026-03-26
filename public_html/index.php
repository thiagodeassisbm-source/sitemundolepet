<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Resolve Laravel base path
|--------------------------------------------------------------------------
|
| In shared hosting, `public_html` is often the web root while the Laravel
| application stays in the parent directory. This prevents hard failures
| when files are split between those locations.
|
*/
$basePath = __DIR__;
if (! file_exists($basePath.'/vendor/autoload.php') && file_exists(dirname(__DIR__).'/vendor/autoload.php')) {
    $basePath = dirname(__DIR__);
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $basePath.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $basePath.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $basePath.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
