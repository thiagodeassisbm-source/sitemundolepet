import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Users as UsersIcon,
    Plus,
    Trash2,
    Edit3,
    Shield,
    Mail,
    User as UserIcon,
    Save,
    ArrowLeft,
    CheckCircle2,
    X,
    Eye,
    EyeOff,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Users({ users = [] }) {
    const [view, setView] = useState('list');
    const [editingUser, setEditingUser] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'Administrador',
        password: '',
        id: null,
    });

    const handleEdit = (user) => {
        setEditingUser(user);
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            role: user.role || 'Administrador',
            password: '',
            id: user.id,
        });
        setView('edit');
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (editingUser) {
            post(route('admin.users.update', { user: data.id }), {
                onSuccess: () => {
                    setView('list');
                    setEditingUser(null);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    reset();
                },
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    setView('list');
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente remover este usuário?')) {
            router.delete(route('admin.users.destroy', id), {
                onSuccess: () => {
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Gerenciar Usuários - Admin" />

            {view === 'list' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Gerenciamento de Usuários</h1>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Controle quem acessa o painel administrativo</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingUser(null);
                                clearErrors();
                                reset();
                                setView('edit');
                            }}
                            className="btn-primary py-3 px-6 flex items-center gap-2 text-sm shadow-xl shadow-purple-900/10"
                        >
                            <Plus size={18} />
                            Novo Usuário
                        </button>
                    </div>

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-3 text-emerald-600 font-bold"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Operação realizada com sucesso!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usuário</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nível de Acesso</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u) => (
                                    <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#572981]/10 flex items-center justify-center text-[#572981]">
                                                    <UserIcon size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{u.name}</p>
                                                    <p className="text-sm text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                <Shield size={12} />
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                {u.status || 'Ativo'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(u)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:bg-[#572981] hover:text-white rounded-xl transition-all"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="mb-10">
                        <button
                            onClick={() => setView('list')}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#572981] font-bold text-sm transition-colors mb-4 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para a Lista
                        </button>
                        <h1 className="text-3xl font-black text-[#572981] tracking-tight">
                            {editingUser ? 'Editar Usuário' : 'Novo Usuário Administrador'}
                        </h1>
                    </div>

                    <div className="max-w-4xl bg-white rounded-[48px] shadow-sm border border-gray-50 overflow-hidden">
                        <form onSubmit={handleSave} className="p-8 lg:p-12 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">Nome Completo</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            type="text"
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`block w-full pl-16 pr-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800 ${errors.name ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                                            placeholder="Ex: Ana Souza"
                                            required
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs font-bold ml-4 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">E-mail de Acesso</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`block w-full pl-16 pr-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800 ${errors.email ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                                            placeholder="Ex: ana@mundolepet.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs font-bold ml-4 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">Nível de Permissão</label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="block w-full px-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800 appearance-none"
                                    >
                                        <option value="Administrador">Administrador Total</option>
                                        <option value="Gestor de Conteúdo">Gestor de Conteúdo</option>
                                        <option value="Visualizador">Apenas Visualização</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">Senha {editingUser && '(Deixe em branco para manter)'}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`block w-full px-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800 ${errors.password ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                                            placeholder="••••••••"
                                            required={!editingUser}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#572981] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs font-bold ml-4 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={processing} className="w-full btn-primary py-5 rounded-[28px] flex items-center justify-center gap-3 shadow-xl shadow-purple-900/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50">
                                    {processing ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                    {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </AdminLayout>
    );
}
