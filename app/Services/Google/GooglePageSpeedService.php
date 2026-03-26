<?php

namespace App\Services\Google;

use Illuminate\Support\Facades\Http;

class GooglePageSpeedService
{
    /**
     * Obtém métricas de performance do site
     */
    public function getPerformanceMetrics($url)
    {
        if (!$url) return null;

        $account = \Illuminate\Support\Facades\DB::table('google_accounts')->first();
        $apiKey = $account->api_key ?? config('services.google.api_key');
        
        $apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

        try {
            // Chamada para Desktop
            $response = Http::get($apiUrl, [
                'url' => $url,
                'category' => 'performance',
                'strategy' => 'desktop',
                'key' => $apiKey
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'score' => round($data['lighthouseResult']['categories']['performance']['score'] * 100),
                    'lcp' => $data['lighthouseResult']['audits']['largest-contentful-paint']['displayValue'],
                    'fid' => $data['lighthouseResult']['audits']['max-potential-fid']['displayValue'] ?? 'N/A',
                    'cls' => $data['lighthouseResult']['audits']['cumulative-layout-shift']['displayValue'],
                ];
            }
        } catch (\Exception $e) {
            \Log::error("Google PageSpeed API Error: " . $e->getMessage());
        }

        return null;
    }
}
