/* ===== SCRIPT: deixa a página interativa ===== */

var EMAIL = 'tiago.masaro@alunos.ifsuldeminas.edu.br';

/* ----- Tema claro/escuro ----- */
var root = document.documentElement, tb = document.getElementById('theme');
function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches }
function paint() { tb.textContent = isDark() ? '☀' : '☾' }
try { var s = localStorage.getItem('tema'); if (s) root.setAttribute('data-theme', s) } catch (e) { }
paint();
tb.onclick = function () {
    var n = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('tema', n) } catch (e) { }
    paint();
};

/* ----- 01 Menu do celular ----- */
var links = document.getElementById('links');
document.getElementById('menu').onclick = function () { links.classList.toggle('open') };
links.onclick = function () { links.classList.remove('open') };

/* ----- 04 Ano atual no rodapé ----- */
document.getElementById('ano').textContent = new Date().getFullYear();

/* ----- 06 Progresso de leitura + 03 Voltar ao topo ----- */
var barra = document.getElementById('progresso'), topoBtn = document.getElementById('topo-btn');
function aoRolar() {
    var h = document.documentElement;
    var total = h.scrollHeight - h.clientHeight;
    barra.style.width = (total > 0 ? (h.scrollTop / total) * 100 : 0) + '%';
    topoBtn.classList.toggle('show', h.scrollTop > 400);
}
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();
topoBtn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }) };

/* ----- 02 Navegação ativa: destaca a seção visível ----- */
var secoes = document.querySelectorAll('section[id]'), itens = document.querySelectorAll('.links a');
var obs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
        if (e.isIntersecting) {
            itens.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id) });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
secoes.forEach(function (s) { obs.observe(s) });

/* ----- 10 Copiar e-mail ----- */
var cb = document.getElementById('copiar');
cb.onclick = function () {
    function feito() {
        cb.textContent = 'Copiado!';
        cb.classList.add('ok');
        setTimeout(function () { cb.textContent = 'Copiar'; cb.classList.remove('ok') }, 2000);
    }
    try { navigator.clipboard.writeText(EMAIL).then(feito, function () { cb.textContent = 'Erro' }) }
    catch (e) { cb.textContent = 'Erro' }
};

/* ----- 05 Formulário com validação (abre o app de e-mail) ----- */
document.getElementById('form').onsubmit = function (ev) {
    ev.preventDefault();
    var nome = document.getElementById('nome').value.trim(),
        email = document.getElementById('email').value.trim(),
        msg = document.getElementById('msg').value.trim(),
        erro = document.getElementById('erro');
    if (!nome || !email || !msg) { erro.textContent = 'Preencha todos os campos.'; return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { erro.textContent = 'Digite um e-mail válido.'; return }
    erro.textContent = '';
    var corpo = 'Nome: ' + nome + '\nE-mail: ' + email + '\n\n' + msg;
    location.href = 'mailto:' + EMAIL + '?subject=' +
        encodeURIComponent('Contato pelo currículo - ' + nome) + '&body=' + encodeURIComponent(corpo);
};