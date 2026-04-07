<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     * Usa a data de alteração do manifest do Vite para recarregar os assets quando houver atualização.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        $manifestPath = public_path('build/manifest.json');
        if (is_file($manifestPath)) {
            return (string) filemtime($manifestPath);
        }
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'errors' => fn () => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],
            'debug' => fn () => $request->session()->get('debug'),
            'agendamentosPendentesCount' => fn () => $request->user()
                ? \App\Models\Appointment::where('status', 'pendente')->count()
                : 0,
            'siteSeo' => fn () => static::siteSeoShared(),
        ];
    }

    /**
     * Título, descrição, favicon e og:image do site (Google / compartilhamento).
     * Usado no <head> das páginas públicas.
     */
    public static function siteSeoShared(): object
    {
        // Título e descrição: mesmas queries do admin (Configurações > Site e Google)
        $title = \App\Models\SiteContent::getSiteTitle();
        $description = \App\Models\SiteContent::getSiteDescription();

        $content = \App\Models\SiteContent::getContent('site');
        $seo = $content->get('seo');
        if (!$seo || !$seo instanceof \Illuminate\Support\Collection) {
            return (object) [
                'title' => $title,
                'description' => $description,
                'favicon' => '',
                'og_image' => '',
                'og_image_full' => '',
            ];
        }
        $arr = $seo->all();
        $favicon = $arr['favicon'] ?? '';
        $ogImage = $arr['og_image'] ?? '';
        $ogImageFull = $ogImage && str_starts_with((string) $ogImage, '/')
            ? (request()->getSchemeAndHttpHost() . $ogImage)
            : (string) $ogImage;

        return (object) [
            'title' => $title !== '' ? $title : trim((string) ($arr['title'] ?? '')),
            'description' => $description !== '' ? $description : trim((string) ($arr['description'] ?? '')),
            'favicon' => $favicon,
            'og_image' => $ogImage,
            'og_image_full' => $ogImageFull,
        ];
    }
}
