<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    $email = 'thiago@mundolepet.com.br';
    $user = User::where('email', $email)->first();

    if ($user) {
        $user->password = Hash::make('thiago2024'); // Resetting password just in case
        $user->save();
        echo "User updated successfully.\n";
    } else {
        User::create([
            'name' => 'Thiago',
            'email' => $email,
            'password' => Hash::make('thiago2024'),
        ]);
        echo "User created successfully.\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
die();
