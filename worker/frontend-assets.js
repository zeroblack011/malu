// Frontend assets as strings for reliable serving

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
    <div id="root" style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0f0f23;color:#fff;font-family:sans-serif;">
        <div style="text-align:center;padding:40px;">
            <h1 style="font-size:48px;background:linear-gradient(135deg,#818cf8,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">MALU DIGITAL</h1>
            <p style="font-size:18px;color:#a0a0b8;margin:20px 0;">Sistema de Serviços Digitais Premium</p>
            <div style="background:#1a1a2e;padding:30px;border-radius:16px;margin-top:30px;max-width:500px;">
                <h2 style="margin-bottom:20px;">Criar Conta</h2>
                <form id="registerForm" style="display:flex;flex-direction:column;gap:15px;">
                    <input type="text" id="regName" placeholder="Nome completo" required style="padding:14px;background:#252538;border:2px solid #2d2d44;border-radius:10px;color:#fff;font-size:15px;">
                    <input type="email" id="regEmail" placeholder="Email" required style="padding:14px;background:#252538;border:2px solid #2d2d44;border-radius:10px;color:#fff;font-size:15px;">
                    <input type="tel" id="regPhone" placeholder="Telefone" required style="padding:14px;background:#252538;border:2px solid #2d2d44;border-radius:10px;color:#fff;font-size:15px;">
                    <button type="submit" style="padding:16px;background:#6366f1;color:white;border:none;border-radius:10px;font-size:18px;font-weight:700;cursor:pointer;">Começar Agora</button>
                </form>
            </div>
        </div>
    </div>
    <script src="/app.js"></script>
</body>
</html>
`;

// Export flag to check if assets are available
export const ASSETS_AVAILABLE = true;
