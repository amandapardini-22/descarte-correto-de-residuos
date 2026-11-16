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

// Calendário: programação oficial por CEP, consultada em 16/11/2026.
// Os próprios cartões do HTML fornecem os dias e horários, inclusive sem JavaScript.
const weekdayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const collectionDays = [...document.querySelectorAll('.day')];
const schedule = new Map(collectionDays.map(el => [Number(el.dataset.day), {
  type: el.classList.contains('common') ? 'common' : el.classList.contains('recycle') ? 'recycle' : 'rest',
  time: el.querySelector('time')?.dateTime || ''
}]));
function updateToday(now = new Date()) {
  const tz = 'America/Sao_Paulo';
  const key = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(now);
  const day = weekdayKeys.indexOf(key);
  const slot = schedule.get(day);
  const common = slot?.type === 'common';
  const recycle = slot?.type === 'recycle';

  document.getElementById('todayDate').textContent = 'Hoje · ' + new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: tz
  }).format(now);
  document.getElementById('todayTitle').textContent = common
    ? 'Dia de lixo comum · ' + slot.time
    : recycle ? 'Dia de coleta seletiva · ' + slot.time : 'Sem coleta regular hoje';
  document.getElementById('todayDetail').textContent = common
    ? 'Horário previsto. Separe orgânicos e rejeitos e coloque os sacos na calçada nas duas horas anteriores à coleta.'
    : recycle ? 'Horário previsto. Separe os recicláveis limpos e secos e coloque-os na calçada nas duas horas anteriores à coleta.'
      : 'Guarde os resíduos adequadamente até o próximo dia de coleta.';

  collectionDays.forEach(el => {
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
  pet: ["Coleta seletiva · quinta, 09:16", "Esvazie e retire restos de líquidos."],
  paper: ["Coleta seletiva · quinta, 09:16", "Mantenha o papelão seco e dobre a caixa."],
  can: ["Coleta seletiva · quinta, 09:16", "Retire resíduos do conteúdo."],
  glass: ["Coleta seletiva · quinta, 09:16", "Esvazie e proteja a embalagem contra quebras."],
  carton: ["Coleta seletiva · quinta, 09:16", "Esvazie, retire os resíduos e compacte a embalagem."],
  plastic: ["Coleta seletiva · quinta, 09:16", "Retire os resíduos e deixe a embalagem seca."],
  broken: ["Vidro quebrado · confirme o destino", "Proteja os cacos em embalagem resistente, identifique e confira a orientação da coleta."],
  food: ["Lixo comum · segunda 12:05, quarta 09:33 e sexta 12:23", "Acondicione em saco fechado ou aproveite em compostagem adequada."],
  dirty: ["Lixo comum · segunda 12:05, quarta 09:33 e sexta 12:23", "Papel com gordura não deve contaminar os recicláveis."],
  diaper: ["Lixo comum · segunda 12:05, quarta 09:33 e sexta 12:23", "Feche bem o saco."],
  tissue: ["Lixo comum · segunda 12:05, quarta 09:33 e sexta 12:23", "Não misture papéis sanitários ou sujos aos recicláveis."],
  coffee: ["Lixo comum · segunda 12:05, quarta 09:33 e sexta 12:23", "Acondicione em saco fechado ou utilize em compostagem adequada."],
  sofa: ["Cata-Bagulho · confirme a programação", "Confirme a próxima data e se o item é aceito antes de colocá-lo na rua."],
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
