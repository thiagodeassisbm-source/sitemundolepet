<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rota do Sitemap para SEO
Route::get('/sitemap.xml', function () {
    $now = now()->startOfDay()->toAtomString();
    $baseUrl = 'https://www.mundolepet.com.br'; // Forçando www conforme preferência do usuário
    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    $urls = [
        ['loc' => $baseUrl . '/', 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '1.0'],
        ['loc' => $baseUrl . '/#servicos', 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.9'],
        ['loc' => $baseUrl . '/#nutricao', 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.9'],
        ['loc' => $baseUrl . '/#banhotosa', 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.9'],
        ['loc' => $baseUrl . '/historia', 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
        ['loc' => $baseUrl . '/contato', 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
    ];

    foreach ($urls as $url) {
        $xml .= '<url>';
        $xml .= '<loc>' . $url['loc'] . '</loc>';
        $xml .= '<lastmod>' . $url['lastmod'] . '</lastmod>';
        $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
        $xml .= '<priority>' . $url['priority'] . '</priority>';
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    return response($xml, 200, ['Content-Type' => 'application/xml']);
});

// Robots.txt para SEO
Route::get('/robots.txt', function () {
    $baseUrl = 'https://www.mundolepet.com.br';
    $content = "User-agent: *\nAllow: /\n\nSitemap: " . $baseUrl . '/sitemap.xml';
    return response($content, 200, ['Content-Type' => 'text/plain']);
});

Route::get('/deploy-teste.txt', function () {
    return response('Deploy OK - Mundo Le Pet. Arquivo de teste. Se você vê isto, o routes/web.php foi atualizado no servidor.', 200, [
        'Content-Type' => 'text/plain; charset=utf-8',
    ]);
});

// Verificação do deploy da pasta build/: Laravel lê o arquivo que o script envia.
// Se aparecer o texto abaixo = build/ está na pasta certa (public/build/). Se 404 = pasta errada.
Route::get('/build/deploy-verificado.txt', function () {
    $path = public_path('build/deploy-verificado.txt');
    if (!is_file($path)) {
        return response("Arquivo não encontrado no servidor.\nCaminho esperado: " . $path . "\n\nO deploy está enviando para outra pasta. Ajuste FTP_REMOTE_PATH no .env.deploy.", 404, [
            'Content-Type' => 'text/plain; charset=utf-8',
        ]);
    }
    return response()->file($path, [
        'Content-Type' => 'text/plain; charset=utf-8',
    ]);
});

/*
|--------------------------------------------------------------------------
| Public Stats API
|--------------------------------------------------------------------------
*/
Route::post('/api/stats/video-click', function () {
    try {
        \Illuminate\Support\Facades\DB::table('stats_counters')
            ->where('key', 'video_clicks')
            ->increment('value');
        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Temporário para rodar migração campo estatísticas
Route::get('/run-migrations-stats-v2', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return \Illuminate\Support\Facades\Artisan::output();
    } catch (\Exception $e) {
        return 'ERR: ' . $e->getMessage();
    }
});

Route::get('/', function () {
    try {
        $content = \App\Models\SiteContent::getContent('home');
        // Se existir apenas 'initial' (seed antigo), usar como 'hero' para o frontend
        if ($content->get('hero') === null && $content->get('initial')) {
            $content->put('hero', $content->get('initial'));
        }
        $videosContent = \App\Models\SiteContent::getContent('videos');
        $videosList = $videosContent->get('videos')?->get('list');
        $videos = $videosList ? (is_string($videosList) ? json_decode($videosList, true) : $videosList) : [];
        $videos = is_array($videos) ? $videos : [];
        $contactInfo = \App\Models\SiteContent::getContent('contact');
    } catch (\Throwable $e) {
        \Log::error('Public home fallback activated: ' . $e->getMessage());
        $content = collect();
        $videos = [];
        $contactInfo = collect();
    }

    return Inertia::render('Home', [
        'cms' => $content,
        'videos' => $videos,
        'contactInfo' => $contactInfo,
    ]);
});

Route::get('/historia', function () {
    try {
        $content = \App\Models\SiteContent::getContent('history');
        $hero = $content->get('hero', collect());
        $history = $content->get('history', collect());
        $merged = $hero->merge($history)->all();
        $homeContent = \App\Models\SiteContent::getContent('home');
        $whatsapp = $homeContent->get('profile')?->get('whatsapp') ?? '';
    } catch (\Throwable $e) {
        \Log::error('Public history fallback activated: ' . $e->getMessage());
        $merged = [];
        $whatsapp = '';
    }

    $response = Inertia::render('History', ['cms' => ['history' => $merged], 'whatsapp' => $whatsapp]);
    return $response->toResponse(request())
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache');
});

Route::get('/contato', function () {
    try {
        $content = \App\Models\SiteContent::getContent('contact');
        $homeContent = \App\Models\SiteContent::getContent('home');
        $whatsapp = $homeContent->get('profile')?->get('whatsapp') ?? '';
    } catch (\Throwable $e) {
        \Log::error('Public contact fallback activated: ' . $e->getMessage());
        $content = collect();
        $whatsapp = '';
    }

    return Inertia::render('Contact', ['cms' => $content, 'whatsapp' => $whatsapp]);
});

Route::post('/agendamento', [App\Http\Controllers\AppointmentController::class, 'store'])->name('agendamento.store');

Route::prefix('admin')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Admin/Login');
    })->name('login');

    /**
     * Debug do login: abra no navegador /admin/debug-login
     * Mostra se o banco está conectado, usuários na tabela e teste de senha.
     */
    Route::get('/debug-login', function () {
        $html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Debug Login</title>';
        $html .= '<style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;background:#f5f5f5;}';
        $html .= '.ok{color:green;}.erro{color:red;}.info{background:#fff;padding:12px;margin:8px 0;border-radius:8px;border-left:4px solid #572981;} pre{overflow:auto;}</style></head><body>';
        $html .= '<h1>🔧 Debug Login – Mundo Le Pet</h1>';

        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            $dbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
            $html .= '<p class="ok">✅ Conexão com o banco: OK (banco: <strong>' . htmlspecialchars($dbName) . '</strong>)</p>';
        } catch (\Throwable $e) {
            $html .= '<p class="erro">❌ Conexão com o banco: FALHOU</p>';
            $html .= '<div class="info erro"><strong>Erro:</strong> ' . htmlspecialchars($e->getMessage()) . '</div>';
            $html .= '</body></html>';
            return response($html, 500)->header('Content-Type', 'text/html; charset=utf-8');
        }

        try {
            $users = \Illuminate\Support\Facades\DB::table('users')->get(['id', 'name', 'email']);
            $html .= '<p class="ok">✅ Tabela <code>users</code>: ' . $users->count() . ' usuário(s)</p>';
            if ($users->isEmpty()) {
                $html .= '<div class="info">Nenhum usuário no banco. Crie um ou rode o script atualizar_senha.php.</div>';
            } else {
                $html .= '<div class="info"><strong>Usuários:</strong><pre>' . htmlspecialchars(json_encode($users->toArray(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . '</pre></div>';
                $first = $users->first();
                $testPass = 'MundoLePet2024!';
                $attempt = \Illuminate\Support\Facades\Auth::attempt(['email' => $first->email, 'password' => $testPass], false);
                $html .= '<div class="info"><strong>Teste de senha</strong> para ' . htmlspecialchars($first->email) . ' com senha "' . htmlspecialchars($testPass) . '": ';
                $html .= $attempt ? '<span class="ok">✅ OK – use esse e-mail e essa senha no login.</span>' : '<span class="erro">❌ Senha não confere. Rode: php atualizar_senha.php</span>';
                $html .= '</div>';
            }
        } catch (\Throwable $e) {
            $html .= '<p class="erro">❌ Erro ao ler tabela users</p>';
            $html .= '<div class="info erro">' . htmlspecialchars($e->getMessage()) . '</div>';
        }

        $html .= '<p style="margin-top:24px;"><a href="/admin/login">← Voltar ao login</a></p></body></html>';
        return response($html)->header('Content-Type', 'text/html; charset=utf-8');
    });

    Route::post('/login', function (\Illuminate\Http\Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        try {
            if (\Illuminate\Support\Facades\Auth::attempt($credentials, $request->boolean('remember'))) {
                $request->session()->regenerate();
                return redirect()->intended('/admin/dashboard');
            }
        } catch (\RuntimeException $e) {
            // Hash antigo ou inválido (não-bcrypt): trata como credencial incorreta, sem 500
        }

        return Inertia::render('Admin/Login', [
            'loginError' => 'Usuário ou senha estão incorretos. Tente novamente.',
        ]);
    });

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            $stats = [
                'visits' => 0,
                'visits_month' => 0,
                'visits_history' => [],
                'leads' => \App\Models\Appointment::where('status', 'pendente')->count(),
                'appointments' => \App\Models\Appointment::whereIn('status', ['confirmado', 'realizado'])->count(),
                'video_clicks' => \Illuminate\Support\Facades\DB::table('stats_counters')->where('key', 'video_clicks')->value('value') ?? 0,
            ];

            try {
                $account = \Illuminate\Support\Facades\DB::table('google_accounts')->first();
                if ($account && $account->property_id) {
                    $analytics = new \App\Services\Google\GoogleAnalyticsService();
                    $stats['visits'] = $analytics->getTodayVisitors($account->property_id);
                    $stats['visits_month'] = $analytics->getMonthVisitors($account->property_id);
                    $stats['visits_history'] = $analytics->getMonthlyHistory($account->property_id);
                }
            } catch (\Exception $e) {
                \Log::error("Dashboard Stats Error: " . $e->getMessage());
            }

            $recentActivity = \App\Models\Appointment::orderBy('created_at', 'desc')
                ->limit(4)
                ->get()
                ->map(function($app) {
                    $time = $app->created_at->diffForHumans();
                    return [
                        'user' => $app->name,
                        'action' => $app->status === 'pendente' ? 'Novo Agendamento solicitado' : 'Agendamento ' . $app->status,
                        'time' => $time,
                        'type' => $app->status
                    ];
                });

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentActivity' => $recentActivity
            ]);
        })->name('admin.dashboard');





        Route::get('/content', function () {
            $conteudo = \App\Models\SiteContent::getContent('home');
            if ($conteudo->get('hero') === null && $conteudo->get('initial')) {
                $conteudo->put('hero', $conteudo->get('initial'));
            }
            return Inertia::render('Admin/HomeContent', [
                'conteudo' => $conteudo->toArray()
            ]);
        })->name('admin.content');

        // Debug: ver exatamente o que está vindo para o painel de conteúdo
        Route::get('/content-debug', function () {
            $conteudo = \App\Models\SiteContent::getContent('home');
            if ($conteudo->get('hero') === null && $conteudo->get('initial')) {
                $conteudo->put('hero', $conteudo->get('initial'));
            }
            return response()->json($conteudo);
        })->name('admin.content.debug');

        // Preencher abas que estão vazias: Nossos Diferenciais, Perfil Profissional, Alimentação Natural
        Route::get('/content-preencher-abas', function () {
            $itens = [
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'title', 'content_value' => 'Nossos Diferenciais'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card1_title', 'content_value' => 'Alimentação Natural'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card1_text', 'content_value' => 'Nutrologia personalizada para o bem-estar e longevidade do seu pet.'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card1_image', 'content_value' => ''],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card2_title', 'content_value' => 'Dermatologia'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card2_text', 'content_value' => 'Cuidado especializado para a saúde da pele e pelagem do seu melhor amigo.'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card2_image', 'content_value' => ''],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card3_title', 'content_value' => 'Consultas Especializadas'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card3_text', 'content_value' => 'Atendimento focado em medicina preventiva e curativa.'],
                ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card3_image', 'content_value' => ''],
                ['page' => 'home', 'section' => 'profile', 'content_key' => 'title', 'content_value' => 'Responsável Técnica'],
                ['page' => 'home', 'section' => 'profile', 'content_key' => 'name', 'content_value' => 'Dra. Thania Alvarenga'],
                ['page' => 'home', 'section' => 'profile', 'content_key' => 'quote', 'content_value' => 'Minha missão é transformar a saúde dos pets através de uma abordagem natural e científica.'],
                ['page' => 'home', 'section' => 'profile', 'content_key' => 'text', 'content_value' => 'A Dra. Thania Alvarenga é reconhecida por sua expertise em Nutrologia Pet e Dermatologia, unindo ciência e natureza para tratar as causas raízes dos problemas de saúde.'],
                ['page' => 'home', 'section' => 'profile', 'content_key' => 'tags', 'content_value' => 'Nutróloga Veterinária, Dermatologista Pet, +10 anos de Experiência'],
                ['page' => 'home', 'section' => 'profile', 'content_key' => 'image', 'content_value' => '/images/dra_thania.png'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'title', 'content_value' => 'Nossa Linha Natural'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'text', 'content_value' => 'Trabalhamos com ingredientes frescos e selecionados, sem conservantes artificiais ou corantes. Cada receita é formulada para atender às necessidades específicas do seu animal.'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat1_val', 'content_value' => '100%'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat1_label', 'content_value' => 'Natural e Fresco'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat2_val', 'content_value' => '0%'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat2_label', 'content_value' => 'Conservantes'],
                ['page' => 'home', 'section' => 'natural', 'content_key' => 'image', 'content_value' => '/images/natural_food.png'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'subtitle', 'content_value' => 'O que oferecemos'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'title', 'content_value' => 'Serviços que realizamos'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'description', 'content_value' => 'Na Mundo Le Pet, oferecemos atendimento veterinário completo para o seu pet: consultas clínicas e especializadas, exames, vacinação, castração e muito mais. Conte com nossa equipe para cuidar da saúde e do bem-estar do seu melhor amigo.'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service1_name', 'content_value' => 'Castração'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service2_name', 'content_value' => 'Consulta Clínica Geral'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service3_name', 'content_value' => 'Consulta de Dermatologia'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service4_name', 'content_value' => 'Consulta de Nutrologia'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service5_name', 'content_value' => 'Exames Laboratoriais'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service6_name', 'content_value' => 'Exames de Imagem'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service7_name', 'content_value' => 'Outras Especialidades'],
                ['page' => 'home', 'section' => 'servicos', 'content_key' => 'service8_name', 'content_value' => 'Vacina'],
            ];
            foreach ($itens as $item) {
                \App\Models\SiteContent::updateOrCreate(
                    ['page' => $item['page'], 'section' => $item['section'], 'content_key' => $item['content_key']],
                    ['content_value' => $item['content_value']]
                );
            }
            return redirect()->route('admin.content')->with('message', 'Abas preenchidas. Recarregue a página se não aparecer.');
        })->name('admin.content.preencher');

        Route::get('/pages/history', [\App\Http\Controllers\Admin\PageController::class, 'history'])->name('admin.pages.history');
        Route::get('/pages/contact', [\App\Http\Controllers\Admin\PageController::class, 'contact'])->name('admin.pages.contact');
        Route::get('/settings/site', function () {
            $conteudo = \App\Models\SiteContent::getContent('site');
            return Inertia::render('Admin/SiteSettings', ['conteudo' => $conteudo->toArray()]);
        })->name('admin.settings.site');
        Route::post('/pages/update', [\App\Http\Controllers\Admin\PageController::class, 'update'])->name('admin.pages.update');
        Route::post('/pages/upload-image', [\App\Http\Controllers\Admin\PageController::class, 'uploadImage'])->name('admin.pages.upload-image');

        Route::get('/agendamentos', [\App\Http\Controllers\Admin\AppointmentController::class, 'index'])->name('admin.agendamentos');
        Route::patch('/agendamentos/{appointment}', [\App\Http\Controllers\Admin\AppointmentController::class, 'update'])->name('admin.agendamentos.update');

        Route::get('/videos', function () {
            $content = \App\Models\SiteContent::getContent('videos');
            $list = $content->get('videos')?->get('list');
            $videos = $list ? (is_string($list) ? json_decode($list, true) : $list) : [];
            $videos = is_array($videos) ? $videos : [];
            return Inertia::render('Admin/Videos', [
                'videos' => $videos,
            ]);
        })->name('admin.videos');
        Route::post('/videos', function (\Illuminate\Http\Request $request) {
            $request->validate(['videos' => 'required|array', 'videos.*.id' => 'required|string', 'videos.*.title' => 'required|string', 'videos.*.summary' => 'nullable|string', 'videos.*.category' => 'nullable|string']);
            \App\Models\SiteContent::updateOrCreate(
                ['page' => 'videos', 'section' => 'videos', 'content_key' => 'list'],
                ['content_value' => json_encode($request->videos)]
            );
            return back()->with('success', 'Vídeos salvos.');
        })->name('admin.videos.store');

        Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
        Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
        Route::post('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

        Route::get('/google/insights', function () {
            $isConnected = false;
            $analyticsData = null;
            $summary = null;
            $searchData = null;
            $pageSpeed = null;
            $account = null;

            try {
                $account = \Illuminate\Support\Facades\DB::table('google_accounts')->first();
                $isConnected = (bool)($account->access_token ?? null);
                
                if ($isConnected) {
                    if ($account->property_id) {
                        $analytics = new \App\Services\Google\GoogleAnalyticsService();
                        $analyticsData = $analytics->getVisitors30Days($account->property_id);
                        $summary = $analytics->getSummary($account->property_id);
                    }

                    if ($account->site_url) {
                        $search = new \App\Services\Google\GoogleSearchConsoleService();
                        $searchData = $search->getSearchMetrics($account->site_url);
                        
                        $ps = new \App\Services\Google\GooglePageSpeedService();
                        $pageSpeed = $ps->getPerformanceMetrics($account->site_url);
                    }
                }
            } catch (\Exception $e) {
                \Log::warning("Google Insights DB Error: " . $e->getMessage());
            }

            return Inertia::render('Admin/GoogleInsights', [
                'isConnected' => $isConnected,
                'analyticsData' => $analyticsData,
                'summary' => $summary,
                'searchData' => $searchData,
                'pageSpeed' => $pageSpeed,
                'settings' => [
                    'property_id' => $account->property_id ?? '',
                    'site_url' => $account->site_url ?? '',
                    'client_id' => $account->client_id ?? '',
                    'client_secret' => $account->client_secret ?? '',
                    'redirect_uri' => $account->redirect_uri ?? '',
                    'api_key' => $account->api_key ?? '',
                ]
            ]);
        })->name('admin.google.insights');

        Route::post('/google/settings', [App\Http\Controllers\Admin\GoogleController::class, 'updateSettings'])->name('admin.google.settings');
        Route::get('/google/disconnect', [App\Http\Controllers\Admin\GoogleController::class, 'disconnect'])->name('admin.google.disconnect');

        // Google OAuth Routes
        Route::get('/google/connect', [App\Http\Controllers\Admin\GoogleController::class, 'connect'])->name('admin.google.connect');
        Route::get('/google/callback', [App\Http\Controllers\Admin\GoogleController::class, 'callback'])->name('admin.google.callback');
        Route::post('/logout', function() {
            \Illuminate\Support\Facades\Auth::logout();
            return redirect('/admin/login');
        })->name('logout');
    }); // End auth middleware

    Route::get('/seed-content', function() {
        $data = [
            // Home - Hero
            ['page' => 'home', 'section' => 'hero', 'content_key' => 'title', 'content_value' => 'Saúde que vem do Coração'],
            ['page' => 'home', 'section' => 'hero', 'content_key' => 'subtitle', 'content_value' => 'Proporcione ao seu pet uma vida mais longa e vibrante com alimentação natural personalizada e cuidados dermatológicos de quem ama o que faz.'],
            ['page' => 'home', 'section' => 'hero', 'content_key' => 'banner1', 'content_value' => '/images/banner.png'],
            ['page' => 'home', 'section' => 'hero', 'content_key' => 'banner2', 'content_value' => '/images/banner2.png'],
            ['page' => 'home', 'section' => 'hero', 'content_key' => 'banner3', 'content_value' => '/images/banner3.png'],

            // Home - Diferenciais
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'title', 'content_value' => 'Nossos Diferenciais'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card1_title', 'content_value' => 'Alimentação Natural'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card1_text', 'content_value' => 'Nutrologia personalizada para o bem-estar e longevidade do seu pet.'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card1_image', 'content_value' => ''],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card2_title', 'content_value' => 'Dermatologia'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card2_text', 'content_value' => 'Cuidado especializado para a saúde da pele e pelagem do seu melhor amigo.'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card2_image', 'content_value' => ''],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card3_title', 'content_value' => 'Consultas Especializadas'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card3_text', 'content_value' => 'Atendimento focado em medicina preventiva e curativa.'],
            ['page' => 'home', 'section' => 'differentials', 'content_key' => 'card3_image', 'content_value' => ''],

            // Home - Perfil Profissional
            ['page' => 'home', 'section' => 'profile', 'content_key' => 'title', 'content_value' => 'Responsável Técnica'],
            ['page' => 'home', 'section' => 'profile', 'content_key' => 'name', 'content_value' => 'Dra. Thania Alvarenga'],
            ['page' => 'home', 'section' => 'profile', 'content_key' => 'quote', 'content_value' => 'Minha missão é transformar a saúde dos pets através de uma abordagem natural e científica.'],
            ['page' => 'home', 'section' => 'profile', 'content_key' => 'text', 'content_value' => 'A Dra. Thania Alvarenga é reconhecida por sua expertise em Nutrologia Pet e Dermatologia, unindo ciência e natureza para tratar as causas raízes dos problemas de saúde.'],
            ['page' => 'home', 'section' => 'profile', 'content_key' => 'tags', 'content_value' => 'Nutróloga Veterinária, Dermatologista Pet, +10 anos de Experiência'],
            ['page' => 'home', 'section' => 'profile', 'content_key' => 'image', 'content_value' => '/images/dra_thania.png'],

            // Home - Linha Natural
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'title', 'content_value' => 'Nossa Linha Natural'],
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'text', 'content_value' => 'Trabalhamos com ingredientes frescos e selecionados, sem conservantes artificiais ou corantes. Cada receita é formulada para atender às necessidades específicas do seu animal.'],
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat1_val', 'content_value' => '100%'],
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat1_label', 'content_value' => 'Natural e Fresco'],
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat2_val', 'content_value' => '0%'],
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat2_label', 'content_value' => 'Conservantes'],
            ['page' => 'home', 'section' => 'natural', 'content_key' => 'image', 'content_value' => '/images/natural_food.png'],

            ['page' => 'history', 'section' => 'hero', 'content_key' => 'title', 'content_value' => 'Nossa História'],
            ['page' => 'history', 'section' => 'hero', 'content_key' => 'subtitle', 'content_value' => 'Do sonho de cuidar à revolução da medicina natural. Conheça como transformamos a vida de milhares de pets.'],
            ['page' => 'history', 'section' => 'hero', 'content_key' => 'bg_image', 'content_value' => 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop'],
            ['page' => 'history', 'section' => 'inicio', 'content_key' => 'title', 'content_value' => 'O Surgimento de uma Paixão'],
            ['page' => 'history', 'section' => 'inicio', 'content_key' => 'text', 'content_value' => "A nossa jornada começou há mais de 10 anos, movida por uma inquietação: como oferecer aos nossos pets uma vida mais vibrante e saudável, fugindo das abordagens convencionais?"],
            ['page' => 'history', 'section' => 'inicio', 'content_key' => 'image', 'content_value' => 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop'],
            ['page' => 'history', 'section' => 'evolucao', 'content_key' => 'title', 'content_value' => 'Nasce o Mundo Le Pet'],
            ['page' => 'history', 'section' => 'evolucao', 'content_key' => 'quote', 'content_value' => '"Não queríamos apenas tratar doenças, queríamos promover vida. Foi assim que decidimos dar o próximo passo."'],
            ['page' => 'history', 'section' => 'evolucao', 'content_key' => 'text', 'content_value' => 'A mudança para a marca Mundo Le Pet marcou um novo capítulo. Expandimos nossos horizontes, focando intensamente na Nutrologia e Dermatologia Pet, trazendo a alimentação natural como o pilar central de um estilo de vida preventivo.'],
            ['page' => 'history', 'section' => 'evolucao', 'content_key' => 'image', 'content_value' => 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1974&auto=format&fit=crop'],
            ['page' => 'contact', 'section' => 'hero', 'content_key' => 'title', 'content_value' => 'Entre em Contato'],
            ['page' => 'contact', 'section' => 'hero', 'content_key' => 'subtitle', 'content_value' => 'Dúvidas, agendamentos ou apenas quer dar um "oi"? Estamos prontos para atender você e seu pet.'],
            ['page' => 'contact', 'section' => 'info', 'content_key' => 'phone', 'content_value' => '(62) 99999-9999'],
            ['page' => 'contact', 'section' => 'info', 'content_key' => 'email', 'content_value' => 'contato@mundolepet.com.br'],
            ['page' => 'contact', 'section' => 'info', 'content_key' => 'address', 'content_value' => 'Rua dos Pets, 123 - Setor Marista'],
            ['page' => 'contact', 'section' => 'info', 'content_key' => 'city', 'content_value' => 'Goiânia - GO'],
            ['page' => 'contact', 'section' => 'map', 'content_key' => 'embed', 'content_value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15286.376839074!2d-49.2558!3d-16.6869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQxJzEyLjgiUyA0OcKwMTUnMjAuOCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr'],
            
            // Home - Banho e Tosa
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'title', 'content_value' => 'Banho e Tosa Especializado'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'description', 'content_value' => 'Oferecemos o melhor cuidado para o seu pet, utilizando produtos de alta qualidade e técnicas especializadas para garantir o bem-estar e a beleza do seu melhor amigo.'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'banner1', 'content_value' => '/images/banho_tosa_1.png'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'service1_name', 'content_value' => 'Hidratação'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'service2_name', 'content_value' => 'Tosas Variadas'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'service3_name', 'content_value' => 'Banho U.V'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'service4_name', 'content_value' => 'Penteados'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'service5_name', 'content_value' => 'Banho Hipoalergênicos'],
            ['page' => 'home', 'section' => 'banho_tosa', 'content_key' => 'service6_name', 'content_value' => 'Corte de Unhas'],
        ];

        foreach ($data as $item) {
            \App\Models\SiteContent::updateOrCreate(
                ['page' => $item['page'], 'section' => $item['section'], 'content_key' => $item['content_key'] ?? ''],
                ['content_value' => $item['content_value']]
            );
        }
        return "Semeado com sucesso!";
    });
});
