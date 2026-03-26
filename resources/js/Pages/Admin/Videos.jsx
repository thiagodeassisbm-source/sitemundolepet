import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
    Video,
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    PlayCircle,
    Save,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultVideos = [
    { id: "ur3d92sVvIw", title: "Conheça o Mundo Le Pet", category: "Institucional", summary: "" },
    { id: "M7lc1UVf-VE", title: "Benefícios da Alimentação Natural", category: "Dicas", summary: "" },
    { id: "dQw4w9WgXcQ", title: "Dicas de Dermatologia Pet", category: "Saúde", summary: "" },
];

export default function Videos({ videos: videosProp }) {
    const initial = Array.isArray(videosProp) && videosProp.length > 0 ? videosProp : defaultVideos;
    const [view, setView] = useState('list');
    const [videos, setVideos] = useState(initial);
    useEffect(() => {
        setVideos(Array.isArray(videosProp) && videosProp.length > 0 ? videosProp : defaultVideos);
    }, [videosProp]);

    const [editingVideo, setEditingVideo] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', youtubeId: '', summary: '' });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleEdit = (video) => {
        setEditingVideo(video);
        setEditForm({
            title: video.title,
            youtubeId: video.id,
            summary: video.summary || ''
        });
        setView('edit');
    };

    const persistVideos = (newList) => {
        router.post(route('admin.videos.store'), { videos: newList }, {
            preserveScroll: true,
            onSuccess: () => {
                setVideos(newList);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        let newList;
        if (editingVideo) {
            newList = videos.map(v =>
                v.id === editingVideo.id
                    ? { ...v, title: editForm.title, id: editForm.youtubeId, summary: editForm.summary || '', category: v.category || 'Institucional' }
                    : v
            );
        } else {
            newList = [...videos, {
                id: editForm.youtubeId,
                title: editForm.title,
                summary: editForm.summary || '',
                category: "Novo",
            }];
        }
        setView('list');
        setEditingVideo(null);
        persistVideos(newList);
    };

    const handleDelete = (id) => {
        if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
        const newList = videos.filter(v => v.id !== id);
        setVideos(newList);
        persistVideos(newList);
    };

    return (
        <AdminLayout>
            <Head title="Vídeos e Interatividade - Admin" />

            {view === 'list' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Vídeos / Interatividade</h1>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Gerencie a galeria de vídeos do site</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingVideo(null);
                                setEditForm({ title: '', youtubeId: '', summary: '' });
                                setView('edit');
                            }}
                            className="btn-primary py-3 px-6 flex items-center gap-2 text-sm shadow-xl shadow-purple-900/10"
                        >
                            <Plus size={18} />
                            Adicionar Novo Vídeo
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
                                Galeria atualizada com sucesso!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => (
                            <div key={video.id} className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 group flex flex-col">
                                {/* Thumbnail Preview */}
                                <div className="relative aspect-video mb-6 rounded-[32px] overflow-hidden bg-gray-900 border border-gray-100 relative group/thumb">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                                        className="w-full h-full object-cover opacity-80 group-hover/thumb:scale-110 transition-transform duration-500"
                                        alt={video.title}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" size={48} />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#54B6B5] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            {video.category}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-gray-800 mb-2 truncate px-2">{video.title}</h3>
                                <div className="flex items-center gap-2 mb-6 px-2">
                                    <Video size={14} className="text-[#572981]" />
                                    <code className="text-xs text-gray-400 font-bold">{video.id}</code>
                                </div>

                                <div className="mt-auto flex gap-2">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="flex-1 bg-gray-50 hover:bg-[#572981] hover:text-white text-[#572981] py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={14} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="w-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <a
                                        href={`https://youtube.com/watch?v=${video.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 bg-gray-50 text-gray-400 hover:bg-white hover:shadow-lg rounded-2xl flex items-center justify-center transition-all"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
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
                            Voltar para a Galeria
                        </button>
                        <h1 className="text-3xl font-black text-[#572981] tracking-tight">
                            {editingVideo ? 'Editar Vídeo' : 'Novo Vídeo'}
                        </h1>
                    </div>

                    <div className="bg-white rounded-[48px] shadow-sm border border-gray-50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Form Side */}
                            <div className="p-8 lg:p-12 border-r border-gray-50">
                                <form onSubmit={handleSave} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">Título do Vídeo</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="block w-full px-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800 text-lg"
                                            placeholder="Ex: Como cuidar do seu pet no verão"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">ID do Vídeo (YouTube)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                autoComplete="off"
                                                value={editForm.youtubeId}
                                                onChange={(e) => setEditForm({ ...editForm, youtubeId: e.target.value })}
                                                className="block w-full px-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800"
                                                placeholder="Ex: ur3d92sVvIw"
                                                required
                                            />
                                            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase ml-4 leading-relaxed tracking-widest">
                                                Dica: O ID é o código que aparece após "v=" na URL do YouTube.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase ml-4 tracking-widest">Resumo Curto</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            value={editForm.summary}
                                            onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                                            className="block w-full px-8 py-5 bg-gray-50 border-transparent rounded-[28px] focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-[#572981] transition-all font-bold text-gray-800"
                                            placeholder="Ex: Aprenda sobre os nutrientes essenciais."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full btn-primary py-5 rounded-[28px] flex items-center justify-center gap-3 shadow-xl shadow-purple-900/10 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Save size={20} />
                                            {editingVideo ? 'Salvar Alterações' : 'Adicionar Vídeo'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Preview Side */}
                            <div className="p-8 lg:p-12 bg-gray-50/50 flex flex-col items-center justify-center text-center">
                                {editForm.youtubeId ? (
                                    <div className="w-full space-y-6">
                                        <h3 className="text-sm font-black text-[#572981] uppercase tracking-widest">Pré-visualização do Player</h3>
                                        <div className="w-full aspect-video rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-black">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${editForm.youtubeId}`}
                                                title="Preview"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        <p className="text-xs text-gray-400 font-bold">Verifique se o vídeo carrega corretamente.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                            <Video className="text-gray-200" size={32} />
                                        </div>
                                        <p className="text-gray-400 font-bold text-sm">Insira um ID do YouTube para <br /> gerar a pré-visualização.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AdminLayout>
    );
}
