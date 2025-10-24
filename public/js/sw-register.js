// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');

            console.log('Service Worker registered:', registration);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available
                        showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });

    // Show update notification
    function showUpdateNotification() {
        const notification = `
            <div class="update-notification">
                <div class="update-content">
                    <span>🎉</span>
                    <div class="update-text">
                        <strong>Nova versão disponível!</strong>
                        <small>Atualize para obter as últimas melhorias</small>
                    </div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="updateApp()">Atualizar</button>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = notification;
        document.body.appendChild(div.firstElementChild);
    }

    // Update app
    window.updateApp = () => {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });

                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });
            }
        });
    };
}
