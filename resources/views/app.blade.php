<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        {{-- SEO Dinâmico do Painel Admin via Props do Inertia --}}
        <title inertia>{{ data_get($page, 'props.siteSeo.title') ?: config('app.name', 'Mundo Le Pet') }}</title>
        <meta name="description" content="{{ data_get($page, 'props.siteSeo.description') ?: 'Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia em Goiânia.' }}">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Favicon Dinâmico com Cache Busting --}}
        <link rel="icon" href="{{ data_get($page, 'props.siteSeo.favicon') ? (str_starts_with(data_get($page, 'props.siteSeo.favicon'), 'http') ? data_get($page, 'props.siteSeo.favicon') : asset(data_get($page, 'props.siteSeo.favicon'))) : asset('favicon.png') }}?v={{ time() }}">

        {{-- Fontes e Performance --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"></noscript>

        {{-- Scripts e Inertia --}}
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <style>
            /* Ajustar fonte do menu lateral */
            aside nav span {
                font-size: 1.125rem !important; /* text-lg */
                font-weight: 400 !important;
            }
            aside nav div div span {
                font-size: 1rem !important;    /* text-base */
                font-weight: 400 !important;
            }
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

        <!-- SEO Local Schema -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "PetStore",
          "name": "Mundo Le Pet",
          "image": "https://mundolepet.com.br/images/logo_reta.png",
          "@id": "https://mundolepet.com.br",
          "url": "https://mundolepet.com.br",
          "telephone": "+5562981991186",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Avenida Perimetral, Setor Coimbra - No SUBSOLO do Hiper Moreira",
            "addressLocality": "Goiânia",
            "addressRegion": "GO",
            "postalCode": "74425-030",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -16.6782,
            "longitude": -49.2789
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "08:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Sunday",
              "opens": "09:00",
              "closes": "14:00"
            }
          ],
          "sameAs": ["https://www.instagram.com/mundolepet"]
        }
        </script>
    </head>
    <body class="font-sans antialiased bg-snow-white">
        @inertia
    </body>
</html>
