const sentenceMeta = [
  ['第一句', '各自找到的主題：你覺得最大的改變是什麼？'],
  ['第二句', '你在哪裡發現這個改變？'],
  ['第三句', '這個改變以前是什麼樣子？'],
  ['第四句', '現在變成什麼樣子？'],
  ['第五句', '這個改變帶給大家什麼感受或幫助？'],
  ['第六句', '用一句話說說你最想讓大家知道的事。']
];
const sample = [
  ['校園變得更有綠意', '圖書館變得更好用', '同學更願意一起合作', '學校更重視安全'],
  ['我在操場旁邊看到新的花圃', '我在圖書館看到新的閱讀角', '我在班上看到大家分組討論', '我在樓梯看到清楚的安全標語'],
  ['以前的角落比較空，也沒有人停留', '以前的書比較少，座位也不夠舒服', '以前常常只有一個人完成工作', '以前的提醒比較少，大家容易奔跑'],
  ['現在有更多植物，也有可以休息的地方', '現在有更多書和舒服的座位', '現在每個人都能分工，互相幫忙', '現在大家會慢慢走，也會互相提醒'],
  ['讓校園更漂亮，也讓我們更喜歡待在學校', '讓閱讀變成一件輕鬆又有趣的事', '讓我們學會聽別人的想法', '讓大家在校園裡更安心'],
  ['我希望大家一起愛護這些改變', '我希望更多人來閱讀和分享', '我發現一起做事可以完成更多事', '小小的提醒也能帶來大大的安全']
];

const count = document.querySelector('#peopleCount');
const cards = document.querySelector('#sentenceCards');
const reportContent = document.querySelector('#reportContent');
const copyBtn = document.querySelector('#copyBtn');
let latestReport = '';

function renderCards() {
  const people = Number(count.value);
  cards.innerHTML = sentenceMeta.map((meta, sentenceIndex) => `
    <article class="sentence-card">
      <div class="card-head"><span class="sentence-no">${sentenceIndex + 1}</span><span class="card-title">${meta[0]}</span><span class="card-subtitle">${meta[1]}</span></div>
      <div class="fields">${Array.from({length: people}, (_, personIndex) => `
        <div class="field"><label>${personIndex + 1}</label><input data-sentence="${sentenceIndex}" data-person="${personIndex}" placeholder="小記者 ${personIndex + 1} 的想法…" /></div>`).join('')}</div>
    </article>`).join('');
}

function getValues() {
  return sentenceMeta.map((_, sentenceIndex) => [...cards.querySelectorAll(`[data-sentence="${sentenceIndex}"]`)].map(input => input.value.trim()).filter(Boolean));
}

function pickKeywords(values) {
  const stop = new Set(['我們','大家','學校','關東國小','現在','以前','變得','可以','這個','讓','更','也','的','有','在','和','了','會','都','一個','很多']);
  const words = values.join(' ').replace(/[，。！？、；：「」『』（）()\s]/g, ' ').split(' ').filter(w => w.length >= 2 && !stop.has(w));
  const frequency = {}; words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
  return Object.entries(frequency).sort((a,b) => b[1]-a[1]).slice(0,2).map(item => item[0]);
}

function combine(values, fallback) {
  const unique = [...new Set(values.filter(Boolean))];
  if (!unique.length) return fallback;
  if (unique.length === 1) return unique[0];
  return unique.slice(0, 2).join('，') + (unique.length > 2 ? '等觀察' : '');
}

function generate() {
  const values = getValues();
  const all = values.flat();
  if (!all.length) { reportContent.innerHTML = '<div class="empty-icon">✎</div><h3>先填入小記者的句子</h3><p>每一格都是一個重要的觀察，至少填寫一句就能開始整理。</p>'; reportContent.classList.add('empty'); copyBtn.disabled = true; return; }
  const keywords = pickKeywords(all);
  const topic = keywords.length ? `讓校園更${keywords[0]}的改變` : '關東國小正在發生的改變';
  const lines = [
    `我們發現，關東國小最大的改變是${combine(values[0], '校園變得更適合學習與生活')}。`,
    `小記者在校園中觀察到：${combine(values[1], '許多角落出現了新的樣子')}。`,
    `以前，${combine(values[2], '有些地方比較少被注意')}。`,
    `現在，${combine(values[3], '大家一起讓校園變得更好')}。`,
    `這些改變讓我們感受到：${combine(values[4], '只要一起努力，小小的行動也能帶來幫助')}。`,
    `關東公民小記者 1、2、3、4，為您做的報導。謝謝您的收看。`
  ];
  reportContent.classList.remove('empty');
  reportContent.innerHTML = `<div class="topic-label">OUR BIG THEME</div><div class="topic">${topic}</div>${lines.map((line, i) => `<div class="article-line ${i === 5 ? 'closing' : ''}"><b>${i + 1}</b><span>${line}</span></div>`).join('')}`;
  latestReport = `主題：${topic}\n\n${lines.map((line, i) => `${i + 1}. ${line}`).join('\n')}`;
  copyBtn.disabled = false;
  document.querySelector('.report-paper').scrollIntoView({behavior:'smooth', block:'nearest'});
}

function fillSample() { renderCards(); const people = Number(count.value); cards.querySelectorAll('input').forEach(input => { const s = Number(input.dataset.sentence); const p = Number(input.dataset.person); input.value = sample[s][p] || ''; }); generate(); }
function clearAll() { renderCards(); reportContent.className = 'report-content empty'; reportContent.innerHTML = '<div class="empty-icon">✎</div><h3>你的報導會出現在這裡</h3><p>填寫左側句子後，按下「整理成六句報導」。</p>'; copyBtn.disabled = true; latestReport = ''; }

count.addEventListener('change', renderCards);
document.querySelector('#generateBtn').addEventListener('click', generate);
document.querySelector('#sampleBtn').addEventListener('click', fillSample);
document.querySelector('#clearBtn').addEventListener('click', clearAll);
copyBtn.addEventListener('click', async () => { await navigator.clipboard.writeText(latestReport); copyBtn.innerHTML = '已複製完整報導 ✓'; setTimeout(() => copyBtn.innerHTML = '複製完整報導 <span>↗</span>', 1800); });
document.querySelector('#copyPromptBtn').addEventListener('click', async () => { const prompt = '將以下的文章內容，幫我彙整成一篇六句話的校園報導，有關關東國小最大的改變。請保留孩子們觀察到的重點，使用簡單、清楚、適合小學生朗讀的語氣。文章內容如下：\n\n【請在這裡貼上文章內容】'; await navigator.clipboard.writeText(prompt); const button = document.querySelector('#copyPromptBtn'); button.textContent = '已複製 ✓'; setTimeout(() => button.textContent = '複製提示詞', 1800); });
document.querySelector('#reportDate').textContent = new Date().toLocaleDateString('zh-TW', {year:'numeric', month:'2-digit', day:'2-digit'}).replaceAll('/', '.');
renderCards();
