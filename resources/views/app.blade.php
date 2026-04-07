<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>Mundo Le Pet | Pet Shop e Clínica Veterinária no Setor Coimbra</title>
        <meta name="description" content="Especialistas em Nutrologia e Dermatologia Pet, Banho e Tosa, localizados no Setor Coimbra Goiânia. Atendimento focado em alimentação natural e bem-estar animal.">
        <link rel="icon" href="/favicon.png">
        @routes
        @viteReactRefresh
        @php
            $viteFiles = ['resources/js/app.jsx'];
            if (isset($page['component'])) {
                $viteFiles[] = "resources/js/Pages/{$page['component']}.jsx";
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
