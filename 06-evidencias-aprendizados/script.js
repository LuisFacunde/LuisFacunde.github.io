document.addEventListener('DOMContentLoaded', () => {
  // 1. Redirecionamento se acessado isoladamente
  if (window.self === window.top) {
    window.location.href = '../index.html?tab=06';
  }

  // 2. Sub-tabs internas de cada Card (Atuação vs Aprendizados)
  const cards = document.querySelectorAll('.evidence-card');
  cards.forEach((card) => {
    const tabButtons = card.querySelectorAll('.tab-nav-btn');
    const panels = card.querySelectorAll('.tab-panel');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Atualizar estado ativo dos botões da sub-tab
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Mostrar o painel correspondente à sub-tab
        panels.forEach((panel) => {
          if (panel.getAttribute('data-panel') === targetTab) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  });

  // 3. Modal Lightbox de Zoom de Imagens
  const modal = document.getElementById('zoomModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('modalClose');
  const imageWrappers = document.querySelectorAll('.card-image-wrapper');

  imageWrappers.forEach((wrapper) => {
    const overlay = wrapper.querySelector('.img-overlay');
    const img = wrapper.querySelector('.card-img');
    const card = wrapper.closest('.evidence-card');
    const title = card.querySelector('.card-title').textContent;
    const period = card.querySelector('.card-period').textContent;

    const openModal = () => {
      modalImg.src = img.src;
      modalCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size: 0.85em; opacity: 0.85; margin-top: 4px; display: inline-block;">${period}</span>`;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Evita rolagem do background enquanto ampliado
    };

    // Abrir modal ao clicar no overlay de zoom da imagem
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
      });
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaura a rolagem da página
  };

  // Fechar ao clicar no botão "X"
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Fechar ao clicar no fundo escuro desfocado (fora da imagem)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (
        e.target === modal ||
        e.target === modal.querySelector('.modal-content-container')
      ) {
        closeModal();
      }
    });
  }

  // Fechar ao pressionar a tecla ESC do teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
