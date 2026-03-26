<?php

namespace App\Services\Google;

use Google\Client;
use Google\Service\SearchConsole;
use Google\Service\SearchConsole\SearchAnalyticsQueryRequest;
use Illuminate\Support\Facades\DB;

class GoogleSearchConsoleService
{
    protected $client;
    protected $searchConsole;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setHttpClient(new \GuzzleHttp\Client(['verify' => false]));
        
        $account = DB::table('google_accounts')->first();
        
        $clientId = $account->client_id ?? config('services.google.client_id');
        $clientSecret = $account->client_secret ?? config('services.google.client_secret');

        if ($clientId) $this->client->setClientId($clientId);
        if ($clientSecret) $this->client->setClientSecret($clientSecret);
        
        if ($account) {
            $tokens = json_decode($account->access_token, true);
            $this->client->setAccessToken($tokens);

            if ($this->client->isAccessTokenExpired()) {
                if ($this->client->getRefreshToken()) {
                    $newToken = $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    DB::table('google_accounts')->where('id', $account->id)->update([
                        'access_token' => json_encode($newToken)
                    ]);
                }
            }
        }

        $this->searchConsole = new SearchConsole($this->client);
    }

    /**
     * Obtém cliques, impressões e palavras-chave dos últimos 30 dias
     */
    public function getSearchMetrics($siteUrl)
    {
        if (!$siteUrl) return null;

        $request = new SearchAnalyticsQueryRequest();
        $request->setStartDate(date('Y-m-d', strtotime('-30 days')));
        $request->setEndDate(date('Y-m-d'));
        $request->setDimensions(['query']);
        $request->setRowLimit(10);

        try {
            $response = $this->searchConsole->searchanalytics->query($siteUrl, $request);
            $rows = $response->getRows();
            
            $queries = [];
            $totalClicks = 0;
            $totalImpressions = 0;

            if ($rows) {
                foreach ($rows as $row) {
                    $queries[] = [
                        'query' => $row->getKeys()[0],
                        'clicks' => $row->getClicks(),
                        'impressions' => $row->getImpressions(),
                        'ctr' => round($row->getCtr() * 100, 2) . '%',
                        'position' => round($row->getPosition(), 1)
                    ];
                    $totalClicks += $row->getClicks();
                    $totalImpressions += $row->getImpressions();
                }
            }

            return [
                'queries' => $queries,
                'total_clicks' => $totalClicks,
                'total_impressions' => $totalImpressions,
                'avg_ctr' => ($totalImpressions > 0) ? round(($totalClicks / $totalImpressions) * 100, 2) . '%' : '0%'
            ];
        } catch (\Exception $e) {
            \Log::error("Google Search Console API Error: " . $e->getMessage());
            return null;
        }
    }
}
