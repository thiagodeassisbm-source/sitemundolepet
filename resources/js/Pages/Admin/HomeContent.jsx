import React, { useState, useCallback, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Edit3,
    Image as ImageIcon,
    Save,
    Layout,
    UserCircle,
    ShoppingBag,
    Star,
    CheckCircle2,
    Upload,
    Zap,
    Leaf,
    Heart,
    Stethoscope,
    ArrowLeft,
    Plus,
    List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos de fonte (valor salvo = nome da fonte para CSS font-family)
const FONTES = [
    { label: 'Padrão do sistema', value: '' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Calibri', value: 'Calibri, Candara, Segoe, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
    { label: 'Open Sans', value: '"Open Sans", sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
];

// Tamanhos numéricos (em pixels) – valor salvo no banco = número
const TAMANHOS_NUMERICOS = [10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48];

// Slider de tamanho de imagem (igual anexo 3: 100–500 px)
const IMAGE_SIZE_MIN = 100;
const IMAGE_SIZE_MAX = 500;
const IMAGE_SIZE_DEFAULT = 250;

// Input criado via DOM puro: React não re-renderiza o campo (evita perder foco ao digitar).
const INPUT_CLASS = 'w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 focus:ring-[#54B6B5]/20 transition-all';
function SectionInput({ label, section, contentKey, type = 'text', defaultValue, onChange, onSave, processing, fontValue = '', sizeValue = '', onSaveFont, onSaveSize, showSaveButton = true }) {
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const onSaveRef = useRef(onSave);
    const fieldId = `content-${section}-${contentKey}`;
    const [localSize, setLocalSize] = useState(() => (sizeValue !== '' && sizeValue !== undefined ? String(sizeValue) : ''));
    useEffect(() => {
        const next = sizeValue !== '' && sizeValue !== undefined ? String(sizeValue) : '';
        setLocalSize(next);
    }, [sizeValue]);
    onChangeRef.current = onChange;
    onSaveRef.current = onSave;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const isTextarea = type === 'textarea';
        const el = document.createElement(isTextarea ? 'textarea' : 'input');
        inputRef.current = el;
        el.id = fieldId;
        el.className = INPUT_CLASS;
        el.value = defaultValue ?? '';
        if (!isTextarea) {
            el.type = 'text';
            el.setAttribute('autocomplete', 'off');
        } else {
            el.rows = 4;
        }
        el.addEventListener('input', () => {
            if (onChangeRef.current) onChangeRef.current(el.value);
        });
        el.addEventListener('blur', () => {
            if (onChangeRef.current) onChangeRef.current(el.value);
        });
        container.appendChild(el);
        return () => {
            try { container.removeChild(el); } catch (_) {}
            inputRef.current = null;
        };
    }, [section, contentKey, type, fieldId]);

    useEffect(() => {
        const el = inputRef.current;
        if (!el || document.activeElement === el) return;
        const next = defaultValue ?? '';
        if (el.value !== next) el.value = next;
    }, [defaultValue]);

    const handleSave = () => {
        const el = inputRef.current;
        const current = el ? el.value : '';
        if (onChangeRef.current) onChangeRef.current(current);
        onSave(section, contentKey, current);
    };

    const handleFontChange = (e) => {
        const v = e.target.value;
        if (onSaveFont) onSaveFont(section, contentKey, v);
    };
    const handleSizeBlur = (e) => {
        const v = String(e.target.value).trim();
        if (v !== '' && onSaveSize) onSaveSize(section, contentKey, v);
    };

    const key = `${section}-${contentKey}`;
    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-4" data-field-key={key}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
                <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Fonte</label>
                    <select
                        value={fontValue ?? ''}
                        onChange={handleFontChange}
                        className="text-xs font-bold text-gray-700 bg-gray-100 border-0 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#54B6B5]/30 min-w-[140px]"
                    >
                        {FONTES.map((opt) => (
                            <option key={opt.value || 'default'} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Tamanho</label>
                    <input
                        type="number"
                        min={8}
                        max={120}
                        placeholder="—"
                        list={`tamanho-list-${key}`}
                        value={localSize}
                        onChange={(e) => setLocalSize(e.target.value)}
                        onBlur={handleSizeBlur}
                        className="text-xs font-bold text-gray-700 bg-gray-100 border-0 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#54B6B5]/30 w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <datalist id={`tamanho-list-${key}`}>
                        {TAMANHOS_NUMERICOS.map((n) => (
                            <option key={n} value={n} />
                        ))}
                    </datalist>
                    {showSaveButton && (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={processing}
                            className="text-[#54B6B5] hover:bg-[#54B6B5]/10 p-2 rounded-full transition-all"
                            title="Salvar texto"
                        >
                            <Save size={18} />
                        </button>
                    )}
                </div>
            </div>
            <div ref={containerRef} className="min-h-[3rem]" />
        </div>
    );
}

export default function HomeContent({ conteudo: conteudoProp }) {
    const conteudo = conteudoProp ?? {};
    const [activeTab, setActiveTab] = useState('hero');
    const [successMessage, setSuccessMessage] = useState(null);
    const [editingDifferential, setEditingDifferential] = useState(null);
    const [justUploadedKey, setJustUploadedKey] = useState(null);
    const [extraBanners, setExtraBanners] = useState(0); // 0..3 = quantos banners extras além dos 3 primeiros

    const { data, setData, post, processing } = useForm({
        // Hero
        'hero.title': conteudo.hero?.title ?? '',
        'hero.subtitle': conteudo.hero?.subtitle ?? '',
        // Differentials
        'differentials.title': conteudo.differentials?.title ?? '',
        'differentials.card1_title': conteudo.differentials?.card1_title ?? '',
        'differentials.card1_text': conteudo.differentials?.card1_text ?? '',
        'differentials.card1_image': conteudo.differentials?.card1_image ?? '',
        'differentials.card2_title': conteudo.differentials?.card2_title ?? '',
        'differentials.card2_text': conteudo.differentials?.card2_text ?? '',
        'differentials.card2_image': conteudo.differentials?.card2_image ?? '',
        'differentials.card3_title': conteudo.differentials?.card3_title ?? '',
        'differentials.card3_text': conteudo.differentials?.card3_text ?? '',
        'differentials.card3_image': conteudo.differentials?.card3_image ?? '',
        // Profile
        'profile.title': conteudo.profile?.title ?? '',
        'profile.name': conteudo.profile?.name ?? '',
        'profile.quote': conteudo.profile?.quote ?? '',
        'profile.text': conteudo.profile?.text ?? '',
        'profile.tags': conteudo.profile?.tags ?? '',
        'profile.whatsapp': conteudo.profile?.whatsapp ?? '',
        // Natural
        'natural.title': conteudo.natural?.title ?? '',
        'natural.text': conteudo.natural?.text ?? '',
        'natural.stat1_val': conteudo.natural?.stat1_val ?? '',
        'natural.stat1_label': conteudo.natural?.stat1_label ?? '',
        'natural.stat2_val': conteudo.natural?.stat2_val ?? '',
        'natural.stat2_label': conteudo.natural?.stat2_label ?? '',
        // Serviços
        'servicos.subtitle': conteudo.servicos?.subtitle ?? 'O que oferecemos',
        'servicos.title': conteudo.servicos?.title ?? 'Serviços que realizamos',
        'servicos.description': conteudo.servicos?.description ?? 'Na Mundo Le Pet, oferecemos atendimento veterinário completo para o seu pet: consultas clínicas e especializadas, exames, vacinação, castração e muito mais. Conte com nossa equipe para cuidar da saúde e do bem-estar do seu melhor amigo.',
        'servicos.service1_name': conteudo.servicos?.service1_name ?? 'Castração',
        'servicos.service2_name': conteudo.servicos?.service2_name ?? 'Consulta Clínica Geral',
        'servicos.service3_name': conteudo.servicos?.service3_name ?? 'Consulta de Dermatologia',
        'servicos.service4_name': conteudo.servicos?.service4_name ?? 'Consulta de Nutrologia',
        'servicos.service5_name': conteudo.servicos?.service5_name ?? 'Exames Laboratoriais',
        'servicos.service6_name': conteudo.servicos?.service6_name ?? 'Exames de Imagem',
        'servicos.service7_name': conteudo.servicos?.service7_name ?? 'Outras Especialidades',
        'servicos.service8_name': conteudo.servicos?.service8_name ?? 'Vacina',
        // Banho e Tosa
        'banho_tosa.title': conteudo.banho_tosa?.title ?? 'Banho e Tosa Especializado',
        'banho_tosa.description': conteudo.banho_tosa?.description ?? 'Oferecemos o melhor cuidado para o seu pet...',
        'banho_tosa.service1_name': conteudo.banho_tosa?.service1_name ?? 'Hidratação',
        'banho_tosa.service2_name': conteudo.banho_tosa?.service2_name ?? 'Tosas Variadas',
        'banho_tosa.service3_name': conteudo.banho_tosa?.service3_name ?? 'Banho U.V',
        'banho_tosa.service4_name': conteudo.banho_tosa?.service4_name ?? 'Penteados',
        'banho_tosa.service5_name': conteudo.banho_tosa?.service5_name ?? 'Banho Hipoalergênicos',
        'banho_tosa.service6_name': conteudo.banho_tosa?.service6_name ?? 'Corte de Unhas',
        // Adicionar suporte dinâmico para até 20 serviços iniciais se existirem no banco
        ...Object.fromEntries(
            Array.from({ length: 14 }, (_, i) => [
                `banho_tosa.service${i + 7}_name`,
                conteudo.banho_tosa?.[`service${i + 7}_name`] ?? ''
            ])
        ),
        // Adicionar suporte dinâmico para até 10 imagens iniciais se existirem no banco
        ...Object.fromEntries(
            Array.from({ length: 7 }, (_, i) => [
                `banho_tosa.banner${i + 4}`,
                conteudo.banho_tosa?.[`banner${i + 4}`] ?? ''
            ])
        )
    });

    const [banhoTosaServiceCount, setBanhoTosaServiceCount] = useState(() => {
        let max = 6;
        for (let i = 7; i <= 20; i++) {
            if (conteudo.banho_tosa?.[`service${i}_name`]?.trim()) {
                max = i;
            }
        }
        return max;
    });

    const [banhoTosaImageCount, setBanhoTosaImageCount] = useState(() => {
        let max = 3;
        for (let i = 4; i <= 10; i++) {
            if (conteudo.banho_tosa?.[`banner${i}`]) {
                max = i;
            }
        }
        return max;
    });

    const submit = (section, key, valueOverride = null) => {
        const contentValue = valueOverride !== null && valueOverride !== undefined ? valueOverride : data[`${section}.${key}`];
        router.post(route('admin.pages.update'), {
            data: {
                page: 'home',
                section: section,
                content_key: key,
                content_value: contentValue
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Salvo com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const saveSize = (section, contentKey, value) => {
        submit(section, contentKey + '_size', value);
    };
    const saveFont = (section, contentKey, value) => {
        submit(section, contentKey + '_font', value);
    };

    const getSizeValue = (section, contentKey) => conteudo[section]?.[contentKey + '_size'] ?? '';
    const getFontValue = (section, contentKey) => conteudo[section]?.[contentKey + '_font'] ?? '';

    const getImageSizeValue = (section, content_key) => {
        const v = conteudo[section]?.[content_key + '_size'];
        if (v === '' || v === undefined || v === null) return IMAGE_SIZE_DEFAULT;
        const n = Number(v);
        return isNaN(n) ? IMAGE_SIZE_DEFAULT : Math.max(IMAGE_SIZE_MIN, Math.min(IMAGE_SIZE_MAX, n));
    };
    const saveImageSize = (section, content_key, value) => {
        submit(section, content_key + '_size', String(value));
    };

    const handleImageUpload = (section, key, file, onDone) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('page', 'home');
        formData.append('section', section);
        formData.append('content_key', key);

        router.post(route('admin.pages.upload-image'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Imagem salva! Já está no site.');
                setJustUploadedKey(`${section}_${key}`);
                if (onDone) onDone();
                setTimeout(() => setSuccessMessage(null), 3000);
                setTimeout(() => setJustUploadedKey(null), 400);
            },
        });
    };

    const tabs = [
        { id: 'hero', label: 'Destaque Principal', icon: <Star size={18} /> },
        { id: 'differentials', label: 'Nossos Diferenciais', icon: <Layout size={18} /> },
        { id: 'servicos', label: 'Serviços', icon: <List size={18} /> },
        { id: 'profile', label: 'Perfil Profissional', icon: <UserCircle size={18} /> },
        { id: 'natural', label: 'Alimentação Natural', icon: <ShoppingBag size={18} /> },
        { id: 'banho_tosa', label: 'Banho e Tosa', icon: <CheckCircle2 size={18} /> }
    ];

    const setField = useCallback((section, contentKey, value) => {
        setData(`${section}.${contentKey}`, value);
    }, [setData]);

    const handleSaveProfile = () => {
        const fields = ['title', 'name', 'quote', 'text', 'tags', 'whatsapp'];
        const items = fields.map((key) => ({
            section: 'profile',
            content_key: key,
            content_value: data[`profile.${key}`] ?? '',
        }));

        router.post(route('admin.pages.update'), {
            data: {
                page: 'home',
                items,
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Perfil salvo com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const handleSaveNatural = () => {
        const fields = ['title', 'text', 'stat1_val', 'stat1_label', 'stat2_val', 'stat2_label'];
        const items = fields.map((key) => ({
            section: 'natural',
            content_key: key,
            content_value: data[`natural.${key}`] ?? '',
        }));

        router.post(route('admin.pages.update'), {
            data: {
                page: 'home',
                items,
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Alimentação Natural salva com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const handleSaveServicos = () => {
        const fields = [
            'subtitle', 'title', 'description',
            'service1_name', 'service2_name', 'service3_name', 'service4_name',
            'service5_name', 'service6_name', 'service7_name', 'service8_name'
        ];
        const items = fields.map((key) => ({
            section: 'servicos',
            content_key: key,
            content_value: data[`servicos.${key}`] ?? '',
        }));

        router.post(route('admin.pages.update'), {
            data: {
                page: 'home',
                items,
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Serviços salvos com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };
    
    const handleSaveBanhoTosa = () => {
        const fields = [
            'title', 'description'
        ];
        // Coleta dinamicamente os nomes dos serviços baseados no contador atual
        for (let i = 1; i <= banhoTosaServiceCount; i++) {
            fields.push(`service${i}_name`);
        }
        const items = fields.map((key) => ({
            section: 'banho_tosa',
            content_key: key,
            content_value: data[`banho_tosa.${key}`] ?? '',
        }));

        router.post(route('admin.pages.update'), {
            data: {
                page: 'home',
                items,
            },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Banho e Tosa salvo com sucesso!');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const RenderImageUploader = ({ label, section, content_key, currentUrl, imageSizeValue = IMAGE_SIZE_DEFAULT, onSaveImageSize, onSaveImage, justUploadedKey }) => {
        const initialSize = Math.max(IMAGE_SIZE_MIN, Math.min(IMAGE_SIZE_MAX, Number(imageSizeValue) || IMAGE_SIZE_DEFAULT));
        const [localSize, setLocalSize] = useState(initialSize);
        const [selectedFile, setSelectedFile] = useState(null);
        const [previewUrl, setPreviewUrl] = useState(null);
        const saveTimeoutRef = useRef(null);
        const fileInputRef = useRef(null);
        const uploadKey = `${section}_${content_key}`;

        useEffect(() => {
            const n = Math.max(IMAGE_SIZE_MIN, Math.min(IMAGE_SIZE_MAX, Number(imageSizeValue) || IMAGE_SIZE_DEFAULT));
            setLocalSize(n);
        }, [imageSizeValue]);

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

        const sizeNum = localSize;
        const percent = ((sizeNum - IMAGE_SIZE_MIN) / (IMAGE_SIZE_MAX - IMAGE_SIZE_MIN)) * 100;
        const displayUrl = previewUrl || currentUrl;

        const getPlaceholderIcon = () => {
            if (section === 'differentials') {
                if (content_key === 'card1_image') return <Leaf size={48} className="text-[#54B6B5]" />;
                if (content_key === 'card2_image') return <Heart size={48} className="text-[#FF69B4]" />;
                if (content_key === 'card3_image') return <Stethoscope size={48} className="text-[#572981]" />;
            }
            return <ImageIcon size={48} className="text-gray-300" />;
        };

        const getPlaceholderBg = () => {
            if (section === 'differentials') {
                if (content_key === 'card1_image') return 'bg-[#54B6B5]/10';
                if (content_key === 'card2_image') return 'bg-[#FF69B4]/10';
                if (content_key === 'card3_image') return 'bg-[#572981]/10';
            }
            return 'bg-gray-50';
        };

        const handleSliderChange = (e) => {
            const v = Number(e.target.value);
            setLocalSize(v);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                if (onSaveImageSize) onSaveImageSize(section, content_key, v);
                saveTimeoutRef.current = null;
            }, 400);
        };

        const handleFileChange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                // Para Banho e Tosa, salva automaticamente ao selecionar
                if (section === 'banho_tosa') {
                    onSaveImage(section, content_key, file, () => setSelectedFile(null));
                } else {
                    setSelectedFile(file);
                }
            }
            e.target.value = '';
        };

        const handleSaveImage = () => {
            if (!selectedFile || !onSaveImage) return;
            onSaveImage(section, content_key, selectedFile, () => setSelectedFile(null));
        };

        useEffect(() => () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); }, []);

        return (
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 flex flex-col gap-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
                    {selectedFile && onSaveImage && section !== 'banho_tosa' && (
                        <button
                            type="button"
                            onClick={handleSaveImage}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#54B6B5] text-white font-bold text-sm hover:bg-[#54B6B5]/90 transition-colors shadow-lg"
                            title="Salvar nova imagem (já será exibida no site)"
                        >
                            <Save size={18} />
                            Salvar imagem
                        </button>
                    )}
                </div>
                <div className="w-full transition-all duration-150" style={{ maxWidth: `${sizeNum}px` }}>
                    <div className={`relative aspect-video rounded-3xl overflow-hidden border border-gray-100 group transition-all ${getPlaceholderBg()}`}>
                        {displayUrl ? (
                            <img src={displayUrl} className="w-full h-full object-cover" alt={label} />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                {getPlaceholderIcon()}
                                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Padrão do Site</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                <Upload size={32} />
                            </div>
                        </label>
                        {selectedFile && (
                            <span className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-[#572981] text-white text-[10px] font-bold uppercase">
                                Nova imagem – clique em Salvar
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tamanho da imagem (px)</span>
                    <div className="relative h-3 flex items-center">
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-[#54B6B5] transition-all duration-150" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-gray-300 bg-white shadow pointer-events-none" style={{ left: `calc(${percent}% - 10px)` }} />
                        <input type="range" min={IMAGE_SIZE_MIN} max={IMAGE_SIZE_MAX} step={10} value={sizeNum} onChange={handleSliderChange} className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-10" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-0.5 px-0.5">
                        <span>{IMAGE_SIZE_MIN}</span>
                        <span className="font-bold text-gray-700">{sizeNum}</span>
                        <span>{IMAGE_SIZE_MAX}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title="Conteúdo Home - Mundo Le Pet" />

            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Gerenciar Conteúdo Home</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Personalize cada detalhe da sua página inicial</p>
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

            <div className="mb-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-4 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all shrink-0 flex items-center gap-3 ${activeTab === tab.id
                            ? 'bg-[#572981] text-white shadow-xl shadow-purple-900/20 scale-105'
                            : 'bg-white text-gray-300 hover:text-gray-500 shadow-sm border border-gray-50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeTab === 'hero' && (
                    <>
                        <SectionInput label="Título de Impacto" section="hero" contentKey="title" defaultValue={data['hero.title']} onChange={v => setField('hero', 'title', v)} onSave={submit} processing={processing} fontValue={getFontValue('hero', 'title')} sizeValue={getSizeValue('hero', 'title')} onSaveFont={saveFont} onSaveSize={saveSize} />
                        <SectionInput label="Subtítulo de Apoio" section="hero" contentKey="subtitle" type="textarea" defaultValue={data['hero.subtitle']} onChange={v => setField('hero', 'subtitle', v)} onSave={submit} processing={processing} fontValue={getFontValue('hero', 'subtitle')} sizeValue={getSizeValue('hero', 'subtitle')} onSaveFont={saveFont} onSaveSize={saveSize} />
                        {[1, 2, 3, ...(extraBanners >= 1 ? [4] : []), ...(extraBanners >= 2 ? [5] : []), ...(extraBanners >= 3 ? [6] : [])].map((n) => (
                            <RenderImageUploader
                                key={`hero-banner${n}`}
                                label={`Banner Principal ${n}`}
                                section="hero"
                                content_key={`banner${n}`}
                                currentUrl={conteudo.hero?.[`banner${n}`]}
                                imageSizeValue={getImageSizeValue('hero', `banner${n}`)}
                                onSaveImageSize={saveImageSize}
                                onSaveImage={handleImageUpload}
                                justUploadedKey={justUploadedKey}
                            />
                        ))}
                        {extraBanners < 3 && (
                            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 border-dashed flex flex-col items-center justify-center gap-4 min-h-[200px]">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mais banners</p>
                                <button
                                    type="button"
                                    onClick={() => setExtraBanners((p) => p + 1)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981]/10 text-[#572981] font-bold hover:bg-[#572981] hover:text-white transition-colors"
                                >
                                    <Plus size={20} />
                                    Adicionar mais um banner
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'differentials' && (
                    <div className="lg:col-span-2 space-y-8">
                        {!editingDifferential ? (
                            <div className="space-y-6">
                                <SectionInput label="Título da Seção" section="differentials" contentKey="title" defaultValue={data['differentials.title']} onChange={v => setField('differentials', 'title', v)} onSave={submit} processing={processing} fontValue={getFontValue('differentials', 'title')} sizeValue={getSizeValue('differentials', 'title')} onSaveFont={saveFont} onSaveSize={saveSize} />

                                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/50">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Diferencial</th>
                                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {[1, 2, 3].map(num => (
                                                <tr key={num} className="hover:bg-gray-50/30 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                                                {conteudo.differentials?.[`card${num}_image`] ? (
                                                                    <img src={conteudo.differentials[`card${num}_image`]} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    num === 1 ? <Leaf className="text-[#54B6B5]" size={20} /> :
                                                                        num === 2 ? <Heart className="text-[#FF69B4]" size={20} /> :
                                                                            <Stethoscope className="text-[#572981]" size={20} />
                                                                )}
                                                            </div>
                                                            <span className="font-bold text-gray-700">{data[`differentials.card${num}_title`] || `Card ${num}`}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => setEditingDifferential(num)}
                                                            className="p-3 rounded-2xl bg-[#572981]/5 text-[#572981] hover:bg-[#572981] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Edit3 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <button
                                        onClick={() => setEditingDifferential(null)}
                                        className="p-3 rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div>
                                        <h3 className="text-xl font-black text-[#572981]">Editando {data[`differentials.card${editingDifferential}_title`]}</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Altere os detalhes deste diferencial abaixo</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        <SectionInput label="Título do Card" section="differentials" contentKey={`card${editingDifferential}_title`} defaultValue={data[`differentials.card${editingDifferential}_title`]} onChange={v => setField('differentials', `card${editingDifferential}_title`, v)} onSave={submit} processing={processing} fontValue={getFontValue('differentials', `card${editingDifferential}_title`)} sizeValue={getSizeValue('differentials', `card${editingDifferential}_title`)} onSaveFont={saveFont} onSaveSize={saveSize} />
                                        <SectionInput label="Descrição Curta" section="differentials" contentKey={`card${editingDifferential}_text`} type="textarea" defaultValue={data[`differentials.card${editingDifferential}_text`]} onChange={v => setField('differentials', `card${editingDifferential}_text`, v)} onSave={submit} processing={processing} fontValue={getFontValue('differentials', `card${editingDifferential}_text`)} sizeValue={getSizeValue('differentials', `card${editingDifferential}_text`)} onSaveFont={saveFont} onSaveSize={saveSize} />
                                    </div>
                                    <RenderImageUploader
                                        label="Ícone ou Imagem Personalizada"
                                        section="differentials"
                                        content_key={`card${editingDifferential}_image`}
                                        currentUrl={conteudo.differentials?.[`card${editingDifferential}_image`]}
                                        imageSizeValue={getImageSizeValue('differentials', `card${editingDifferential}_image`)}
                                        onSaveImageSize={saveImageSize}
                                        onSaveImage={handleImageUpload}
                                        justUploadedKey={justUploadedKey}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {activeTab === 'servicos' && (
                    <>
                        <div className="lg:col-span-2 flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={handleSaveServicos}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981] text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#452066] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                Salvar Serviços
                            </button>
                        </div>
                        <SectionInput label="Subtítulo da seção (ex: O que oferecemos)" section="servicos" contentKey="subtitle" defaultValue={data['servicos.subtitle']} onChange={v => setField('servicos', 'subtitle', v)} onSave={submit} processing={processing} fontValue={getFontValue('servicos', 'subtitle')} sizeValue={getSizeValue('servicos', 'subtitle')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Título principal (ex: Serviços que realizamos)" section="servicos" contentKey="title" defaultValue={data['servicos.title']} onChange={v => setField('servicos', 'title', v)} onSave={submit} processing={processing} fontValue={getFontValue('servicos', 'title')} sizeValue={getSizeValue('servicos', 'title')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <div className="lg:col-span-2">
                            <SectionInput label="Texto descritivo abaixo do título" section="servicos" contentKey="description" type="textarea" defaultValue={data['servicos.description']} onChange={v => setField('servicos', 'description', v)} onSave={submit} processing={processing} fontValue={getFontValue('servicos', 'description')} sizeValue={getSizeValue('servicos', 'description')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/50">
                            <div className="px-8 py-5 border-b border-gray-100">
                                <h3 className="text-sm font-black text-[#572981] uppercase tracking-widest">Serviços exibidos no site</h3>
                                <p className="text-xs text-gray-500 mt-1">Altere os nomes e clique em &quot;Salvar Serviços&quot; para atualizar a página inicial.</p>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-12">#</th>
                                        <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Nome do serviço</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <tr key={num} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-4 text-sm font-bold text-gray-400">{num}</td>
                                            <td className="px-8 py-4">
                                                <input
                                                    type="text"
                                                    value={data[`servicos.service${num}_name`] ?? ''}
                                                    onChange={(e) => setField('servicos', `service${num}_name`, e.target.value)}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-700 focus:ring-2 focus:ring-[#54B6B5]/20 transition-all"
                                                    placeholder={`Serviço ${num}`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'profile' && (
                    <>
                        <div className="lg:col-span-2 flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981] text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#452066] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                Salvar perfil
                            </button>
                        </div>
                        <SectionInput label="Subtítulo Superior" section="profile" contentKey="title" defaultValue={data['profile.title']} onChange={v => setField('profile', 'title', v)} onSave={submit} processing={processing} fontValue={getFontValue('profile', 'title')} sizeValue={getSizeValue('profile', 'title')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Nome do Profissional" section="profile" contentKey="name" defaultValue={data['profile.name']} onChange={v => setField('profile', 'name', v)} onSave={submit} processing={processing} fontValue={getFontValue('profile', 'name')} sizeValue={getSizeValue('profile', 'name')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Frase de Impacto (Citação)" section="profile" contentKey="quote" type="textarea" defaultValue={data['profile.quote']} onChange={v => setField('profile', 'quote', v)} onSave={submit} processing={processing} fontValue={getFontValue('profile', 'quote')} sizeValue={getSizeValue('profile', 'quote')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Texto Biográfico" section="profile" contentKey="text" type="textarea" defaultValue={data['profile.text']} onChange={v => setField('profile', 'text', v)} onSave={submit} processing={processing} fontValue={getFontValue('profile', 'text')} sizeValue={getSizeValue('profile', 'text')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Badges/Tags (Separe por vírgula)" section="profile" contentKey="tags" defaultValue={data['profile.tags']} onChange={v => setField('profile', 'tags', v)} onSave={submit} processing={processing} fontValue={getFontValue('profile', 'tags')} sizeValue={getSizeValue('profile', 'tags')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="WhatsApp (apenas números com DDD e país, ex: 5562999999999)" section="profile" contentKey="whatsapp" defaultValue={data['profile.whatsapp']} onChange={v => setField('profile', 'whatsapp', v)} onSave={submit} processing={processing} fontValue={getFontValue('profile', 'whatsapp')} sizeValue={getSizeValue('profile', 'whatsapp')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <RenderImageUploader label="Foto de Perfil" section="profile" content_key="image" currentUrl={conteudo.profile?.image} imageSizeValue={getImageSizeValue('profile', 'image')} onSaveImageSize={saveImageSize} onSaveImage={handleImageUpload} justUploadedKey={justUploadedKey} />
                    </>
                )}

                {activeTab === 'natural' && (
                    <>
                        <div className="lg:col-span-2 flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={handleSaveNatural}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981] text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#452066] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                Salvar Alimentação Natural
                            </button>
                        </div>
                        <SectionInput label="Título da Linha Natural" section="natural" contentKey="title" defaultValue={data['natural.title']} onChange={v => setField('natural', 'title', v)} onSave={submit} processing={processing} fontValue={getFontValue('natural', 'title')} sizeValue={getSizeValue('natural', 'title')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Descrição dos Benefícios" section="natural" contentKey="text" type="textarea" defaultValue={data['natural.text']} onChange={v => setField('natural', 'text', v)} onSave={submit} processing={processing} fontValue={getFontValue('natural', 'text')} sizeValue={getSizeValue('natural', 'text')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <div className="grid grid-cols-2 gap-4">
                            <SectionInput label="Destaque 1 Valor" section="natural" contentKey="stat1_val" defaultValue={data['natural.stat1_val']} onChange={v => setField('natural', 'stat1_val', v)} onSave={submit} processing={processing} fontValue={getFontValue('natural', 'stat1_val')} sizeValue={getSizeValue('natural', 'stat1_val')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                            <SectionInput label="Destaque 1 Texto" section="natural" contentKey="stat1_label" defaultValue={data['natural.stat1_label']} onChange={v => setField('natural', 'stat1_label', v)} onSave={submit} processing={processing} fontValue={getFontValue('natural', 'stat1_label')} sizeValue={getSizeValue('natural', 'stat1_label')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <SectionInput label="Destaque 2 Valor" section="natural" contentKey="stat2_val" defaultValue={data['natural.stat2_val']} onChange={v => setField('natural', 'stat2_val', v)} onSave={submit} processing={processing} fontValue={getFontValue('natural', 'stat2_val')} sizeValue={getSizeValue('natural', 'stat2_val')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                            <SectionInput label="Destaque 2 Texto" section="natural" contentKey="stat2_label" defaultValue={data['natural.stat2_label']} onChange={v => setField('natural', 'stat2_label', v)} onSave={submit} processing={processing} fontValue={getFontValue('natural', 'stat2_label')} sizeValue={getSizeValue('natural', 'stat2_label')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        </div>
                        <RenderImageUploader label="Foto Ilustrativa" section="natural" content_key="image" currentUrl={conteudo.natural?.image} imageSizeValue={getImageSizeValue('natural', 'image')} onSaveImageSize={saveImageSize} onSaveImage={handleImageUpload} justUploadedKey={justUploadedKey} />
                    </>
                )}

                {activeTab === 'banho_tosa' && (
                    <>
                        <div className="lg:col-span-2 flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={handleSaveBanhoTosa}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#572981] text-white font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#452066] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                Salvar Banho e Tosa
                            </button>
                        </div>
                        <SectionInput label="Título da Seção" section="banho_tosa" contentKey="title" defaultValue={data['banho_tosa.title']} onChange={v => setField('banho_tosa', 'title', v)} onSave={submit} processing={processing} fontValue={getFontValue('banho_tosa', 'title')} sizeValue={getSizeValue('banho_tosa', 'title')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        <SectionInput label="Descrição da Seção" section="banho_tosa" contentKey="description" type="textarea" defaultValue={data['banho_tosa.description']} onChange={v => setField('banho_tosa', 'description', v)} onSave={submit} processing={processing} fontValue={getFontValue('banho_tosa', 'description')} sizeValue={getSizeValue('banho_tosa', 'description')} onSaveFont={saveFont} onSaveSize={saveSize} showSaveButton={false} />
                        
                        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/50">
                                <div className="px-8 py-5 border-b border-gray-100">
                                    <h3 className="text-sm font-black text-[#572981] uppercase tracking-widest">Serviços Oferecidos</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    {Array.from({ length: banhoTosaServiceCount }, (_, i) => i + 1).map((num) => (
                                        <div key={num} className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-gray-400 w-4">{num}</span>
                                            <input
                                                type="text"
                                                value={data[`banho_tosa.service${num}_name`] ?? ''}
                                                onChange={(e) => setField('banho_tosa', `service${num}_name`, e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-700 focus:ring-2 focus:ring-[#54B6B5]/20 transition-all"
                                                placeholder={`Serviço ${num}`}
                                            />
                                        </div>
                                    ))}
                                    {banhoTosaServiceCount < 20 && (
                                        <button
                                            type="button"
                                            onClick={() => setBanhoTosaServiceCount(prev => prev + 1)}
                                            className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-[#54B6B5] hover:text-[#54B6B5] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={18} />
                                            Adicionar novo serviço
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {Array.from({ length: banhoTosaImageCount }, (_, i) => i + 1).map((n) => (
                                    <RenderImageUploader
                                        key={`banho-tosa-banner${n}`}
                                        label={`Imagem do Card ${n}`}
                                        section="banho_tosa"
                                        content_key={`banner${n}`}
                                        currentUrl={conteudo.banho_tosa?.[`banner${n}`]}
                                        imageSizeValue={getImageSizeValue('banho_tosa', `banner${n}`)}
                                        onSaveImageSize={saveImageSize}
                                        onSaveImage={handleImageUpload}
                                        justUploadedKey={justUploadedKey}
                                    />
                                ))}
                                {banhoTosaImageCount < 10 && (
                                    <button
                                        type="button"
                                        onClick={() => setBanhoTosaImageCount(prev => prev + 1)}
                                        className="w-full py-8 rounded-[32px] border-2 border-dashed border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest hover:border-[#54B6B5] hover:text-[#54B6B5] transition-all flex flex-col items-center justify-center gap-3 bg-white"
                                    >
                                        <div className="p-3 rounded-full bg-gray-50 group-hover:bg-[#54B6B5]/10">
                                            <Plus size={24} />
                                        </div>
                                        Adicionar nova foto
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
