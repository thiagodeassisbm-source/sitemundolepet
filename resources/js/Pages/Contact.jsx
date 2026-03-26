import React, { useEffect, useState } from 'react';

import { Head, usePage } from '@inertiajs/react';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Instagram,
    Facebook,
    MessageCircle,
    Menu,
    X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgendamentoModal from '@/Components/AgendamentoModal';

/** Extrai URL do mapa para o link de clique: aceita iframe completo, URL embed ou link direto (goo.gl). */
function getMapClickUrl(raw) {
    if (!raw || typeof raw !== 'string') return 'https://www.google.com/maps';
    const s = raw.trim();
    if (!s) return 'https://www.google.com/maps';
    const iframeMatch = s.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    if (iframeMatch) return iframeMatch[1].trim();
    if (s.startsWith('http')) return s;
    return 'https://www.google.com/maps';
}

/** Imagem do mapa: vem do painel admin (upload) ou fallback local */
const MAPA_IMAGE_FALLBACK = '/images/mapa-contato.png';

export default function Contact({ cms, whatsapp }) {
    const { props } = usePage();
    const siteSeo = props?.siteSeo || {};
    const hero = cms?.hero || {};
    const info = cms?.info || {};
    const formData = cms?.form || {};
    const map = cms?.map || {};
    const mapClickUrl = getMapClickUrl(map.embed);
    const mapImageSrc = map.image || MAPA_IMAGE_FALLBACK;

    const rawTitle = hero.title || 'Entre em Contato';
    const titleParts = String(rawTitle).trim().split(' ');
    const heroLastWord = titleParts.length > 1 ? titleParts.pop() : titleParts[0] || '';
    const heroInitialTitle = titleParts.join(' ');

    const [isScrolled, setIsScrolled] = useState(false);
    const [agendamentoOpen, setAgendamentoOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const goToHomeSection = (id) => {
        if (id === 'historia') {
            window.location.href = '/historia';
            return;
        }

        if (id === 'contato') {
            window.location.href = '/contato';
            return;
        }

        window.location.href = `/#${id}`;
    };

    const menuItems = [
        { label: 'Início', id: 'inicio' },
        { label: 'História', id: 'historia' },
        { label: 'Serviços', id: 'servicos' },
        { label: 'Banho e Tosa', id: 'banhotosa' },
        { label: 'Nutrição', id: 'nutricao' },
        { label: 'Interatividade', id: 'interatividade' },
        { label: 'Dra. Thania', id: 'drathania' },
        { label: 'Contato', id: 'contato' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui poderemos integrar com backend / e-mail depois.
        alert('Mensagem enviada! Em breve entraremos em contato.');
    };

    const version = new Date().getTime();
    return (
        <div className="min-h-screen bg-[#FFFAFA] font-sans scroll-smooth">
            <AgendamentoModal open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} whatsapp={whatsapp} />
            <Head>
                <title>{`Contato - ${siteSeo.title || 'Mundo Le Pet'}`}</title>
                {siteSeo.description && <meta name="description" content={siteSeo.description} />}
                {siteSeo.favicon && <link rel="icon" href={`${siteSeo.favicon}?v=${version}`} />}
                {siteSeo.og_image_full && <meta property="og:image" content={siteSeo.og_image_full} />}
            </Head>

            {/* Navegação */}
            <nav
                className={`fixed w-full z-50 glass transition-all duration-300 ${
                    isScrolled ? 'py-3 shadow-sm' : 'py-6'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center gap-3">
                    <div
                        className="min-w-0 flex-shrink flex items-center gap-2 cursor-pointer"
                        onClick={() => goToHomeSection('inicio')}
                    >
                        <img
                            src={`/images/logo_reta.png?v=${version}`}
                            alt="Mundo Le Pet Logo"
                            className="h-20 w-auto object-contain"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-8 flex-shrink-0">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => goToHomeSection(item.id)}
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
                                <img src={`/images/logo_reta.png?v=${version}`} alt="Mundo Le Pet" className="h-12 w-auto" />
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
                                            goToHomeSection(item.id);
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

            {/* Hero / Formulário */}
            <main className="pt-32 pb-20">
                <section className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <p className="text-xs font-black tracking-[0.3em] uppercase text-[#54B6B5] mb-3">
                            {hero.top_label || 'Vamos conversar?'}
                        </p>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1F1235] mb-4">
                            {heroInitialTitle && <span>{heroInitialTitle} </span>}
                            <span className="text-[#54B6B5] italic">{heroLastWord}</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-600 text-base md:text-lg">
                            {hero.subtitle ||
                                'Dúvidas, agendamentos ou apenas quer dar um “oi”? Estamos prontos para atender você e seu pet.'}
                        </p>
                    </div>

                    {/* Bloco principal - 2 colunas como no layout original */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 items-stretch">
                        {/* Card de canais */}
                        <div className="bg-[#572981] rounded-[36px] p-8 text-white shadow-[0_30px_80px_rgba(37,17,77,0.55)] flex flex-col">
                            <h2 className="text-sm font-black tracking-[0.28em] uppercase text-[#FFBBD9] mb-4">
                                {info.channels_title || 'Canais de Atendimento'}
                            </h2>
                            <p className="text-2xl md:text-3xl font-black mb-8 leading-snug">
                                {info.channels_subtitle || 'Estamos aqui para cuidar de você e do seu pet.'}
                            </p>

                            <div className="space-y-6 text-sm md:text-base">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-[#FFBBD9]" />
                                    </div>
                                    <div>
                                        <p className="text-purple-200 text-xs font-semibold uppercase tracking-[0.18em] mb-1">
                                            Telefone / WhatsApp
                                        </p>
                                        <p className="font-semibold">
                                            {info.phone || '(62) 99999-9999'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-[#FFBBD9]" />
                                    </div>
                                    <div>
                                        <p className="text-purple-200 text-xs font-semibold uppercase tracking-[0.18em] mb-1">
                                            E-mail
                                        </p>
                                        <p className="font-semibold">
                                            {info.email || 'contato@mundolepet.com.br'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-[#FFBBD9]" />
                                    </div>
                                    <div>
                                        <p className="text-purple-200 text-xs font-semibold uppercase tracking-[0.18em] mb-1">
                                            Nosso Espaço
                                        </p>
                                        <p className="font-semibold">
                                            {info.address || 'Rua dos Pets, 123 - Setor Marista'}
                                        </p>
                                        <p className="text-purple-200">
                                            {info.city || 'Goiânia - GO'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-[#FFBBD9]" />
                                    </div>
                                    <div>
                                        <p className="text-purple-200 text-xs font-semibold uppercase tracking-[0.18em] mb-1">
                                            Horário de Atendimento
                                        </p>
                                        <p className="font-semibold whitespace-pre-line">{info.hours || 'Seg - Sex: 08:00 - 18:00'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-purple-200 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                                    {info.social_title || 'Siga o Mundo Le Pet'}
                                </p>
                                <div className="flex gap-4">
                                    <a
                                        href={info.instagram_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={info.facebook_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Card do formulário */}
                        <div className="bg-white rounded-[36px] p-8 md:p-10 shadow-[0_24px_70px_rgba(31,18,53,0.08)] flex flex-col justify-between">
                            <h2 className="text-2xl md:text-3xl font-black text-[#1F1235] mb-2">
                                {formData.title || 'Envie uma Mensagem'}
                            </h2>
                            <p className="text-gray-500 mb-8 text-sm md:text-base">
                                {formData.description ||
                                    'Preencha os campos abaixo e conte como podemos ajudar você e seu pet.'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-[0.18em]">
                                            Nome completo
                                        </label>
                                        <input
                                            type="text"
                                            autoComplete="name"
                                            required
                                            className="w-full h-12 rounded-full border border-gray-200 bg-gray-50/60 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                            placeholder={formData.placeholder_name || 'Como quer ser chamado?'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-[0.18em]">
                                            Seu melhor e-mail
                                        </label>
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="w-full h-12 rounded-full border border-gray-200 bg-gray-50/60 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                            placeholder={formData.placeholder_email || 'exemplo@email.com'}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-[0.18em]">
                                            WhatsApp (opcional)
                                        </label>
                                        <input
                                            type="tel"
                                            autoComplete="tel"
                                            className="w-full h-12 rounded-full border border-gray-200 bg-gray-50/60 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                            placeholder={formData.placeholder_whatsapp || '(00) 00000-0000'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-[0.18em]">
                                            Melhor horário para contato
                                        </label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="w-full h-12 rounded-full border border-gray-200 bg-gray-50/60 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                            placeholder={formData.placeholder_time || '08:00 às 18:00'}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-[0.18em]">
                                        Sua mensagem
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-3xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                        placeholder={formData.placeholder_message || 'Conte-nos como podemos ajudar você e seu pet...'}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-full bg-[#572981] text-white px-8 py-3 text-sm font-black uppercase tracking-[0.2em] shadow-[0_18px_45px_rgba(87,41,129,0.45)] hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        {formData.button_text || 'Falar com Especialistas'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Mapa – card com título */}
                    <div className="mb-20 max-w-2xl">
                        <h2 className="text-xl md:text-2xl font-black text-[#1F1235] mb-4">
                            {map.card_title || 'Onde nos encontrar'}
                        </h2>
                        <a
                            href={mapClickUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-[40px] overflow-hidden bg-[#F1EDF7] shadow-[0_26px_70px_rgba(31,18,53,0.15)] hover:shadow-[0_26px_70px_rgba(31,18,53,0.25)] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#572981] focus:ring-offset-2"
                        >
                            <div className="relative w-full">
                                <img
                                    src={mapImageSrc}
                                    alt="Localização Mundo Le Pet - Clique para abrir no Google Maps"
                                    className="w-full h-auto block"
                                    loading="lazy"
                                />
                                <div className="absolute left-6 bottom-6 bg-white rounded-3xl px-5 py-3 shadow-xl flex items-center gap-3 pointer-events-none">
                                    <div className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600">Estamos aqui!</p>
                                        <p className="text-xs text-[#572981] font-medium">Clique para abrir no Waze ou Maps.</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>
            </main>

            {/* Footer (igual ao da Home) */}
            <footer className="bg-[#572981] pt-20 pb-10 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div>
                            <div className="inline-block bg-white p-4 rounded-2xl mb-8 shadow-inner">
                                <img
                                    src={`/images/logo_reta.png?v=${version}`}
                                    alt="Mundo Le Pet Logo"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                            <p className="text-purple-200 leading-relaxed">
                                Cuidando da saúde do seu pet com o poder da natureza e da
                                ciência.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-8">Menu</h4>
                            <ul className="space-y-4 text-purple-200">
                                <li>
                                    <a href="/" className="hover:text-white transition-colors">
                                        Início
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/historia"
                                        className="hover:text-white transition-colors"
                                    >
                                        História
                                    </a>
                                </li>
                                <li>
                                    <a href="/#servicos" className="hover:text-white transition-colors">
                                        Serviços
                                    </a>
                                </li>
                                <li>
                                    <a href="/#nutricao" className="hover:text-white transition-colors">
                                        Nutrologia
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-8">Contato</h4>
                            <ul className="space-y-4 text-purple-200 text-sm">
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-teal-200 shrink-0" /> {info.phone || '(00) 00000-0000'}
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-teal-200 shrink-0" /> {info.address ? (info.city ? `${info.address} - ${info.city}` : info.address) : 'Rua dos Pets, 123 - Centro'}
                                </li>
                                <li className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-teal-200 shrink-0" /> {info.hours || 'Seg - Sex: 08:00 - 18:00'}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-8">Siga-nos</h4>
                            <div className="flex gap-4">
                                <a
                                    href={info.instagram_url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a
                                    href={info.facebook_url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                >
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

            {/* Botão flutuante WhatsApp */}
            <a
                href="https://wa.me/5500000000000"
                target="_blank"
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
}

