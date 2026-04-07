import React, { useEffect, useState } from 'react';

import { Head, usePage } from '@inertiajs/react';
import {
    Heart,
    Star,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgendamentoModal from '@/Components/AgendamentoModal';
import { publicAsset, withFallbackAsset } from '@/lib/publicAsset';

export default function History({ cms, whatsapp }) {
    const { props } = usePage();
    const siteSeo = props?.siteSeo || {};
    const historyData = cms?.history || {};

    const googleReviewScore = historyData.google_review_score || '5,0';
    const googleReviewScoreNum = Math.max(
        0,
        Math.min(5, parseFloat(String(googleReviewScore).replace(',', '.')) || 5)
    );
    const fullStars = Math.floor(googleReviewScoreNum);
    const hasHalfStar = googleReviewScoreNum - fullStars >= 0.5;

    const ctaBtn1Label = historyData.cta_btn1 || 'Agendar uma consulta';
    const ctaBtn2Label = historyData.cta_btn2 || 'Falar no WhatsApp';
    const ctaBtn1Link = historyData.cta_btn1_link;
    const ctaBtn2Link = historyData.cta_btn2_link;
    const ctaBtn1UsePopup = historyData.cta_btn1_use_popup === '1' || historyData.cta_btn1_use_popup === true;

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
        { label: 'Contato', id: 'contato' }
    ];

    const version = new Date().getTime();
    const logoAsset = withFallbackAsset('/images/logo_reta.png');
    return (
        <div className="min-h-screen bg-[#FFF7FB] font-sans scroll-smooth">
            <AgendamentoModal open={agendamentoOpen} onClose={() => setAgendamentoOpen(false)} whatsapp={whatsapp} />
            <Head>
                <title>{`Nossa História - ${siteSeo.title || 'Mundo Le Pet'}`}</title>
                <meta name="description" content={siteSeo.description || 'Na Mundo Le Pet, oferecemos atendimento veterinário especializado em Nutrologia e Dermatologia, além de consultas clínicas, exames e vacinação em Goiânia.'} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://mundolepet.com.br/historia" />
                
                {siteSeo.favicon && (
                    <>
                        <link rel="shortcut icon" href={publicAsset(siteSeo.favicon)} />
                        <link rel="apple-touch-icon" href={publicAsset(siteSeo.favicon)} />
                        <link rel="icon" type="image/png" sizes="32x32" href={publicAsset(siteSeo.favicon)} />
                    </>
                )}
                {siteSeo.og_image_full && <meta property="og:image" content={siteSeo.og_image_full} />}
            </Head>

            {/* Navigation (mesmo menu da Home, sempre com faixa clara) */}
            <nav className={`fixed w-full z-50 glass transition-all duration-300 ${isScrolled ? 'py-3 shadow-sm' : 'py-6'}`}>
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center gap-3">
                    <div
                        className="min-w-0 flex-shrink flex items-center gap-2 cursor-pointer"
                        onClick={() => goToHomeSection('inicio')}
                    >
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

            {/* Hero */}
            <section className="relative overflow-hidden bg-[#572981] text-white">
                <div className="absolute inset-0">
                    <img
                        src={historyData.banner || historyData.bg_image || '/images/banner.png'}
                        alt="Nossa História"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#572981] via-[#572981]/80 to-transparent" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 pt-36 pb-36 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-5 py-2 mb-6 text-xs font-black tracking-[0.2em] uppercase rounded-full bg-white/15 backdrop-blur-md"
                    >
                        Desde o início
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="mb-4 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight"
                    >
                        {historyData.hero_title || 'Nossa História'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-base md:text-lg text-purple-100"
                    >
                        {historyData.hero_subtitle || 'Do sonho de cuidar à revolução da medicina natural. Conheça como transformamos a vida de milhares de pets.'}
                    </motion.p>
                </div>
            </section>

            {/* Bloco 1 – O Surgimento de uma Paixão */}
            <section className="bg-[#FFF7FB]">
                <div className="max-w-6xl px-4 mx-auto mt-10 pb-24 md:mt-16">
                    <div className="grid items-center gap-14 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative flex justify-center"
                        >
                            <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-[#FF69B4]/15 blur-3xl" />
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#54B6B5]/15 blur-3xl" />

                            <div className="relative w-full max-w-md rotate-[-3deg] rounded-[40px] bg-white shadow-[0_32px_80px_rgba(44,16,77,0.35)] overflow-hidden">
                                <img
                                    src={historyData.block1_image || '/images/banner.png'}
                                    alt="O Surgimento de uma Paixão"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-7"
                        >
                            <span className="text-xs font-black tracking-[0.25em] uppercase text-[#54B6B5]">
                                {historyData.block1_label || 'O começo'}
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-[#572981]">
                                {historyData.block1_title || 'O Surgimento de uma Paixão'}
                            </h2>
                            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
                                {historyData.block1_text || 'A nossa jornada começou há mais de 10 anos, movida por um único propósito: oferecer uma vida mais saudável e equilibrada para aqueles que nos amam incondicionalmente.'}
                            </p>

                            <div className="flex items-start gap-5 p-6 md:p-7 rounded-[28px] border border-[#FF69B4]/15 bg-[#FF69B4]/5">
                                <div className="p-3 rounded-2xl bg-white text-[#FF69B4] shadow-md">
                                    <Heart size={24} fill="currentColor" />
                                </div>
                                <div className="space-y-1.5 text-sm md:text-base">
                                    <h3 className="font-black text-[#572981]">
                                        {historyData.block1_card_title || 'Cuidado incondicional'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {historyData.block1_card_text || 'Cada pet é único e merece um olhar atento, carinhoso e totalmente voltado para a sua individualidade.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Bloco 2 – Nasce o Mundo Le Pet */}
            <section className="pb-20 bg-[#FFF7FB]">
                <div className="max-w-6xl px-4 mx-auto">
                    <div className="grid items-center gap-14 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-7"
                        >
                            <span className="text-xs font-black tracking-[0.25em] uppercase text-[#572981]">
                                {historyData.block2_label || 'A evolução'}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black leading-tight text-[#572981]">
                                {historyData.block2_title || 'Nasce o Mundo Le Pet'}
                            </h2>
                            <p className="pl-5 py-2 text-base italic leading-relaxed text-gray-600 border-l-4 border-[#54B6B5] md:text-lg">
                                {historyData.block2_quote || '"Não queríamos apenas tratar doenças, queríamos promover saúde. Foi então que decidimos dar o próximo passo."'}
                            </p>
                            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
                                {historyData.block2_text || 'O Mundo Le Pet nasceu para ser o porto seguro de tutores que buscam o melhor para seus companheiros. Unimos ciência, nutrição natural e tecnologia em um ambiente acolhedor, focado na prevenção e na qualidade de vida.'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-2 md:gap-6">
                                <div className="flex flex-col items-center justify-center w-full p-6 text-center bg-white border border-gray-100 rounded-[28px] shadow-sm">
                                    <span className="mb-1 text-3xl font-black text-[#54B6B5] md:text-4xl">
                                        {historyData.block2_stat1_val || '+10k'}
                                    </span>
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
                                        {historyData.block2_stat1_label || 'Pets atendidos'}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center w-full p-6 text-center bg-white border border-gray-100 rounded-[28px] shadow-sm">
                                    <span className="mb-1 text-3xl font-black text-[#FF69B4] md:text-4xl">
                                        {historyData.block2_stat2_val || '100%'}
                                    </span>
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
                                        {historyData.block2_stat2_label || 'Natural'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative flex justify-center"
                        >
                            <div className="absolute -top-8 right-0 w-32 h-32 rounded-full bg-[#FFD66B]/25 blur-3xl" />
                            <div className="relative w-full max-w-md rounded-[40px] bg-white shadow-[0_32px_80px_rgba(44,16,77,0.25)] overflow-hidden">
                                <img
                                    src={historyData.block2_image || '/images/banner.png'}
                                    alt="Pet confortável em casa"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Nossa Missão Hoje */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl px-4 mx-auto text-center">
                    <div className="space-y-4">
                        <span className="text-xs font-black tracking-[0.25em] uppercase text-[#54B6B5]">
                            {historyData.mission_label || 'O presente'}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#572981]">
                            {historyData.mission_title || 'Nossa Missão Hoje'}
                        </h2>
                        <div className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[#572981] to-[#54B6B5]" />
                    </div>

                    <p className="max-w-2xl mx-auto mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
                        {historyData.mission_text || 'Hoje, somos referência em cuidados especializados, unindo tecnologia de ponta com o carinho, a escuta ativa e a excelência que cada pet merece.'}
                    </p>

                    <div className="grid gap-6 mt-12 md:grid-cols-3">
                        {[
                            {
                                icon: <Sparkles />,
                                title: historyData.mission_card1_title || 'Excelência técnica',
                                text: historyData.mission_card1_text || 'Protocolos personalizados e atualizados com as melhores evidências científicas.'
                            },
                            {
                                icon: <Heart />,
                                title: historyData.mission_card2_title || 'Pilar de nutrição',
                                text: historyData.mission_card2_text || 'Planos alimentares naturais pensados para cada fase da vida do seu pet.'
                            },
                            {
                                icon: <ShieldCheck />,
                                title: historyData.mission_card3_title || 'Visão de mundo',
                                text: historyData.mission_card3_text || 'Cuidamos da saúde física, emocional e ambiental em cada atendimento.'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="h-full px-6 py-8 text-left bg-[#FFF9FF] border border-[#F0E6FF] rounded-[28px] shadow-sm"
                            >
                                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white text-[#572981] shadow-md">
                                    {React.cloneElement(item.icon, { size: 26 })}
                                </div>
                                <h3 className="mb-2 text-base font-black uppercase tracking-[0.18em] text-[#572981]">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    {item.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-20">
                <div className="relative max-w-6xl mx-auto overflow-hidden text-center bg-[#572981] rounded-[60px] md:rounded-[72px] px-6 py-16 md:px-16 md:py-20">
                    <div className="absolute top-0 right-0 w-80 h-80 -mr-40 -mt-40 rounded-full bg-white/8 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 -ml-40 -mb-40 rounded-full bg-[#54B6B5]/15 blur-3xl" />

                        <div className="relative max-w-2xl mx-auto space-y-8">
                            <h2 className="text-3xl md:text-5xl font-black leading-tight text-white">
                                {historyData.cta_title || 'Quer fazer parte da nossa história?'}
                            </h2>
                            <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row sm:gap-6">
                                {ctaBtn1UsePopup ? (
                                    <button
                                        type="button"
                                        onClick={() => setAgendamentoOpen(true)}
                                        className="w-full px-10 py-4 text-sm font-black tracking-[0.2em] uppercase bg-[#54B6B5] text-white rounded-full shadow-xl shadow-teal-900/40 hover:scale-105 active:scale-95 transition-transform sm:w-auto"
                                    >
                                        {ctaBtn1Label}
                                    </button>
                                ) : ctaBtn1Link ? (
                                    <a
                                        href={ctaBtn1Link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full px-10 py-4 text-sm font-black tracking-[0.2em] uppercase bg-[#54B6B5] text-white rounded-full shadow-xl shadow-teal-900/40 hover:scale-105 active:scale-95 transition-transform sm:w-auto"
                                    >
                                        {ctaBtn1Label}
                                    </a>
                                ) : (
                                    <button className="w-full px-10 py-4 text-sm font-black tracking-[0.2em] uppercase bg-[#54B6B5] text-white rounded-full shadow-xl shadow-teal-900/40 hover:scale-105 active:scale-95 transition-transform sm:w-auto">
                                        {ctaBtn1Label}
                                    </button>
                                )}
                                {ctaBtn2Link ? (
                                    <a
                                        href={ctaBtn2Link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full px-10 py-4 text-sm font-black tracking-[0.2em] uppercase text-white border border-white/25 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors sm:w-auto"
                                    >
                                        {ctaBtn2Label}
                                    </a>
                                ) : (
                                    <button className="w-full px-10 py-4 text-sm font-black tracking-[0.2em] uppercase text-white border border-white/25 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors sm:w-auto">
                                        {ctaBtn2Label}
                                    </button>
                                )}
                            </div>
                        </div>
                </div>
            </section>

            {/* Avaliação Google */}
            <section className="pb-16 bg-white">
                <div className="max-w-4xl px-4 mx-auto">
                    {historyData.google_review_url ? (
                        <a
                            href={historyData.google_review_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-between gap-4 p-6 rounded-3xl bg-[#F8F4FF] border border-[#E2D9FF] md:flex-row transition-all hover:border-[#572981]/40 hover:shadow-lg hover:shadow-[#572981]/10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#4285F4] shadow-sm">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-[0.2em] uppercase text-[#572981]">
                                        {historyData.google_review_title || 'Avaliado no Google'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {historyData.google_review_subtitle || 'Histórias reais de tutores que confiam no Mundo Le Pet.'}
                                    </p>
                                    <p className="text-xs font-bold text-[#54B6B5] mt-1">
                                        {historyData.google_review_cta_text || 'Clique para avaliar →'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-[#572981]">
                                    {googleReviewScore}
                                </span>
                                <div className="flex items-center gap-0.5">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <span key={i} className="relative inline-block w-[18px] h-[18px]">
                                            {i < fullStars ? (
                                                <Star size={18} className="text-[#FFD700]" fill="currentColor" />
                                            ) : i === fullStars && hasHalfStar ? (
                                                <>
                                                    <Star size={18} className="text-gray-300" fill="currentColor" />
                                                    <Star size={18} className="absolute left-0 top-0 text-[#FFD700]" fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                                                </>
                                            ) : (
                                                <Star size={18} className="text-gray-300" fill="currentColor" />
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    ) : (
                        <div className="flex flex-col items-center justify-between gap-4 p-6 rounded-3xl bg-[#F8F4FF] border border-[#E2D9FF] md:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#4285F4] shadow-sm">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-[0.2em] uppercase text-[#572981]">
                                        {historyData.google_review_title || 'Avaliado no Google'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {historyData.google_review_subtitle || 'Histórias reais de tutores que confiam no Mundo Le Pet.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-[#572981]">
                                    {googleReviewScore}
                                </span>
                                <div className="flex items-center gap-0.5">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <span key={i} className="relative inline-block w-[18px] h-[18px]">
                                            {i < fullStars ? (
                                                <Star size={18} className="text-[#FFD700]" fill="currentColor" />
                                            ) : i === fullStars && hasHalfStar ? (
                                                <>
                                                    <Star size={18} className="text-gray-300" fill="currentColor" />
                                                    <Star size={18} className="absolute left-0 top-0 text-[#FFD700]" fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                                                </>
                                            ) : (
                                                <Star size={18} className="text-gray-300" fill="currentColor" />
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
