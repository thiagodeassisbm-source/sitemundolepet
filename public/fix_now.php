<?php
// Script de resgate: sobrescreve o app.blade.php E limpa o cache
$base = dirname(__DIR__);
$bladeFile = $base . '/resources/views/app.blade.php';
$cacheDir  = $base . '/storage/framework/views/';

$newContent = <<<'BLADE'
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Mundo Le Pet') }}</title>
        <meta name="description" content="Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia.">

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1EYHR3C2YT"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18003587585');
            gtag('config', 'G-1EYHR3C2YT');
        </script>

        <!-- SEO Local Schema -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "PetStore",
          "name": "Mundo Le Pet",
          "image": "https://mundolepet.com.br/images/logo_reta.png",
          "@id": "https://mundolepet.com.br",
          "url": "https://mundolepet.com.br",
          "telephone": "+5562981991186"
        }
        </script>

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
BLADE;

// 1. Sobrescrever o arquivo blade
$written = file_put_contents($bladeFile, $newContent);

// 2. Apagar TODOS os caches de view
$deleted = 0;
foreach (glob($cacheDir . '*.php') as $cacheFile) {
    if (unlink($cacheFile)) $deleted++;
}

echo "<h2>Resultado do Resgate</h2>";
echo "<p>Blade sobrescrito? " . ($written !== false ? "SIM ✅ ($written bytes)" : "FALHOU ❌") . "</p>";
echo "<p>Caches apagados: $deleted arquivo(s) ✅</p>";
echo "<p>Linhas no novo arquivo: " . count(file($bladeFile)) . "</p>";

echo "<h3>Verificação do novo conteúdo:</h3>";
echo "<pre style='background:#f0f0f0;padding:10px;font-size:12px;'>";
echo htmlspecialchars(file_get_contents($bladeFile));
echo "</pre>";

echo "<p><strong><a href='/' style='color:green'>Clique aqui para testar o site agora!</a></strong></p>";
echo "<p style='color:red'><strong>Apague este arquivo (fix_now.php) depois de usar!</strong></p>";
