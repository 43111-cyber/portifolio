/**
 * ==========================================================================
 * ADRIEL OS — MOTOR DO SISTEMA OPERACIONAL (WEB DESKTOP ENGINE)
 * Desenvolvido em JavaScript Puro (Vanilla JS) para Adriel Morback
 * ==========================================================================
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. CONFIGURAÇÃO GLOBAL & ESTADO DO SISTEMA
  // ------------------------------------------------------------------------
  const APP_CONFIG = {
    about: {
      id: 'about',
      title: 'Sobre Adriel',
      icon: 'assets/icons/about.svg',
      defaultWidth: 700,
      defaultHeight: 560
    },
    projects: {
      id: 'projects',
      title: 'Meus Projetos',
      icon: 'assets/icons/projects.svg',
      defaultWidth: 840,
      defaultHeight: 620
    },
    skills: {
      id: 'skills',
      title: 'Minhas Habilidades',
      icon: 'assets/icons/skills.svg',
      defaultWidth: 740,
      defaultHeight: 580
    },
    github: {
      id: 'github',
      title: 'Meu GitHub',
      icon: 'assets/icons/github.svg',
      defaultWidth: 640,
      defaultHeight: 520
    },
    contact: {
      id: 'contact',
      title: 'Contato',
      icon: 'assets/icons/contact.svg',
      defaultWidth: 680,
      defaultHeight: 600
    },
    trash: {
      id: 'trash',
      title: 'Lixeira',
      icon: 'assets/icons/trash.svg',
      defaultWidth: 500,
      defaultHeight: 400
    },
    wallpaper: {
      id: 'wallpaper',
      title: 'Wallpapers',
      icon: 'assets/icons/settings.svg',
      defaultWidth: 640,
      defaultHeight: 460
    }
  };

  const WALLPAPERS = [
    'adriel_tactical_pitch.jpg',
    'cyber_matrix_pitch.svg',
    'deep_space_aurora.svg',
    'minimal_slate_field.svg'
  ];

  // Estado das janelas em tempo de execução
  const windowStates = {};
  let highestZIndex = 100;
  let activeWindowId = null;
  let soundEnabled = true;
  let audioCtx = null;
  let currentWallpaperIndex = 0;

  // ------------------------------------------------------------------------
  // 2. SISTEMA DE ÁUDIO SINTETIZADO (WEB AUDIO API)
  // ------------------------------------------------------------------------
  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
  }

  function playSound(type) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'open') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'close') {
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'toast') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      // Ignora silenciosamente caso bloqueado pelo navegador
    }
  }

  // ------------------------------------------------------------------------
  // 3. TOAST NOTIFICATION SYSTEM
  // ------------------------------------------------------------------------
  window.showToast = function (message, icon = '⚡') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    playSound('toast');

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  // ------------------------------------------------------------------------
  // 4. TELA DE INICIALIZAÇÃO (BOOTLOADER)
  // ------------------------------------------------------------------------
  function initBootloader() {
    const bootScreen = document.getElementById('boot-screen');
    const progressBar = document.getElementById('boot-progress-bar');
    const percentLabel = document.getElementById('boot-percent');
    const statusLabel = document.getElementById('boot-status-text');
    const consoleBox = document.getElementById('boot-console');
    const skipBtn = document.getElementById('btn-skip-boot');

    if (!bootScreen) return;

    const bootSteps = [
      { pct: 15, msg: 'Iniciando Kernel v1.0.4...', log: '> [SYS] Kernel montado com sucesso (x86_64 web-core).' },
      { pct: 40, msg: 'Carregando subsistema gráfico...', log: '> [GPU] Shader neon pitch inicializado [OK].' },
      { pct: 68, msg: 'Carregando módulos de projetos...', log: '> [REPO] 43111-cyber/jogo-ste e Apostila de Excel indexados [OK].' },
      { pct: 90, msg: 'Montando Área de Trabalho...', log: '> [GUI] Glassmorphism & Drag Engine ativos.' },
      { pct: 100, msg: 'AdrielOS Pronto!', log: '> [SYS] Ambiente carregado. Bem-vindo, Adriel Morback!' }
    ];

    let currentStep = 0;
    let bootCompleted = false;

    function finishBoot() {
      if (bootCompleted) return;
      bootCompleted = true;

      if (progressBar) progressBar.style.width = '100%';
      if (percentLabel) percentLabel.textContent = '100%';
      if (statusLabel) statusLabel.textContent = 'AdrielOS Pronto!';

      setTimeout(() => {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
          bootScreen.style.display = 'none';
          showToast('Bem-vindo ao AdrielOS! Dê um duplo clique nos ícones para abrir aplicativos.', '⚡');
        }, 450);
      }, 350);
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', finishBoot);
    }

    // Avanço progressivo
    const interval = setInterval(() => {
      if (bootCompleted) {
        clearInterval(interval);
        return;
      }

      if (currentStep < bootSteps.length) {
        const step = bootSteps[currentStep];
        if (progressBar) progressBar.style.width = step.pct + '%';
        if (percentLabel) percentLabel.textContent = step.pct + '%';
        if (statusLabel) statusLabel.textContent = step.msg;

        if (consoleBox) {
          const logLine = document.createElement('div');
          logLine.className = 'boot-log-line';
          logLine.textContent = step.log;
          consoleBox.appendChild(logLine);
          consoleBox.scrollTop = consoleBox.scrollHeight;
        }

        currentStep++;
      } else {
        clearInterval(interval);
        finishBoot();
      }
    }, 420);
  }

  // ------------------------------------------------------------------------
  // 5. GERENCIADOR DE PAPEL DE PAREDE
  // ------------------------------------------------------------------------
  window.setWallpaper = function (filename) {
    const layer = document.getElementById('wallpaper-layer');
    if (!layer) return;

    layer.style.backgroundImage = `url('assets/wallpapers/${filename}')`;
    localStorage.setItem('adriel_os_wallpaper', filename);

    // Atualiza seleção visual na janela de wallpaper
    const options = document.querySelectorAll('.wallpaper-option');
    options.forEach(opt => {
      if (opt.getAttribute('data-wp') === filename) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    const index = WALLPAPERS.indexOf(filename);
    if (index !== -1) {
      currentWallpaperIndex = index;
    }

    playSound('click');
    showToast(`Papel de parede atualizado para: ${filename.replace(/\.[^/.]+$/, '')}`, '🖼️');
  };

  window.cycleWallpaper = function () {
    currentWallpaperIndex = (currentWallpaperIndex + 1) % WALLPAPERS.length;
    window.setWallpaper(WALLPAPERS[currentWallpaperIndex]);
  };

  function initWallpaper() {
    const saved = localStorage.getItem('adriel_os_wallpaper') || 'adriel_tactical_pitch.jpg';
    window.setWallpaper(saved);
  }

  // ------------------------------------------------------------------------
  // 6. GERENCIAMENTO DE JANELAS (WINDOW MANAGER)
  // ------------------------------------------------------------------------
  function getCenteredPosition(width, height) {
    const desktop = document.getElementById('desktop');
    const screenW = desktop ? desktop.clientWidth : window.innerWidth;
    const screenH = desktop ? desktop.clientHeight : window.innerHeight;

    // Em telas pequenas / mobile, usa margens ajustadas
    if (screenW <= 768) {
      return { x: screenW * 0.025, y: 10 };
    }

    // Leve deslocamento cascata caso outras janelas estejam abertas
    const offset = (Object.keys(windowStates).filter(k => windowStates[k].isOpen).length % 5) * 22;

    const x = Math.max(20, Math.floor((screenW - width) / 2) + offset);
    const y = Math.max(20, Math.floor((screenH - height) / 2) + offset);

    return { x, y };
  }

  function bringToFront(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    highestZIndex++;
    win.style.zIndex = highestZIndex;
    activeWindowId = appId;

    // Atualiza classes ativas de todas as janelas
    document.querySelectorAll('.os-window').forEach(w => {
      w.classList.remove('active');
    });
    win.classList.add('active');

    // Atualiza abas da barra de tarefas
    document.querySelectorAll('.taskbar-app-tab').forEach(tab => {
      if (tab.getAttribute('data-app') === appId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  window.openApp = function (appId) {
    const config = APP_CONFIG[appId];
    const win = document.getElementById(`win-${appId}`);
    if (!win || !config) return;

    // Fecha menu iniciar e menu de contexto ao abrir app
    closeStartMenu();
    closeContextMenu();

    if (!windowStates[appId]) {
      const pos = getCenteredPosition(config.defaultWidth, config.defaultHeight);
      windowStates[appId] = {
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        x: pos.x,
        y: pos.y,
        width: config.defaultWidth,
        height: config.defaultHeight
      };

      if (window.innerWidth > 768) {
        win.style.width = `${config.defaultWidth}px`;
        win.style.height = `${config.defaultHeight}px`;
        win.style.left = `${pos.x}px`;
        win.style.top = `${pos.y}px`;
      }
    } else {
      windowStates[appId].isOpen = true;
    }

    // Se estiver minimizado, restaura
    if (windowStates[appId].isMinimized) {
      windowStates[appId].isMinimized = false;
      win.classList.remove('minimized');
    }

    win.style.display = 'flex';
    bringToFront(appId);
    updateTaskbarApps();
    playSound('open');
  };

  window.minimizeApp = function (appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win || !windowStates[appId]) return;

    windowStates[appId].isMinimized = true;
    win.classList.add('minimized');
    win.classList.remove('active');

    if (activeWindowId === appId) {
      activeWindowId = null;
      // Passa o foco para a próxima janela visível
      const openApps = Object.keys(windowStates).filter(
        id => windowStates[id].isOpen && !windowStates[id].isMinimized
      );
      if (openApps.length > 0) {
        bringToFront(openApps[openApps.length - 1]);
      }
    }

    updateTaskbarApps();
    playSound('click');
  };

  window.maximizeApp = function (appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win || !windowStates[appId]) return;

    const state = windowStates[appId];
    state.isMaximized = !state.isMaximized;

    if (state.isMaximized) {
      win.classList.add('maximized');
    } else {
      win.classList.remove('maximized');
    }

    bringToFront(appId);
    playSound('click');
  };

  window.closeApp = function (appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    win.style.display = 'none';
    win.classList.remove('active', 'maximized', 'minimized');

    if (windowStates[appId]) {
      windowStates[appId].isOpen = false;
      windowStates[appId].isMinimized = false;
      windowStates[appId].isMaximized = false;
    }

    if (activeWindowId === appId) {
      activeWindowId = null;
    }

    updateTaskbarApps();
    playSound('close');
  };

  // ------------------------------------------------------------------------
  // 7. ARRASTAR JANELAS (DRAG & DROP COM SUPORTE A MOUSE E TOUCH)
  // ------------------------------------------------------------------------
  function initDraggable(win) {
    const titlebar = win.querySelector('.window-titlebar');
    if (!titlebar) return;

    const appId = win.getAttribute('data-app');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onPointerDown(e) {
      // Ignora clique nos botões de controle
      if (e.target.closest('.win-btn')) return;
      if (windowStates[appId] && windowStates[appId].isMaximized) return;
      if (window.innerWidth <= 768) return; // Desativa arraste livre no mobile

      isDragging = true;
      bringToFront(appId);

      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

      startX = clientX;
      startY = clientY;

      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);

      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const clientX = e.clientX !== undefined ? e.clientX : (e.touches ? e.touches[0].clientX : startX);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches ? e.touches[0].clientY : startY);

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      // Limites de segurança da tela
      const desktop = document.getElementById('desktop');
      const maxRight = (desktop ? desktop.clientWidth : window.innerWidth) - 80;
      const maxBottom = (desktop ? desktop.clientHeight : window.innerHeight) - 40;

      newLeft = Math.max(-win.clientWidth + 80, Math.min(newLeft, maxRight));
      newTop = Math.max(0, Math.min(newTop, maxBottom));

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;

      if (windowStates[appId]) {
        windowStates[appId].x = newLeft;
        windowStates[appId].y = newTop;
      }
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    }

    titlebar.addEventListener('mousedown', onPointerDown);
    titlebar.addEventListener('touchstart', onPointerDown, { passive: false });

    // Foco ao clicar no corpo da janela
    win.addEventListener('mousedown', () => bringToFront(appId));
    win.addEventListener('touchstart', () => bringToFront(appId), { passive: true });
  }

  function initWindows() {
    document.querySelectorAll('.os-window').forEach(win => {
      const appId = win.getAttribute('data-app');

      // Botões da barra de controle
      const minBtn = win.querySelector('.win-btn-minimize');
      const maxBtn = win.querySelector('.win-btn-maximize');
      const closeBtn = win.querySelector('.win-btn-close');

      if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); window.minimizeApp(appId); });
      if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); window.maximizeApp(appId); });
      if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); window.closeApp(appId); });

      initDraggable(win);
    });
  }

  // ------------------------------------------------------------------------
  // 8. BARRA DE TAREFAS (TASKBAR)
  // ------------------------------------------------------------------------
  function updateTaskbarApps() {
    const container = document.getElementById('taskbar-apps');
    if (!container) return;

    container.innerHTML = '';

    // Cria abas para aplicativos abertos
    Object.keys(windowStates).forEach(appId => {
      const state = windowStates[appId];
      if (!state.isOpen) return;

      const config = APP_CONFIG[appId];
      if (!config) return;

      const tab = document.createElement('button');
      tab.className = 'taskbar-app-tab open';
      if (!state.isMinimized && activeWindowId === appId) {
        tab.classList.add('active');
      }
      tab.setAttribute('data-app', appId);
      tab.setAttribute('title', config.title);

      tab.innerHTML = `
        <img src="${config.icon}" alt="">
        <span class="taskbar-tab-title">${config.title}</span>
      `;

      tab.addEventListener('click', () => {
        if (state.isMinimized) {
          window.openApp(appId);
        } else if (activeWindowId === appId) {
          window.minimizeApp(appId);
        } else {
          bringToFront(appId);
        }
      });

      container.appendChild(tab);
    });
  }

  function initClock() {
    const timeEl = document.getElementById('taskbar-clock');
    const dateEl = document.getElementById('taskbar-date');

    function update() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');

      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      if (timeEl) timeEl.textContent = `${hours}:${mins}:${secs}`;
      if (dateEl) dateEl.textContent = `${day}/${month}/${year}`;
    }

    update();
    setInterval(update, 1000);
  }

  // ------------------------------------------------------------------------
  // 9. MENU INICIAR & PESQUISA EM TEMPO REAL
  // ------------------------------------------------------------------------
  function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    const startBtn = document.getElementById('start-button');
    if (!menu) return;

    const isVisible = menu.style.display !== 'none';
    if (isVisible) {
      closeStartMenu();
    } else {
      closeContextMenu();
      menu.style.display = 'flex';
      if (startBtn) {
        startBtn.classList.add('active');
        startBtn.setAttribute('aria-expanded', 'true');
      }
      playSound('click');

      // Foca automaticamente no campo de pesquisa
      const input = document.getElementById('start-search-input');
      if (input) {
        input.value = '';
        filterStartApps('');
        setTimeout(() => input.focus(), 60);
      }
    }
  }

  function closeStartMenu() {
    const menu = document.getElementById('start-menu');
    const startBtn = document.getElementById('start-button');
    if (menu) menu.style.display = 'none';
    if (startBtn) {
      startBtn.classList.remove('active');
      startBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function filterStartApps(query) {
    const q = query.toLowerCase().trim();
    const items = document.querySelectorAll('.start-app-item');
    const noResults = document.getElementById('start-no-results');
    const clearBtn = document.getElementById('start-search-clear');

    if (clearBtn) {
      if (q.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    let matchCount = 0;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();

      if (!q || text.includes(q) || keywords.includes(q)) {
        item.style.display = 'flex';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noResults) {
      if (matchCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  }

  function initStartMenu() {
    const startBtn = document.getElementById('start-button');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
      });
    }

    const searchInput = document.getElementById('start-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterStartApps(e.target.value);
      });
    }

    const clearBtn = document.getElementById('start-search-clear');
    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterStartApps('');
        searchInput.focus();
      });
    }

    // Clique nos aplicativos do Menu Iniciar
    document.querySelectorAll('.start-app-item').forEach(item => {
      item.addEventListener('click', () => {
        const appId = item.getAttribute('data-app');
        if (appId) {
          window.openApp(appId);
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 10. MENU DE CONTEXTO (BOTÃO DIREITO NA ÁREA DE TRABALHO)
  // ------------------------------------------------------------------------
  function openContextMenu(x, y) {
    const menu = document.getElementById('context-menu');
    if (!menu) return;

    closeStartMenu();

    menu.style.display = 'block';

    const menuW = menu.offsetWidth || 210;
    const menuH = menu.offsetHeight || 160;
    const maxLeft = window.innerWidth - menuW - 10;
    const maxTop = window.innerHeight - menuH - 60;

    menu.style.left = `${Math.min(x, maxLeft)}px`;
    menu.style.top = `${Math.min(y, maxTop)}px`;

    playSound('click');
  }

  function closeContextMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) menu.style.display = 'none';
  }

  window.refreshDesktop = function () {
    closeContextMenu();
    playSound('toast');
    showToast('Área de trabalho atualizada com sucesso!', '🔄');
  };

  // ------------------------------------------------------------------------
  // 11. ÍCONES DO DESKTOP (DUPLO CLIQUE NO DESKTOP, TOQUE ÚNICO NO MOBILE)
  // ------------------------------------------------------------------------
  function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');

    icons.forEach(icon => {
      const appId = icon.getAttribute('data-app');

      // Seleção visual no clique simples
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        icons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        playSound('click');

        // Se for dispositivo touch / tela pequena, abre com toque simples
        if (window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024)) {
          window.openApp(appId);
        }
      });

      // Duplo clique para desktop tradicional
      icon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        window.openApp(appId);
      });

      // Acessibilidade via teclado (Enter / Espaço abre o app)
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openApp(appId);
        }
      });
    });

    // Desseleciona ícones ao clicar em área vazia do desktop
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.os-window') && !e.target.closest('.context-menu')) {
          icons.forEach(i => i.classList.remove('selected'));
          closeStartMenu();
          closeContextMenu();
        }
      });

      // Menu de contexto com botão direito
      desktop.addEventListener('contextmenu', (e) => {
        if (!e.target.closest('.os-window')) {
          e.preventDefault();
          openContextMenu(e.clientX, e.clientY);
        }
      });
    }
  }

  // ------------------------------------------------------------------------
  // 12. TEMA (CLARO / ESCURO) & SOM DO SISTEMA
  // ------------------------------------------------------------------------
  function initTheme() {
    const btn = document.getElementById('btn-toggle-theme');
    const icon = document.getElementById('theme-btn-icon');
    const label = document.getElementById('theme-btn-label');

    const savedTheme = localStorage.getItem('adriel_os_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    function updateThemeUI(theme) {
      if (theme === 'light') {
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Modo Claro';
      } else {
        if (icon) icon.textContent = '🌙';
        if (label) label.textContent = 'Modo Escuro';
      }
    }

    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('adriel_os_theme', next);
        updateThemeUI(next);
        playSound('click');
        showToast(`Tema alterado para: ${next === 'dark' ? 'Modo Escuro' : 'Modo Claro'}`, '🎨');
      });
    }
  }

  function initSoundToggle() {
    const btn = document.getElementById('btn-sound-toggle');
    const icon = document.getElementById('sound-icon');

    const saved = localStorage.getItem('adriel_os_sound');
    soundEnabled = saved !== 'false';
    if (icon) icon.textContent = soundEnabled ? '🔊' : '🔇';

    if (btn) {
      btn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('adriel_os_sound', soundEnabled);
        if (icon) icon.textContent = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) playSound('click');
        showToast(`Efeitos sonoros: ${soundEnabled ? 'Ativados' : 'Desativados'}`, soundEnabled ? '🔊' : '🔇');
      });
    }
  }

  // ------------------------------------------------------------------------
  // 13. AÇÕES DOS APLICATIVOS (FORMULÁRIO, CLONE GITHUB, REINICIAR)
  // ------------------------------------------------------------------------
  window.copyCloneUrl = function () {
    const input = document.getElementById('clone-url-input');
    const btn = document.getElementById('btn-copy-clone');
    if (!input) return;

    navigator.clipboard.writeText(input.value).then(() => {
      playSound('toast');
      if (btn) btn.textContent = 'Copiado!';
      setTimeout(() => {
        if (btn) btn.textContent = 'Copiar';
      }, 2000);
      showToast('Comando Git clonado para a área de transferência!', '📋');
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      showToast('Comando copiado!', '📋');
    });
  };

  window.handleContactSubmit = function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const msgInput = document.getElementById('contact-message');
    const feedback = document.getElementById('contact-feedback');

    if (!nameInput || !emailInput || !msgInput || !feedback) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const msg = msgInput.value.trim();

    // Validação básica
    if (!name || !email || !msg) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Por favor, preencha todos os campos obrigatórios (*).';
      feedback.classList.remove('hidden');
      playSound('close');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Por favor, insira um endereço de e-mail válido.';
      feedback.classList.remove('hidden');
      playSound('close');
      return;
    }

    feedback.className = 'form-feedback success';
    feedback.innerHTML = `
      <strong>Mensagem validada com sucesso, ${name}!</strong><br>
      Como este é um ambiente estático, você pode enviar diretamente por:
      <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="mailto:adriel.morback@gmail.com?subject=${encodeURIComponent(subject || 'Contato via AdrielOS')}&body=${encodeURIComponent(msg + '\n\nDe: ' + name + ' (' + email + ')')}" class="btn btn-secondary btn-sm" style="color: #34d399;">
          ✉️ Enviar via E-mail
        </a>
        <a href="https://wa.me/5519974226148?text=${encodeURIComponent('Olá Adriel! Meu nome é ' + name + ' (' + email + '). ' + msg)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #25d366;">
          💬 Enviar via WhatsApp
        </a>
      </div>
    `;
    feedback.classList.remove('hidden');

    playSound('toast');
    showToast(`Obrigado pelo contato, ${name}! Escolha o canal para envio direto.`, '📬');
  };

  window.restartSystem = function () {
    closeStartMenu();
    playSound('toast');
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) {
      bootScreen.style.display = 'flex';
      bootScreen.classList.remove('fade-out');

      // Fecha todas as janelas abertas
      Object.keys(windowStates).forEach(appId => {
        window.closeApp(appId);
      });

      initBootloader();
    }
  };

  // ------------------------------------------------------------------------
  // 14. ATALHOS DE TECLADO
  // ------------------------------------------------------------------------
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // ESC fecha start menu, context menu ou a janela em foco
      if (e.key === 'Escape') {
        const startMenu = document.getElementById('start-menu');
        const contextMenu = document.getElementById('context-menu');

        if (startMenu && startMenu.style.display !== 'none') {
          closeStartMenu();
          return;
        }

        if (contextMenu && contextMenu.style.display !== 'none') {
          closeContextMenu();
          return;
        }

        // Se uma janela estiver em foco, minimiza-a
        if (activeWindowId) {
          window.minimizeApp(activeWindowId);
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 15. INICIALIZAÇÃO GERAL DO SISTEMA
  // ------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initBootloader();
    initWallpaper();
    initWindows();
    initClock();
    initStartMenu();
    initDesktopIcons();
    initTheme();
    initSoundToggle();
    initKeyboardShortcuts();
  });

})();
