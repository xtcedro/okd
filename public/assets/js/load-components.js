import { initializeChatbot } from './chatbot.js';

// Load Footer
export function loadFooter() {
  fetch('../../components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Load Chatbot and Initialize It
export function loadChatbot(marked) {
  return fetch('../../components/chatbot.html')
    .then(response => response.text())
    .then(data => {
      const container = document.createElement('div');
      container.innerHTML = data;
      document.body.appendChild(container);
      initializeChatbot(marked); // ✅ Initialize after injecting HTML
    })
    .catch(error => console.error('Error loading chatbot:', error));
}
