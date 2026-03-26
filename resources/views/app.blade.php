<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">

        @php
            $siteTitle = \App\Models\SiteContent::getSiteTitle() ?: config('app.name', 'Mundo Le Pet');
            $siteDescription = \App\Models\SiteContent::getSiteDescription();
            $allContent = \App\Models\SiteContent::getContent('site');
            $siteSeoHead = $allContent ? $allContent->get('seo') : null;
            $siteFavicon = $siteSeoHead ? $siteSeoHead->get('favicon', '') : '';
        @endphp
        <title inertia>{{ $siteTitle }}</title>
        @if($siteDescription)
        <meta name="description" content="{{ $siteDescription }}">
        @endif
        @if($siteFavicon)
        <link rel="icon" href="{{ str_starts_with($siteFavicon, 'http') ? $siteFavicon : asset($siteFavicon) }}?v={{ time() }}">
        @endif

        <!-- Fonts & Performance -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"></noscript>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
        <style>
            /* Ajustar fonte: tamanho intermediário e sem negrito */
            aside nav span {
                font-size: 1.125rem !important; /* Equivalente a text-lg */
                font-weight: 400 !important;   /* Fonte normal, sem negrito */
            }
            /* Subitens levemente menores */
            aside nav div div span {
                font-size: 1rem !important;    /* Equivalente a text-base */
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
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
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
          "sameAs": [
            "https://www.instagram.com/mundolepet"
          ]
        }
        </script>
    </head>
    <body class="font-sans antialiased bg-snow-white">
        @inertia
    </body>
</html>
