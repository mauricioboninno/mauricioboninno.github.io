  import { handleFooterCycling } from './footer.js';
  import { handleQuotesTyping } from './quotes.js'

  handleQuotesTyping();
  handleFooterCycling();

  const menuButton = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');

  menuButton.addEventListener('click', () => {
    const isOpen = sideMenu.classList.toggle('open');
    menuButton.innerHTML = isOpen ? '&lt;' : '&gt;';
  });