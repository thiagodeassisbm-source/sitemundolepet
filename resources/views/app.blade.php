<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Titulo e Descricao dinamicos vindos do Painel Admin > Site e Google --}}
        <title inertia>{{ data_get($page, 'props.siteSeo.title') ?: config('app.name', 'Mundo Le Pet') }}</title>
        <meta name="description" content="{{ data_get($page, 'props.siteSeo.description') ?: 'Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia.' }}">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph --}}
        <meta property="og:title" content="{{ data_get($page, 'props.siteSeo.title') ?: config('app.name', 'Mundo Le Pet') }}">
        <meta property="og:description" content="{{ data_get($page, 'props.siteSeo.description') ?: 'Na Mundo Le Pet, atendimento veterinário em Goiânia.' }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">

        <link rel="icon" href="{{ asset('favicon.png') }}" sizes="any">

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
          "name": "{{ data_get($page, 'props.siteSeo.title') ?: 'Mundo Le Pet' }}",
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
