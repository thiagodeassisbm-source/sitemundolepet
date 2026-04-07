<?php
// Aplica SEO dinamico no app.blade.php + limpa cache
// Execute UMA VEZ e apague depois.
$base = dirname(__DIR__);
$bladeFile = $base . '/resources/views/app.blade.php';
$cacheDir  = $base . '/storage/framework/views/';

// Conteudo final: SEO dinamico via data_get (sem @if, sem @php)
$html = <<<'BLADE'
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ data_get($page, 'props.siteSeo.title') ?: config('app.name', 'Mundo Le Pet') }}</title>
        <meta name="description" content="{{ data_get($page, 'props.siteSeo.description') ?: 'Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia.' }}">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        <meta property="og:title" content="{{ data_get($page, 'props.siteSeo.title') ?: config('app.name', 'Mundo Le Pet') }}">
        <meta property="og:description" content="{{ data_get($page, 'props.siteSeo.description') ?: 'Na Mundo Le Pet, atendimento veterinário em Goiânia.' }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">

        <link rel="icon" href="{{ asset('favicon.png') }}" sizes="any">

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1EYHR3C2YT"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18003587585');
            gtag('config', 'G-1EYHR3C2YT');
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

$ok = file_put_contents($bladeFile, $html);
$deleted = 0;
foreach (glob($cacheDir . '*.php') as $f) { if(unlink($f)) $deleted++; }

echo "<h2>" . ($ok ? "✅ Aplicado com sucesso!" : "❌ ERRO ao gravar!") . "</h2>";
echo "<p>Arquivo gravado: $ok bytes | Cache limpo: $deleted arquivo(s)</p>";
echo "<p><strong><a href='/'>👉 Clique aqui para testar o site</a></strong></p>";
echo "<p>Depois de confirmar, apague este arquivo (seo_apply.php) por segurança.</p>";
