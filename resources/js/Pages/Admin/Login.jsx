import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Heart, Lock, Mail, ChevronRight, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { loginError } = usePage().props;

    const [popupDismissed, setPopupDismissed] = useState(false);
    const hasLoginError = Boolean(loginError);
    const showPopup = hasLoginError && !popupDismissed;

    const handleSubmit = (e) => {
        e.preventDefault();
        setPopupDismissed(false);
        const form = e.target;
        router.post('/admin/login', {
            email: form.email.value,
            password: form.password.value,
            remember: form.remember?.checked ?? false,
        });
    };

    const errorMessage = loginError || 'Usuário ou senha estão incorretos. Tente novamente.';

    return (
        <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6 relative font-sans">
            <Head title="Login Admin - Mundo Le Pet" />

            {/* Popup de erro de login */}
            {showPopup && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="login-error-title">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setPopupDismissed(true)}
                    />
                    <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8">
                        <div className="flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={() => setPopupDismissed(true)}
                                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 id="login-error-title" className="text-lg font-black text-gray-800 mb-2">Login inválido</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                {errorMessage}
                            </p>
                            <button
                                type="button"
                                onClick={() => setPopupDismissed(true)}
                                className="w-full py-3 rounded-2xl bg-[#572981] text-white font-bold hover:bg-[#572981]/90 transition-colors"
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#572981]/5 rounded-full blur-[120px] overflow-hidden pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#54B6B5]/5 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md"
            >
                {/* Logo Area */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 rotate-3 border border-gray-50">
                        <Heart className="text-[#572981] fill-current w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-[#572981] tracking-tight">Mundo <span className="text-[#54B6B5]">Le Pet</span></h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Painel de Controle</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[48px] p-10 lg:p-12 shadow-2xl shadow-purple-900/5 border border-white">
                    <h2 className="text-xl font-black text-gray-800 mb-8">Acesse sua conta</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase ml-4">E-mail</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-[#572981] transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full pl-14 pr-5 py-4 bg-gray-50 border-transparent rounded-[24px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800"
                                    placeholder="Digite seu usuário"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase ml-4">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-[#572981] transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className="block w-full pl-14 pr-14 py-4 bg-gray-50 border-transparent rounded-[24px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input name="remember" type="checkbox" className="w-4 h-4 rounded border-gray-200 text-[#572981] focus:ring-[#572981]" />
                                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700">Lembrar de mim</span>
                            </label>
                            <a href="#" className="text-xs font-bold text-[#54B6B5] hover:underline">Esqueceu a senha?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-3 mt-4 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Entrar no Sistema
                            <ChevronRight size={20} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
