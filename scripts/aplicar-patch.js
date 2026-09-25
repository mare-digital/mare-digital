// Aplica as melhorias (navbar fixa, menu no telemóvel e estilos responsivos)
// ao index.html exportado pela ferramenta de design.
//
// Uso:  npm run patch                 (usa public/index.html)
//       node scripts/aplicar-patch.js caminho/para/index.html
//
// O index.html é um bundle: o HTML real está guardado como JSON dentro de
// <script type="__bundler/template">. O script extrai-o, altera-o e volta a
// guardá-lo no mesmo formato. A cópia de segurança fica em backup/.
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'public', 'index.html'));
const html = fs.readFileSync(htmlPath, 'utf8');

const OPEN = '<script type="__bundler/template">';
const start = html.indexOf(OPEN);
if (start < 0) throw new Error('Não encontrei o template do bundle em ' + htmlPath);
const i = start + OPEN.length;
const j = html.indexOf('</script>', i);
// O bundler escapa "</" (barra invertida + u002F) para não fechar a tag <script> antes do tempo.
const encode = s => JSON.stringify(s).replace(new RegExp("</", "g"), '<' + String.fromCharCode(92) + 'u002F');

let t = JSON.parse(html.slice(i, j).trim());

if (t.includes('mare-menu-btn')) {
  console.log('O patch já está aplicado em ' + htmlPath + '. Nada a fazer.');
  process.exit(0);
}

function rep(a,b,count){const n=t.split(a).length-1;if(n!==(count||1))throw new Error('O export mudou e o patch já não encaixa (esperava '+(count||1)+', encontrei '+n+'): '+a.slice(0,80));t=t.split(a).join(b);}
function addClass(snippet,cls,count){rep(snippet,snippet.replace(/^<(\w+) /,'<$1 class="'+cls+'" '),count);}

// Estilos responsivos (inline styles precisam de !important para serem sobrepostos)
rep('@media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}\n</style>',
`@media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}
html{scroll-padding-top:88px}
.mare-menu-btn{display:none}
@media (max-width: 860px){
.mare-nav{padding:12px 20px !important;gap:0 16px !important}
.mare-menu-btn{display:flex;width:44px;height:44px;border-radius:12px;border:1px solid #3A5170;background:transparent;color:#EEF2F5;align-items:center;justify-content:center;cursor:pointer}
.mare-nav-links{display:none !important;width:100%;flex-direction:column;align-items:stretch !important;gap:0 !important;padding:8px 0 16px}
.mare-nav-links.is-open{display:flex !important}
.mare-nav-links a{padding:12px 4px;font-size:17px !important;border-bottom:1px solid #22344C}
.mare-nav-links a:last-child{justify-content:center;margin-top:12px;border-bottom:none}
.mare-h1{font-size:clamp(38px,9vw,60px) !important}
.mare-h2{font-size:clamp(32px,7vw,46px) !important}
.mare-wrap{padding:80px 32px !important}
.mare-hero-inner{padding:56px 32px 120px !important;gap:48px !important}
.mare-tech-grid{grid-template-columns:minmax(0,1fr) !important}
.mare-steps{grid-template-columns:repeat(3,minmax(0,1fr)) !important;row-gap:32px !important}
.mare-flow-line{display:none !important}
}
@media (max-width: 600px){
.mare-wrap{padding:64px 20px !important}
.mare-hero-inner{padding:40px 20px 96px !important}
.mare-lead{font-size:18px !important}
.mare-h3{font-size:28px !important}
.mare-detail{padding:28px 22px !important}
.mare-detail h3{font-size:28px !important}
.mare-form{padding:24px 20px !important}
.mare-foot{padding:40px 20px !important}
.mare-foot-right{align-items:flex-start !important}
.mare-mock-body{padding:18px !important}
.mare-mock-img{flex-basis:96px !important;height:140px !important}
.mare-mock-img svg{width:96px;height:auto}
.mare-mock-nav{display:none !important}
.mare-mock-title{font-size:22px !important}
.mare-step-btn{width:52px !important;height:52px !important}
}
</style>`);

// Navbar fixa (sticky) + botão de menu no telemóvel
rep('<header style="width: 100%; border-bottom: 1px solid #22344C">',
 '<header style="position: sticky; top: 0; z-index: 100; width: 100%; border-bottom: 1px solid #22344C; background: rgba(15, 28, 46, 0.92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px)">');
addClass('<nav style="max-width: 1200px; margin: 0 auto; padding: 20px 48px;','mare-nav');
rep('<a href="#topo" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #EEF2F5">',
 '<a href="#topo" sc-camel-on-click="{{closeMenu}}" aria-label="Maré Digital — voltar ao início" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #EEF2F5">');
rep('<div style="display: flex; align-items: center; gap: 32px; flex-wrap: wrap">\n<a href="#servicos"',
 '<button type="button" class="mare-menu-btn" sc-camel-on-click="{{toggleMenu}}" aria-label="{{menuLabel}}" aria-expanded="{{menuExpanded}}" aria-controls="mare-menu"><svg width="22" height="22" sc-camel-view-box="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="{{menuIcon}}"></path></svg></button>\n<div id="mare-menu" class="mare-nav-links {{menuClass}}" style="display: flex; align-items: center; gap: 32px; flex-wrap: wrap">\n<a href="#servicos"');
for (const h of ['#servicos" style="color: #C9D4DF','#tecnologia" style="color: #C9D4DF','#processo" style="color: #C9D4DF'])
  rep('<a href="'+h, '<a sc-camel-on-click="{{closeMenu}}" href="'+h);
rep('<a href="#contacto" style="display: inline-flex; align-items: center; min-height: 44px;','<a sc-camel-on-click="{{closeMenu}}" href="#contacto" style="display: inline-flex; align-items: center; min-height: 44px;');

// Hero
addClass('<div style="position: relative; max-width: 1200px; margin: 0 auto; padding: 104px 48px 160px;','mare-hero-inner');
addClass('<h1 style=','mare-h1');
addClass('<p style="margin: 0; font-size: 20px;','mare-lead');
addClass('<div style="padding: 22px 26px 28px;','mare-mock-body');
addClass('<div style="display: flex; gap: 16px; font-size: 13px; color: #4A5A6B">','mare-mock-nav');
addClass('<div style="font-family: \'Bricolage Grotesque\', Georgia, serif; font-weight: 800; font-size: 30px;','mare-mock-title');
addClass('<div style="flex: 0 0 170px; height: 190px;','mare-mock-img');

// Secções
addClass('<div style="max-width: 1200px; margin: 0 auto; padding: 120px 48px','mare-wrap',4);
addClass('<div style="max-width: 1200px; margin: 0 auto; padding: 112px 48px','mare-wrap');
addClass('<h2 style=','mare-h2',5);
addClass('<h3 style="margin: 0; font-family: \'Bricolage Grotesque\', Georgia, serif; font-weight: 600; font-size: 36px;','mare-h3',3);
addClass('<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 64px">','mare-tech-grid');

// Processo
addClass('<div style="position: absolute; top: 31px;','mare-flow-line',2);
addClass('<ol style=','mare-steps');
addClass('<button sc-camel-on-click="{{item.pick}}"','mare-step-btn');
addClass('<div aria-live="polite" style=','mare-detail');

// Contacto e rodapé
addClass('<div style="flex: 1 1 440px; padding: 36px;','mare-form');
addClass('<div style="max-width: 1200px; margin: 0 auto; padding: 48px;','mare-foot');
addClass('<div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end">','mare-foot-right');

// Estado do menu
rep("state = { active: 0, playing: true };","state = { active: 0, playing: true, menuOpen: false };");
rep("    return {\n      accent:",
`    var menuOpen = !!s.menuOpen;
    return {
      menuClass: menuOpen ? 'is-open' : '',
      menuExpanded: menuOpen ? 'true' : 'false',
      menuLabel: menuOpen ? 'Fechar menu' : 'Abrir menu',
      menuIcon: menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16',
      toggleMenu: function () { self.setState({ menuOpen: !menuOpen }); },
      closeMenu: function () { if (self.state && self.state.menuOpen) self.setState({ menuOpen: false }); },
      accent:`);

const backupDir = path.join(__dirname, '..', 'backup');
fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, 'index.' + new Date().toISOString().replace(/[:.]/g, '-') + '.html');
fs.writeFileSync(backupPath, html);

fs.writeFileSync(htmlPath, html.slice(0, i) + '\n' + encode(t) + '\n  ' + html.slice(j));
console.log('Patch aplicado em ' + htmlPath);
console.log('Original guardado em ' + backupPath);
