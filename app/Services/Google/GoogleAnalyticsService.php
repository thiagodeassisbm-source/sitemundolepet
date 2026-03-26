<?php

namespace App\Services\Google;

use Google\Client;
use Google\Service\AnalyticsData;
use Google\Service\AnalyticsData\RunReportRequest;
use Illuminate\Support\Facades\DB;

class GoogleAnalyticsService
{
    protected $client;
    protected $analytics;

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

        $this->analytics = new AnalyticsData($this->client);
    }

    /**
     * Obtém o tráfego dos últimos 30 dias (Usuários e Visualizações)
     */
    public function getVisitors30Days($propertyId)
    {
        if (!$propertyId) return null;

        $request = new RunReportRequest([
            'dateRanges' => [['startDate' => '30daysAgo', 'endDate' => 'today']],
            'dimensions' => [['name' => 'date']],
            'metrics' => [
                ['name' => 'activeUsers'],
                ['name' => 'screenPageViews']
            ]
        ]);

        try {
            $response = $this->analytics->properties->runReport("properties/$propertyId", $request);
            
            $data = [
                'labels' => [],
                'users' => [],
                'views' => []
            ];

            foreach ($response->getRows() as $row) {
                // Formata data YYYYMMDD para DD/MM
                $rawDate = $row->getDimensionValues()[0]->getValue();
                $formattedDate = substr($rawDate, 6, 2) . '/' . substr($rawDate, 4, 2);
                
                $data['labels'][] = $formattedDate;
                $data['users'][] = (int)$row->getMetricValues()[0]->getValue();
                $data['views'][] = (int)$row->getMetricValues()[1]->getValue();
            }

            return $data;
        } catch (\Exception $e) {
            \Log::error("Google Analytics API Error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtém métricas principais resumidas
     */
    public function getSummary($propertyId)
    {
        if (!$propertyId) return null;

        $request = new RunReportRequest([
            'dateRanges' => [['startDate' => '30daysAgo', 'endDate' => 'today']],
            'metrics' => [
                ['name' => 'activeUsers'],
                ['name' => 'screenPageViews'],
                ['name' => 'bounceRate'],
                ['name' => 'averageSessionDuration']
            ]
        ]);

        try {
            $response = $this->analytics->properties->runReport("properties/$propertyId", $request);
            $rows = $response->getRows();
            
            if (empty($rows)) {
                return [
                    'users' => '0',
                    'views' => '0',
                    'bounce_rate' => '0%',
                    'avg_duration' => '0 min'
                ];
            }

            $totals = $rows[0]->getMetricValues();

            return [
                'users' => number_format((float)($totals[0]->getValue() ?? 0), 0, ',', '.'),
                'views' => number_format((float)($totals[1]->getValue() ?? 0), 0, ',', '.'),
                'bounce_rate' => number_format((float)($totals[2]->getValue() ?? 0) * 100, 1) . '%',
                'avg_duration' => round((float)($totals[3]->getValue() ?? 0) / 60, 1) . ' min'
            ];
        } catch (\Exception $e) {
            \Log::error("Google Analytics Summary Error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Obtém o número de visitantes de hoje
     */
    public function getTodayVisitors($propertyId)
    {
        if (!$propertyId) return 0;

        $request = new RunReportRequest([
            'dateRanges' => [['startDate' => 'today', 'endDate' => 'today']],
            'metrics' => [['name' => 'activeUsers']]
        ]);

        try {
            $response = $this->analytics->properties->runReport("properties/$propertyId", $request);
            $rows = $response->getRows();
            if (empty($rows)) return 0;
            
            return (int)$rows[0]->getMetricValues()[0]->getValue();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Obtém o número de visitantes do mês atual
     */
    public function getMonthVisitors($propertyId)
    {
        if (!$propertyId) return 0;

        $request = new RunReportRequest([
            'dateRanges' => [['startDate' => 'firstDayOfMonth', 'endDate' => 'today']],
            'metrics' => [['name' => 'activeUsers']]
        ]);

        try {
            $response = $this->analytics->properties->runReport("properties/$propertyId", $request);
            $rows = $response->getRows();
            if (empty($rows)) return 0;
            
            return (int)$rows[0]->getMetricValues()[0]->getValue();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Obtém as visitas mensais (últimos 6 meses)
     */
    public function getMonthlyHistory($propertyId)
    {
        if (!$propertyId) return [];

        $request = new RunReportRequest([
            'dateRanges' => [['startDate' => '180daysAgo', 'endDate' => 'today']],
            'dimensions' => [['name' => 'yearMonth']],
            'metrics' => [['name' => 'activeUsers']]
        ]);

        try {
            $response = $this->analytics->properties->runReport("properties/$propertyId", $request);
            $history = [];
            
            // Garantir que os dados venham ordenados se a API não garantir
            $rows = $response->getRows();
            if (empty($rows)) return [];

            foreach ($rows as $row) {
                $rawMonth = $row->getDimensionValues()[0]->getValue(); // YYYYMM
                $year = substr($rawMonth, 0, 4);
                $month = substr($rawMonth, 4, 2);
                $label = $month . '/' . $year;
                $history[] = [
                    'label' => $label,
                    'count' => (int)$row->getMetricValues()[0]->getValue()
                ];
            }
            return $history;
        } catch (\Exception $e) {
            return [];
        }
    }
}
