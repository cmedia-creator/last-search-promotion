const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const resultsEl = document.getElementById('results');
const metaEl = document.getElementById('resultMeta');
const transitionEl = document.getElementById('transition');
const lsText = document.getElementById('lsText');

const normalResults = [
  {
    title: '日本各地に残る有名な都市伝説まとめ',
    source: 'urban-note.example.com',
    snippet: '学校、駅、トンネル、廃墟などで語られてきた都市伝説を地域別に紹介。由来や派生した噂もあわせて掲載しています。'
  },
  {
    title: 'ネットで広まった都市伝説10選',
    source: 'mystery-journal.example.jp',
    snippet: '掲示板やSNSをきっかけに広まった代表的なネット怪談を整理。初出とされる投稿や、後から付け加えられた説も紹介。'
  },
  {
    title: '知らない方がよかった？都市伝説・怪談の記録',
    source: 'records-archive.example.net',
    snippet: '古くから語られる怪談や噂話を記録形式で掲載。事実関係が確認できない内容も含まれます。'
  },
  {
    title: '全国の心霊・怪談スポットを調べてみた',
    source: 'night-walker.example.com',
    snippet: '有名な心霊スポットから地域限定の噂まで、現地写真や投稿情報を交えてまとめています。'
  },
  {
    title: '消えたサイト、残されたページ。ネット都市伝説特集',
    source: 'oldweb-lab.example.org',
    snippet: '閉鎖済みサイトや出所不明のページにまつわる噂を紹介。現在も一部キャッシュが確認できるものがあります。'
  },
  {
    title: '都市伝説の元ネタを検証する',
    source: 'fact-or-story.example.jp',
    snippet: '有名な噂話を資料や新聞記事から検証。誤解や創作が広まった経緯についても解説します。'
  },
  {
    title: '【閲覧注意】検索してはいけないと言われる話まとめ',
    source: 'occult-box.example.com',
    snippet: '検索をきっかけに広まった怪談や都市伝説をまとめています。内容には真偽不明の情報が含まれます。'
  },
  {
    title: '深夜に読む都市伝説まとめ',
    source: 'midnight-column.example.net',
    snippet: '短く読める都市伝説をテーマ別に掲載。学校、電話、写真、インターネットに関する話を中心に紹介します。'
  },
  {
    title: '投稿された奇妙な体験談まとめ',
    source: 'anonymous-report.example.jp',
    snippet: '読者から寄せられた不可解な体験談を掲載。投稿者の希望により一部情報は編集されています。'
  },
  {
    title: '昔の掲示板で語られていた怖い話',
    source: 'log-collection.example.com',
    snippet: '2000年代の掲示板ログをもとに、当時話題になった怪談や未解決の書き込みを紹介します。'
  }
];

let phase = 0;
let rendered = false;
let specialArmed = false;

function renderResults() {
  resultsEl.innerHTML = '';
  normalResults.forEach((r, i) => {
    const item = document.createElement('article');
    item.className = 'result';
    item.dataset.index = i;
    item.innerHTML = `
      <div class="result-source">${r.source}</div>
      <a href="#" class="result-title">${r.title}</a>
      <div class="result-snippet">${r.snippet}</div>
    `;
    const link = item.querySelector('.result-title');
    link.addEventListener('click', (e) => handleResultClick(e, i));
    resultsEl.appendChild(item);
  });
  rendered = true;
  applyPhase();
}

function setSnippet(index, text, anomaly = true) {
  const el = resultsEl.querySelector(`[data-index="${index}"] .result-snippet`);
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = text;
    el.classList.toggle('anomaly', anomaly);
    el.style.opacity = '1';
  }, 160);
}

function applyPhase() {
  if (!rendered) return;
  normalResults.forEach((r, i) => setSnippet(i, r.snippet, false));

  if (phase === 1) setTimeout(() => setSnippet(2, 'ここではありません。'), 220);
  if (phase === 2) setTimeout(() => setSnippet(2, 'もう少し下です。'), 220);
  if (phase === 3) {
    setTimeout(() => setSnippet(2, 'もう少し下です。'), 140);
    setTimeout(() => setSnippet(6, 'それです。'), 320);
  }
  if (phase === 4) {
    setTimeout(() => setSnippet(6, 'なぜ押さないのですか'), 220);
  }
  if (phase === 5) {
    setTimeout(() => setSnippet(6, '待っています。'), 220);
    specialArmed = true;
  }
  if (phase === 6) {
    setTimeout(() => setSnippet(6, '押してください。'), 220);
    specialArmed = true;
  }
}

function search(query) {
  const q = query.trim();
  if (!q) return;

  metaEl.classList.remove('hidden');
  resultsEl.classList.remove('hidden');

  if (q === '都市伝説　まとめ' || q === '都市伝説 まとめ') {
    metaEl.textContent = '約 18,700 件';
    if (!rendered) renderResults();
    phase = 1;
    applyPhase();
    return;
  }

  if (phase >= 4) {
    metaEl.textContent = `「${q}」の検索結果`;
    if (!rendered) renderResults();
    normalResults.forEach((r, i) => setSnippet(i, r.snippet, false));
    setTimeout(() => setSnippet(2, '戻らないでください。'), 450);
    phase = 5;
    return;
  }

  metaEl.textContent = `「${q}」の検索結果`;
  if (!rendered) renderResults();
}

function handleResultClick(e, index) {
  e.preventDefault();

  if (index !== 6) return;

  if (phase === 3) {
    phase = 4;
    setSnippet(6, 'なぜ押さないのですか');
    window.scrollBy({ top: 1, behavior: 'smooth' });
    return;
  }

  if (specialArmed || phase >= 5) {
    launchLastSearch();
  }
}

function launchLastSearch() {
  transitionEl.classList.remove('hidden');
  lsText.textContent = '';
  const text = '見つけてくれてありがとう';
  let i = 0;
  const timer = setInterval(() => {
    lsText.textContent += text[i++] || '';
    if (i > text.length) clearInterval(timer);
  }, 120);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  search(input.value);
});

window.addEventListener('keydown', (e) => {
  // 動画撮影用ショートカット。Rキーでフェーズ進行。
  if (e.key.toLowerCase() === 'r' && rendered) {
    phase = Math.min(6, phase + 1);
    applyPhase();
  }
});

// 撮影時の操作補助：ページ上部ブランド5回クリックで進行
let taps = 0;
document.querySelector('.brand').addEventListener('click', () => {
  taps += 1;
  if (rendered && taps % 5 === 0) {
    phase = Math.min(6, phase + 1);
    applyPhase();
  }
});
