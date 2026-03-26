<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $fillable = [
        'page',
        'section',
        'content_key',
        'content_value',
    ];

    public static function getContent($page)
    {
        return self::where('page', $page)->get()->groupBy('section')->map(function ($items) {
            return $items->pluck('content_value', 'content_key');
        });
    }

    /**
     * Retorna o título do site (SEO) cadastrado em Configurações > Site e Google.
     */
    public static function getSiteTitle(): string
    {
        $value = self::where('page', 'site')
            ->where('section', 'seo')
            ->where('content_key', 'title')
            ->value('content_value');
        return $value !== null && trim((string) $value) !== '' ? trim((string) $value) : '';
    }

    /**
     * Retorna a descrição do site (SEO) cadastrada em Configurações > Site e Google.
     */
    public static function getSiteDescription(): string
    {
        $value = self::where('page', 'site')
            ->where('section', 'seo')
            ->where('content_key', 'description')
            ->value('content_value');
        return $value !== null && trim((string) $value) !== '' ? trim((string) $value) : '';
    }
}
