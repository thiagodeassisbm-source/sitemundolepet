<?php
// Versao 3 - Diagnostico completo
ini_set('display_errors', 1);
error_reporting(E_ALL);

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(Illuminate\Http\Request::capture());

    echo "=== DIAGNOSTICO V3 ===\n";
    echo "Banco: " . DB::connection()->getDatabaseName() . "\n";
    
    // 1. Verificar Colunas no Users
    $hasRole = Schema::hasColumn('users', 'role');
    $hasStatus = Schema::hasColumn('users', 'status');
    echo "Users possui role? " . ($hasRole ? 'SIM' : 'NAO') . "\n";
    echo "Users possui status? " . ($hasStatus ? 'SIM' : 'NAO') . "\n";

    // 2. Verificar Migrations Pendentes
    echo "\nMigrations no Banco:\n";
    $dbMigrations = DB::table('migrations')->pluck('migration')->toArray();
    
    $files = glob(__DIR__ . '/database/migrations/*.php');
    foreach ($files as $file) {
        $name = basename($file, '.php');
        $inDb = in_array($name, $dbMigrations);
        echo "- $name: " . ($inDb ? '[OK]' : '[PENDENTE]') . "\n";
    }

    // 3. Tentar limpar site_contents se solicitado
    if (isset($_GET['fix'])) {
        echo "\nTentando fix...\n";
        // Registrar as migrations que já foram feitas manualmente ou deram conflito
        $toRegister = [
            '2026_03_03_000000_create_site_contents_table',
            '2026_02_26_000001_create_appointments_table'
        ];
        
        foreach ($toRegister as $m) {
            if (!in_array($m, $dbMigrations)) {
                DB::table('migrations')->insert(['migration' => $m, 'batch' => 999]);
                echo "Registrada migration: $m\n";
            }
        }
        echo "Fix concluído.\n";
    }

} catch (\Exception $e) {
    echo "Erro: " . $e->getMessage() . "\n";
}
?>
