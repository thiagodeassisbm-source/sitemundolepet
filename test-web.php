<?php
// Ativar exibição de erros
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "TESTE DE BANCO DE DADOS - " . date('Y-m-d H:i:s') . "\n";

// Carregar o Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(Illuminate\Http\Request::capture());

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    echo "Conexão: " . DB::connection()->getDatabaseName() . "\n";
    
    echo "Tabelas existentes:\n";
    $tables = DB::select('SHOW TABLES');
    foreach ($tables as $table) {
        $name = array_values((array)$table)[0];
        echo "- $name\n";
    }

    echo "\nRegistros na tabela migrations:\n";
    if (Schema::hasTable('migrations')) {
        $migrations = DB::table('migrations')->get();
        foreach ($migrations as $m) {
            echo "- {$m->migration} (batch: {$m->batch})\n";
        }
    } else {
        echo "AVISO: Tabela 'migrations' não existe!\n";
    }

    echo "\nVerificando site_contents especificamente:\n";
    echo "Schema::hasTable('site_contents'): " . (Schema::hasTable('site_contents') ? 'SIM' : 'NAO') . "\n";

} catch (\Exception $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}
?>
