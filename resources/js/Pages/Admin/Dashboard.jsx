import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    Users,
    ShoppingCart,
    Eye,
    Video as VideoIcon,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg shadow-opacity-20`}>
                {React.cloneElement(icon, { size: 24, className: 'text-white' })}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-800">{value}</h3>
            </div>
        </div>
        {trend && (
            <div className="flex flex-col items-end">
                <span className="flex items-center text-emerald-500 font-bold text-sm">
                    <ArrowUpRight size={16} />
                    {trend}%
                </span>
                <span className="text-[10px] text-gray-300 font-bold uppercase">Este mês</span>
            </div>
        )}
    </div>
);

export default function Dashboard({ stats, recentActivity }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard - Mundo Le Pet" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Bem-vindo, Thiago! 👋</h1>
                <p className="text-gray-400 font-bold">Aqui está o resumo do que está acontecendo no Mundo Le Pet hoje.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                <StatCard
                    title="Visitas Hoje"
                    value={stats?.visits?.toLocaleString('pt-BR') || "0"}
                    icon={<Eye />}
                    trend={null}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Visitas Mês"
                    value={stats?.visits_month?.toLocaleString('pt-BR') || "0"}
                    icon={<TrendingUp />}
                    trend={null}
                    color="bg-purple-600"
                />
                <StatCard
                    title="Cliques Vídeo"
                    value={stats?.video_clicks?.toLocaleString('pt-BR') || "0"}
                    icon={<VideoIcon />}
                    trend={null}
                    color="bg-pink-500"
                />
                <StatCard
                    title="Novos Leads"
                    value={stats?.leads || "0"}
                    icon={<Users />}
                    trend={null}
                    color="bg-[#54B6B5]"
                />
                <StatCard
                    title="Agendamentos"
                    value={stats?.appointments || "0"}
                    icon={<ShoppingCart />}
                    trend={null}
                    color="bg-orange-500"
                />
            </div>

            {/* Monthly History */}
            {stats?.visits_history && stats.visits_history.length > 0 && (
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 mb-10">
                    <h3 className="text-xl font-black text-[#572981] mb-6">Histórico de Visitas (Mensal)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {stats.visits_history.map((item, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-3xl text-center hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-xl font-black text-[#572981]">{item.count.toLocaleString('pt-BR')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-[#572981]">Atividade Recente</h3>
                        <button onClick={() => window.location.href='/admin/agendamentos'} className="text-sm font-bold text-[#54B6B5] hover:underline">Ver tudo</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#572981]">
                                            {item.user[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{item.user}</p>
                                            <p className="text-xs text-gray-400">{item.action}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-[10px] font-black uppercase text-gray-300">
                                        {item.time}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-8">Nenhuma atividade recente.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#572981] to-[#452066] rounded-[40px] p-8 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                            <TrendingUp className="text-[#54B6B5]" size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 leading-tight">Dica de Crescimento</h3>
                        <p className="text-purple-100/80 text-sm leading-relaxed mb-8">
                            Seus vídeos de interatividade estão com 24% mais cliques hoje. Poste um novo vídeo sobre "Dermatologia Pet" para engajar mais clientes!
                        </p>
                        <button className="w-full bg-[#54B6B5] text-white py-4 rounded-2xl font-bold hover:bg-[#459a99] transition-all shadow-lg shadow-teal-900/40">
                            Postar Novo Vídeo
                        </button>
                    </div>
                    {/* Decorative spheres */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#54B6B5]/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </AdminLayout>
    );
}
