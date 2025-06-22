import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import {HeroUIProvider} from "@heroui/react";
import { Toaster } from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <HeroUIProvider>
                <Toaster position="top-right" />
                <App {...props} />
            </HeroUIProvider>
        );
    },
    progress: {
        color: "#1b096c",
        showSpinner: true,
    },
});
