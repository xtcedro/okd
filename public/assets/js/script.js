import {
  loadFooter,
//  loadChatbot,
  // loadSearchWidget,
  loadNotifications,
  loadWebSocket,
 // loadBootScreen,
  loadTechStackSlider, // ✅ Tech stack slider
  loadSystemInfoFAB    // ✅ System Info FAB
} from './load-components.js';

import anime from 'https://cdn.skypack.dev/animejs@3.2.1';

import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { setupNavigation } from './navigation.js';
//import { runBootSequence } from './boot-sequence.js';
import { initializeTypingEffects } from './initTypingEffects.js'; // ✅ Typing engine
import { initAnimations } from './animations.js';                 // ✅ Unified animation suite

// import { applySiteTheme } from './theme.js'; // ✅ Optional: custom theming

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ✅ 1️⃣ Sovereign Kernel boot
    //await runBootSequence();

    // ✅ 2️⃣ Optionally apply your theme
    // await applySiteTheme();

    // ✅ 3️⃣ Load core dynamic components
    loadFooter();
 //   loadChatbot(marked);
    // loadSearchWidget();
    loadNotifications();
    loadWebSocket();
    setupNavigation();

    // ✅ 4️⃣ Portfolio-specific features
    loadTechStackSlider();
    loadSystemInfoFAB();

    // ✅ 5️⃣ Typing effects
    initializeTypingEffects();

    initAnimations()

    showNotification('✅ All components & animations loaded for PedroMDominguez.com', 'success');
  } catch (err) {
    console.error('❌ Error during initialization:', err);
    showNotification('❌ Something went wrong. Please refresh.', 'error');
  }
});
