<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google\Client;
use Google\Service\AnalyticsData;
use Google\Service\SearchConsole;
use Illuminate\Support\Facades\DB;

class GoogleController extends Controller
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
        // Ignore SSL verification for cURL error 60 workaround on some servers
        $this->client->setHttpClient(new \GuzzleHttp\Client(['verify' => false]));
        
        $account = DB::table('google_accounts')->first();
        
        $clientId = $account->client_id ?? config('services.google.client_id');
        $clientSecret = $account->client_secret ?? config('services.google.client_secret');
        $redirectUri = $account->redirect_uri ?? config('services.google.redirect_uri');

        if ($clientId) $this->client->setClientId($clientId);
        if ($clientSecret) $this->client->setClientSecret($clientSecret);
        if ($redirectUri) $this->client->setRedirectUri($redirectUri);
        
        $this->client->addScope([
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/webmasters.readonly',
            'https://www.googleapis.com/auth/admanager.readonly',
        ]);
        
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
    }

    public function connect()
    {
        $account = DB::table('google_accounts')->first();
        $clientId = $account->client_id ?? config('services.google.client_id');
        $clientSecret = $account->client_secret ?? config('services.google.client_secret');

        if (!$clientId || !$clientSecret) {
            return redirect()->route('admin.google.insights')->with('error', 'Credenciais do Google não configuradas. Preencha o Client ID e Secret nas configurações.');
        }

        try {
            return redirect()->away($this->client->createAuthUrl());
        } catch (\Exception $e) {
            return redirect()->route('admin.google.insights')->with('error', 'Erro ao iniciar conexão com Google: ' . $e->getMessage());
        }
    }

    public function callback(Request $request)
    {
        if ($request->has('code')) {
            $token = $this->client->fetchAccessTokenWithAuthCode($request->code);
            
            DB::table('google_accounts')->updateOrInsert(
                ['id' => 1],
                [
                    'email' => 'admin@mundolepet.com',
                    'access_token' => json_encode($token),
                    'refresh_token' => $token['refresh_token'] ?? null,
                    'updated_at' => now()
                ]
            );

            return redirect()->route('admin.google.insights')->with('success', 'Google conectado com sucesso!');
        }

        return redirect()->route('admin.google.insights')->with('error', 'Falha na conexão.');
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'property_id' => 'nullable|string',
            'site_url' => 'nullable|string',
            'client_id' => 'nullable|string',
            'client_secret' => 'nullable|string',
            'redirect_uri' => 'nullable|string',
            'api_key' => 'nullable|string',
        ]);

        DB::table('google_accounts')->updateOrInsert(
            ['id' => 1],
            [
                'email' => 'admin@mundolepet.com',
                'property_id' => $request->property_id,
                'site_url' => $request->site_url,
                'client_id' => $request->client_id,
                'client_secret' => $request->client_secret,
                'redirect_uri' => $request->redirect_uri,
                'api_key' => $request->api_key,
                'updated_at' => now()
            ]
        );

        return back()->with('success', 'Configurações atualizadas!');
    }

    public function disconnect()
    {
        DB::table('google_accounts')->updateOrInsert(
            ['id' => 1],
            [
                'email' => 'admin@mundolepet.com',
                'access_token' => null,
                'refresh_token' => null,
                'updated_at' => now()
            ]
        );

        return redirect()->route('admin.google.insights')->with('success', 'Google desconectado com sucesso!');
    }
}
