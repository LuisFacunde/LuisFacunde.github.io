function loadIframe(sectionId) {
    if (sectionId !== 'home') {
        const iframe = document.getElementById(`iframe-${sectionId}`);
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

                    // Mapear links internos nas páginas filhas para navegar nas seções do pai
                    doc.querySelectorAll('a').forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.includes('../')) {
                            link.addEventListener('click', function(e) {
                                e.preventDefault();
                                const parts = href.split('/').filter(Boolean);
                                const folder = parts.find(p => p.match(/^\d{2}-/));
                                if (folder) {
                                    const num = folder.split('-')[0];
                                    toggleSection(num, true); // Força a abertura da seção target
                                } else if (href.includes('index.html') && parts.length === 1) {
                                    toggleSection('home', true);
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
}

function toggleSection(sectionId, forceOpen = false) {
    const section = document.getElementById(`section-${sectionId}`);
    if (!section) return;

    const isExpanded = section.classList.contains('expanded');

    if (isExpanded && !forceOpen) {
        // Se já está aberto e não foi forçado a abrir, colapsa a seção
        section.classList.remove('expanded');
        section.querySelector('.section-trigger').setAttribute('aria-expanded', 'false');
        updateUrl('home');
    } else {
        // Recolher todas as outras seções abertas
        document.querySelectorAll('.collapsible-section').forEach(s => {
            if (s.id !== `section-${sectionId}`) {
                s.classList.remove('expanded');
                s.querySelector('.section-trigger').setAttribute('aria-expanded', 'false');
            }
        });

        // Expandir a seção desejada
        section.classList.add('expanded');
        section.querySelector('.section-trigger').setAttribute('aria-expanded', 'true');

        // Carregar o iframe correspondente
        loadIframe(sectionId);

        // Atualizar URL query param (?tab=XX) mantendo retrocompatibilidade
        updateUrl(sectionId);

        // Rolar a página suavemente para focar no cabeçalho da seção expandida
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    }
}

function updateUrl(sectionId) {
    const newUrl = sectionId === 'home' 
        ? window.location.pathname 
        : `?tab=${sectionId}`;
    window.history.replaceState(null, '', newUrl);
}

// Inicializar e configurar escutas
document.addEventListener('DOMContentLoaded', () => {
    // Cliques nos gatilhos das seções
    document.querySelectorAll('.section-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const sectionId = trigger.getAttribute('data-section');
            toggleSection(sectionId);
        });
    });

    // Ler parâmetros de inicialização (?tab=0X) na carga da página
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab && ['01','02','03','04','05','06','07','08','09'].includes(initialTab)) {
        // Se houver parâmetro, abre a seção indicada e colapsa a de Apresentação
        toggleSection(initialTab, true);
    } else {
        // Caso contrário, garante que a de Apresentação inicia aberta
        toggleSection('home', true);
    }
});
