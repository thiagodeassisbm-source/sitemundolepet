<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @php
        $seoTitle = isset($siteSeo->title) && trim((string) $siteSeo->title) !== '' ? (string) $siteSeo->title : config('app.name', 'Mundo Le Pet');
        $seoDescription = isset($siteSeo->description) && trim((string) $siteSeo->description) !== '' ? (string) $siteSeo->description : 'Mundo Le Pet: atendimento veterinario completo para o seu pet.';
        $seoFavicon = isset($siteSeo->favicon) ? (string) $siteSeo->favicon : '';
        $seoOgImage = isset($siteSeo->og_image_full) ? (string) $siteSeo->og_image_full : '';
        $seoUrl = url()->current();
    @endphp
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="description" content="{{ $seoDescription }}">
    <link rel="canonical" href="{{ $seoUrl }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $seoUrl }}">
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDescription }}">
    @if ($seoOgImage !== '')
        <meta property="og:image" content="{{ $seoOgImage }}">
    @endif
    @if ($seoFavicon !== '')
        <link rel="icon" href="{{ $seoFavicon }}">
    @endif
    <title inertia>{{ $seoTitle }}</title>

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
