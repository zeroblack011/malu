// Frontend assets as strings for reliable serving
// Fallback HTML in case Workers Sites fails

export const HTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#1a1a2e">
    <title>MALU - Serviços Digitais Premium</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div style="min-height:100vh;background:#0f0f23;color:#fff;font-family:sans-serif;padding:20px;">
        <div style="max-width:1200px;margin:0 auto;">
            <header style="text-align:center;padding:40px 0;">
                <h1 style="font-size:48px;background:linear-gradient(135deg,#818cf8,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px;">MALU DIGITAL</h1>
                <p style="font-size:20px;color:#a0a0b8;margin-bottom:30px;">Serviços Digitais Premium para Empreendedores</p>
                <p style="font-size:16px;color:#6b6b8a;">LLC nos EUA, TikTok Shop, Proxies, Business Managers, Apps Personalizados e muito mais.</p>
            </header>

            <div style="text-align:center;padding:40px;background:#1a1a2e;border-radius:16px;margin:20px auto;max-width:600px;">
                <h2 style="font-size:28px;margin-bottom:20px;">Carregando Sistema...</h2>
                <p style="color:#a0a0b8;margin-bottom:30px;">Por favor aguarde enquanto carregamos todos os serviços disponíveis</p>
                <div style="width:50px;height:50px;border:4px solid #252538;border-top-color:#6366f1;border-radius:50%;margin:0 auto;animation:spin 0.8s linear infinite;"></div>
            </div>

            <style>
                @keyframes spin { to { transform: rotate(360deg); } }
            </style>
        </div>
    </div>
    <script src="/app.js"></script>
</body>
</html>
`;

// Export flag to check if assets are available
export const ASSETS_AVAILABLE = true;
