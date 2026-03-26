import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    BarChart3,
    TrendingUp,
    MousePointer2,
    Eye,
    Zap,
    DollarSign,
    RefreshCw,
    ExternalLink,
    Search,
    Globe,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Settings,
    X,
    Save
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


export default function GoogleInsights({ isConnected: initialConnected = false, analyticsData, summary, searchData, pageSpeed, settings }) {
    const [isConnected, setIsConnected] = useState(initialConnected);
    const [showSettings, setShowSettings] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing } = useForm({
        property_id: settings?.property_id || '',
        site_url: settings?.site_url || '',
        client_id: settings?.client_id || '',
        client_secret: settings?.client_secret || '',
        redirect_uri: settings?.redirect_uri || '',
        api_key: settings?.api_key || ''
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        post('/admin/google/settings', {
            onSuccess: () => setShowSettings(false)
        });
    };

    const handleSyncNow = () => {
        if (!isConnected || isLoading) return;
        setIsLoading(true);

        router.visit(route('admin.google.insights'), {
            preserveScroll: true,
            preserveState: false,
            onFinish: () => setIsLoading(false),
        });
    };

    // Use real data from GA4 or fallback to empty
    const chartData = {
        labels: analyticsData?.labels || ['Sem Dados'],
        datasets: [
            {
                label: 'Usuários Ativos',
                data: analyticsData?.users || [0],
                borderColor: '#54B6B5',
                backgroundColor: 'rgba(84, 182, 181, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF', font: { weight: 'bold' } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF', font: { weight: 'bold' } }
            }
        }
    };

    const MetricCard = ({ icon: Icon, title, value, detail, color, trend }) => (
        <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-[32px] group hover:border-[#54B6B5]/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-opacity-10 ${color} text-opacity-100`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 font-bold text-xs ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-black text-white">{value}</h3>
                <p className="text-xs text-gray-500 font-bold mt-2">{detail}</p>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Google Insights - Admin" />

            <div className="min-h-screen -m-8 p-8 bg-[#111111] text-gray-100">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart3 className="text-[#54B6B5]" size={32} />
                            <h1 className="text-3xl font-black text-white tracking-tight italic">Site Kit <span className="text-[#54B6B5]">Plus</span></h1>
                        </div>
                        <p className="text-gray-500 font-bold">Métricas avançadas integradas diretamente do Google Cloud.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-4 bg-white/5 text-gray-400 rounded-2xl border border-white/10 hover:text-[#54B6B5] hover:border-[#54B6B5]/30 transition-all font-bold"
                            title="Configurações do Google"
                        >
                            <Settings size={20} />
                        </button>
                        {!isConnected ? (
                            <a
                                href="/admin/google/connect"
                                className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#54B6B5] hover:text-white transition-all shadow-xl shadow-white/5"
                            >
                                <Globe size={18} />
                                Conectar com Google
                            </a>
                        ) : (
                            <div className="flex items-center gap-3">
                                <a
                                    href="/admin/google/connect"
                                    className="flex items-center gap-3 bg-white/5 text-gray-400 px-6 py-4 rounded-2xl font-black text-sm border border-white/10 hover:bg-white/10 transition-all hover:text-white"
                                    title="Trocar conta do Google"
                                >
                                    <Globe size={18} />
                                    Trocar Conta
                                </a>
                                <button
                                    type="button"
                                    onClick={handleSyncNow}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 bg-white/5 text-gray-400 px-6 py-4 rounded-2xl font-black text-sm border border-white/10 hover:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                                    {isLoading ? 'Sincronizando...' : 'Sincronizar Agora'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {!isConnected ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center p-20 bg-[#1A1A1A] rounded-[48px] border border-dashed border-white/10 text-center"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                            <AlertCircle className="text-gray-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4">Acesso Não Configurado</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                            Para visualizar as métricas de tráfego, performance e receita, você precisa autorizar a conexão com sua conta Google.
                        </p>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {['Analytics', 'Search Console', 'PageSpeed', 'AdSense'].map(item => (
                                <li key={item} className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                icon={Eye}
                                title="Usuários Ativos (GA4)"
                                value={summary?.users || '0'}
                                detail={!settings?.property_id ? "⚠️ ID da Propriedade não configurado" : "Visitantes únicos nos últimos 30 dias"}
                                color="bg-blue-500"
                                trend={null}
                            />
                            <MetricCard
                                icon={MousePointer2}
                                title="Cliques (Search)"
                                value={searchData?.total_clicks || '0'}
                                detail={!settings?.site_url ? "⚠️ URL do Site não configurada" : `CTR Médio: ${searchData?.avg_ctr || '0%'}`}
                                color="bg-emerald-500"
                                trend={null}
                            />
                            <MetricCard
                                icon={Zap}
                                title="Performance Score"
                                value={pageSpeed?.score ? `${pageSpeed.score}/100` : 'N/A'}
                                detail={!settings?.site_url ? "⚠️ URL do Site não configurada" : `LCP Desktop: ${pageSpeed?.lcp || 'N/A'}`}
                                color="bg-purple-500"
                                trend={null}
                            />
                            <MetricCard
                                icon={TrendingUp}
                                title="Impressões (Search)"
                                value={searchData?.total_impressions || '0'}
                                detail={!settings?.site_url ? "⚠️ URL do Site não configurada" : "Visibilidade total no Google"}
                                color="bg-amber-500"
                                trend={null}
                            />
                        </div>

                        {/* Large Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-[#1A1A1A] p-8 rounded-[48px] border border-white/5">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-white mb-1">Crescimento de Tráfego</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Últimos 30 dias</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-black text-[#54B6B5]">30D</button>
                                        <button className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs font-black text-gray-500 transition-all">90D</button>
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-8 rounded-[48px] border border-white/5 flex flex-col">
                                <h3 className="text-xl font-black text-white mb-8">Alertas de SEO</h3>
                                <div className="space-y-6 flex-1">
                                    {[
                                        { 
                                            label: 'Performance do Site', 
                                            color: (pageSpeed?.score < 50) ? 'text-red-500' : (pageSpeed?.score < 90 ? 'text-amber-500' : 'text-emerald-500'), 
                                            desc: pageSpeed?.score ? `Pontuação: ${pageSpeed.score}/100` : 'Aguardando dados...' 
                                        },
                                        { 
                                            label: 'Taxa de Cliques (CTR)', 
                                            color: (parseFloat(searchData?.avg_ctr) < 2) ? 'text-amber-500' : 'text-emerald-500', 
                                            desc: searchData?.avg_ctr ? `Média de ${searchData.avg_ctr}` : 'Aguardando dados...' 
                                        },
                                        { 
                                            label: 'Tempo de Carregamento', 
                                            color: (parseFloat(pageSpeed?.lcp) > 2.5) ? 'text-red-500' : 'text-emerald-500', 
                                            desc: pageSpeed?.lcp ? `LCP: ${pageSpeed.lcp}` : 'Aguardando dados...' 
                                        }
                                    ].map((alert, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/5 group">
                                            <div className={`mt-1 ${alert.color}`}>
                                                <TrendingUp size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-[#54B6B5] transition-colors">{alert.label}</p>
                                                <p className="text-xs text-gray-500 font-medium">{alert.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <a 
                                    href={settings?.site_url ? `https://search.google.com/search-console?resource_id=${encodeURIComponent(settings.site_url)}` : 'https://search.google.com/search-console'} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    Ver Relatório Completo
                                </a>
                            </div>
                        </div>

                        {/* Top Queries Table */}
                        <div className="bg-[#1A1A1A] rounded-[48px] border border-white/5 overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                        <Search size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Principais Termos de Pesquisa</h3>
                                </div>
                                <button className="text-xs font-black text-[#54B6B5] uppercase underline">Search Console completo</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/[0.02]">
                                            <th className="px-8 py-5 italic">Query</th>
                                            <th className="px-8 py-5">Cliques</th>
                                            <th className="px-8 py-5">Impressões</th>
                                            <th className="px-8 py-5">CTR</th>
                                            <th className="px-8 py-5 text-right italic">Posição Média</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {searchData?.queries?.length > 0 ? (
                                            searchData.queries.map((item, i) => (
                                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-8 py-5 font-bold text-gray-300 group-hover:text-white">{item.query}</td>
                                                    <td className="px-8 py-5 text-sm font-black text-white">{item.clicks}</td>
                                                    <td className="px-8 py-5 text-sm text-gray-500">{item.impressions}</td>
                                                    <td className="px-8 py-5 text-xs font-black text-[#54B6B5]">{item.ctr}</td>
                                                    <td className="px-8 py-5 text-right font-black italic text-emerald-500 text-lg">#{item.position}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs italic">
                                                    Nenhum dado de pesquisa encontrado. Configure a URL do site.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-[#1A1A1A] rounded-[48px] border border-white/10 shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white italic">Configurações <span className="text-[#54B6B5]">Google</span></h3>
                                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveSettings} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">ID da Propriedade (GA4)</label>
                                        <input
                                            type="text"
                                            value={data.property_id}
                                            onChange={e => setData('property_id', e.target.value)}
                                            placeholder="Ex: 324567891"
                                            className="w-full bg-white/5 border-transparent rounded-2xl px-6 py-4 text-white font-bold focus:bg-white/10 focus:border-[#54B6B5] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">URL do Site (Search Console)</label>
                                        <input
                                            type="text"
                                            value={data.site_url}
                                            onChange={e => setData('site_url', e.target.value)}
                                            placeholder="Ex: https://mundolepet.com.br"
                                            className="w-full bg-white/5 border-transparent rounded-2xl px-6 py-4 text-white font-bold focus:bg-white/10 focus:border-[#54B6B5] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Google Client ID</label>
                                    <input
                                        type="text"
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="w-full bg-white/5 border-transparent rounded-2xl px-6 py-4 text-white font-bold focus:bg-white/10 focus:border-[#54B6B5] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Google Client Secret</label>
                                    <input
                                        type="password"
                                        value={data.client_secret}
                                        onChange={e => setData('client_secret', e.target.value)}
                                        className="w-full bg-white/5 border-transparent rounded-2xl px-6 py-4 text-white font-bold focus:bg-white/10 focus:border-[#54B6B5] transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Redirect URI</label>
                                        <input
                                            type="text"
                                            value={data.redirect_uri}
                                            onChange={e => setData('redirect_uri', e.target.value)}
                                            className="w-full bg-white/5 border-transparent rounded-2xl px-6 py-4 text-white font-bold focus:bg-white/10 focus:border-[#54B6B5] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">PageSpeed API Key</label>
                                        <input
                                            type="text"
                                            value={data.api_key}
                                            onChange={e => setData('api_key', e.target.value)}
                                            className="w-full bg-white/5 border-transparent rounded-2xl px-6 py-4 text-white font-bold focus:bg-white/10 focus:border-[#54B6B5] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-[#54B6B5] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#459a99] transition-all flex items-center justify-center gap-3"
                                    >
                                        {processing ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                        Salvar Configurações Reais
                                    </button>
                                    {isConnected && (
                                        <a
                                            href="/admin/google/disconnect"
                                            className="px-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                        >
                                            Desconectar Google
                                        </a>
                                    )}
                                </div>
                                
                                <a
                                    href="/admin/google/connect"
                                    className="flex w-full items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#54B6B5] hover:text-white transition-all mt-4"
                                >
                                    <Globe size={16} />
                                    Autorizar/Conectar conta Google Agora
                                </a>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
