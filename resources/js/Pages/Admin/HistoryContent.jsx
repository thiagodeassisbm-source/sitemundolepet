import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Save, BookOpen, Upload, CheckCircle2, ImageIcon, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTION = 'history';
const PAGE = 'history';

const IMAGE_SIZE_MIN = 100;
const IMAGE_SIZE_MAX = 500;
const IMAGE_SIZE_DEFAULT = 250;

const INPUT_CLASS = 'w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-[#54B6B5]/20 transition-all';

function HistoryImageField({ label, contentKey, currentUrl, imageSizeValue, onSaveImageSize, onImageUpload }) {
    const initialSize = Math.max(IMAGE_SIZE_MIN, Math.min(IMAGE_SIZE_MAX, Number(imageSizeValue) || IMAGE_SIZE_DEFAULT));
    const [localSize, setLocalSize] = useState(initialSize);
    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        const n = Math.max(IMAGE_SIZE_MIN, Math.min(IMAGE_SIZE_MAX, Number(imageSizeValue) || IMAGE_SIZE_DEFAULT));
        setLocalSize(n);
    }, [imageSizeValue]);

    const sizeNum = localSize;
    const percent = ((sizeNum - IMAGE_SIZE_MIN) / (IMAGE_SIZE_MAX - IMAGE_SIZE_MIN)) * 100;

    const handleSliderChange = (e) => {
        const v = Number(e.target.value);
        setLocalSize(v);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            if (onSaveImageSize) onSaveImageSize(contentKey, v);
            saveTimeoutRef.current = null;
        }, 400);
    };

    useEffect(() => () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); }, []);

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-6">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
            <div className="w-full transition-all duration-150" style={{ maxWidth: `${sizeNum}px` }}>
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 group">
                    {currentUrl ? (
                        <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            <ImageIcon size={48} className="text-gray-300" />
                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Nenhuma imagem</span>
                        </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageUpload(e, contentKey)} />
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Upload size={32} />
                        </div>
                    </label>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tamanho da imagem no site (px)</span>
                <div className="relative h-3 flex items-center">
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[#54B6B5] transition-all duration-150" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-gray-300 bg-white shadow pointer-events-none" style={{ left: `calc(${percent}% - 10px)` }} />
                    <input
                        type="range"
                        min={IMAGE_SIZE_MIN}
                        max={IMAGE_SIZE_MAX}
                        step={10}
                        value={sizeNum}
                        onChange={handleSliderChange}
                        className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-10"
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-0.5 px-0.5">
                    <span>{IMAGE_SIZE_MIN}</span>
                    <span className="font-bold text-gray-700">{sizeNum}</span>
                    <span>{IMAGE_SIZE_MAX}</span>
                </div>
            </div>
        </div>
    );
}

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
            el.rows = rows || 4;
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

export default function HistoryContent({ conteudo }) {
    const history = conteudo?.history || {};
    const [successMessage, setSuccessMessage] = useState(null);

    const { data, setData, post, processing } = useForm({
        hero_title: history.hero_title || 'Nossa História',
        hero_subtitle: history.hero_subtitle || 'Do sonho de cuidar à revolução da medicina natural. Conheça como transformamos a vida de milhares de pets.',
        banner: history.banner || history.bg_image || '',
        block1_label: history.block1_label || 'O começo',
        block1_title: history.block1_title || 'O Surgimento de uma Paixão',
        block1_text: history.block1_text || 'A nossa jornada começou há mais de 10 anos, movida por um único propósito: oferecer uma vida mais saudável e equilibrada para aqueles que nos amam incondicionalmente.',
        block1_card_title: history.block1_card_title || 'Cuidado incondicional',
        block1_card_text: history.block1_card_text || 'Cada pet é único e merece um olhar atento, carinhoso e totalmente voltado para a sua individualidade.',
        block2_label: history.block2_label || 'A evolução',
        block2_title: history.block2_title || 'Nasce o Mundo Le Pet',
        block2_quote: history.block2_quote || '"Não queríamos apenas tratar doenças, queríamos promover saúde. Foi então que decidimos dar o próximo passo."',
        block2_text: history.block2_text || 'O Mundo Le Pet nasceu para ser o porto seguro de tutores que buscam o melhor para seus companheiros.',
        block2_stat1_val: history.block2_stat1_val || '+10k',
        block2_stat1_label: history.block2_stat1_label || 'Pets atendidos',
        block2_stat2_val: history.block2_stat2_val || '100%',
        block2_stat2_label: history.block2_stat2_label || 'Natural',
        mission_label: history.mission_label || 'O presente',
        mission_title: history.mission_title || 'Nossa Missão Hoje',
        mission_text: history.mission_text || 'Hoje, somos referência em cuidados especializados, unindo tecnologia de ponta com o carinho, a escuta ativa e a excelência que cada pet merece.',
        mission_card1_title: history.mission_card1_title || 'Excelência técnica',
        mission_card1_text: history.mission_card1_text || 'Protocolos personalizados e atualizados com as melhores evidências científicas.',
        mission_card2_title: history.mission_card2_title || 'Pilar de nutrição',
        mission_card2_text: history.mission_card2_text || 'Planos alimentares naturais pensados para cada fase da vida do seu pet.',
        mission_card3_title: history.mission_card3_title || 'Visão de mundo',
        mission_card3_text: history.mission_card3_text || 'Cuidamos da saúde física, emocional e ambiental em cada atendimento.',
        cta_title: history.cta_title || 'Quer fazer parte da nossa história?',
        cta_btn1: history.cta_btn1 || 'Agendar uma consulta',
        cta_btn2: history.cta_btn2 || 'Falar no WhatsApp',
        cta_btn1_link: history.cta_btn1_link || '',
        cta_btn2_link: history.cta_btn2_link || '',
        cta_btn1_use_popup: history.cta_btn1_use_popup || '',
        google_review_title: history.google_review_title || 'Avaliado no Google',
        google_review_subtitle: history.google_review_subtitle || 'Histórias reais de tutores que confiam no Mundo Le Pet.',
        google_review_cta_text: history.google_review_cta_text || 'Clique para avaliar →',
        google_review_score: history.google_review_score || '5,0',
        google_review_url: history.google_review_url || '',
    });

    const submit = (contentKey, valueOverride = null) => {
        const value = valueOverride !== null && valueOverride !== undefined ? valueOverride : data[contentKey];
        router.post(route('admin.pages.update'), {
            data: {
                page: PAGE,
                section: SECTION,
                content_key: contentKey,
                content_value: value ?? '',
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Salvo com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const IMAGE_KEYS = ['banner', 'block1_image', 'block2_image'];

    const handleImageUpload = (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('page', PAGE);
        formData.append('section', SECTION);
        formData.append('content_key', key);
        router.post(route('admin.pages.upload-image'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Imagem atualizada!');
                setTimeout(() => setSuccessMessage(null), 3000);
                router.reload();
            },
        });
    };

    const getImageSizeValue = (contentKey) => {
        const v = history[contentKey + '_size'];
        if (v === '' || v === undefined || v === null) return IMAGE_SIZE_DEFAULT;
        const n = Number(v);
        return isNaN(n) ? IMAGE_SIZE_DEFAULT : Math.max(IMAGE_SIZE_MIN, Math.min(IMAGE_SIZE_MAX, n));
    };
    const saveImageSize = (contentKey, value) => {
        router.post(route('admin.pages.update'), {
            data: {
                page: PAGE,
                section: SECTION,
                content_key: contentKey + '_size',
                content_value: String(value),
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Tamanho salvo!');
                setTimeout(() => setSuccessMessage(null), 2000);
            },
        });
    };

    const handleSaveAll = () => {
        const items = Object.keys(data)
            .filter((key) => !IMAGE_KEYS.includes(key))
            .map((key) => ({
                section: SECTION,
                content_key: key,
                content_value: data[key] ?? '',
            }));

        router.post(route('admin.pages.update'), {
            data: {
                page: PAGE,
                items,
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Página História salva com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Editar História - Mundo Le Pet" />
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Página História</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Edite o conteúdo da página Nossa História</p>
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
                                className="bg-[#54B6B5] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#54B6B5]/20"
                            >
                                <CheckCircle2 size={18} />
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="space-y-10 w-full">
                <section>
                    <h2 className="text-lg font-black text-[#572981] mb-4 flex items-center gap-2">
                        <BookOpen size={20} />
                        Hero (topo da página)
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StableField label="Título do hero" name="hero_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Subtítulo do hero" name="hero_subtitle" type="textarea" rows={2} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <div className="lg:col-span-2">
                            <HistoryImageField
                                label="Imagem de fundo do hero (banner)"
                                contentKey="banner"
                                currentUrl={history.banner || history.bg_image || '/images/banner.png'}
                                imageSizeValue={getImageSizeValue('banner')}
                                onSaveImageSize={saveImageSize}
                                onImageUpload={handleImageUpload}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-black text-[#572981] mb-4">Bloco 1 – O Surgimento de uma Paixão</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StableField label="Rótulo (ex: O começo)" name="block1_label" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Título do bloco" name="block1_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Parágrafo principal" name="block1_text" type="textarea" rows={4} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <HistoryImageField
                            label="Imagem do bloco (cão, gato e alimentação)"
                            contentKey="block1_image"
                            currentUrl={history.block1_image || '/images/banner.png'}
                            imageSizeValue={getImageSizeValue('block1_image')}
                            onSaveImageSize={saveImageSize}
                            onImageUpload={handleImageUpload}
                        />
                        <StableField label="Título do card (Cuidado incondicional)" name="block1_card_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Texto do card" name="block1_card_text" type="textarea" rows={3} data={data} setData={setData} processing={processing} onSubmit={submit} />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-black text-[#572981] mb-4">Bloco 2 – Nasce o Mundo Le Pet</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StableField label="Rótulo (ex: A evolução)" name="block2_label" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Título do bloco" name="block2_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Citação (destaque)" name="block2_quote" type="textarea" rows={2} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Parágrafo principal" name="block2_text" type="textarea" rows={3} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <HistoryImageField
                            label="Imagem do bloco (pet confortável em casa)"
                            contentKey="block2_image"
                            currentUrl={history.block2_image || '/images/banner.png'}
                            imageSizeValue={getImageSizeValue('block2_image')}
                            onSaveImageSize={saveImageSize}
                            onImageUpload={handleImageUpload}
                        />
                        <StableField label="Destaque 1 – Valor (ex: +10k)" name="block2_stat1_val" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Destaque 1 – Rótulo" name="block2_stat1_label" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Destaque 2 – Valor (ex: 100%)" name="block2_stat2_val" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Destaque 2 – Rótulo" name="block2_stat2_label" data={data} setData={setData} processing={processing} onSubmit={submit} />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-black text-[#572981] mb-4">Nossa Missão Hoje</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StableField label="Rótulo" name="mission_label" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Título" name="mission_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Parágrafo" name="mission_text" type="textarea" rows={3} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Card 1 – Título" name="mission_card1_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Card 1 – Texto" name="mission_card1_text" type="textarea" rows={2} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Card 2 – Título" name="mission_card2_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Card 2 – Texto" name="mission_card2_text" type="textarea" rows={2} data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Card 3 – Título" name="mission_card3_title" data={data} setData={setData} processing={processing} onSubmit={submit} />
                        <StableField label="Card 3 – Texto" name="mission_card3_text" type="textarea" rows={2} data={data} setData={setData} processing={processing} onSubmit={submit} />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-black text-[#572981] mb-4">CTA (Quer fazer parte da nossa história?)</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StableField label="Título" name="cta_title" data={data} setData={setData} />
                        <StableField label="Botão 1 (ex: Agendar uma consulta)" name="cta_btn1" data={data} setData={setData} />
                        <StableField label="Link do Botão 1 (URL – usado só se não marcar o popup abaixo)" name="cta_btn1_link" data={data} setData={setData} />
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-4 lg:col-span-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Botão 1 – Destino ao clicar</label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.cta_btn1_use_popup === '1'}
                                    onChange={(e) => setData('cta_btn1_use_popup', e.target.checked ? '1' : '')}
                                    className="w-5 h-5 rounded border-gray-300 text-[#572981] focus:ring-[#572981]"
                                />
                                <span className="text-sm font-bold text-gray-700">Abrir popup de agendamento (ao clicar no Botão 1, o visitante vê o formulário &quot;Agendar Agora&quot; do site)</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-8">Se marcar, o link do Botão 1 é ignorado. Se desmarcar, o Botão 1 usará o link acima.</p>
                        </div>
                        <StableField label="Botão 2 (ex: Falar no WhatsApp)" name="cta_btn2" data={data} setData={setData} />
                        <StableField label="Link do Botão 2 (URL completa – ex: https://...)" name="cta_btn2_link" data={data} setData={setData} />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-black text-[#572981] mb-4 flex items-center gap-2">
                        <Star size={20} />
                        Avaliação Google
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StableField
                            label="Título (ex: Avaliado no Google)"
                            name="google_review_title"
                            data={data}
                            setData={setData}
                        />
                        <StableField
                            label="Descrição (subtítulo)"
                            name="google_review_subtitle"
                            type="textarea"
                            rows={3}
                            data={data}
                            setData={setData}
                        />
                        <StableField
                            label="Texto do link (ex: Clique para avaliar →)"
                            name="google_review_cta_text"
                            data={data}
                            setData={setData}
                        />
                        <StableField
                            label="Nota (ex: 5,0 ou 4,6 – use vírgula; define o número e as estrelas, inclusive metade)"
                            name="google_review_score"
                            data={data}
                            setData={setData}
                        />
                        <StableField
                            label="Link da avaliação no Google (URL completa – ao clicar no card no site, o visitante será direcionado)"
                            name="google_review_url"
                            data={data}
                            setData={setData}
                        />
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
