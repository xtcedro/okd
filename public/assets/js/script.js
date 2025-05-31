import { loadFooter, loadChatbot } from './load-components.js';
import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { setupNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFooter();
  loadChatbot(marked); // ⬅️ initializes chatbot internally
  setupNavigation();
});
