import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    Video,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    ChevronRight,
    Heart,
    ChevronDown,
    Users,
    BarChart3,
    BookOpen,
    History,
    Mail,
    CalendarCheck,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children, user = { name: 'Admin Mundo Le Pet', email: 'contato@mundolepet.com' } }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({});
    const { props } = usePage();
    const agendamentosPendentes = Number(props?.agendamentosPendentesCount ?? 0);
    const hasNovoAgendamento = agendamentosPendentes > 0;

    const toggleMenu = (label) => {
        setOpenMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const menuItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin/dashboard' },
        { label: 'Conteúdo Home', icon: <FileText size={20} />, href: '/admin/content' },
        { label: 'Agendamentos', icon: <CalendarCheck size={20} />, href: '/admin/agendamentos' },
        {
            label: 'Páginas',
            icon: <BookOpen size={20} />,
            href: '#',
            subItems: [
                { label: 'História', icon: <History size={18} />, href: '/admin/pages/history' },
                { label: 'Contatos', icon: <Mail size={18} />, href: '/admin/pages/contact' }
            ]
        },
        { label: 'Interatividade', icon: <Video size={20} />, href: '/admin/videos' },
        { label: 'Google Insights', icon: <BarChart3 size={20} />, href: '/admin/google/insights' },
        {
            label: 'Configurações',
            icon: <Settings size={20} />,
            href: '#',
            subItems: [
                { label: 'Site e Google', icon: <Globe size={18} />, href: '/admin/settings/site' },
                { label: 'Usuários', icon: <Users size={18} />, href: '/admin/users' }
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FD] flex font-sans">
            {/* Sidebar */}
            <aside className={`bg-[#572981] text-white fixed left-0 top-0 h-screen z-50 transition-all duration-300 flex flex-col min-w-0 ${isSidebarOpen ? 'w-64 min-w-[14rem]' : 'w-20'}`}>
                <div className="p-4 flex items-center justify-between flex-shrink-0 min-w-0">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="bg-white p-1 rounded-lg flex-shrink-0">
                                <Heart className="text-[#572981] fill-current w-5 h-5" />
                            </div>
                            <span className="font-black text-lg tracking-tight truncate">Admin <span className="text-[#54B6B5]">Pet</span></span>
                        </div>
                    ) : (
                        <Heart className="mx-auto flex-shrink-0" />
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden flex-shrink-0 p-1">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
                    <div className="mt-1 flex-1 min-h-0 overflow-y-auto overflow-x-visible py-2 overscroll-contain">
                        <div className="px-3 space-y-0.5 w-full min-w-[13rem] pb-2">
                            {menuItems.map((item) => (
                                <div key={item.label} className="space-y-0.5">
                                    {item.subItems ? (
                                        <button
                                            onClick={() => toggleMenu(item.label)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/10 group min-w-0 ${!isSidebarOpen && 'justify-center'}`}
                                        >
                                            <span className="text-[#54B6B5] group-hover:text-white transition-colors flex-shrink-0 w-6 flex justify-center">
                                                {React.cloneElement(item.icon, { size: 22 })}
                                            </span>
                                            {isSidebarOpen && <span className="font-normal text-sm tracking-tight truncate flex-1 text-left">{item.label}</span>}
                                            {isSidebarOpen && (
                                                <ChevronDown
                                                    size={16}
                                                    className={`flex-shrink-0 transition-transform duration-300 ${openMenus[item.label] ? 'rotate-180' : ''}`}
                                                />
                                            )}
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/10 group min-w-0 ${!isSidebarOpen && 'justify-center'}`}
                                        >
                                            <span className="text-[#54B6B5] group-hover:text-white transition-colors flex-shrink-0 w-6 flex justify-center">
                                                {React.cloneElement(item.icon, { size: 22 })}
                                            </span>
                                            {isSidebarOpen && <span className="font-normal text-sm tracking-tight truncate flex-1">{item.label}</span>}
                                        </Link>
                                    )}

                                    <AnimatePresence>
                                        {item.subItems && openMenus[item.label] && isSidebarOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="pl-4 pr-2 pt-0.5 pb-1 space-y-0.5"
                                                style={{ overflow: 'visible' }}
                                            >
                                                {item.subItems.map((sub) => (
                                                    <Link
                                                        key={sub.label}
                                                        href={sub.href}
                                                        className="flex items-center gap-3 py-2.5 pl-3 pr-2 rounded-xl transition-all hover:bg-white/10 group text-white/90 hover:text-white min-w-0 w-full"
                                                    >
                                                        <span className="text-[#54B6B5] group-hover:text-white transition-colors flex-shrink-0 w-[18px] flex justify-center">
                                                            {React.cloneElement(sub.icon, { size: 18 })}
                                                        </span>
                                                        <span className="font-normal text-sm tracking-tight truncate flex-1">{sub.label}</span>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="flex-shrink-0 border-t border-white/10 px-3 py-3 mt-auto">
                    <Link
                        href="/admin/login"
                        className={`flex items-center gap-3 p-3 rounded-xl w-full bg-red-500/10 text-red-100 hover:bg-red-500 hover:text-white transition-all min-w-0 ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <span className="flex-shrink-0 w-6 flex justify-center">
                            <LogOut size={20} />
                        </span>
                        {isSidebarOpen && <span className="font-bold text-sm truncate flex-1">Sair</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Menu size={20} />
                        </button>
                        <h2 className="font-black text-[#572981] text-lg uppercase tracking-widest">Painel Administrativo</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/agendamentos"
                            className={`relative p-2 rounded-lg transition-colors ${hasNovoAgendamento ? 'text-[#572981]' : 'text-gray-400 hover:text-[#572981]'}`}
                            title={hasNovoAgendamento ? `${agendamentosPendentes} novo(s) agendamento(s)` : 'Agendamentos'}
                        >
                            <Bell size={20} className={hasNovoAgendamento ? 'animate-swing' : ''} />
                            {hasNovoAgendamento && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-blink-dot" />
                            )}
                        </Link>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-gray-800 leading-none mb-1">{user.name}</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Administrador</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#572981] to-[#54B6B5] p-0.5 shadow-lg">
                                <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center bg-gray-100 overflow-hidden">
                                    <User className="text-gray-400" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
