<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @php
        $defaultTitle = "Mundo Le Pet - Excelência em Nutrologia e Dermatologia Pet";
        $defaultDescription = "Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia, além de consultas clínicas, exames e vacinação em Goiânia.";
        
        $seoTitle = $defaultTitle;
        $seoDescription = $defaultDescription;
        $seoFavicon = '';
        $seoOgImageFull = '';
        try {
            $seo = \App\Http\Middleware\HandleInertiaRequests::siteSeoShared();
            if (! empty(trim((string) ($seo->title ?? '')))) {
                $seoTitle = trim((string) $seo->title);
            }
            if (! empty(trim((string) ($seo->description ?? '')))) {
                $seoDescription = trim((string) $seo->description);
            }
            $seoFavicon = (string) ($seo->favicon ?? '');
            $seoOgImageFull = trim((string) ($seo->og_image_full ?? ''));
        } catch (\Throwable $e) {
            $seoFavicon = '';
        }

        $faviconUrl = $seoFavicon
            ? (str_starts_with($seoFavicon, 'http') ? $seoFavicon : asset($seoFavicon))
            : asset('favicon.png');
    @endphp

    <title inertia>{{ $seoTitle }}</title>
    <meta name="description" content="{{ $seoDescription }}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Open Graph -->
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDescription }}">
    @if ($seoOgImageFull !== '')
        <meta property="og:image" content="{{ $seoOgImageFull }}">
    @endif
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">

    <!-- Favicons -->
    <link rel="icon" href="{{ asset('favicon.png') }}" sizes="32x32">
    <link rel="icon" href="{{ asset('favicon-48x48.png') }}" sizes="48x48">
    <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
    {{-- Fallback para o favicon dinâmico se for diferente --}}
    @if($seoFavicon)
        <link rel="icon" type="image/png" href="{{ $faviconUrl }}">
    @endif

    <!-- LocalBusiness Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "VeterinaryCare",
      "name": "Mundo Le Pet",
      "image": "https://mundolepet.com.br/images/logo_reta.png",
      "@id": "https://mundolepet.com.br/",
      "url": "https://mundolepet.com.br/",
      "telephone": "+5562999999999",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua T-44, 282",
        "addressLocality": "Goiânia",
        "addressRegion": "GO",
        "postalCode": "74210-150",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -16.704283,
        "longitude": -49.273656
      },
      "openingHoursSpecification": {
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
      }
    }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"></noscript>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-snow-white">
    @inertia
</body>
</html>
