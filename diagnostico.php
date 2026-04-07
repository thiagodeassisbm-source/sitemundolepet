<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<html><body style='font-family:monospace; background:#111; color:#eee; padding:20px;'>";
echo "<h1>🕵️ Diagnóstico Deep v2 - Erro 419</h1>";

try {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    
    // Bootstrapping para ter acesso ao config
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $kernel->handle($request = Illuminate\Http\Request::capture());
    
    echo "<h3>2. Valores de Ambiente (Runtime)</h3>";
    echo "APP_URL: " . config('app.url') . "<br>";
    echo "SESSION_DRIVER: " . config('session.driver') . "<br>";
    echo "SESSION_SECURE: " . (config('session.secure') ? 'YES' : 'NO') . "<br>";
    echo "SESSION_DOMAIN: " . (config('session.domain') ?: 'NULL') . "<br>";
    echo "SESSION_SAMESITE: " . config('session.same_site', 'Lax') . "<br>";
    echo "COOKIE_NAME: " . config('session.cookie') . "<br>";
    echo "SECURE_BY_DEFAULT: " . (Illuminate\Support\Facades\Request::isSecure() ? 'YES' : 'NO') . "<br>";

    echo "<h3>3. Headers da Requisição</h3>";
    echo "<pre>";
    foreach (getallheaders() as $name => $value) {
        echo "$name: $value\n";
    }
    echo "</pre>";

    echo "<h3>4. Cookies Recebidos</h3>";
    echo "<pre>";
    print_r($_COOKIE);
    echo "</pre>";

} catch (Exception $e) {
    echo "<span style='color:red;'>❌ Erro Total: " . $e->getMessage() . "</span><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "</body></html>";
