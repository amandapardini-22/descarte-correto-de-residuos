/** Descarte Consciente — navegação, calendário, consulta e checklist. */
'use strict';

// Menu responsivo
const menu = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});
window.matchMedia('(max-width:640px)').addEventListener('change', closeMenu);

// Calendário: rotina semanal informada pelos moradores (São Paulo).
const weekdayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function updateToday(now = new Date()) {
  const tz = 'America/Sao_Paulo';
  const key = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(now);
  const day = weekdayKeys.indexOf(key);
  const common = [1, 3, 5].includes(day);
  const recycle = [2, 4].includes(day);

  document.getElementById('todayDate').textContent = 'Hoje · ' + new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: tz
  }).format(now);
  document.getElementById('todayTitle').textContent = common
    ? 'Dia de lixo comum'
    : recycle ? 'Dia de coleta seletiva' : 'Sem coleta regular informada';
  document.getElementById('todayDetail').textContent = common
    ? 'Prepare os sacos de orgânicos e rejeitos. Confirme o horário.'
    : recycle ? 'Prepare os recicláveis limpos e secos. Confirme o horário.'
      : 'Guarde os resíduos adequadamente até o próximo dia de coleta.';

  document.querySelectorAll('.day').forEach(el => {
    const active = Number(el.dataset.day) === day;
    el.classList.toggle('is-today', active);
    if (active) el.setAttribute('aria-current', 'date');
    else el.removeAttribute('aria-current');
  });
}

updateToday();
window.addEventListener('focus', () => updateToday());
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateToday();
});
// A função recebe o horário atual a cada atualização.
setInterval(() => updateToday(), 60000);

// Consulta interativa: as chaves correspondem às opções no HTML.
const guidance = {
  pet: ["Coleta seletiva · terça e quinta", "Esvazie e retire restos de líquidos."],
  paper: ["Coleta seletiva · terça e quinta", "Mantenha o papelão seco e dobre a caixa."],
  can: ["Coleta seletiva · terça e quinta", "Retire resíduos do conteúdo."],
  glass: ["Coleta seletiva · terça e quinta", "Esvazie e proteja a embalagem contra quebras."],
  carton: ["Coleta seletiva · terça e quinta", "Esvazie, retire os resíduos e compacte a embalagem."],
  plastic: ["Coleta seletiva · terça e quinta", "Retire os resíduos e deixe a embalagem seca."],
  broken: ["Coleta seletiva: atenção especial", "Proteja os cacos em embalagem resistente, identifique e confira a orientação da coleta."],
  food: ["Lixo comum · segunda, quarta e sexta", "Acondicione em saco fechado ou aproveite em compostagem adequada."],
  dirty: ["Lixo comum · segunda, quarta e sexta", "Papel com gordura não deve contaminar os recicláveis."],
  diaper: ["Lixo comum · segunda, quarta e sexta", "Feche bem o saco."],
  tissue: ["Lixo comum · segunda, quarta e sexta", "Não misture papéis sanitários ou sujos aos recicláveis."],
  coffee: ["Lixo comum · segunda, quarta e sexta", "Acondicione em saco fechado ou utilize em compostagem adequada."],
  sofa: ["Cata-Bagulho mensal", "Confirme a próxima data e se o item é aceito antes de colocá-lo na rua."],
  battery: ["Resíduo especial", "Entregue em ponto de recebimento de pilhas e baterias."],
  med: ["Resíduo especial", "Entregue em UBS ou farmácia habilitada. Não descarte em pias ou vasos sanitários."],
  oil: ["Resíduo especial", "Guarde o óleo frio em garrafa fechada e encaminhe para coleta de óleo."],
  electronics: ["Resíduo especial", "Procure ponto de logística reversa de eletrônicos."],
  lamp: ["Resíduo especial", "Procure ponto que receba o tipo de lâmpada. Evite quebrá-la."],
  tire: ["Resíduo especial", "Leve a um ponto de recebimento de pneus. Mantenha protegido da chuva até a entrega."]
};

const select = document.getElementById('wasteSelect');
const out = document.getElementById('wasteResult');
select.addEventListener('change', () => {
  out.replaceChildren();
  const info = guidance[select.value];
  if (!info) {
    out.textContent = 'O destino e os cuidados aparecerão aqui.';
    return;
  }
  const title = document.createElement('strong');
  title.textContent = info[0];
  out.append(title, document.createElement('br'), document.createTextNode(info[1]));
});

// Checklist: não armazena nem transmite dados dos moradores.
const boxes = [...document.querySelectorAll('#checks input')];
function updateChecks() {
  const n = boxes.filter(b => b.checked).length;
  document.getElementById('progressFill').style.width = (n / boxes.length * 100) + '%';
  document.getElementById('checkStatus').textContent = n + ' de ' + boxes.length +
    ' cuidados concluídos' + (n === boxes.length ? ' — tudo pronto!' : '');
}
boxes.forEach(b => b.addEventListener('change', updateChecks));
document.getElementById('resetBtn').addEventListener('click', () => {
  boxes.forEach(b => b.checked = false);
  updateChecks();
});
updateChecks();

// Material informativo: impressão e download da imagem do QR Code.
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('downloadQr').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = document.querySelector('.qr-print img').src;
  link.download = 'qrcode-descarte-consciente.png';
  link.click();
});
