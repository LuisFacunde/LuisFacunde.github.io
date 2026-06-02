// Redireciona para o portal principal mantendo a tab 03 aberta se acessado diretamente
if (window.self === window.top) {
    window.location.href = '../index.html?tab=03';
}
