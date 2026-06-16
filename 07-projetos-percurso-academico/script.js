// Redirecionamento para o portal principal quando acessado diretamente
if (window.self === window.top) {
    window.location.href = '../index.html?tab=07';
}

// ── Lógica de upload e preview de imagens dos semestres ──
document.addEventListener('DOMContentLoaded', () => {
    const fileInputs = document.querySelectorAll('.img-file-input');

    fileInputs.forEach((input) => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const previewId = input.dataset.preview;
            const labelId   = input.dataset.label;

            const previewBlock = document.getElementById(previewId);
            const label        = document.getElementById(labelId);
            const previewImg   = previewBlock.querySelector('.preview-img');

            const reader = new FileReader();
            reader.onload = (ev) => {
                previewImg.src = ev.target.result;
                previewBlock.style.display = 'block';
                label.style.display        = 'none';
            };
            reader.readAsDataURL(file);
        });
    });

    // Botões de remoção de imagem
    document.querySelectorAll('.remove-img-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId  = btn.dataset.target;
            const previewId = btn.dataset.preview;
            const labelId   = btn.dataset.label;

            const fileInput    = document.getElementById(targetId);
            const previewBlock = document.getElementById(previewId);
            const label        = document.getElementById(labelId);
            const previewImg   = previewBlock.querySelector('.preview-img');

            // Limpa o input e esconde o preview
            fileInput.value     = '';
            previewImg.src      = '';
            previewBlock.style.display = 'none';
            label.style.display        = '';
        });
    });
});
