<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        {{-- SEO Dinâmico - Fallback Seguro --}}
        <title inertia>{{ data_get($page, 'props.siteSeo.title') ?: 'Mundo Le Pet | Pet Shop e Clínica Veterinária no Setor Coimbra' }}</title>
        <meta name="description" content="{{ data_get($page, 'props.siteSeo.description') ?: 'Especialistas em Nutrologia e Dermatologia Pet, Banho e Tosa, localizados no Setor Coimbra Goiânia.' }}">
        <meta name="robots" content="index, follow">

        {{-- Favicon Dinâmico com Cache Busting --}}
        <link rel="icon" href="{{ data_get($page, 'props.siteSeo.favicon') ? (str_starts_with(data_get($page, 'props.siteSeo.favicon'), 'http') ? data_get($page, 'props.siteSeo.favicon') : asset(data_get($page, 'props.siteSeo.favicon'))) : asset('favicon.png') }}?v={{ time() }}">

        {{-- Fontes Outfit --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

        {{-- Scripts e Vite - Protegido contra $page Nulo --}}
        @routes
        @viteReactRefresh
        @php
            $viteFiles = ['resources/js/app.jsx'];
            $component = data_get($page, 'component');
            if ($component) {
                $viteFiles[] = "resources/js/Pages/{$component}.jsx";
            }
        @endphp
        @vite($viteFiles)
        @inertiaHead

        <style>
            aside nav span { font-size: 1.125rem !important; font-weight: 400 !important; }
            aside nav div div span { font-size: 1rem !important; font-weight: 400 !important; }
        </style>

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1EYHR3C2YT"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18003587585');
            gtag('config', 'G-1EYHR3C2YT');
        </script>
    </head>
    <body class="font-sans antialiased bg-snow-white">
        @inertia
    </body>
</html>
