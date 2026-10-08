import { questions, themes, siteConfig } from './content.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const box = hero.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - .5;
  const y = (event.clientY - box.top) / box.height - .5;
  hero.style.setProperty('--desk-x', `${(x + .5) * 100}%`);
  hero.style.setProperty('--desk-y', `${(y + .5) * 100}%`);
});
hero.addEventListener('pointerleave', () => {
  hero.style.setProperty('--desk-x', '78%');
  hero.style.setProperty('--desk-y', '20%');
});
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});

const asked = new Set();
const conversation = document.querySelector('#conversation');
const initialConversation = conversation.innerHTML;
const options = document.querySelector('#question-options');
const answerPanel = document.querySelector('#answer-panel');
const revealButton = document.querySelector('#reveal-answer');
const count = document.querySelector('#question-count');
const clues = document.querySelector('#clue-count');
const meter = document.querySelector('#clue-meter');

function renderQuestions() {
  options.replaceChildren();
  questions.forEach((question, index) => {
    const button = document.createElement('button');
    button.className = 'question-option';
    button.dataset.question = index;
    button.textContent = question.text;
    button.addEventListener('click', () => askQuestion(index, button));
    options.append(button);
  });
}

function askQuestion(index, button) {
  if (asked.has(index)) return;
  asked.add(index);
  const question = questions[index];
  button.disabled = true;
  button.classList.add('asked');
  button.setAttribute('aria-label', `${question.text} 已提问，回答：${question.answer}`);
  const turn = document.createElement('div');
  turn.className = 'conversation-turn';
  const userMessage = document.createElement('p');
  userMessage.className = 'user-question';
  userMessage.textContent = question.text;
  const response = document.createElement('div');
  response.className = 'host-response';
  const tag = document.createElement('span');
  tag.className = `answer-tag ${question.kind}`;
  tag.textContent = question.answer;
  const explanation = document.createElement('p');
  explanation.textContent = question.explanation;
  response.append(tag, explanation);
  turn.append(userMessage, response);
  conversation.append(turn);
  conversation.scrollTo({top:conversation.scrollHeight, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  const clueCount = [...asked].filter(i => questions[i].clue).length;
  count.textContent = `${asked.size} 次提问`;
  clues.textContent = `${clueCount} / 3`;
  meter.value = clueCount;
  meter.textContent = `${clueCount} / 3`;
  if (clueCount === 3) revealButton.classList.add('ready');
  const next = [...options.querySelectorAll('button')].find(item => !item.disabled);
  (next || revealButton).focus({preventScroll:true});
}

revealButton.addEventListener('click', () => {
  const open = revealButton.getAttribute('aria-expanded') === 'true';
  revealButton.setAttribute('aria-expanded', String(!open));
  answerPanel.hidden = open;
  revealButton.innerHTML = open ? '揭开汤底 <span aria-hidden="true">✦</span>' : '收起汤底 <span aria-hidden="true">−</span>';
  if (!open) answerPanel.scrollIntoView({block:'nearest', behavior:reducedMotion.matches ? 'instant' : 'smooth'});
});
document.querySelector('#reset-demo').addEventListener('click', () => {
  asked.clear();
  conversation.innerHTML = initialConversation;
  count.textContent = '0 次提问';
  clues.textContent = '0 / 3';
  meter.value = 0;
  meter.textContent = '0 / 3';
  answerPanel.hidden = true;
  revealButton.setAttribute('aria-expanded', 'false');
  revealButton.classList.remove('ready');
  revealButton.innerHTML = '揭开汤底 <span aria-hidden="true">✦</span>';
  renderQuestions();
  options.querySelector('button').focus({preventScroll:true});
});
renderQuestions();

const featureStates = [
  { label:'THE HOST IS READY', title:'每一个问题，<br>都有回应。', detail:'<span class="answer-tag yes">是</span><span class="answer-tag no">否</span><span class="answer-tag neutral">不重要</span>' },
  { label:'ONE MYSTERY. EIGHT MINDS.', title:'同一张桌，<br>八种脑回路。', detail:'<span class="seats" aria-label="最多八人共同推理">'+Array.from({length:8},(_,i)=>`<span>${String(i+1).padStart(2,'0')}</span>`).join('')+'</span>' },
  { label:'CONNECT THE MISSING PIECES', title:'让所有线索，<br>终于连成故事。', detail:'<span class="stage-clue">记录线索</span><span class="stage-clue">提交推理</span><span class="stage-clue">结案回顾</span>' }
];
document.querySelectorAll('[data-feature]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.feature);
  document.querySelectorAll('[data-feature]').forEach((item, i) => {
    const expanded = i === index;
    item.setAttribute('aria-expanded', String(expanded));
    item.querySelector('.feature-plus').textContent = expanded ? '−' : '＋';
    item.closest('.feature-item').classList.toggle('active', expanded);
    document.getElementById(item.getAttribute('aria-controls')).hidden = !expanded;
  });
  const state = featureStates[index];
  document.querySelector('#stage-label').textContent = state.label;
  document.querySelector('#stage-title').innerHTML = state.title;
  document.querySelector('#stage-detail').innerHTML = state.detail;
}));

const grid = document.querySelector('#story-grid');
const dialog = document.querySelector('#story-dialog');
let lastStoryTrigger;
themes.forEach((theme, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'story-card';
  button.dataset.story = theme.id;
  button.style.setProperty('--card-accent', theme.color);
  button.setAttribute('aria-label', `翻阅${theme.name}主题`);
  button.setAttribute('aria-haspopup', 'dialog');
  button.innerHTML = `<span class="story-art"><img src="./assets/${theme.image}" alt="${theme.name}档案卡" width="512" height="762" loading="lazy"><span class="story-cover"><span>翻阅档案</span><span aria-hidden="true">＋</span></span></span><span class="story-info"><span class="story-number">0${index+1} / ${theme.english}</span><strong>${theme.name}</strong><span class="story-line">${theme.line}</span></span>`;
  button.addEventListener('click', () => {
    lastStoryTrigger = button;
    document.querySelector('#dialog-art').src = `./assets/${theme.image}`;
    document.querySelector('#dialog-art').alt = `${theme.name}档案卡`;
    document.querySelector('#dialog-eyebrow').textContent = `FILE 0${index+1} / ${theme.english}`;
    document.querySelector('#dialog-title').textContent = theme.name;
    document.querySelector('#dialog-description').textContent = theme.description;
    document.querySelector('#dialog-facts').innerHTML = `<div><dt>适合谁</dt><dd>${theme.audience}</dd></div><div><dt>推理体验</dt><dd>${theme.feeling}</dd></div><div><dt>开局建议</dt><dd>${theme.advice}</dd></div>`;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
  grid.append(button);
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastStoryTrigger?.focus({preventScroll:true});
});
document.querySelector('#dialog-try').addEventListener('click', () => {
  dialog.close();
  document.querySelector('#experience').scrollIntoView({behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  options.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
});

document.querySelectorAll('[data-spotlight]').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--light-x', `${event.clientX - box.left}px`);
    card.style.setProperty('--light-y', `${event.clientY - box.top}px`);
  });
});

const revealElements = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
}), {threshold:.08});
if (!reducedMotion.matches) revealElements.forEach(item => { item.classList.add('will-reveal'); observer.observe(item); });
reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  revealElements.forEach(item => item.classList.add('in-view'));
  document.querySelectorAll('[data-tilt]').forEach(card => card.style.transform = '');
});
let scrollFrame;
const progress = document.querySelector('.reading-progress');
function updateScroll() {
  scrollFrame = undefined;
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${scrollable > 0 ? scrollY / scrollable * 100 : 0}%`;
  const manifesto = document.querySelector('.manifesto');
  const box = manifesto.getBoundingClientRect();
  const amount = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (innerHeight - box.top) / (innerHeight * .65)));
  manifesto.style.setProperty('--reveal-progress', amount);
  if (!reducedMotion.matches) {
    const heroProgress = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
    hero.style.setProperty('--scene-scale', 1.02 + heroProgress * .13);
    manifesto.style.setProperty('--ticker-shift', (amount - .5) * (innerWidth < 760 ? 12 : 60));
    const cards = grid.getBoundingClientRect();
    const fan = Math.min(1, Math.max(0, (innerHeight - cards.top) / (innerHeight * .8)));
    grid.style.setProperty('--fan-progress', 1 - fan);
  }
}
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, {passive:true});
addEventListener('resize', updateScroll);
updateScroll();

if (siteConfig.gameUrl) {
  try {
    const url = new URL(siteConfig.gameUrl);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      document.querySelectorAll('[data-game-entry]').forEach(link => { link.href=url.href; link.textContent='进入完整推理室'; });
    }
  } catch { /* A missing or invalid entry keeps the self-contained demo usable. */ }
}
