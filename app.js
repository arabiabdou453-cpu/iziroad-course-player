/**
 * IZIROAD LMS Course Player & Overview App
 * Interactive logic for lessons, video player, progress tracking, and notes.
 */

// Lessons Data (Extracted directly from user screenshots)
const lessons = [
  {
    id: 1,
    title: "Exploring WordPress (Introduction)",
    duration: "08:00",
    completed: true,
    description: "Dans cette première leçon d'introduction, nous allons découvrir l'écosystème WordPress, son histoire, et pourquoi il propulse plus de 43% des sites web dans le monde. Nous aborderons la différence entre WordPress.com et WordPress.org, ainsi que la configuration requise.",
    tags: ["WordPress 6.5", "WooCommerce", "Local Server", "PHP 8.2"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: 2,
    title: "Qu'est-ce que WordPress ?",
    duration: "06:00",
    completed: true,
    description: "Comprendre le fonctionnement interne d'un CMS (Content Management System) et l'architecture base de données MySQL + fichiers PHP.",
    tags: ["CMS", "Architecture", "Open Source"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: 3,
    title: "Transformez votre ordinateur en serveur local - Partie 1",
    duration: "08:00",
    completed: true,
    description: "Installation et prise en main de LocalWP / Laragon pour créer un environnement de test local rapide et sécurisé sur Windows et Mac.",
    tags: ["LocalWP", "Localhost", "Dev Tools"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: 4,
    title: "Transformez votre ordinateur en serveur local - Partie 2",
    duration: "11:00",
    completed: true,
    description: "Configuration avancée de php.ini, mémoire limite pour WordPress et gestion de bases de données avec phpMyAdmin.",
    tags: ["php.ini", "phpMyAdmin", "MySQL"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: 5,
    title: "Fournisseur d'hébergement gratuit pour les tests",
    duration: "04:00",
    completed: true,
    description: "Découverte des solutions d'hébergement temporaires gratuites pour tester vos maquettes en ligne avant le déploiement final.",
    tags: ["Hosting", "Staging", "Cloud"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    id: 6,
    title: "Commencer avec WordPress",
    duration: "14:00",
    completed: false,
    description: "Premier lancement du tableau de bord d'administration (wp-admin), réglages généraux, permaliens et sécurisation initiale.",
    tags: ["wp-admin", "Settings", "Security"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"
  },
  {
    id: 7,
    title: "Thèmes",
    duration: "12:00",
    completed: false,
    description: "Choisir, installer et personnaliser un thème WordPress professionnel (Astra, Hello Elementor, GeneratePress).",
    tags: ["Themes", "Astra", "Customizer"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  },
  {
    id: 8,
    title: "Extensions (Plugins)",
    duration: "20:00",
    completed: false,
    description: "Comment choisir les bons plugins sans ralentir son site web, et installer les indispensables pour l'e-commerce.",
    tags: ["Plugins", "WooCommerce", "Performance"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: 9,
    title: "Pages",
    duration: "12:00",
    completed: false,
    description: "Création des pages indispensables (Accueil, Boutique, À propos, Contact, Mentions légales).",
    tags: ["Pages", "Gutenberg", "Structure"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4"
  },
  {
    id: 10,
    title: "Menus",
    duration: "10:00",
    completed: false,
    description: "Création et gestion des menus de navigation d'en-tête, mégamenus et liens du pied de page.",
    tags: ["Menus", "Navigation", "UX"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  }
];

let currentLessonIndex = 0;

// DOM Elements
const lessonsListEl = document.getElementById('lessons-list');
const overviewLessonsListEl = document.getElementById('overview-lessons-list');
const progressPercentEl = document.getElementById('progress-percent');
const progressFillEl = document.getElementById('progress-fill');
const currentLessonTitleEl = document.getElementById('current-lesson-title');
const currentLessonDescEl = document.querySelector('.tab-description');
const currentLessonTagsEl = document.querySelector('.resume-tags');

// Video Player Elements
const videoEl = document.getElementById('main-video');
const bigPlayBtn = document.getElementById('big-play');
const ctrlPlayPauseBtn = document.getElementById('ctrl-play-pause');
const ctrlPlayIcon = document.getElementById('ctrl-play-icon');
const ctrlPauseIcon = document.getElementById('ctrl-pause-icon');
const timeDisplayEl = document.getElementById('time-display');
const seekBarEl = document.getElementById('seek-bar');
const ctrlFullscreenBtn = document.getElementById('ctrl-fullscreen');
const ctrlMuteBtn = document.getElementById('ctrl-mute');

// Bottom Action Buttons
const btnMarkDone = document.getElementById('btn-mark-done');
const btnNextLesson = document.getElementById('btn-next-lesson');

// View Switching Elements
const playerView = document.getElementById('player-view');
const overviewView = document.getElementById('overview-view');
const btnToOverview = document.getElementById('btn-to-overview');
const btnBackToPlayer = document.getElementById('btn-back-to-player');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Notes
const noteInput = document.getElementById('note-input');
const btnSaveNote = document.getElementById('btn-save-note');
const notesListEl = document.getElementById('notes-list');

// Comments
const commentTextInput = document.getElementById('comment-text');
const btnSendComment = document.getElementById('btn-send-comment');
const commentsContainer = document.getElementById('comments-container');
const commentsCountEl = document.getElementById('comments-count');

// --- Initialize App ---
function init() {
  renderSidebarLessons();
  renderOverviewLessons();
  updateProgress();
  loadLesson(currentLessonIndex);
  setupVideoControls();
  setupEventListeners();
  loadSavedNotes();
}

// Render lessons in Player sidebar
function renderSidebarLessons() {
  lessonsListEl.innerHTML = '';
  lessons.forEach((lesson, index) => {
    const item = document.createElement('div');
    item.className = `lesson-item ${index === currentLessonIndex ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="lesson-status-icon">${lesson.completed ? '✓' : index + 1}</div>
      <div class="lesson-info">
        <div class="lesson-title">${lesson.title}</div>
        <div class="lesson-meta">Video - ${lesson.duration} mins</div>
      </div>
    `;
    item.addEventListener('click', () => {
      loadLesson(index);
    });
    lessonsListEl.appendChild(item);
  });
}

// Render lessons in Overview accordion
function renderOverviewLessons() {
  overviewLessonsListEl.innerHTML = '';
  lessons.forEach((lesson, index) => {
    const row = document.createElement('div');
    row.className = 'overview-lesson-row';
    row.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="color: ${lesson.completed ? '#10b981' : '#64748b'}; font-size: 1.1rem;">${lesson.completed ? '✔' : '▶'}</span>
        <span style="font-weight: 500;">${lesson.title}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 16px; color: #64748b;">
        <span>${lesson.duration}</span>
        <span style="cursor: pointer;" title="Aperçu">👁</span>
      </div>
    `;
    row.addEventListener('click', () => {
      loadLesson(index);
      switchToView('player');
    });
    overviewLessonsListEl.appendChild(row);
  });
}

// Update Course Progress Percentage
function updateProgress() {
  const completedCount = lessons.filter(l => l.completed).length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  progressPercentEl.textContent = `${percent}%`;
  progressFillEl.style.width = `${percent}%`;
}

// Load a specific lesson into player
function loadLesson(index) {
  currentLessonIndex = index;
  const lesson = lessons[index];

  currentLessonTitleEl.textContent = lesson.title;
  currentLessonDescEl.textContent = lesson.description;

  currentLessonTagsEl.innerHTML = lesson.tags
    .map(tag => `<span class="tag">${tag}</span>`)
    .join('');

  // Switch video source
  videoEl.src = lesson.videoUrl;
  videoEl.load();

  // Reset controls state
  ctrlPlayIcon.style.display = 'block';
  ctrlPauseIcon.style.display = 'none';
  bigPlayBtn.classList.remove('hidden');

  renderSidebarLessons();
}

// Setup Video Controls
function setupVideoControls() {
  function togglePlay() {
    if (videoEl.paused || videoEl.ended) {
      videoEl.play();
      ctrlPlayIcon.style.display = 'none';
      ctrlPauseIcon.style.display = 'block';
      bigPlayBtn.classList.add('hidden');
    } else {
      videoEl.pause();
      ctrlPlayIcon.style.display = 'block';
      ctrlPauseIcon.style.display = 'none';
      bigPlayBtn.classList.remove('hidden');
    }
  }

  bigPlayBtn.addEventListener('click', togglePlay);
  ctrlPlayPauseBtn.addEventListener('click', togglePlay);
  videoEl.addEventListener('click', togglePlay);

  videoEl.addEventListener('timeupdate', () => {
    const cur = videoEl.currentTime;
    const dur = videoEl.duration || 1;
    seekBarEl.value = (cur / dur) * 100;

    const curM = Math.floor(cur / 60).toString().padStart(2, '0');
    const curS = Math.floor(cur % 60).toString().padStart(2, '0');
    const durM = Math.floor(dur / 60).toString().padStart(2, '0');
    const durS = Math.floor(dur % 60).toString().padStart(2, '0');
    timeDisplayEl.textContent = `${curM}:${curS} / ${durM}:${durS}`;
  });

  seekBarEl.addEventListener('input', () => {
    const time = (seekBarEl.value / 100) * videoEl.duration;
    videoEl.currentTime = time;
  });

  ctrlFullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.getElementById('video-box').requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  ctrlMuteBtn.addEventListener('click', () => {
    videoEl.muted = !videoEl.muted;
    ctrlMuteBtn.style.opacity = videoEl.muted ? '0.5' : '1';
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Mark as Done Button
  btnMarkDone.addEventListener('click', () => {
    lessons[currentLessonIndex].completed = true;
    updateProgress();
    renderSidebarLessons();
    renderOverviewLessons();

    // Auto-advance
    if (currentLessonIndex < lessons.length - 1) {
      loadLesson(currentLessonIndex + 1);
    }
  });

  // Next Lesson Button
  btnNextLesson.addEventListener('click', () => {
    if (currentLessonIndex < lessons.length - 1) {
      loadLesson(currentLessonIndex + 1);
    } else {
      alert("🎉 Félicitations ! Vous avez terminé toutes les leçons de ce module.");
    }
  });

  // View Switching
  btnToOverview.addEventListener('click', () => switchToView('overview'));
  btnBackToPlayer.addEventListener('click', () => switchToView('player'));

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Take Note Quick Trigger
  document.getElementById('btn-take-note').addEventListener('click', () => {
    document.querySelector('[data-tab="tab-notes"]').click();
    noteInput.focus();
  });

  // Save Note
  btnSaveNote.addEventListener('click', saveNote);

  // Send Comment
  btnSendComment.addEventListener('click', addComment);
}

function switchToView(view) {
  if (view === 'overview') {
    playerView.classList.remove('view-active');
    playerView.classList.add('view-hidden');
    overviewView.classList.remove('view-hidden');
    overviewView.classList.add('view-active');
  } else {
    overviewView.classList.remove('view-active');
    overviewView.classList.add('view-hidden');
    playerView.classList.remove('view-hidden');
    playerView.classList.add('view-active');
  }
}

// Notes System
function saveNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  const cur = videoEl.currentTime || 0;
  const m = Math.floor(cur / 60).toString().padStart(2, '0');
  const s = Math.floor(cur % 60).toString().padStart(2, '0');
  const timestamp = `${m}:${s}`;

  const noteObj = {
    lessonId: lessons[currentLessonIndex].id,
    time: timestamp,
    text: text,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  let notes = JSON.parse(localStorage.getItem('iziroad:notes') || '[]');
  notes.unshift(noteObj);
  localStorage.setItem('iziroad:notes', JSON.stringify(notes));

  noteInput.value = '';
  loadSavedNotes();
}

function loadSavedNotes() {
  const notes = JSON.parse(localStorage.getItem('iziroad:notes') || '[]');
  if (notes.length === 0) return;

  notesListEl.innerHTML = notes.map(n => `
    <div class="note-card">
      <span class="note-timestamp">⏱ ${n.time} &bull; ${n.date}</span>
      <p>${escapeHtml(n.text)}</p>
    </div>
  `).join('');
}

// Comments System
function addComment() {
  const text = commentTextInput.value.trim();
  if (!text) return;

  const item = document.createElement('div');
  item.className = 'comment-item';
  item.innerHTML = `
    <div class="comment-avatar">AR</div>
    <div class="comment-body">
      <div class="comment-author">Arabi Abderrahmane <span class="comment-date">À l'instant</span></div>
      <p>${escapeHtml(text)}</p>
    </div>
  `;

  commentsContainer.insertBefore(item, commentsContainer.firstChild);
  commentTextInput.value = '';

  const count = commentsContainer.querySelectorAll('.comment-item').length;
  commentsCountEl.textContent = count;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Start app
init();
