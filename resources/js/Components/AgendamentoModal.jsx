import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, Calendar, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PET_TYPES = [
    { value: '', label: 'Selecione' },
    { value: 'cão', label: 'Cão' },
    { value: 'gato', label: 'Gato' },
    { value: 'outro', label: 'Outro' },
];

const SUCCESS_MESSAGE = 'Seu pedido de agendamento foi salvo! Agora vamos te direcionar para nosso WhatsApp para confirmar seu agendamento!';

/** Formata número para wa.me: só dígitos; se não começar com 55, adiciona (Brasil). */
function formatWhatsAppNumber(raw) {
    if (!raw || typeof raw !== 'string') return '';
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) return '';
    return digits.startsWith('55') ? digits : `55${digits}`;
}

/** Monta a mensagem do agendamento para enviar no WhatsApp. */
function buildWhatsAppMessage(form) {
    const lines = [
        '*Novo agendamento pelo site*',
        '',
        `Nome: ${form.name || '-'}`,
        `E-mail: ${form.email || '-'}`,
        `Telefone / WhatsApp: ${form.phone || '-'}`,
        `Nome do pet: ${form.pet_name || '-'}`,
        `Espécie: ${form.pet_type || '-'}`,
        `Data desejada: ${form.preferred_date || '-'}`,
        `Melhor horário: ${form.preferred_time || '-'}`,
        form.message ? `Mensagem: ${form.message}` : '',
    ].filter(Boolean);
    return lines.join('\n');
}

export default function AgendamentoModal({ open, onClose, whatsapp: whatsappProp }) {
    const [sending, setSending] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [pendingWhatsAppUrl, setPendingWhatsAppUrl] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        pet_name: '',
        pet_type: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        const payload = {
            ...form,
            preferred_date: form.preferred_date || null,
        };
        const formSnapshot = { ...form };
        router.post(route('agendamento.store'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                let url = null;
                const num = formatWhatsAppNumber(whatsappProp);
                if (num) {
                    const text = encodeURIComponent(buildWhatsAppMessage(formSnapshot));
                    url = `https://wa.me/${num}?text=${text}`;
                }
                setPendingWhatsAppUrl(url);
                setForm({ name: '', email: '', phone: '', pet_name: '', pet_type: '', preferred_date: '', preferred_time: '', message: '' });
                setShowSuccessPopup(true);
            },
            onFinish: () => setSending(false),
        });
    };

    const closeSuccessAndModal = () => {
        if (pendingWhatsAppUrl) {
            window.open(pendingWhatsAppUrl, '_blank', 'noopener,noreferrer');
            setPendingWhatsAppUrl(null);
        }
        setShowSuccessPopup(false);
        onClose();
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Popup de sucesso */}
                <AnimatePresence>
                    {showSuccessPopup && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#1F1235]/70 backdrop-blur-sm z-10 flex items-center justify-center p-4"
                                onClick={closeSuccessAndModal}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative z-20 w-full max-w-md bg-white rounded-[32px] shadow-[0_30px_80px_rgba(87,41,129,0.4)] p-8 text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <p className="text-5xl mb-4">❤️</p>
                                <p className="text-[#1F1235] font-bold text-lg leading-snug mb-6 uppercase">
                                    {SUCCESS_MESSAGE}
                                </p>
                                <button
                                    type="button"
                                    onClick={closeSuccessAndModal}
                                    className="btn-primary px-8 py-3 rounded-2xl"
                                >
                                    OK
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#1F1235]/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-white rounded-[32px] shadow-[0_30px_80px_rgba(87,41,129,0.35)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-[#572981] text-white px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-[#FFBBD9]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight">Agendar Agora</h2>
                                <p className="text-sm text-white/80">Preencha os dados para solicitar seu agendamento</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nome completo</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                placeholder="Como podemos chamar você?"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">E-mail</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Telefone / WhatsApp</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                    placeholder="(62) 99999-9999"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nome do pet</label>
                                <input
                                    type="text"
                                    value={form.pet_name}
                                    onChange={(e) => handleChange('pet_name', e.target.value)}
                                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                    placeholder="Ex: Thor, Luna"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Espécie</label>
                                <select
                                    value={form.pet_type}
                                    onChange={(e) => handleChange('pet_type', e.target.value)}
                                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                >
                                    {PET_TYPES.map((opt) => (
                                        <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Data desejada</label>
                                <input
                                    type="date"
                                    value={form.preferred_date}
                                    onChange={(e) => handleChange('preferred_date', e.target.value)}
                                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Melhor horário</label>
                                <input
                                    type="text"
                                    value={form.preferred_time}
                                    onChange={(e) => handleChange('preferred_time', e.target.value)}
                                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/60 px-4 text-[#1F1235] font-medium focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                    placeholder="Ex: Manhã, 14h"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Mensagem (opcional)</label>
                            <textarea
                                rows={3}
                                value={form.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-[#1F1235] font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#572981]/40 focus:border-[#572981]"
                                placeholder="Conte brevemente o motivo do agendamento ou dúvidas..."
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-12 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={sending}
                                className="flex-1 btn-primary h-12 rounded-2xl flex items-center justify-center gap-2 shadow-[0_18px_45px_rgba(87,41,129,0.35)]"
                            >
                                <Send className="w-5 h-5" />
                                {sending ? 'Enviando...' : 'Enviar agendamento'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
