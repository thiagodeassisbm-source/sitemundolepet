import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Calendar, Mail, Phone, User, PawPrint, Clock } from 'lucide-react';

const statusColors = {
    pendente: 'bg-amber-100 text-amber-800',
    confirmado: 'bg-[#54B6B5]/20 text-[#54B6B5]',
    realizado: 'bg-emerald-100 text-emerald-800',
    cancelado: 'bg-gray-100 text-gray-600',
};

const STATUS_OPTIONS = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'realizado', label: 'Realizado' },
    { value: 'cancelado', label: 'Cancelado' },
];

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function Agendamentos({ appointments: appointmentsProp }) {
    const appointments = Array.isArray(appointmentsProp) ? appointmentsProp : [];
    const [updatingId, setUpdatingId] = useState(null);

    const handleStatusChange = (appointmentId, newStatus) => {
        setUpdatingId(appointmentId);
        router.patch(route('admin.agendamentos.update', appointmentId), { status: newStatus }, {
            preserveScroll: true,
            onFinish: () => setUpdatingId(null),
        });
    };

    return (
        <AdminLayout>
            <Head title="Agendamentos - Mundo Le Pet" />
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#572981] mb-2 tracking-tight">Agendamentos</h1>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                    Lista de solicitações de agendamento enviadas pelo site
                </p>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                {appointments.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#572981]/10 flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-[#572981]" />
                        </div>
                        <p className="text-gray-500 font-bold text-lg mb-2">Nenhum agendamento ainda</p>
                        <p className="text-gray-400 text-sm">Os agendamentos preenchidos no formulário "Agendar Agora" aparecerão aqui.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-200 bg-gray-50/80">
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Nome / E-mail</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Telefone / Pet</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Data do agendamento</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Enviado em</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Mensagem</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((a) => (
                                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50/50 align-top">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#572981]/10 flex items-center justify-center shrink-0">
                                                    <User className="w-5 h-5 text-[#572981]" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#1F1235]">{a.name}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail size={14} /> {a.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {a.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone size={14} /> {a.phone}
                                                </span>
                                            )}
                                            {a.pet_name && (
                                                <span className="flex items-center gap-1 mt-1">
                                                    <PawPrint size={14} /> {a.pet_name}
                                                    {a.pet_type && ` (${a.pet_type})`}
                                                </span>
                                            )}
                                            {!a.phone && !a.pet_name && '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="flex items-center gap-1 text-[#1F1235] font-medium">
                                                <Calendar size={16} className="text-[#572981] shrink-0" />
                                                {a.preferred_date ? formatDate(a.preferred_date) : '—'}
                                                {a.preferred_time && (
                                                    <span className="text-gray-500 font-normal"> · {a.preferred_time}</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[a.status] || statusColors.pendente}`}>
                                                {STATUS_OPTIONS.find((o) => o.value === a.status)?.label || a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {formatDateTime(a.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                            {a.message ? <span className="line-clamp-2" title={a.message}>{a.message}</span> : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={a.status}
                                                onChange={(e) => handleStatusChange(a.id, e.target.value)}
                                                disabled={updatingId === a.id}
                                                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white font-medium text-[#1F1235] focus:ring-2 focus:ring-[#572981]/30 focus:border-[#572981] disabled:opacity-60"
                                            >
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {updatingId === a.id && (
                                                <span className="ml-2 text-xs text-gray-400">Salvando...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
