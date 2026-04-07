<?php
/**
 * Restaura todo o conteúdo da página inicial (home) no banco.
 * Execute: php restaurar_conteudo_home.php
 */

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\SiteContent;

$homeContent = [
    // Hero (destaque principal)
    ['page' => 'home', 'section' => 'hero', 'content_key' => 'title', 'content_value' => 'Um Novo Conceito em Medicina Veterinária'],
    ['page' => 'home', 'section' => 'hero', 'content_key' => 'subtitle', 'content_value' => 'Especialistas em Nutrologia e Dermatologia Pet. Proporcionando uma vida longa, saudável e feliz para o seu melhor amigo através da alimentação natural.'],
    ['page' => 'home', 'section' => 'hero', 'content_key' => 'banner1', 'content_value' => '/images/banner.png'],
    ['page' => 'home', 'section' => 'hero', 'content_key' => 'banner2', 'content_value' => '/images/banner2.png'],
    ['page' => 'home', 'section' => 'hero', 'content_key' => 'banner3', 'content_value' => '/images/banner3.png'],

    // Nossos Diferenciais
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

    // Perfil (Dra. Thania)
    ['page' => 'home', 'section' => 'profile', 'content_key' => 'title', 'content_value' => 'Responsável Técnica'],
    ['page' => 'home', 'section' => 'profile', 'content_key' => 'name', 'content_value' => 'Dra. Thania Alvarenga'],
    ['page' => 'home', 'section' => 'profile', 'content_key' => 'quote', 'content_value' => 'Não queríamos apenas tratar doenças, queríamos promover vida.'],
    ['page' => 'home', 'section' => 'profile', 'content_key' => 'text', 'content_value' => 'Médica veterinária especialista em Nutrologia e Dermatologia Pet. Com anos de experiência em alimentação natural e medicina preventiva, dedico-me a oferecer o melhor cuidado para o seu melhor amigo.'],
    ['page' => 'home', 'section' => 'profile', 'content_key' => 'tags', 'content_value' => 'Nutrologia,Dermatologia,Alimentação Natural,Medicina Preventiva'],
    ['page' => 'home', 'section' => 'profile', 'content_key' => 'image', 'content_value' => '/images/dra_thania.png'],

    // Alimentação Natural
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'title', 'content_value' => 'Alimentação Natural que Transforma'],
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'text', 'content_value' => 'Acreditamos que a base da saúde está na alimentação. Oferecemos orientação em dietas naturais, suplementação e nutrologia para que seu pet tenha uma vida mais longa e saudável.'],
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat1_val', 'content_value' => '100%'],
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat1_label', 'content_value' => 'Foco em bem-estar'],
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat2_val', 'content_value' => '10+'],
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'stat2_label', 'content_value' => 'Anos de experiência'],
    ['page' => 'home', 'section' => 'natural', 'content_key' => 'image', 'content_value' => '/images/natural_food.png'],
];

$count = 0;
foreach ($homeContent as $item) {
    SiteContent::updateOrCreate(
        [
            'page' => $item['page'],
            'section' => $item['section'],
            'content_key' => $item['content_key'],
        ],
        ['content_value' => $item['content_value']]
    );
    $count++;
}

echo "Conteúdo da página inicial restaurado com sucesso! ({$count} itens inseridos/atualizados.)\n";
echo "Atualize a página no navegador (F5) para ver o conteúdo.\n";
