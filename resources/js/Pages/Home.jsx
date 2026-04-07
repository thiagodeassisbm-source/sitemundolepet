import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Heart,
    Stethoscope,
    Leaf,
    MessageCircle,
    Instagram,
    Facebook,
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    ShieldCheck,
    Star,
    Play,
    Syringe,
    FlaskConical,
    Scan,
    LayoutGrid,
    Menu,
    X,
    Scissors,
    Waves,
    Sparkles,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgendamentoModal from '@/Components/AgendamentoModal';
import { publicAsset, withFallbackAsset } from '@/lib/publicAsset';

// Gera style para fonte e tamanho numérico (só aplica se valor for número)
function textStyle(font, size) {
    const s = {};
    if (font) s.fontFamily = font;
    if (size != null && size !== '' && /^\d+$/.test(String(size))) s.fontSize = `${size}px`;
    return Object.keys(s).length ? s : undefined;
}

const Home = ({ cms, videos: serverVideos, contactInfo: contactInfoProp }) => {
    const { props } = usePage();
    const siteSeo = props?.siteSeo || {};
    const contactInfo = contactInfoProp || {};
    const footerInfo = contactInfo.info || {};
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [agendamentoOpen, setAgendamentoOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const defaultVideos = [
        { id: "ur3d92sVvIw", title: "Conheça o Mundo Le Pet", summary: "Um tour completo pela nossa clínica e filosofia de cuidado." },
        { id: "M7lc1UVf-VE", title: "Benefícios da Alimentação Natural", summary: "Descubra como a dieta fresca transforma a vida do seu pet." },
        { id: "dQw4w9WgXcQ", title: "Dicas de Dermatologia Pet", summary: "Entenda as causas comuns de coceiras e alergias." }
    ];
    const videos = (() => {
        const source = (Array.isArray(serverVideos) && serverVideos.length > 0) ? serverVideos : defaultVideos;
        return [...source].sort((a, b) => {
            const aTs = a?.posted_at ? Date.parse(a.posted_at) : Number.NaN;
            const bTs = b?.posted_at ? Date.parse(b.posted_at) : Number.NaN;
            const aHasDate = Number.isFinite(aTs);
            const bHasDate = Number.isFinite(bTs);
            if (aHasDate && bHasDate) return bTs - aTs;
            if (aHasDate) return -1;
            if (bHasDate) return 1;
            return 0;
        });
    })();
    const [activeVideo, setActiveVideo] = useState(videos[0]?.id || "ur3d92sVvIw");

    // Reset videoLoaded when activeVideo changes
    useEffect(() => {
        setVideoLoaded(false);
    }, [activeVideo]);

    const banners = (() => {
        const list = [
            cms?.hero?.banner1,
            cms?.hero?.banner2,
            cms?.hero?.banner3,
            cms?.hero?.banner4,
            cms?.hero?.banner5,
            cms?.hero?.banner6
        ].filter(Boolean);
        return list.length > 0 ? list : ["/images/banner.png", "/images/banner2.png", "/images/banner3.png"];
    })();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 7000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(timer);
        };
    }, [banners.length]);

    const rawWhatsapp = cms?.profile?.whatsapp || '5500000000000';
    const whatsappDigits = (rawWhatsapp && typeof rawWhatsapp === 'string')
        ? rawWhatsapp.replace(/\D/g, '')
        : '';
    const whatsappLink = whatsappDigits
        ? `https://wa.me/${whatsappDigits}`
        : 'https://wa.me/5500000000000';

    const services = [
        {
            title: cms?.differentials?.card1_title || "Alimentação Natural",
            description: cms?.differentials?.card1_text || "Nutrologia personalizada para o bem-estar e longevidade do seu pet.",
            titleFont: cms?.differentials?.card1_title_font,
            titleSize: cms?.differentials?.card1_title_size,
            descFont: cms?.differentials?.card1_text_font,
            descSize: cms?.differentials?.card1_text_size,
            icon: cms?.differentials?.card1_image ? (
                <img src={cms.differentials.card1_image} alt={cms.differentials.card1_title || "Alimentação Natural"} className="w-10 h-10 object-contain" loading="lazy" />
            ) : (
                <Leaf className="w-8 h-8 text-[#54B6B5]" />
            ),
            color: "bg-[#54B6B5]/10"
        },
        {
            title: cms?.differentials?.card2_title || "Dermatologia",
            description: cms?.differentials?.card2_text || "Cuidado especializado para a saúde da pele e pelagem do seu melhor amigo.",
            titleFont: cms?.differentials?.card2_title_font,
            titleSize: cms?.differentials?.card2_title_size,
            descFont: cms?.differentials?.card2_text_font,
            descSize: cms?.differentials?.card2_text_size,
            icon: cms?.differentials?.card2_image ? (
                <img src={cms.differentials.card2_image} alt={cms.differentials.card2_title || "Dermatologia"} className="w-10 h-10 object-contain" loading="lazy" />
            ) : (
                <Heart className="w-8 h-8 text-[#FF69B4]" />
            ),
            color: "bg-[#FF69B4]/10"
        },
        {
            title: cms?.differentials?.card3_title || "Consultas Especializadas",
            description: cms?.differentials?.card3_text || "Atendimento focado em medicina preventiva e curativa.",
            titleFont: cms?.differentials?.card3_title_font,
            titleSize: cms?.differentials?.card3_title_size,
            descFont: cms?.differentials?.card3_text_font,
            descSize: cms?.differentials?.card3_text_size,
            icon: cms?.differentials?.card3_image ? (
                <img src={cms.differentials.card3_image} alt={cms.differentials.card3_title || "Consultas Especializadas"} className="w-10 h-10 object-contain" loading="lazy" />
            ) : (
                <Stethoscope className="w-8 h-8 text-[#572981]" />
            ),
            color: "bg-[#572981]/10"
        }
    ];

    const servicosNomesPadrao = [
        'Castração', 'Consulta Clínica Geral', 'Consulta de Dermatologia', 'Consulta de Nutrologia',
        'Exames Laboratoriais', 'Exames de Imagem', 'Outras Especialidades', 'Vacina'
    ];
    const servicosIconesCores = [
        { icon: Syringe, color: 'bg-[#572981]/10', iconColor: 'text-[#572981]' },
        { icon: Stethoscope, color: 'bg-[#54B6B5]/10', iconColor: 'text-[#54B6B5]' },
        { icon: Heart, color: 'bg-[#FF69B4]/10', iconColor: 'text-[#FF69B4]' },
        { icon: Leaf, color: 'bg-[#54B6B5]/10', iconColor: 'text-[#54B6B5]' },
        { icon: FlaskConical, color: 'bg-[#FFD700]/20', iconColor: 'text-[#B8860B]' },
        { icon: Scan, color: 'bg-[#572981]/10', iconColor: 'text-[#572981]' },
        { icon: LayoutGrid, color: 'bg-[#54B6B5]/10', iconColor: 'text-[#54B6B5]' },
        { icon: Syringe, color: 'bg-[#FF69B4]/10', iconColor: 'text-[#FF69B4]' }
    ];
    const nossosServicos = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const nome = cms?.servicos?.[`service${i}_name`]?.trim() || servicosNomesPadrao[i - 1];
        const { icon, color, iconColor } = servicosIconesCores[i - 1];
        return { nome, icon, color, iconColor };
    });

    const banhoTosaBanners = (() => {
        const list = Array.from({ length: 10 }, (_, i) => i + 1)
            .map(i => cms?.banho_tosa?.[`banner${i}`])
            .filter(Boolean);
        return list.length > 0 ? list : ["/images/banho_tosa_1.png"];
    })();

    const [currentBanhoTosaBanner, setCurrentBanhoTosaBanner] = useState(0);

    useEffect(() => {
        if (banhoTosaBanners.length > 1) {
            const timer = setInterval(() => {
                setCurrentBanhoTosaBanner((prev) => (prev + 1) % banhoTosaBanners.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [banhoTosaBanners.length]);

    const banhoTosaServices = Array.from({ length: 20 }, (_, i) => i + 1)
        .map(i => cms?.banho_tosa?.[`service${i}_name`]?.trim())
        .filter(Boolean);
    const displayedBanhoTosaServices = banhoTosaServices.length > 0 
        ? banhoTosaServices 
        : ['Hidratação', 'Tosas Variadas', 'Banho U.V', 'Penteados', 'Banho Hipoalergênicos', 'Corte de Unhas'];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Altura do cabeçalho fixo
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const navigateToHistory = () => {
        window.location.href = '/historia';
    };

    const navigateToContact = () => {
        window.location.href = '/contato';
    };

    const menuItems = [
        { label: 'Início', id: 'inicio' },
        { label: 'História', id: 'historia' },
        { label: 'Serviços', id: 'servicos' },
        { label: 'Banho e Tosa', id: 'banhotosa' },
        { label: 'Nutrição', id: 'nutricao' },
        { label: 'Interatividade', id: 'interatividade' },
        { label: 'Dra. Thania', id: 'drathania' },
        { label: 'Contato', id: 'contato' }
    ];

    const handleMenuClick = (id) => {
        if (id === 'historia') {
            navigateToHistory();
            return;
        }

        if (id === 'contato') {
            navigateToContact();
            return;
        }

        scrollToSection(id);
    };

    const trackVideoClick = () => {
        try {
            fetch('/api/stats/video-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            }).catch(() => {});
        } catch (e) {}
    };

    const handleVideoChange = (videoId) => {
        setActiveVideo(videoId);
        trackVideoClick();
    };

    const version = new Date().getTime();
    const logoAsset = withFallbackAsset('/images/logo_reta.png');
    return (
        <div className="min-h-screen bg-[#FFFAFA] selection:bg-[#572981]/20 font-sans scroll-smooth">
            <AgendamentoModal open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} whatsapp={cms?.profile?.whatsapp} />
            <Head>
                <title>{(siteSeo.title && String(siteSeo.title).trim()) ? String(siteSeo.title).trim() : "Mundo Le Pet - Excelência em Nutrologia e Dermatologia Pet"}</title>
                <meta name="description" content={siteSeo.description || 'Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia, além de consultas clínicas, exames e vacinação em Goiânia.'} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://mundolepet.com.br/" />
                
                {siteSeo.favicon && (
                    <>
                        <link rel="shortcut icon" href={publicAsset(siteSeo.favicon)} />
                        <link rel="apple-touch-icon" href={publicAsset(siteSeo.favicon)} />
                        <link rel="icon" type="image/png" sizes="32x32" href={publicAsset(siteSeo.favicon)} />
                    </>
                )}
                {siteSeo.og_image_full && <meta property="og:image" content={siteSeo.og_image_full} />}
                <meta property="og:title" content={siteSeo.title || "Mundo Le Pet - Excelência em Nutrologia e Dermatologia Pet"} />
                <meta property="og:description" content={siteSeo.description || 'Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia, além de consultas clínicas, exames e vacinação em Goiânia.'} />
            </Head>

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center gap-3">
                    <div className="min-w-0 flex-shrink flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('inicio')}>
                        <img
                            src={`${logoAsset.primary}?v=${version}`}
                            alt="Mundo Le Pet Logo"
                            className="h-20 w-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `${logoAsset.fallback}?v=${version}`;
                            }}
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-8 flex-shrink-0">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                className="text-lg font-bold text-gray-700 hover:text-[#572981] transition-all cursor-pointer hover:scale-105 active:scale-95"
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setAgendamentoOpen(true)}
                            className="btn-primary py-3 px-8 text-base"
                        >
                            Agendar Agora
                        </button>
                    </div>

                    {/* Menu mobile: botão hambúrguer - visível em telas menores que md (768px) */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden flex-shrink-0 p-3 rounded-xl bg-[#572981]/10 text-[#572981] hover:bg-[#572981]/20 transition-colors border-2 border-[#572981]/30"
                        aria-label="Abrir menu"
                    >
                        <Menu className="w-7 h-7" strokeWidth={2.5} />
                    </button>
                </div>
            </nav>

            {/* Painel do menu mobile */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-hidden="true"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-2xl z-[70] md:hidden flex flex-col py-6 px-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <img
                                    src={`${logoAsset.primary}?v=${version}`}
                                    alt="Mundo Le Pet"
                                    className="h-12 w-auto"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `${logoAsset.fallback}?v=${version}`;
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                    aria-label="Fechar menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleMenuClick(item.id);
                                        }}
                                        className="text-left py-3 px-4 rounded-xl text-lg font-bold text-gray-700 hover:bg-[#572981]/10 hover:text-[#572981] transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setAgendamentoOpen(true);
                                    }}
                                    className="mt-4 btn-primary py-3 px-6 text-center w-full"
                                >
                                    Agendar Agora
                                </button>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section id="inicio" className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#572981]/5 rounded-l-[100px] -z-10 hidden lg:block" />
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#54B6B5]/10 text-[#54B6B5] rounded-full text-sm font-bold mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Especialista em Nutrologia & Saúde Natural
                        </div>
                        <h1 className="font-black text-[#572981] leading-tight mb-6 transition-all duration-500 text-5xl lg:text-7xl" style={textStyle(cms?.hero?.title_font, cms?.hero?.title_size)}>
                            {(() => {
                                const t = (cms?.hero?.title || 'Um Novo Conceito em Medicina Veterinária').trim();
                                const words = t.split(/\s+/).filter(Boolean);
                                if (words.length <= 1) return <span className="text-[#54B6B5] italic underline decoration-[#FFD700] underline-offset-8">{t || 'Veterinária'}</span>;
                                return (<><span>{words.slice(0, -1).join(' ')}</span> <br /><span className="text-[#54B6B5] italic underline decoration-[#FFD700] underline-offset-8">{words[words.length - 1]}</span></>);
                            })()}
                        </h1>
                        <p className="text-gray-600 mb-10 max-w-lg leading-relaxed text-lg" style={textStyle(cms?.hero?.subtitle_font, cms?.hero?.subtitle_size)}>
                            {cms?.hero?.subtitle || 'Especialistas em Nutrologia e Dermatologia Pet. Proporcionando uma vida longa, saudável e feliz para o seu melhor amigo através da alimentação natural.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href={whatsappLink} target="_blank" className="btn-primary flex items-center justify-center gap-2" rel="noreferrer">
                                <MessageCircle className="w-5 h-5" />
                                Falar no WhatsApp
                            </a>
                            <button onClick={() => scrollToSection('servicos')} className="bg-white text-gray-800 px-6 py-3 rounded-full font-bold border-2 border-gray-100 hover:border-[#572981] transition-all flex items-center justify-center gap-2 shadow-sm">
                                Ver Serviços
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative order-1 lg:order-2"
                    >
                        <div className="relative z-10 rounded-[60px] overflow-hidden border-[12px] border-white shadow-2xl rotate-2 aspect-[4/3] bg-gray-100">
                            {banners.map((img, idx) => {
                                const sizeKey = `banner${idx + 1}_size`;
                                const px = cms?.hero?.[sizeKey] && /^\d+$/.test(String(cms.hero[sizeKey])) ? `${cms.hero[sizeKey]}px` : undefined;
                                return (
                                    <motion.img
                                        key={idx}
                                        src={img}
                                        alt="Mundo Le Pet Banner"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: currentBanner === idx ? 1 : 0,
                                            scale: currentBanner === idx ? 1 : 1.05,
                                        }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        style={px ? { maxWidth: px, margin: '0 auto' } : undefined}
                                    />
                                );
                            })}

                            {/* Banner Progress Indicators */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                                {banners.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentBanner(idx)}
                                        className={`h-2 rounded-full transition-all duration-500 ${currentBanner === idx ? 'bg-white w-10 shadow-lg' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl opacity-30 animate-pulse" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FF69B4] rounded-full blur-3xl opacity-30 animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* Nossos Diferenciais */}
            <section id="diferenciais" className="py-20 bg-[#FFFAFA]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl lg:text-5xl font-black text-[#572981] mb-16" style={textStyle(cms?.differentials?.title_font, cms?.differentials?.title_size)}>{cms?.differentials?.title || 'Nossos Diferenciais'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="p-10 rounded-[40px] bg-white shadow-sm border border-gray-50 hover:shadow-xl transition-all group text-left"
                            >
                                <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center mb-8 mx-auto md:mx-0 group-hover:rotate-12 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-4" style={textStyle(service.titleFont, service.titleSize)}>{service.title}</h3>
                                <p className="text-base text-gray-600 leading-relaxed" style={textStyle(service.descFont, service.descSize)}>{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Serviços que realizamos */}
            <section id="servicos" className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-[#54B6B5] font-black tracking-widest uppercase text-sm mb-4 block" style={textStyle(cms?.servicos?.subtitle_font, cms?.servicos?.subtitle_size)}>{cms?.servicos?.subtitle || 'O que oferecemos'}</span>
                    <h2 className="text-3xl lg:text-5xl font-black text-[#572981] mb-4" style={textStyle(cms?.servicos?.title_font, cms?.servicos?.title_size)}>{cms?.servicos?.title || 'Serviços que realizamos'}</h2>
                    <div className="w-24 h-2 bg-[#FFD700] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mb-16 leading-relaxed" style={textStyle(cms?.servicos?.description_font, cms?.servicos?.description_size)}>
                        {cms?.servicos?.description || 'Na Mundo Le Pet, oferecemos atendimento veterinário completo para o seu pet: consultas clínicas e especializadas, exames, vacinação, castração e muito mais. Conte com nossa equipe para cuidar da saúde e do bem-estar do seu melhor amigo.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nossosServicos.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                    className="p-8 rounded-[40px] bg-[#FFFAFA] shadow-sm border border-gray-50 hover:shadow-xl hover:border-[#572981]/20 transition-all group text-center"
                                >
                                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-8 h-8 ${item.iconColor}`} />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-800">{item.nome}</h3>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Banho e Tosa Section */}
            <section id="banhotosa" className="py-20 bg-[#FFFAFA]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Imagens (Lado Esquerdo) */}
                        <div className="w-full lg:w-1/2">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white bg-gray-100"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentBanhoTosaBanner}
                                        src={banhoTosaBanners[currentBanhoTosaBanner]}
                                        alt="Banho e Tosa Mundo Le Pet"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 1 }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                                {banhoTosaBanners.length > 1 && (
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                        {banhoTosaBanners.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentBanhoTosaBanner(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${currentBanhoTosaBanner === idx ? 'bg-white w-8' : 'bg-white/40 w-1.5'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Informações (Lado Direito) */}
                        <div className="w-full lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF69B4]/10 text-[#FF69B4] rounded-full text-sm font-bold mb-6">
                                    <Scissors className="w-4 h-4" />
                                    Estética Pet Premium
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black text-[#572981] mb-6 leading-tight" style={textStyle(cms?.banho_tosa?.title_font, cms?.banho_tosa?.title_size)}>
                                    {cms?.banho_tosa?.title || 'Banho e Tosa Especializado'}
                                </h2>
                                <p className="text-lg text-gray-600 mb-10 leading-relaxed" style={textStyle(cms?.banho_tosa?.description_font, cms?.banho_tosa?.description_size)}>
                                    {cms?.banho_tosa?.description || 'Oferecemos o melhor cuidado para o seu pet, utilizando produtos de alta qualidade e técnicas especializadas para garantir o bem-estar e a beleza do seu melhor amigo.'}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    {displayedBanhoTosaServices.map((service, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-50 group hover:border-[#572981]/20 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-[#54B6B5]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <CheckCircle className="w-5 h-5 text-[#54B6B5]" />
                                            </div>
                                            <span className="font-bold text-gray-700">{service}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => setAgendamentoOpen(true)} className="btn-primary flex items-center gap-2">
                                    <Waves className="w-5 h-5" />
                                    Agendar Estética
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dra Thania Section - coluna da imagem só ocupa o tamanho da foto; texto preenche o resto para alinhar à direita */}
            <section id="drathania" className="py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#572981]/5 -z-10" />
                <div className="container mx-auto px-6">
                    <div className="glass rounded-[60px] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-auto lg:shrink-0 lg:max-w-[50%]">
                            <div className="relative w-fit max-w-full mx-auto lg:mx-0">
                                <img
                                    src={cms?.profile?.image || "/images/dra_thania.png"}
                                    alt="Dra Thania Alvarenga"
                                    className="rounded-[40px] shadow-2xl w-full aspect-[4/5] object-cover"
                                    loading="lazy"
                                    style={cms?.profile?.image_size && /^\d+$/.test(String(cms.profile.image_size)) ? { maxWidth: `${cms.profile.image_size}px` } : undefined}
                                />
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-[#FFD700] fill-current" />)}
                                    </div>
                                    <p className="text-sm font-bold text-gray-800">Referência em Nutrologia</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:flex-1 lg:min-w-0">
                            <span className="text-sm text-[#54B6B5] font-black tracking-widest uppercase mb-4 block" style={textStyle(cms?.profile?.title_font, cms?.profile?.title_size)}>{cms?.profile?.title || 'Responsável Técnica'}</span>
                            <h2 className="text-4xl lg:text-6xl font-black text-[#572981] mb-8 leading-tight" style={textStyle(cms?.profile?.name_font, cms?.profile?.name_size)}>{cms?.profile?.name}</h2>
                            <p className="text-xl text-gray-700 font-bold mb-6 italic border-l-4 border-[#FF69B4] pl-6" style={textStyle(cms?.profile?.quote_font, cms?.profile?.quote_size)}>
                                "{cms?.profile?.quote}"
                            </p>
                            <div className="space-y-4 mb-10 text-gray-600">
                                <p className="text-base" style={textStyle(cms?.profile?.text_font, cms?.profile?.text_size)}>{cms?.profile?.text}</p>
                                <div className="flex flex-wrap gap-3">
                                    {cms?.profile?.tags?.split(',').map((tag, i) => (
                                        <span key={i} className="px-4 py-2 bg-white rounded-full text-xs font-bold border border-gray-100 shadow-sm">{tag.trim()}</span>
                                    ))}
                                </div>
                            </div>
                            <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-secondary inline-block">
                                Agendar Consulta com a Dra.
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Line Natural Section - coluna da imagem só ocupa o tamanho da foto; texto preenche o resto para alinhar à esquerda */}
            <section id="nutricao" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                        <div className="w-full lg:flex-1 lg:min-w-0">
                            <h2 className="text-4xl lg:text-6xl font-black text-[#572981] mb-8" style={textStyle(cms?.natural?.title_font, cms?.natural?.title_size)}>{cms?.natural?.title}</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed" style={textStyle(cms?.natural?.text_font, cms?.natural?.text_size)}>
                                {cms?.natural?.text}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-6 bg-[#54B6B5]/10 rounded-3xl">
                                    <p className="text-3xl font-black text-[#54B6B5] mb-1" style={textStyle(cms?.natural?.stat1_val_font, cms?.natural?.stat1_val_size)}>{cms?.natural?.stat1_val}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider" style={textStyle(cms?.natural?.stat1_label_font, cms?.natural?.stat1_label_size)}>{cms?.natural?.stat1_label}</p>
                                </div>
                                <div className="p-6 bg-[#FF69B4]/10 rounded-3xl">
                                    <p className="text-3xl font-black text-[#FF69B4] mb-1" style={textStyle(cms?.natural?.stat2_val_font, cms?.natural?.stat2_val_size)}>{cms?.natural?.stat2_val}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider" style={textStyle(cms?.natural?.stat2_label_font, cms?.natural?.stat2_label_size)}>{cms?.natural?.stat2_label}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-auto lg:shrink-0 lg:max-w-[50%] flex justify-center lg:justify-end">
                            <motion.img
                                whileHover={{ scale: 1.02 }}
                                src={cms?.natural?.image || "/images/natural_food.png"}
                                alt="Alimentação Natural"
                                className="rounded-[40px] shadow-xl w-full max-w-full aspect-square object-cover"
                                loading="lazy"
                                style={cms?.natural?.image_size && /^\d+$/.test(String(cms.natural.image_size)) ? { maxWidth: `${cms.natural.image_size}px` } : undefined}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Interatividade Section - modelo anexo 2: player à esquerda, Mais Vídeos à direita com ícone, título e descrição; primeiro com fundo roxo */}
            <section id="interatividade" className="py-20 bg-snow-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-teal-secondary font-black tracking-widest uppercase text-sm mb-4 block">Fique por dentro</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-purple-primary mb-4">Interatividade</h2>
                        <div className="w-24 h-2 bg-pet-yellow mx-auto rounded-full"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 bg-white p-4 lg:p-8 rounded-[40px] shadow-xl border border-gray-50">
                        {/* Video Player - Click to load optimization */}
                        <div className="w-full lg:w-2/3 aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black relative group">
                            {!videoLoaded ? (
                                <div 
                                    className="absolute inset-0 cursor-pointer flex items-center justify-center bg-gray-900"
                                    onClick={() => {
                                        setVideoLoaded(true);
                                        trackVideoClick();
                                    }}
                                >
                                    <img 
                                        src={`https://img.youtube.com/vi/${activeVideo}/maxresdefault.jpg`} 
                                        alt="Video Preview" 
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                        loading="lazy"
                                    />
                                    <div className="absolute w-20 h-20 bg-[#572981] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-white font-black text-sm uppercase tracking-widest drop-shadow-lg">Clique para carregar vídeo</p>
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>

                        {/* Mais Vídeos - lista com ícone, título e descrição; primeiro com fundo roxo */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-3">
                            <h3 className="text-xl font-black text-[#572981] mb-1 flex items-center gap-2">
                                <Play className="w-5 h-5 fill-current" />
                                Mais Vídeos
                            </h3>
                            <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1 custom-scrollbar">
                                {videos.map((video, index) => {
                                    const isFirst = index === 0;
                                    const isActive = activeVideo === video.id;
                                    return (
                                        <button
                                            key={video.id}
                                            onClick={() => handleVideoChange(video.id)}
                                            className={`flex items-start gap-4 p-4 rounded-2xl transition-all text-left w-full border ${
                                                isFirst
                                                    ? 'bg-[#572981] text-white border-[#572981] shadow-lg'
                                                    : 'bg-white text-gray-800 border-gray-100 hover:border-[#572981]/20 hover:bg-gray-50/80'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                                                isFirst ? 'border-white bg-white/10' : 'border-[#572981]/30 bg-[#572981]/5'
                                            }`}>
                                                <Play className={`w-5 h-5 ${isFirst ? 'text-white fill-white' : 'text-[#572981] fill-[#572981]'}`} />
                                            </div>
                                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                <span className={`font-bold text-sm leading-tight ${isFirst ? 'text-white' : 'text-gray-800'}`}>
                                                    {video.title}
                                                </span>
                                                {video.summary && (
                                                    <span className={`text-[10px] uppercase font-black tracking-widest leading-snug ${isFirst ? 'text-white/80' : 'text-gray-500'}`}>
                                                        {video.summary}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contato" className="bg-[#572981] pt-20 pb-10 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="inline-block bg-white p-4 rounded-2xl mb-8 shadow-inner">
                                <img
                                    src={`${logoAsset.primary}?v=${version}`}
                                    alt="Mundo Le Pet Logo"
                                    className="h-12 w-auto object-contain"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `${logoAsset.fallback}?v=${version}`;
                                    }}
                                />
                            </div>
                            <p className="text-purple-200 leading-relaxed">
                                Cuidando da saúde do seu pet com o poder da natureza e da ciência.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-8">Menu</h4>
                            <ul className="space-y-4 text-purple-200">
                                <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Serviços</a></li>
                                <li><a href="/historia" className="hover:text-white transition-colors">História</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Nutrologia</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Dra Thania</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-8">Contato</h4>
                            <ul className="space-y-4 text-purple-200">
                                <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-teal-200 shrink-0" /> {footerInfo.phone || '(00) 00000-0000'}</li>
                                <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-teal-200 shrink-0" /> {footerInfo.address ? `${footerInfo.address}${footerInfo.city ? ` - ${footerInfo.city}` : ''}` : 'Rua dos Pets, 123 - Centro'}</li>
                                <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-teal-200 shrink-0" /> {footerInfo.hours || 'Seg - Sex: 08:00 - 18:00'}</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-8">Siga-nos</h4>
                            <div className="flex gap-4">
                                <a href={footerInfo.instagram_url || '#'} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a href={footerInfo.facebook_url || '#'} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                                    <Facebook className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-10 text-center text-purple-300 text-sm">
                        <p>&copy; 2026 Mundo Le Pet. Desenvolvido{' '}
                            <a href="https://www.upgyn.com.br" target="_blank" rel="noreferrer" className="text-white hover:underline font-semibold">UPGYN</a>.
                        </p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-5 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all group"
            >
                <div className="relative">
                    <MessageCircle className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#25D366] rounded-full" />
                </div>
                <div className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap font-bold text-sm">
                    Fale conosco agora!
                </div>
            </a>
        </div>
    );
};

export default Home;
