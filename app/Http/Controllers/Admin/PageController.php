<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    public function history()
    {
        return Inertia::render('Admin/HistoryContent', [
            'conteudo' => SiteContent::getContent('history')
        ]);
    }

    public function contact()
    {
        return Inertia::render('Admin/ContactContent', [
            'conteudo' => SiteContent::getContent('contact')
        ]);
    }

    public function update(Request $request)
    {
        // Inertia envia os campos dentro de 'data'; aceita também no topo da requisição
        $data = $request->input('data', $request->all());

        // NOVO: suporta salvar vários campos de uma vez usando data[items][]
        $items = $data['items'] ?? null;
        if (is_array($items) && count($items) > 0) {
            $page = $data['page'] ?? $request->input('page');
            if (empty($page)) {
                return back()->with('error', 'Página não informada.');
            }

            foreach ($items as $item) {
                $section = $item['section'] ?? null;
                $contentKey = $item['content_key'] ?? null;
                $contentValue = $item['content_value'] ?? '';

                if (empty($section) || empty($contentKey)) {
                    // Ignora itens incompletos, mas continua salvando os demais
                    continue;
                }

                SiteContent::updateOrCreate(
                    [
                        'page' => $page,
                        'section' => $section,
                        'content_key' => $contentKey,
                    ],
                    ['content_value' => $contentValue]
                );
            }

            return back()->with('success', 'Conteúdo atualizado com sucesso!');
        }

        // MODO ANTIGO: atualização de um único campo (continua funcionando para Home/História)
        $page = $data['page'] ?? $request->input('page');
        $section = $data['section'] ?? $request->input('section');
        $contentKey = $data['content_key'] ?? $request->input('content_key');
        $contentValue = $data['content_value'] ?? $request->input('content_value');

        if (empty($page) || empty($section) || empty($contentKey)) {
            return back()->with('error', 'Dados incompletos (página, seção ou chave).');
        }

        SiteContent::updateOrCreate(
            [
                'page' => $page,
                'section' => $section,
                'content_key' => $contentKey,
            ],
            ['content_value' => $contentValue ?? '']
        );

        return back()->with('success', 'Conteúdo atualizado com sucesso!');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|file|max:2048',
            'page' => 'required|string',
            'section' => 'required|string',
            'content_key' => 'required|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $ext = strtolower($file->getClientOriginalExtension() ?: pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION));
            $allowed = ['jpeg', 'jpg', 'png', 'gif', 'svg', 'webp'];
            if (!in_array($ext, $allowed)) {
                return back()->with('error', 'Formato não permitido. Use: ' . implode(', ', $allowed));
            }
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->move(public_path('images/uploads'), $fileName);
            $url = '/images/uploads/' . $fileName;

            SiteContent::updateOrCreate(
                [
                    'page' => $request->page,
                    'section' => $request->section,
                    'content_key' => $request->content_key,
                ],
                ['content_value' => $url]
            );

            return back()->with('success', 'Imagem enviada com sucesso!');
        }

        return back()->with('error', 'Falha ao enviar imagem.');
    }
}
