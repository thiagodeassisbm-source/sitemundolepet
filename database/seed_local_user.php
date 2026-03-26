<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$u = new \App\Models\User();
$u->name = 'Admin';
$u->email = 'admin@mundolepet.com.br';
$u->password = \Illuminate\Support\Facades\Hash::make('MundoLePet2024!');
$u->save();
echo "Usuario admin@mundolepet.com.br criado. Senha: MundoLePet2024!\n";
