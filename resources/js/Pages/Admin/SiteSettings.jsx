import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Save, CheckCircle2, Upload, ImageIcon, Globe, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE = 'site';
const SECTION = 'seo';

const INPUT_CLASS = 'w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-[#54B6B5]/20 transition-all';

function ImageUploadCard({ label, contentKey, currentUrl, onUpload, justUploadedKey }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const uploadKey = `${SECTION}_${contentKey}`;

    useEffect(() => {
        if (justUploadedKey === uploadKey) {
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [justUploadedKey, uploadKey]);

    useEffect(() => {
        if (!selectedFile) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const displayUrl = previewUrl || currentUrl;
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
        e.target.value = '';
    };
    const handleSave = () => {
        if (!selectedFile || !onUpload) return;
        onUpload(selectedFile, () => setSelectedFile(null));
    };

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-6">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                    {displayUrl ? (
                        contentKey === 'favicon' ? (
                            <img src={displayUrl} alt="Favicon" className="w-16 h-16 object-contain" />
                        ) : (
                            <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
                        )
                    ) : (
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 mb-3">
                        {contentKey === 'favicon'
                            ? 'Ícone exibido na aba do navegador e nos resultados de pesquisa. Use PNG ou ICO, preferencialmente quadrado.'
                            : 'Imagem exibida quando o link do site é compartilhado (Google, redes sociais). Recomendado: 1200x630 px.'}
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#572981]/10 text-[#572981] font-bold text-sm cursor-pointer hover:bg-[#572981]/20 transition-colors">
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <Upload size={18} />
                        Escolher arquivo
                    </label>
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={handleSave}
                            className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#54B6B5] text-white font-bold text-sm hover:bg-[#54B6B5]/90 transition-colors"
                        >
                            <Save size={18} />
                            Salvar imagem
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SiteSettings({ conteudo }) {
    const seo = conteudo?.seo || {};
    const [successMessage, setSuccessMessage] = useState(null);
    const [justUploadedKey, setJustUploadedKey] = useState(null);

    const { data, setData, processing } = useForm({
        title: seo.title ?? 'Mundo Le Pet - Alimentação Natural e Cuidados Especiais',
        description: seo.description ?? 'Nutrologia personalizada para o bem-estar e longevidade do seu pet. Dermatologia. Cuidado especializado para a saúde da pele e pelagem do seu melhor amigo.',
    });

    const handleSaveText = () => {
        router.post(route('admin.pages.update'), {
            data: {
                page: PAGE,
                items: [
                    { section: SECTION, content_key: 'title', content_value: data.title ?? '' },
                    { section: SECTION, content_key: 'description', content_value: data.description ?? '' },
                ],
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Salvo! Atualize a página do site (F5) para ver o novo título na aba.');
                setTimeout(() => setSuccessMessage(null), 5000);
            },
        });
    };

    const handleImageUpload = (contentKey, file, onDone) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('page', PAGE);
        formData.append('section', SECTION);
        formData.append('content_key', contentKey);
        router.post(route('admin.pages.upload-image'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Imagem salva!');
                setJustUploadedKey(`${SECTION}_${contentKey}`);
                if (onDone) onDone();
                setTimeout(() => setSuccessMessage(null), 3000);
                setTimeout(() => setJustUploadedKey(null), 500);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Site e Google - Mundo Le Pet" />
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Site e Google</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Edite o texto da aba do navegador, da busca do Google, favicon e imagem de compartilhamento</p>
                </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveText}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981] text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#452066] disabled:opacity-60"
                    >
                        <Save size={18} />
                        Salvar título e descrição
                    </button>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Globe size={16} /> Título do site (texto na aba da janela e no Google)
                    </label>
                    <p className="text-sm text-gray-500 -mt-1">Este é o texto que aparece na aba do navegador e nos resultados de pesquisa. Edite aqui e clique em &quot;Salvar título e descrição&quot;.</p>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={INPUT_CLASS}
                        placeholder="Ex: Mundo Le Pet - Alimentação Natural e Cuidados Especiais"
                    />
                </div>

                <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={16} /> Descrição do site (Google e redes sociais)
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={INPUT_CLASS}
                        rows={4}
                        placeholder="Texto que aparece na busca do Google e ao compartilhar o link."
                    />
                </div>

                <ImageUploadCard
                    label="Favicon (ícone na aba e na pesquisa)"
                    contentKey="favicon"
                    currentUrl={seo.favicon}
                    onUpload={(file, onDone) => handleImageUpload('favicon', file, onDone)}
                    justUploadedKey={justUploadedKey}
                />
                <ImageUploadCard
                    label="Imagem do site no Google (compartilhamento)"
                    contentKey="og_image"
                    currentUrl={seo.og_image}
                    onUpload={(file, onDone) => handleImageUpload('og_image', file, onDone)}
                    justUploadedKey={justUploadedKey}
                />
            </div>
        </AdminLayout>
    );
}
