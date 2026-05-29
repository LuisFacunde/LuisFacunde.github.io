let activeTab = 'home';

function switchTab(tabId) {
    activeTab = tabId;

    // Alternar estado das abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Alternar exibição dos painéis de conteúdo
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === `pane-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Carregar iframe sob demanda (Lazy Loading de alto desempenho)
    if (tabId !== 'home') {
        const iframe = document.getElementById(`iframe-${tabId}`);
        if (iframe && !iframe.src) {
            iframe.src = iframe.getAttribute('data-src');
            
            // Manipular o conteúdo do iframe quando carregar
            iframe.onload = () => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    // Injetar estilo CSS para esconder cabeçalhos/rodapés repetitivos
                    const style = doc.createElement('style');
                    style.textContent = `
                        header, nav, footer, .main-header, .main-footer, .top-accent-bar {
                            display: none !important;
                        }
                        body {
                            padding: 30px !important;
                            margin: 0 !important;
                            background-color: var(--bg-card, #ffffff) !important;
                            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                        }
                        main {
                            max-width: 1000px !important;
                            margin: 0 auto !important;
                        }
                    `;
                    doc.head.appendChild(style);

                    // Mapear links internos nas páginas filhas para navegar nas abas do pai
                    doc.querySelectorAll('a').forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.includes('../')) {
                            link.addEventListener('click', function(e) {
                                e.preventDefault();
                                const parts = href.split('/').filter(Boolean);
                                const folder = parts.find(p => p.match(/^\d{2}-/));
                                if (folder) {
                                    const num = folder.split('-')[0];
                                    switchTab(num);
                                } else if (href.includes('index.html') && parts.length === 1) {
                                    switchTab('home');
                                }
                            });
                        }
                    });
                } catch (e) {
                    console.log("Aviso: Restrições de segurança do iframe local impediram a injeção de estilo. Funciona normalmente em fallback.", e);
                }
            };
        }
    }

    // Sincronizar o URL real com query param (?tab=XX) de forma invisível
    const newUrl = tabId === 'home' 
        ? window.location.pathname 
        : `?tab=${tabId}`;
    window.history.replaceState(null, '', newUrl);

    // Rolar a página suavemente para focar na aba se o usuário já estiver navegando
    if (tabId !== 'home') {
        document.querySelector('.tabs-system').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Inicializar e configurar escutas
document.addEventListener('DOMContentLoaded', () => {
    // Cliques nas abas fixas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Arrastar com o mouse para rolar as abas horizontalmente (desktop click-to-drag)
    const tabsNav = document.getElementById('portfolio-tabs');
    if (tabsNav) {
        let isDown = false;
        let startX;
        let scrollLeft;

        tabsNav.addEventListener('mousedown', (e) => {
            isDown = true;
            tabsNav.classList.add('dragging');
            startX = e.pageX - tabsNav.offsetLeft;
            scrollLeft = tabsNav.scrollLeft;
        });

        tabsNav.addEventListener('mouseleave', () => {
            isDown = false;
            tabsNav.classList.remove('dragging');
        });

        tabsNav.addEventListener('mouseup', () => {
            isDown = false;
            tabsNav.classList.remove('dragging');
        });

        tabsNav.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tabsNav.offsetLeft;
            const walk = (x - startX) * 1.5; // Ajuste de velocidade de arrasto
            tabsNav.scrollLeft = scrollLeft - walk;
        });
    }

    // Ler parâmetros de inicialização (?tab=0X) na carga da página
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab && ['01','02','03','04','05','06','07','08','09'].includes(initialTab)) {
        switchTab(initialTab);
    }
});
