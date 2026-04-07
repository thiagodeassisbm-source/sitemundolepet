<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$base_path = __DIR__;
require $base_path . '/vendor/autoload.php';
$app = require_once $base_path . '/bootstrap/app.php';

use Illuminate\Http\Request;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Request::create('/admin/google/connect', 'GET')
);

echo "Status Code: " . $response->getStatusCode() . "<br>";
if ($response instanceof \Illuminate\Http\RedirectResponse) {
    echo "Redirecting to: " . $response->getTargetUrl() . "<br>";
} else {
    echo "Content: " . htmlspecialchars($response->getContent());
}
