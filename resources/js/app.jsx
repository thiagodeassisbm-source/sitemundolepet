import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    // Se a página enviar título, usa; senão mantém o que já está no document (Blade/servidor) para não sobrescrever com texto errado.
    title: (title) => {
        const t = (title && typeof title === 'string') ? title.trim() : '';
        if (t) return t;
        const current = window.document.getElementsByTagName('title')[0]?.innerText?.trim();
        return current || 'Mundo Le Pet';
    },
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#572981',
    },
});
