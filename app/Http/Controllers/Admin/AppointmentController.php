<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    /**
     * Lista todos os agendamentos para o painel administrativo.
     */
    public function index(): Response
    {
        $appointments = Appointment::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Agendamentos', [
            'appointments' => $appointments,
        ]);
    }

    /**
     * Atualiza o status de um agendamento.
     */
    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pendente,confirmado,realizado,cancelado',
        ]);

        $appointment->update(['status' => $validated['status']]);

        return back()->with('success', 'Status atualizado.');
    }
}
