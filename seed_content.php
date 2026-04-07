<?php
// Tentar localizar o autoload em diferentes caminhos comuns de hospedagem
$paths = [
    __DIR__.'/vendor/autoload.php',
    __DIR__.'/../vendor/autoload.php',
    '/home/u315410518/domains/mundolepet.com.br/public_html/vendor/autoload.php'
];

foreach ($paths as $path) {
    if (file_exists($path)) {
        require $path;
        $appPath = str_replace('vendor/autoload.php', 'bootstrap/app.php', $path);
        $app = require_once $appPath;
        break;
    }
}

if (!isset($app)) {
    die("Erro: Não foi possível localizar o autoload do Laravel.");
}

use App\Models\SiteContent;

$data = [
    // HOME
    ['page' => 'home', 'section' => 'initial', 'content_key' => 'title', 'content_value' => 'Um Novo Conceito em Medicina Veterinária'],
    ['page' => 'home', 'section' => 'initial', 'content_key' => 'subtitle', 'content_value' => 'Especialistas em Nutrologia e Dermatologia Pet. Proporcionando uma vida longa, saudável e feliz para o seu melhor amigo através da alimentação natural.'],
    
    // HISTORIA (HISTORY)
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

    // CONTATO (CONTACT)
    ['page' => 'contact', 'section' => 'hero', 'content_key' => 'title', 'content_value' => 'Entre em Contato'],
    ['page' => 'contact', 'section' => 'hero', 'content_key' => 'subtitle', 'content_value' => 'Dúvidas, agendamentos ou apenas quer dar um "oi"? Estamos prontos para atender você e seu pet.'],
    ['page' => 'contact', 'section' => 'info', 'content_key' => 'phone', 'content_value' => '(62) 99999-9999'],
    ['page' => 'contact', 'section' => 'info', 'content_key' => 'email', 'content_value' => 'contato@mundolepet.com.br'],
    ['page' => 'contact', 'section' => 'info', 'content_key' => 'address', 'content_value' => 'Rua dos Pets, 123 - Setor Marista'],
    ['page' => 'contact', 'section' => 'info', 'content_key' => 'city', 'content_value' => 'Goiânia - GO'],
    ['page' => 'contact', 'section' => 'map', 'content_key' => 'embed', 'content_value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15286.376839074!2d-49.2558!3d-16.6869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQxJzEyLjgiUyA0OcKwMTUnMjAuOCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr'],
];

foreach ($data as $item) {
    SiteContent::updateOrCreate(
        ['page' => $item['page'], 'section' => $item['section'], 'content_key' => $item['content_key']],
        ['content_value' => $item['content_value']]
    );
}

echo "Dados iniciais semeados com sucesso!\n";
die();
