<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Store a new appointment (public form submission).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:30',
            'pet_name' => 'nullable|string|max:255',
            'pet_type' => 'nullable|string|in:cão,gato,outro',
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:2000',
        ]);

        Appointment::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Agendamento enviado com sucesso! Em breve entraremos em contato.']);
        }

        return back()->with('success', 'Agendamento enviado com sucesso!');
    }
}
