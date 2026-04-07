<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;

try {
    $count = User::count();
    $users = User::all();
    echo "User count: " . $count . "\n";
    foreach ($users as $user) {
        echo "User: " . $user->name . " (" . $user->email . ")\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
die();
