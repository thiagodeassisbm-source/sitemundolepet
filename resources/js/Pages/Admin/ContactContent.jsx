import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Save, Mail, CheckCircle2, Upload, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE = 'contact';

const INPUT_CLASS = 'w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-[#54B6B5]/20 transition-all';

// Campo simples: só controla o valor via useForm.
// O salvamento é feito por um único botão "Salvar página".
function StableField({ label, name, type = 'text', rows, data, setData }) {
    const containerRef = useRef(null);
    const elRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isTextarea = type === 'textarea';
        const el = document.createElement(isTextarea ? 'textarea' : 'input');
        elRef.current = el;
        el.className = INPUT_CLASS;
        el.value = data[name] ?? '';
        if (isTextarea) {
            el.rows = rows || 3;
        } else {
            el.type = 'text';
            el.setAttribute('autocomplete', 'off');
        }

        el.addEventListener('input', () => setData(name, el.value));

        container.appendChild(el);
        return () => {
            try { container.removeChild(el); } catch (_) {}
            elRef.current = null;
        };
    }, [name, type, rows]);

    useEffect(() => {
        const el = elRef.current;
        if (!el || document.activeElement === el) return;
        const next = data[name] ?? '';
        if (el.value !== next) el.value = next;
    }, [data, name]);

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
            </div>
            <div ref={containerRef} className="min-h-[3rem]" />
        </div>
    );
}

export default function ContactContent({ conteudo }) {
    const hero = conteudo?.hero || {};
    const info = conteudo?.info || {};
    const formData = conteudo?.form || {};
    const map = conteudo?.map || {};
    const [successMessage, setSuccessMessage] = useState(null);

    const { data, setData, processing } = useForm({
        hero_top_label: hero.hero_top_label || hero.top_label || 'Vamos conversar?',
        hero_title: hero.hero_title || hero.title || 'Entre em Contato',
        hero_subtitle: hero.hero_subtitle || hero.subtitle || 'Dúvidas, agendamentos ou apenas quer dar um "oi"? Estamos prontos para atender você e seu pet.',
        info_channels_title: info.channels_title || 'Canais de Atendimento',
        info_channels_subtitle: info.channels_subtitle || 'Estamos aqui para cuidar de você e do seu pet.',
        info_phone: info.phone || '(62) 99999-9999',
        info_email: info.email || 'contato@mundolepet.com.br',
        info_address: info.address || 'Rua dos Pets, 123 - Setor Marista',
        info_city: info.city || 'Goiânia - GO',
        info_hours: info.hours || 'Seg - Sex: 08:00 - 18:00',
        info_social_title: info.social_title || 'Siga o Mundo Le Pet',
        info_instagram_url: info.instagram_url || '',
        info_facebook_url: info.facebook_url || '',
        form_title: formData.form_title || formData.title || 'Envie uma Mensagem',
        form_description: formData.form_description || formData.description || 'Preencha os campos abaixo e conte como podemos ajudar você e seu pet.',
        form_button_text: formData.form_button_text || formData.button_text || 'Falar com Especialistas',
        form_placeholder_name: formData.placeholder_name || 'Como quer ser chamado?',
        form_placeholder_email: formData.placeholder_email || 'exemplo@email.com',
        form_placeholder_whatsapp: formData.placeholder_whatsapp || '(00) 00000-0000',
        form_placeholder_time: formData.placeholder_time || '08:00 às 18:00',
        form_placeholder_message: formData.placeholder_message || 'Conte-nos como podemos ajudar você e seu pet...',
        map_embed: map.embed || '',
        map_card_title: map.card_title || '',
    });

    const sections = [
        { id: 'hero', label: 'Topo da página (Hero)', keys: [
            { name: 'hero_top_label', label: 'Rótulo pequeno (ex: Vamos conversar?)', section: 'hero', contentKey: 'top_label' },
            { name: 'hero_title', label: 'Título principal (ex: Entre em Contato)', section: 'hero', contentKey: 'title' },
            { name: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, section: 'hero', contentKey: 'subtitle' },
        ]},
        { id: 'info', label: 'Canais de Atendimento', keys: [
            { name: 'info_channels_title', label: 'Título do card (Canais de Atendimento)', section: 'info', contentKey: 'channels_title' },
            { name: 'info_channels_subtitle', label: 'Frase de apoio (Estamos aqui para...)', section: 'info', contentKey: 'channels_subtitle' },
            { name: 'info_phone', label: 'Telefone / WhatsApp', section: 'info', contentKey: 'phone' },
            { name: 'info_email', label: 'E-mail', section: 'info', contentKey: 'email' },
            { name: 'info_address', label: 'Endereço (rua, número, bairro)', section: 'info', contentKey: 'address' },
            { name: 'info_city', label: 'Cidade e UF', section: 'info', contentKey: 'city' },
            { name: 'info_hours', label: 'Horário de Atendimento (um dia por linha; use Enter para nova linha)', type: 'textarea', rows: 6, section: 'info', contentKey: 'hours' },
            { name: 'info_social_title', label: 'Título redes sociais (ex: Siga o Mundo Le Pet)', section: 'info', contentKey: 'social_title' },
            { name: 'info_instagram_url', label: 'URL do Instagram', section: 'info', contentKey: 'instagram_url' },
            { name: 'info_facebook_url', label: 'URL do Facebook', section: 'info', contentKey: 'facebook_url' },
        ]},
        { id: 'form', label: 'Formulário "Envie uma Mensagem"', keys: [
            { name: 'form_title', label: 'Título do formulário', section: 'form', contentKey: 'title' },
            { name: 'form_description', label: 'Instrução abaixo do título', type: 'textarea', rows: 2, section: 'form', contentKey: 'description' },
            { name: 'form_button_text', label: 'Texto do botão (ex: Falar com Especialistas)', section: 'form', contentKey: 'button_text' },
            { name: 'form_placeholder_name', label: 'Placeholder – Nome', section: 'form', contentKey: 'placeholder_name' },
            { name: 'form_placeholder_email', label: 'Placeholder – E-mail', section: 'form', contentKey: 'placeholder_email' },
            { name: 'form_placeholder_whatsapp', label: 'Placeholder – WhatsApp', section: 'form', contentKey: 'placeholder_whatsapp' },
            { name: 'form_placeholder_time', label: 'Placeholder – Melhor horário', section: 'form', contentKey: 'placeholder_time' },
            { name: 'form_placeholder_message', label: 'Placeholder – Mensagem', section: 'form', contentKey: 'placeholder_message' },
        ]},
        { id: 'map', label: 'Mapa', keys: [
            { name: 'map_card_title', label: 'Título do card do mapa (ex: Onde nos encontrar)', section: 'map', contentKey: 'card_title' },
            { name: 'map_embed', label: 'Link do mapa: URL de incorporar, código iframe ou link direto (maps.app.goo.gl/...)', type: 'textarea', rows: 3, section: 'map', contentKey: 'embed' },
        ]},
    ];

    const SECTION_MAP = 'map';
    const handleImageUpload = (e, contentKey) => {
        const file = e?.target?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('page', PAGE);
        formData.append('section', SECTION_MAP);
        formData.append('content_key', contentKey);
        router.post(route('admin.pages.upload-image'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Imagem do mapa atualizada!');
                setTimeout(() => setSuccessMessage(null), 3000);
                router.reload();
            },
        });
    };

    const handleSaveAll = () => {
        const items = [];
        sections.forEach((sec) => {
            sec.keys.forEach((k) => {
                items.push({
                    section: k.section,
                    content_key: k.contentKey,
                    content_value: data[k.name] ?? '',
                });
            });
        });

        router.post(route('admin.pages.update'), {
            data: {
                page: PAGE,
                items,
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Página salva com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar Contato - Mundo Le Pet" />
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Página Contato</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Edite textos, telefone, endereço, formulário e mapa</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981] text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#452066] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        Salvar página
                    </button>
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#54B6B5] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg"
                            >
                                <CheckCircle2 size={18} /> {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="space-y-10 w-full">
                {sections.map((sec) => (
                    <section key={sec.id}>
                        <h2 className="text-lg font-black text-[#572981] mb-4 flex items-center gap-2">
                            <Mail size={20} /> {sec.label}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {sec.keys.map((k) => (
                                <StableField
                                    key={k.name}
                                    label={k.label}
                                    name={k.name}
                                    type={k.type}
                                    rows={k.rows}
                                    data={data}
                                    setData={setData}
                                />
                            ))}
                            {sec.id === 'map' && (
                                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-4">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">
                                        Imagem do mapa (exibida no site; ao clicar, abre o link acima)
                                    </label>
                                    <div className="max-w-2xl">
                                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 group">
                                            {map.image ? (
                                                <img src={map.image} alt="Preview mapa" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                                    <ImageIcon size={48} className="text-gray-300" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Nenhuma imagem – envie uma para personalizar</span>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} />
                                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                                    <Upload size={32} />
                                                </div>
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Recomendado: captura do Google Maps no tamanho desejado. O site exibe no tamanho da imagem.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </AdminLayout>
    );
}
