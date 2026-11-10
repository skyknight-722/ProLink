/**
 * ProjectLink — Student Project Collaboration Platform
 * Clean Technical Architecture & High-Contrast Cyber Aesthetics
 * Authentication, Dedicated Admin Portal (Direct Link Only),
 * 11 Core Directions Classification (Photo 4 Match),
 * Distinct Tabs (Main, Projects, About, Profile, Admin),
 * and Application System managed directly by project creators.
 */

// Fresh Storage Key to ensure clean state
const STATE_KEY = 'projectlink_platform_state_v3';

// 11 Core Directions from Photo 4
const PROJECT_CATEGORIES = [
  { id: 'IT', name: 'IT & Dasturlash', desc: 'Web-saytlar, mobil ilovalar, botlar, platformalar', icon: 'fa-code', color: '#38bdf8' },
  { id: 'AI', name: 'AI & Data Science', desc: 'Sun\'iy intellekt, ML, chatbotlar, data analysis', icon: 'fa-brain', color: '#a855f7' },
  { id: 'Education', name: 'Ta\'lim & Ilm-fan', desc: 'EdTech, olimpiadalar, ilmiy tadqiqotlar', icon: 'fa-graduation-cap', color: '#3b82f6' },
  { id: 'Ecology', name: 'Ekologiya & Agrotech', desc: 'Atrof-muhit, qayta ishlash, qishloq xo\'jaligi', icon: 'fa-leaf', color: '#10b981' },
  { id: 'Social', name: 'Volontyorlik & Social Impact', desc: 'Xayriya, yoshlar tashabbuslari, jamiyatga foyda', icon: 'fa-hand-holding-heart', color: '#f43f5e' },
  { id: 'Startup', name: 'Startup & Biznes', desc: 'Yangi mahsulotlar, tadbirkorlik, biznes loyihalar', icon: 'fa-rocket', color: '#f59e0b' },
  { id: 'Media', name: 'Media & Kreativ', desc: 'Mobilografiya, dizayn, kontent, SMM, jurnalistika', icon: 'fa-film', color: '#ec4899' },
  { id: 'Robotics', name: 'Muhandislik & Robototexnika', desc: 'Robotlar, elektronika, IoT, dronlar', icon: 'fa-robot', color: '#06b6d4' },
  { id: 'Health', name: 'Sog\'liq & Sport', desc: 'HealthTech, salomatlik va sport tashabbuslari', icon: 'fa-heartbeat', color: '#ef4444' },
  { id: 'Urban', name: 'Shahar & Transport', desc: 'Urbanistika, jamoat transporti, Smart City', icon: 'fa-city', color: '#14b8a6' },
  { id: 'Culture', name: 'Madaniyat & San\'at', desc: 'Musiqa, teatr, ijodiy va madaniy loyihalar', icon: 'fa-palette', color: '#eab308' }
];

// Default Seeded Users (Without referral codes)
const defaultUsers = [
  {
    id: 'usr_admin',
    name: 'Platform Administrator',
    handle: 'admin_projectlink',
    email: 'admin@projectlink.uz',
    password: 'admin123',
    role: 'admin',
    title: 'Bosh Moderator & Tizim Administratori',
    university: 'Toshkent Axborot Texnologiyalari Universiteti (TATU)',
    location: 'Toshkent, O‘zbekiston',
    age: 24,
    bio: 'ProjectLink loyihalar platformasi boshqaruv va moderatsiya hisobi. Barcha 11 yo‘nalishdagi tashabbuslarni muvofiqlashtiruvchi.',
    skills: ['System Administration', 'Ecosystem Moderation', 'Platform Governance'],
    github: '',
    telegram: 'https://t.me/projectlink_uz',
    portfolio: 'https://projectlink.uz',
    status: 'Active',
    isVerified: true,
    avatarInitials: 'PA',
    joinedDate: '2024-01-01'
  },
  {
    id: 'usr_student',
    name: 'Azizbek Alimov',
    handle: 'azizbek_dev',
    email: 'azizbek@projectlink.uz',
    password: 'user123',
    role: 'user',
    title: 'Frontend Dasturchi',
    university: 'Inha Universiteti (Toshkent)',
    location: 'Toshkent, O‘zbekiston',
    age: 20,
    bio: 'Veb texnologiyalar va amaliy dasturiy loyihalar ishqibozi.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
    github: '',
    telegram: 'https://t.me/azizbek_dev',
    portfolio: '',
    status: 'Active',
    isVerified: true,
    avatarInitials: 'AA',
    joinedDate: '2024-02-15'
  }
];

const defaultProjects = [];
const defaultApplications = [];

const defaultLogs = [
  '[08:00:01] [SYS_INIT] ProjectLink Platform initialized',
  '[08:00:15] [AUTH_SERVICE] Secure direct-link authentication engine online',
  '[08:01:22] [CAT_SYSTEM] 11 Core Directions classification matrix active and synced',
  '[08:02:00] [TELEMETRY] System health: 100% NOMINAL'
];

let state = {
  currentUserId: null, // Prompt to login/register upon first entering
  currentView: 'main', // 'main' | 'projects' | 'about' | 'profile' | 'admin'
  profileViewingUserId: null,
  adminTab: 'projects', // 'projects' | 'users' | 'applications' | 'terminal'
  adminCategoryFilter: 'all',
  projectCategoryFilter: 'all',
  profileTab: 'projects', // 'projects' | 'memberships' | 'applications' | 'manage_apps'
  searchQuery: '',
  activeChatProjectId: null,
  activeChatChannel: 'umumiy-chat',
  projectChats: {},
  users: defaultUsers,
  projects: defaultProjects,
  applications: defaultApplications,
  logs: defaultLogs
};

// Persistence
function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...state, ...parsed };
      // Ensure state arrays
      if (!Array.isArray(state.projects)) state.projects = [];
      if (!Array.isArray(state.applications)) state.applications = [];
      if (!Array.isArray(state.users) || state.users.length === 0) state.users = defaultUsers;
      if (!state.projectChats) state.projectChats = {};

      // Fix admin bio if old state exists
      const admin = state.users.find(u => u.id === 'usr_admin');
      if (admin && admin.bio && admin.bio.includes('IT va Ekologiya')) {
        admin.bio = 'ProjectLink loyihalar platformasi boshqaruv va moderatsiya hisobi. Barcha 11 yo‘nalishdagi tashabbuslarni muvofiqlashtiruvchi.';
      }
    }
  } catch (e) {
    console.warn('Could not load stored state, using defaults', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      currentUserId: state.currentUserId,
      currentView: state.currentView,
      profileViewingUserId: state.profileViewingUserId,
      users: state.users,
      projects: state.projects,
      applications: state.applications,
      projectChats: state.projectChats,
      logs: state.logs
    }));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

function getCurrentUser() {
  if (!state.currentUserId) return null;
  return state.users.find(u => u.id === state.currentUserId) || null;
}

function addLog(tag, message) {
  const time = new Date().toTimeString().split(' ')[0];
  const entry = `[${time}] [${tag}] ${message}`;
  state.logs.unshift(entry);
  if (state.logs.length > 100) state.logs.pop();
  saveState();
  renderAdminTerminalLogs();
}

// ==========================================================================
// Views & Navigation Management (Distinct Tabs: Main, Projects, About, Profile, Admin)
// ==========================================================================
function switchView(viewName) {
  state.currentView = viewName;
  if (viewName === 'profile') {
    state.profileViewingUserId = state.currentUserId || (state.users[0] && state.users[0].id);
  }

  document.querySelectorAll('.view-wrapper').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  // Re-render relevant view
  if (viewName === 'projects') renderProjects();
  if (viewName === 'profile') renderUserProfile();
  if (viewName === 'admin') renderAdminPanel();

  saveState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateHeaderRoleDisplay() {
  const user = getCurrentUser();
  const authContainer = document.getElementById('header-auth-container');
  const adminNavBtn = document.getElementById('nav-admin-btn');
  const profileNavBtn = document.getElementById('nav-profile-btn');

  // Admin tab visibility: only visible when logged in as admin via direct link
  if (adminNavBtn) {
    if (user && user.role === 'admin') {
      adminNavBtn.style.display = 'inline-flex';
      adminNavBtn.classList.remove('locked');
      adminNavBtn.title = 'Administrator paneli';
    } else {
      adminNavBtn.style.display = 'none';
    }
  }

  // Profile tab visibility
  if (profileNavBtn) {
    profileNavBtn.style.display = user ? 'inline-flex' : 'none';
  }

  // Header user / auth controls
  if (authContainer) {
    if (user) {
      const roleBadge = user.role === 'admin' 
        ? `<span class="user-role-badge user-role-admin"><i class="fas fa-shield-alt"></i> ADMIN</span>`
        : `<span class="user-role-badge user-role-user"><i class="fas fa-user"></i> USER</span>`;

      authContainer.innerHTML = `
        <div class="user-session-pill" onclick="switchView('profile')" title="Profilingizga o'tish">
          <div class="user-session-avatar">${user.avatarInitials}</div>
          <span style="font-weight: 600;">${user.name.split(' ')[0]}</span>
          ${roleBadge}
        </div>
        <button class="pl-btn pl-btn-ghost pl-btn-sm" onclick="handleLogout()" title="Tizimdan chiqish">
          <i class="fas fa-sign-out-alt"></i> Chiqish
        </button>
      `;
    } else {
      authContainer.innerHTML = `
        <button class="pl-btn pl-btn-ghost pl-btn-sm" onclick="openLoginModal()">
          <i class="fas fa-sign-in-alt"></i> Kirish
        </button>
        <button class="pl-btn pl-btn-paper pl-btn-sm" onclick="openRegisterModal()">
          <i class="fas fa-user-plus"></i> Ro'yxatdan o'tish
        </button>
      `;
    }
  }
}

// ==========================================================================
// Authentication: Email-based Login & Registration
// ==========================================================================
function openLoginModal() {
  closeAllModals();
  const modal = document.getElementById('modal-login');
  if (modal) modal.classList.add('active');
}

function openRegisterModal() {
  closeAllModals();
  const modal = document.getElementById('modal-register');
  if (modal) modal.classList.add('active');
}

function openWelcomeAuthModal() {
  closeAllModals();
  const modal = document.getElementById('modal-welcome-auth');
  if (modal) modal.classList.add('active');
}

function switchWelcomeTab(tab) {
  const loginBtn = document.getElementById('tab-btn-welcome-login');
  const regBtn = document.getElementById('tab-btn-welcome-register');
  const loginPane = document.getElementById('welcome-pane-login');
  const regPane = document.getElementById('welcome-pane-register');
  if (tab === 'login') {
    if (loginBtn) loginBtn.classList.add('active');
    if (regBtn) regBtn.classList.remove('active');
    if (loginPane) loginPane.style.display = 'block';
    if (regPane) regPane.style.display = 'none';
  } else {
    if (loginBtn) loginBtn.classList.remove('active');
    if (regBtn) regBtn.classList.add('active');
    if (loginPane) loginPane.style.display = 'none';
    if (regPane) regPane.style.display = 'block';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = (form.email.value || '').trim().toLowerCase();
  const password = (form.password.value || '').trim();

  if (!email || !password) {
    showToast('Iltimos, email va parolni kiriting', 'error');
    return;
  }

  // If Supabase is configured, try Supabase cloud login first
  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    try {
      showToast('Supabase orqali tekshirilmoqda...', 'info');
      const authData = await window.supabaseAdapter.signIn(email, password);
      if (authData && authData.user) {
        let user = state.users.find(u => u.email.toLowerCase() === email || u.id === authData.user.id);
        if (!user) {
          const initials = (authData.user.user_metadata?.name || email)
            .split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'PL';
          user = {
            id: authData.user.id,
            name: authData.user.user_metadata?.name || email.split('@')[0],
            handle: authData.user.user_metadata?.handle || email.split('@')[0],
            email: authData.user.email,
            password: password,
            role: authData.user.user_metadata?.role || 'user',
            title: authData.user.user_metadata?.title || 'Talaba / Dasturchi',
            university: authData.user.user_metadata?.university || 'TATU',
            location: 'Toshkent, O‘zbekiston',
            age: 21,
            bio: 'Supabase orqali tasdiqlangan foydalanuvchi hisobi.',
            skills: ['Full Stack', 'Cloud'],
            github: '',
            telegram: '',
            portfolio: '',
            status: 'Active',
            isVerified: true,
            avatarInitials: initials,
            joinedDate: new Date().toISOString().split('T')[0]
          };
          state.users.unshift(user);
        }
        state.currentUserId = user.id;
        addLog('AUTH_SUPABASE', `Supabase Auth: ${user.name} (${user.email}) tizimga kirdi`);
        saveState();
        closeAllModals();
        form.reset();
        updateHeaderRoleDisplay();
        if (state.currentView === 'profile') renderUserProfile();
        if (state.currentView === 'admin') renderAdminPanel();
        renderProjects();
        showToast(`Xush kelibsiz, ${user.name}! (Supabase Cloud)`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Supabase sign-in error:', err);
      showToast('Supabase: ' + (err.message || 'Kirishda xatolik yuz berdi'), 'error');
    }
  }

  const user = state.users.find(u => u.email.toLowerCase() === email && u.password === password);
  if (!user) {
    showToast('Email yoki parol noto‘g‘ri! Qaytadan urinib ko‘ring.', 'error');
    return;
  }

  if (user.status === 'Suspended') {
    showToast('Hisobingiz administrator tomonidan bloklangan.', 'error');
    return;
  }

  state.currentUserId = user.id;
  addLog('AUTH_LOGIN', `Tizimga muvaffaqiyatli kirildi: ${user.name} (${user.role.toUpperCase()})`);
  saveState();

  closeAllModals();
  form.reset();
  updateHeaderRoleDisplay();

  if (state.currentView === 'profile') renderUserProfile();
  if (state.currentView === 'admin') renderAdminPanel();
  renderProjects();

  showToast(`Xush kelibsiz, ${user.name}! [${user.role.toUpperCase()}]`, 'success');
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const name = (form.name.value || '').trim();
  const email = (form.email.value || '').trim().toLowerCase();
  const password = (form.password.value || '').trim();
  const confirmPassword = (form.confirmPassword.value || '').trim();

  if (!name || !email || !password) {
    showToast('Iltimos, barcha majburiy maydonlarni to‘ldiring', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Parol kamida 6 ta belgidan iborat bo‘lishi kerak', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Parollar mos kelmadi!', 'error');
    return;
  }

  const exists = state.users.some(u => u.email.toLowerCase() === email);
  if (exists) {
    showToast('Ushbu email bilan ro‘yxatdan o‘tilgan. Iltimos, tizimga kiring.', 'error');
    return;
  }

  const role = 'user';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'PL';

  let userId = `usr_${Date.now().toString().slice(-6)}`;

  // If Supabase is configured, create real cloud account
  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    try {
      showToast('Supabase orqali hisob ochilmoqda...', 'info');
      const authRes = await window.supabaseAdapter.signUp(email, password, {
        name,
        handle: email.split('@')[0],
        role: 'user'
      });
      if (authRes && authRes.user) {
        userId = authRes.user.id;
        addLog('AUTH_SUPABASE_REG', `Supabase Auth yangi foydalanuvchi: ${name} (${email})`);
      }
    } catch (err) {
      console.warn('Supabase sign-up error:', err);
      showToast('Supabase: ' + (err.message || 'Ro‘yxatdan o‘tishda xatolik'), 'warning');
    }
  }

  const newUser = {
    id: userId,
    name,
    handle: email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
    email,
    password,
    role,
    title: 'Yosh Tashabbuskor / Dasturchi',
    university: 'O‘zbekiston Ta’lim Muassasasi',
    location: 'Toshkent, O‘zbekiston',
    age: 20,
    bio: 'ProjectLink a’zosi. Yoshlar loyihalariga qiziqadi va amaliy jamoalarda qatnashadi.',
    skills: ['Teamwork', 'Communication'],
    github: '',
    telegram: '',
    portfolio: '',
    status: 'Active',
    isVerified: true,
    avatarInitials: initials,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  state.users.unshift(newUser);
  state.currentUserId = newUser.id;

  addLog('AUTH_REGISTER', `Yangi foydalanuvchi: ${newUser.name} (${newUser.email})`);
  saveState();

  closeAllModals();
  form.reset();
  updateHeaderRoleDisplay();
  renderProjects();

  showToast(`Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi! Xush kelibsiz, ${newUser.name}.`, 'success');
}

function handleLogout() {
  const user = getCurrentUser();
  const userName = user ? user.name : 'Foydalanuvchi';
  state.currentUserId = null;
  addLog('AUTH_LOGOUT', `Hisobdan chiqildi: ${userName}`);
  saveState();

  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    window.supabaseAdapter.signOut().catch(console.warn);
  }

  updateHeaderRoleDisplay();
  if (state.currentView === 'admin' || state.currentView === 'profile') {
    switchView('main');
  } else {
    renderProjects();
  }

  showToast('Tizimdan muvaffaqiyatli chiqdingiz.', 'success');
}

function loginAsDemo(roleType) {
  let targetUser = null;
  if (roleType === 'admin') {
    targetUser = state.users.find(u => u.role === 'admin') || state.users[0];
  } else {
    targetUser = state.users.find(u => u.role === 'user') || state.users[1] || state.users[0];
  }

  if (targetUser) {
    state.currentUserId = targetUser.id;
    addLog('AUTH_DEMO', `Demo kirish: ${targetUser.name} (${targetUser.role.toUpperCase()})`);
    saveState();
    closeAllModals();
    updateHeaderRoleDisplay();

    if (state.currentView === 'profile') renderUserProfile();
    if (state.currentView === 'admin') renderAdminPanel();
    renderProjects();

    showToast(`Tezkor kirish: ${targetUser.name} [${targetUser.role.toUpperCase()}]`, 'success');
  }
}

// ==========================================================================
// Category Classification System (11 Core Directions from Photo 4)
// ==========================================================================
function getCategoryInfo(catId) {
  if (!catId) return PROJECT_CATEGORIES[0];
  return PROJECT_CATEGORIES.find(c => c.id.toLowerCase() === catId.toLowerCase() || c.name.toLowerCase().includes(catId.toLowerCase())) || {
    id: catId,
    name: catId,
    desc: 'Loyiha yo‘nalishi',
    icon: 'fa-folder',
    color: '#38bdf8'
  };
}

function getCategoryBadge(catId) {
  const cat = getCategoryInfo(catId);
  return `<span class="badge-category" style="background: rgba(255, 255, 255, 0.08); color: ${cat.color}; border: 1px solid ${cat.color};">
    <i class="fas ${cat.icon}"></i> ${escapeHTML(cat.name)}
  </span>`;
}

function filterByDirection(catId) {
  state.projectCategoryFilter = catId;
  switchView('projects');
  renderProjects();
}

function updateProjectCategory(projectId, newCategory) {
  const cat = getCategoryInfo(newCategory);
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;

  const oldCat = project.category || 'Noma\'lum';
  project.category = newCategory;

  addLog('CAT_UPDATE', `'${project.title}' toifasi: ${oldCat} -> ${newCategory}`);
  saveState();

  if (state.currentView === 'admin') renderAdminPanel();
  if (state.currentView === 'projects') renderProjects();

  showToast(`Loyiha yo‘nalishi "${cat.name}" ga o‘zgartirildi!`, 'success');
}

function setProjectCategoryFilter(cat) {
  state.projectCategoryFilter = cat;
  renderProjects();
}

function setAdminCategoryFilter(cat) {
  state.adminCategoryFilter = cat;
  renderAdminPanel();
}

// ==========================================================================
// VIEW: Projects Rendering (Dedicated Projects Catalog)
// ==========================================================================
function renderProjects() {
  updatePreviewTelemetryStats();
  const container = document.getElementById('projects-container');
  if (!container) return;

  const query = (state.searchQuery || '').toLowerCase().trim();
  const catFilter = state.projectCategoryFilter || 'all';

  const filtered = state.projects.filter(p => {
    // Category match
    if (catFilter !== 'all' && (p.category || 'IT') !== catFilter) {
      return false;
    }
    // Search match
    if (!query) return true;
    return (
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.roleNeeded && p.roleNeeded.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  });

  // Dynamically render category filter tabs in view-projects
  const filterWrap = document.querySelector('.category-filter-wrap');
  if (filterWrap) {
    filterWrap.innerHTML = `
      <button class="cat-filter-btn ${catFilter === 'all' ? 'active' : ''}" data-category="all" onclick="setProjectCategoryFilter('all')">
        <i class="fas fa-th-large"></i> Barchasi <span class="cat-count">${state.projects.length}</span>
      </button>
      ${PROJECT_CATEGORIES.map(c => {
        const count = state.projects.filter(p => (p.category || 'IT') === c.id).length;
        const isActive = catFilter === c.id;
        return `
          <button class="cat-filter-btn ${isActive ? 'active' : ''}" data-category="${c.id}" onclick="setProjectCategoryFilter('${c.id}')" style="${isActive ? `background: ${c.color}; color: #04051a; border-color: ${c.color}; font-weight: 700;` : ''}">
            <i class="fas ${c.icon}" style="${isActive ? 'color: #04051a;' : `color: ${c.color};`}"></i> ${escapeHTML(c.name)} <span class="cat-count">${count}</span>
          </button>
        `;
      }).join('')}
    `;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-projects-box">
        <i class="fas fa-folder-open empty-projects-icon"></i>
        <h3 class="empty-projects-title">Hozircha loyihalar mavjud emas</h3>
        <p class="empty-projects-desc">
          ${query || catFilter !== 'all' 
            ? 'Tanlangan yo‘nalish yoki qidiruv bo‘yicha loyiha topilmadi.' 
            : 'Platformada birinchi bo‘lib o‘z loyihangizni e’lon qiling va yoshlar bilan faol jamoani shakllantiring!'}
        </p>
        <button class="pl-btn pl-btn-lime" onclick="openCreateProjectModal()">
          <i class="fas fa-plus"></i> [ + ILK LOYIHANGIZNI YARATING ]
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    let statusClass = 'status-open';
    if (p.status === 'Urgent') statusClass = 'status-urgent';
    if (p.isFeatured) statusClass = 'status-featured';

    const categoryBadge = getCategoryBadge(p.category || 'IT');

    return `
      <article class="project-card" data-id="${p.id}">
        <div class="project-header-bar">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="project-id-badge">PROJECT // ${p.id.toUpperCase()}</span>
            ${categoryBadge}
          </div>
          <span class="status-pill ${statusClass}">:${p.status}:</span>
        </div>
        
        <div class="project-body">
          <h3 class="project-title">${escapeHTML(p.title)}</h3>
          <p class="project-desc">${escapeHTML(p.description)}</p>
          
          <div class="project-tags">
            ${(p.tags || []).map(t => `<span class="project-tag">#${escapeHTML(t)}</span>`).join('')}
          </div>
          
          <div class="project-meta-strip">
            <div class="project-meta-item">
              <i class="fas fa-user-tag"></i>
              <span>${escapeHTML(p.roleNeeded)}</span>
            </div>
            <div class="project-meta-item">
              <i class="fas fa-map-pin"></i>
              <span>${escapeHTML(p.location || 'O‘zbekiston')}</span>
            </div>
            <div class="project-meta-item">
              <i class="fas fa-users"></i>
              <span>${p.applicationsCount || 0} Arizalar</span>
            </div>
            <div class="project-meta-item">
              <i class="fas fa-calendar-alt"></i>
              <span>Muddat: ${escapeHTML(p.deadline || '2025-12-31')}</span>
            </div>
          </div>
        </div>
        
        <div class="project-footer-bar">
          <div class="project-owner-cell" onclick="viewUserProfile('${p.ownerId}')" title="Muallif profilini ko'rish">
            <div class="owner-avatar">${p.ownerInitials || 'PL'}</div>
            <div class="owner-meta">
              <div class="owner-name">${escapeHTML(p.ownerName || 'Muallif')}</div>
              <div class="owner-role">Tashabbuskor &middot; :PROFIL:</div>
            </div>
          </div>
          
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <button class="pl-btn pl-btn-lime pl-btn-sm" onclick="openProjectChat('${p.id}')" title="Loyiha ichki Discord-style chati">
              <i class="fas fa-comments"></i> Chat
            </button>
            <button class="pl-btn pl-btn-ghost pl-btn-sm" onclick="openProjectDetailsModal('${p.id}')">
              Batafsil
            </button>
            <button class="pl-btn pl-btn-paper pl-btn-sm" onclick="openApplyModal('${p.id}')">
              Ariza &rarr;
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function handleSearch(e) {
  state.searchQuery = e.target.value;
  renderProjects();
}

// ==========================================================================
// VIEW: Dedicated Admin Panel (Projects List + Users List + Category Selector)
// ==========================================================================
function renderAdminPanel() {
  const container = document.getElementById('view-admin');
  if (!container) return;

  const currentUser = getCurrentUser();

  // Access Control: Administrator Clearance Guard
  if (!currentUser || currentUser.role !== 'admin') {
    container.innerHTML = `
      <div class="container" style="padding: 4rem 1.5rem;">
        <div style="max-width: 620px; margin: 0 auto; background: rgba(4,5,26,0.85); border: 1px solid var(--border-strong); padding: 3rem; text-align: center;">
          <i class="fas fa-user-lock" style="font-size: 3.5rem; color: var(--accent-rose); margin-bottom: 1.25rem;"></i>
          <h2 style="font-family: var(--font-hero); font-size: 2.2rem; text-transform: uppercase; color: var(--text-main); margin-bottom: 0.5rem;">
            Kirish Ruxsati Berilmadi
          </h2>
          <p style="font-family: var(--font-tech); font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            Ushbu bo‘limga faqat <strong style="color: var(--accent-lime);">"ad28"</strong> tavsiya kodi bilan ro‘yxatdan o‘tgan Administratorlar kira oladi.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button class="pl-btn pl-btn-lime" onclick="openRegisterModal()">
              <i class="fas fa-key"></i> "ad28" Kodi Bilan Ro'yxatdan O'tish
            </button>
            <button class="pl-btn pl-btn-ghost" onclick="loginAsDemo('admin')">
              <i class="fas fa-shield-alt"></i> Demo Admin Kirishi
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const totalUsers = state.users.length;
  const totalProjects = state.projects.length;
  const itProjectsCount = state.projects.filter(p => (p.category || 'IT') === 'IT').length;
  const ecoProjectsCount = state.projects.filter(p => p.category === 'Ecology').length;
  const totalApps = state.applications.length;

  // Filter projects by admin category filter
  const adminCatFilter = state.adminCategoryFilter || 'all';
  const displayedProjects = state.projects.filter(p => {
    if (adminCatFilter === 'all') return true;
    return (p.category || 'IT') === adminCatFilter;
  });

  container.innerHTML = `
    <div class="container">
      <!-- Admin Clearance Banner -->
      <div class="admin-badge-banner">
        <div class="admin-banner-left">
          <div class="admin-avatar">${currentUser.avatarInitials}</div>
          <div class="admin-banner-info">
            <h3>${currentUser.name} // ADMIN CONSOLE</h3>
            <p>:SYSTEM CLEARANCE LEVEL 4: &middot; ${currentUser.title}</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
          <button class="pl-btn pl-btn-lime pl-btn-sm" onclick="openCreateProjectModal()">
            <i class="fas fa-plus"></i> Yangi Loyiha Qo'shish
          </button>
          <button class="pl-btn pl-btn-ghost pl-btn-sm" onclick="exportDataJSON()">
            <i class="fas fa-download"></i> Export JSON
          </button>
        </div>
      </div>

      <!-- Live Metrics Strip -->
      <div class="admin-metric-grid">
        <div class="metric-card">
          <span class="metric-title">Jami Loyihalar</span>
          <span class="metric-number">${totalProjects}</span>
          <span class="metric-meta"><i class="fas fa-laptop-code"></i> IT: ${itProjectsCount} &middot; <i class="fas fa-seedling"></i> Ecology: ${ecoProjectsCount}</span>
        </div>
        
        <div class="metric-card">
          <span class="metric-title">Jami Foydalanuvchilar</span>
          <span class="metric-number">${totalUsers}</span>
          <span class="metric-meta"><i class="fas fa-users-cog"></i> Adminlar: ${state.users.filter(u => u.role === 'admin').length} ta</span>
        </div>
        
        <div class="metric-card">
          <span class="metric-title">Tushgan Arizalar</span>
          <span class="metric-number" style="color: var(--accent-cyan);">${totalApps}</span>
          <span class="metric-meta"><i class="fas fa-file-alt"></i> Ko‘rib chiqish kutilmoqda</span>
        </div>
        
        <div class="metric-card">
          <span class="metric-title">Platforma Holati</span>
          <span class="metric-number" style="color: var(--accent-emerald);">FAOL</span>
          <span class="metric-meta"><i class="fas fa-server"></i> Server: Online</span>
        </div>
      </div>

      <!-- Admin Navigation Sub-Tabs -->
      <div class="admin-tabs-nav">
        <button class="admin-tab-btn ${state.adminTab === 'projects' ? 'active' : ''}" onclick="switchAdminTab('projects')">
          [ 01 LOYIHALAR VA TASNIFLASH (${totalProjects}) ]
        </button>
        <button class="admin-tab-btn ${state.adminTab === 'users' ? 'active' : ''}" onclick="switchAdminTab('users')">
          [ 02 FOYDALANUVCHILAR RO‘YXATI (${totalUsers}) ]
        </button>
        <button class="admin-tab-btn ${state.adminTab === 'applications' ? 'active' : ''}" onclick="switchAdminTab('applications')">
          [ 03 ARIZALAR MODERATSIYASI (${totalApps}) ]
        </button>
        <button class="admin-tab-btn ${state.adminTab === 'terminal' ? 'active' : ''}" onclick="switchAdminTab('terminal')">
          [ 04 AUDIT VA TERMINAL ]
        </button>
      </div>

      <!-- SUB-TAB 1: PROJECTS & CATEGORY CLASSIFIER -->
      <div class="admin-panel-view ${state.adminTab === 'projects' ? 'active' : ''}" id="admin-sub-projects">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="font-family: var(--font-tech); font-size: 0.8rem; color: var(--text-secondary);">
            <i class="fas fa-filter"></i> Yo‘nalish bo‘yicha ko‘rish:
            <select class="admin-category-selector" style="margin-left: 0.5rem;" onchange="setAdminCategoryFilter(this.value)">
              <option value="all" ${adminCatFilter === 'all' ? 'selected' : ''}>Barchasi (${totalProjects})</option>
              ${PROJECT_CATEGORIES.map(c => {
                const cnt = state.projects.filter(p => (p.category || 'IT') === c.id).length;
                return `<option value="${c.id}" ${adminCatFilter === c.id ? 'selected' : ''}>${escapeHTML(c.name)} (${cnt})</option>`;
              }).join('')}
            </select>
          </div>
          <button class="pl-btn pl-btn-lime pl-btn-sm" onclick="openCreateProjectModal()">
            <i class="fas fa-plus"></i> Yangi Loyiha E’lon Qilish
          </button>
        </div>

        <div class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Loyiha Nomi</th>
                <th>Muallif</th>
                <th>Kerakli Rol</th>
                <th>Yo‘nalish Tasniflagichi (11 Toifa)</th>
                <th>Holat</th>
                <th>Tavsiya</th>
                <th style="text-align: right;">Amallar</th>
              </tr>
            </thead>
            <tbody>
              ${displayedProjects.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted); font-family: var(--font-tech);">
                    Hozircha loyihalar mavjud emas. Yangi loyiha qo‘shish uchun yuqoridagi tugmani bosing.
                  </td>
                </tr>
              ` : displayedProjects.map(p => {
                const curCat = p.category || 'IT';
                return `
                  <tr>
                    <td>
                      <strong style="color: var(--text-main); font-family: var(--font-hero); font-size: 1.05rem;">${escapeHTML(p.title)}</strong>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML((p.tags || []).join(', '))}</div>
                    </td>
                    <td>
                      <span style="font-family: var(--font-tech); font-size: 0.8rem;">${escapeHTML(p.ownerName || 'Muallif')}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-tech); font-size: 0.76rem; color: var(--accent-cyan);">${escapeHTML(p.roleNeeded)}</span>
                    </td>
                    <td>
                      <!-- 11 Core Directions Category Selector -->
                      <select class="admin-category-selector" onchange="updateProjectCategory('${p.id}', this.value)" title="Loyihani 11 ta yo‘nalishdan biriga tasniflash">
                        ${PROJECT_CATEGORIES.map(c => `
                          <option value="${c.id}" ${curCat === c.id ? 'selected' : ''}>${escapeHTML(c.name)}</option>
                        `).join('')}
                      </select>
                    </td>
                    <td>
                      <select class="form-select-pl" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;" onchange="updateProjectStatus('${p.id}', this.value)">
                        <option value="Open" ${p.status === 'Open' ? 'selected' : ''}>Open</option>
                        <option value="Urgent" ${p.status === 'Urgent' ? 'selected' : ''}>Urgent</option>
                        <option value="Completed" ${p.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Archived" ${p.status === 'Archived' ? 'selected' : ''}>Archived</option>
                      </select>
                    </td>
                    <td>
                      <button class="btn-icon-action" style="color: ${p.isFeatured ? 'var(--accent-lime)' : 'var(--text-muted)'};" onclick="toggleProjectFeatured('${p.id}')">
                        <i class="fas fa-star"></i> ${p.isFeatured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td style="text-align: right;">
                      <div class="action-btn-group" style="justify-content: flex-end;">
                        <button class="btn-icon-action" onclick="openProjectDetailsModal('${p.id}')" title="Detallarni ko'rish">
                          <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="btn-icon-action danger" onclick="deleteProject('${p.id}')" title="O'chirish">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SUB-TAB 2: USERS LIST (No referral codes, Admin cannot ban himself) -->
      <div class="admin-panel-view ${state.adminTab === 'users' ? 'active' : ''}" id="admin-sub-users">
        <div class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Foydalanuvchi</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Universitet / Ta’lim</th>
                <th>Holat</th>
                <th>Verifikatsiya</th>
                <th style="text-align: right;">Amallar</th>
              </tr>
            </thead>
            <tbody>
              ${state.users.map(u => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <div class="owner-avatar" style="width:28px;height:28px;font-size:0.65rem;">${u.avatarInitials}</div>
                      <div>
                        <strong style="color: var(--text-main); font-family: var(--font-tech);">${escapeHTML(u.name)}</strong>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML(u.title || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-family: var(--font-tech); font-size: 0.78rem; color: var(--text-secondary);">${escapeHTML(u.email || '-')}</span>
                  </td>
                  <td>
                    <span class="user-role-badge ${u.role === 'admin' ? 'user-role-admin' : 'user-role-user'}">
                      ${u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style="font-family: var(--font-tech); font-size: 0.75rem; color: var(--text-muted);">
                      ${escapeHTML(u.university || '—')}
                    </span>
                  </td>
                  <td>
                    <span style="color: ${u.status === 'Active' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-family: var(--font-tech); font-size: 0.75rem;">
                      ${u.status}
                    </span>
                  </td>
                  <td>
                    ${u.isVerified 
                      ? '<span style="color: var(--accent-lime); font-family: var(--font-tech); font-size: 0.75rem;"><i class="fas fa-check-circle"></i> Tasdiqlangan</span>' 
                      : '<span style="color: var(--text-muted); font-family: var(--font-tech); font-size: 0.75rem;">Yo‘q</span>'}
                  </td>
                  <td style="text-align: right;">
                    <div class="action-btn-group" style="justify-content: flex-end;">
                      <button class="btn-icon-action" onclick="viewUserProfile('${u.id}')" title="Profilni ko‘rish">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-icon-action" onclick="toggleUserRole('${u.id}')" title="Rolni almashtirish (User <-> Admin)">
                        <i class="fas fa-shield-alt"></i>
                      </button>
                      ${u.id !== state.currentUserId ? `
                        <button class="btn-icon-action" onclick="toggleUserStatus('${u.id}')" title="Bloklash/Faollashtirish">
                          <i class="fas fa-ban"></i>
                        </button>
                        <button class="btn-icon-action danger" onclick="deleteUser('${u.id}')" title="O‘chirish">
                          <i class="fas fa-trash"></i>
                        </button>
                      ` : `
                        <button class="btn-icon-action" disabled title="Administrator o‘z hisobini bloklay olmaydi" style="opacity: 0.25; cursor: not-allowed;">
                          <i class="fas fa-ban"></i>
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SUB-TAB 3: APPLICATIONS (Admin does NOT confirm applications; only the project creator does) -->
      <div class="admin-panel-view ${state.adminTab === 'applications' ? 'active' : ''}" id="admin-sub-applications">
        <div class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nomzod</th>
                <th>Loyiha</th>
                <th>Rol</th>
                <th>Izoh / Pitch</th>
                <th>Sana</th>
                <th>Holat</th>
                <th style="text-align: right;">Tasdiqlash Huquqi</th>
              </tr>
            </thead>
            <tbody>
              ${state.applications.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted); font-family: var(--font-tech);">
                    Hozircha arizalar mavjud emas.
                  </td>
                </tr>
              ` : state.applications.map(app => {
                const project = state.projects.find(p => p.id === app.projectId);
                const ownerName = project ? project.ownerName : 'Loyiha egasi';
                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600; color: var(--text-main); font-family: var(--font-tech);">${escapeHTML(app.userName)}</div>
                    </td>
                    <td>
                      <div style="font-family: var(--font-hero); font-size: 0.95rem;">${escapeHTML(app.projectTitle)}</div>
                    </td>
                    <td>
                      <span style="font-family: var(--font-tech); font-size: 0.75rem; color: var(--accent-lime);">${escapeHTML(app.role)}</span>
                    </td>
                    <td>
                      <div style="font-size: 0.8rem; color: var(--text-secondary); max-width: 260px; white-space: normal;">
                        "${escapeHTML(app.note)}"
                      </div>
                    </td>
                    <td>
                      <span style="font-family: var(--font-tech); font-size: 0.72rem; color: var(--text-muted);">${app.date}</span>
                    </td>
                    <td>
                      <span class="status-pill status-${app.status}">
                        :${app.status.toUpperCase()}:
                      </span>
                    </td>
                    <td style="text-align: right;">
                      <span style="font-family: var(--font-tech); font-size: 0.72rem; color: var(--accent-cyan); white-space: nowrap;">
                        <i class="fas fa-user-check"></i> ${escapeHTML(ownerName)} tasdiqlaydi
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SUB-TAB 4: TERMINAL AUDIT -->
      <div class="admin-panel-view ${state.adminTab === 'terminal' ? 'active' : ''}" id="admin-sub-terminal">
        <div class="admin-terminal-shell">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; margin-bottom: 1rem; display: flex; justify-content: space-between;">
            <span>PROJECTLINK SYSTEM AUDIT STREAM &middot; AUDIT ACTIVE</span>
            <span>TYPE 'help' FOR COMMANDS</span>
          </div>
          
          <div class="terminal-stream-log" id="admin-terminal-logs">
            <!-- Rendered by renderAdminTerminalLogs() -->
          </div>
          
          <div class="terminal-interactive-line">
            <span class="cli-prompt">admin@projectlink:~$</span>
            <input type="text" class="cli-input" id="terminal-cli-input" placeholder="Komandani kiriting (help, stats, users, projects, apps, clear)..." onkeydown="handleTerminalKey(event)">
          </div>
        </div>
      </div>
    </div>
  `;

  renderAdminTerminalLogs();
}

function switchAdminTab(tab) {
  state.adminTab = tab;
  renderAdminPanel();
}

function renderAdminTerminalLogs() {
  const container = document.getElementById('admin-terminal-logs');
  if (!container) return;
  container.innerHTML = state.logs.map(log => `
    <div class="terminal-log-line">
      <span class="timestamp">${log.split(' ')[0]}</span>
      <span class="tag">${log.split(' ')[1] || ''}</span>
      <span>${log.substring(log.indexOf(']') + 1)}</span>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

function handleTerminalKey(e) {
  if (e.key === 'Enter') {
    const cmd = e.target.value.trim().toLowerCase();
    e.target.value = '';
    executeTerminalCommand(cmd);
  }
}

function executeTerminalCommand(cmd) {
  if (!cmd) return;
  addLog('CLI_EXEC', cmd);

  if (cmd === 'help') {
    addLog('INFO', 'Available commands: help, status, stats, users, projects, apps, clear');
  } else if (cmd === 'status' || cmd === 'stats') {
    const itCount = state.projects.filter(p => (p.category || 'IT') === 'IT').length;
    const ecoCount = state.projects.filter(p => p.category === 'Ecology').length;
    addLog('STATUS', `Users: ${state.users.length} | Projects: ${state.projects.length} (IT: ${itCount}, Eco: ${ecoCount}) | Apps: ${state.applications.length}`);
    addLog('STATUS', `Server: Online | Memory: 42% | Status: NOMINAL`);
  } else if (cmd === 'users') {
    state.users.forEach(u => {
      addLog('USER_ENTRY', `${u.id}: ${u.name} (${u.email}) - ${u.role.toUpperCase()} [${u.status}]`);
    });
  } else if (cmd === 'projects') {
    if (state.projects.length === 0) {
      addLog('PROJ_EMPTY', 'No projects registered currently.');
    } else {
      state.projects.forEach(p => {
        addLog('PROJ_ENTRY', `${p.id}: ${p.title} [${p.category || 'IT'}] - ${p.status}`);
      });
    }
  } else if (cmd === 'apps') {
    if (state.applications.length === 0) {
      addLog('APP_EMPTY', 'No applications submitted currently.');
    } else {
      state.applications.forEach(a => {
        addLog('APP_ENTRY', `${a.id}: ${a.userName} -> ${a.projectTitle} [${a.status}]`);
      });
    }
  } else if (cmd === 'clear') {
    state.logs = ['[SYSTEM_READY] Terminal stream buffer cleared.'];
    saveState();
    renderAdminTerminalLogs();
  } else {
    addLog('ERROR', `Noma'lum komanda: '${cmd}'. 'help' yozib komandalar ro'yxatini ko'ring.`);
  }
}

// ==========================================================================
// Admin Actions: User Management & Moderation
// ==========================================================================
function toggleUserVerification(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  user.isVerified = !user.isVerified;
  addLog('ADMIN_VERIFY', `${user.name} verifikatsiyasi: ${user.isVerified}`);
  saveState();
  renderAdminPanel();
  showToast(`${user.name} verifikatsiya holati yangilandi!`, 'success');
}

function toggleUserRole(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  user.role = user.role === 'admin' ? 'user' : 'admin';
  addLog('ADMIN_ROLE', `${user.name} roli ${user.role.toUpperCase()} ga o‘zgartirildi`);
  saveState();
  renderAdminPanel();
  updateHeaderRoleDisplay();
  showToast(`${user.name} roli yangilandi: ${user.role.toUpperCase()}`, 'success');
}

function toggleUserStatus(userId) {
  if (userId === state.currentUserId) {
    showToast('Administrator o‘z hisobini bloklay (ban qila) olmaydi!', 'error');
    return;
  }
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  user.status = user.status === 'Active' ? 'Suspended' : 'Active';
  addLog('ADMIN_STATUS', `${user.name} holati ${user.status} ga o‘zgartirildi`);
  saveState();
  renderAdminPanel();
  showToast(`${user.name} holati: ${user.status}`, 'success');
}

function deleteUser(userId) {
  if (userId === state.currentUserId) {
    showToast('Administrator o‘z hisobini o‘chira olmaydi!', 'error');
    return;
  }
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  if (confirm(`Haqiqatan ham "${user.name}" foydalanuvchisini o‘chirmoqchimisiz?`)) {
    state.users = state.users.filter(u => u.id !== userId);
    addLog('ADMIN_DELETE', `Foydalanuvchi o‘chirildi: ${user.name} (${userId})`);
    saveState();
    renderAdminPanel();
    showToast(`${user.name} muvaffaqiyatli o‘chirildi`, 'success');
  }
}

function updateProjectStatus(projectId, newStatus) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  project.status = newStatus;
  addLog('PROJ_MOD', `${project.title} holati ${newStatus} ga o‘zgartirildi`);
  saveState();
  renderProjects();
  if (state.currentView === 'admin') renderAdminPanel();
  showToast(`Loyiha holati o‘zgartirildi: ${newStatus}`, 'success');
}

function toggleProjectFeatured(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  project.isFeatured = !project.isFeatured;
  addLog('PROJ_MOD', `${project.title} featured: ${project.isFeatured}`);
  saveState();
  renderAdminPanel();
  renderProjects();
  showToast(`Loyiha tavsiya holati yangilandi!`, 'success');
}

function deleteProject(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  if (confirm(`Haqiqatan ham "${project.title}" loyihasini o‘chirmoqchimisiz?`)) {
    state.projects = state.projects.filter(p => p.id !== projectId);
    addLog('PROJ_DELETE', `Loyiha o‘chirildi: ${project.title}`);
    saveState();
    renderAdminPanel();
    renderProjects();
    showToast(`Loyiha muvaffaqiyatli o‘chirildi`, 'success');
  }
}

// Requirement: Only the person who created the "loyiha" confirms or rejects applications
function handleApplicationAction(appId, newStatus) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Iltimos, avval tizimga kiring', 'error');
    openLoginModal();
    return;
  }

  const app = state.applications.find(a => a.id === appId);
  if (!app) {
    showToast('Ariza topilmadi', 'error');
    return;
  }

  const project = state.projects.find(p => p.id === app.projectId);
  if (!project) {
    showToast('Tegishli loyiha topilmadi', 'error');
    return;
  }

  // Creator ownership validation
  if (project.ownerId !== currentUser.id) {
    showToast('Faqat loyihani yaratgan muallif arizani tasdiqlay yoki rad eta oladi!', 'error');
    return;
  }

  app.status = newStatus;
  addLog('APP_ACTION', `Loyiha muallifi (${currentUser.name}) arizani ${newStatus === 'accepted' ? 'QABUL QILDI' : 'RAD ETDI'} [${project.title}]`);
  saveState();

  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    window.supabaseAdapter.updateApplicationStatus(appId, newStatus)
      .catch(err => console.warn('[SUPABASE] Cloud application status update error:', err));
  }

  if (state.currentView === 'profile') renderUserProfile();
  if (state.currentView === 'admin') renderAdminPanel();

  showToast(`Ariza muvaffaqiyatli ${newStatus === 'accepted' ? 'qabul qilindi' : 'rad etildi'}!`, 'success');
}

// ==========================================================================
// User Profile System
// ==========================================================================
function viewUserProfile(userId) {
  state.profileViewingUserId = userId;
  switchView('profile');
}

function renderUserProfile() {
  const user = state.users.find(u => u.id === state.profileViewingUserId) || getCurrentUser() || state.users[0];
  const currentUser = getCurrentUser();
  const isMe = currentUser && user.id === currentUser.id;

  const container = document.getElementById('view-profile');
  if (!container) return;

  const userProjects = state.projects.filter(p => p.ownerId === user.id);
  const userApplications = state.applications.filter(a => a.userId === user.id);
  const acceptedApplications = state.applications.filter(a => a.userId === user.id && a.status === 'accepted');

  // Projects joined as an accepted team member
  const joinedProjects = state.projects.filter(p => 
    p.ownerId !== user.id && (
      acceptedApplications.some(a => a.projectId === p.id) ||
      (Array.isArray(p.members) && p.members.some(m => m.userId === user.id || m.email === user.email))
    )
  );

  // All projects user is a member/lead of
  const allMemberProjects = [
    ...userProjects.map(p => ({
      ...p,
      membershipRole: 'Loyiha Rahbari (Team Lead)',
      isOwner: true
    })),
    ...joinedProjects.map(p => {
      const app = acceptedApplications.find(a => a.projectId === p.id);
      return {
        ...p,
        membershipRole: app ? app.role : 'Faol Jamoa A‘zosi',
        isOwner: false
      };
    })
  ];

  // Applications submitted to projects created by this user
  const incomingApplications = isMe 
    ? state.applications.filter(a => userProjects.some(p => p.id === a.projectId))
    : [];

  container.innerHTML = `
    <div class="container">
      <div class="section-header-block" style="margin-bottom: 2rem;">
        <div>
          <div class="section-label"><i class="fas fa-id-card"></i> FOYDALANUVCHI PROFILI</div>
          <h2 class="section-title">${isMe ? 'MENING PROFILIM' : escapeHTML(user.name.toUpperCase()) + ' // PROFIL'}</h2>
          <p class="section-subtitle">O‘zbekiston talabalar va ishlab chiquvchilar tarmog‘i</p>
        </div>
        
        <div style="display: flex; gap: 0.75rem;">
          ${isMe ? `
            <button class="pl-btn pl-btn-lime" onclick="openEditProfileModal()">
              <i class="fas fa-user-edit"></i> [ TAHRIRLASH ]
            </button>
          ` : `
            <button class="pl-btn pl-btn-ghost" onclick="viewUserProfile('${currentUser ? currentUser.id : state.users[0].id}')">
              <i class="fas fa-arrow-left"></i> [ O‘Z PROFILIMGA QAYTISH ]
            </button>
          `}
        </div>
      </div>

      <div class="profile-layout-grid">
        <!-- Profile Identity Card -->
        <aside class="profile-id-card">
          <div class="profile-avatar-big">${user.avatarInitials}</div>
          
          <div class="profile-status-badge">
            <span class="beacon-dot"></span>
            ${user.role === 'admin' ? '[ ADMINISTRATOR ]' : '[ FOYDALANUVCHI ]'}
          </div>
          
          <h3 class="profile-name">${escapeHTML(user.name)}</h3>
          <div class="profile-role-title">@${escapeHTML(user.handle)} &middot; ${escapeHTML(user.title || '')}</div>
          
          <p class="profile-bio-text">${escapeHTML(user.bio || 'Ma’lumot kiritilmagan.')}</p>
          
          <div class="profile-field-row">
            <span class="profile-field-label">Email:</span>
            <span class="profile-field-val">${escapeHTML(user.email || '—')}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Universitet:</span>
            <span class="profile-field-val">${escapeHTML(user.university || '—')}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Manzil:</span>
            <span class="profile-field-val">${escapeHTML(user.location || '—')}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Yosh:</span>
            <span class="profile-field-val">${user.age ? user.age + ' yosh' : '—'}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">A’zo bo‘lgan:</span>
            <span class="profile-field-val">${user.joinedDate}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Holat:</span>
            <span class="profile-field-val" style="color: var(--accent-emerald);">${user.status}</span>
          </div>

          <!-- Project Membership Summary in Profile (Requirement 11) -->
          <div style="margin-top: 1.25rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 1rem;">
            <div class="profile-field-label" style="color: var(--accent-lime); margin-bottom: 0.4rem;">
              <i class="fas fa-users-cog"></i> JAMOA A‘ZOLIGI:
            </div>
            ${allMemberProjects.length > 0 ? `
              <div style="font-family: var(--font-tech); font-size: 0.8rem; color: var(--text-main); margin-bottom: 0.35rem;">
                <span style="color: var(--accent-emerald); font-weight: 700;">● ${allMemberProjects.length} ta loyiha</span> faol ishtirokchisi
              </div>
              <div style="font-family: var(--font-tech); font-size: 0.72rem; color: var(--text-secondary); display: flex; gap: 0.75rem; flex-wrap: wrap;">
                ${userProjects.length > 0 ? `<span>👑 Rahbar: ${userProjects.length} ta</span>` : ''}
                ${joinedProjects.length > 0 ? `<span>⚡ A’zo: ${joinedProjects.length} ta</span>` : ''}
              </div>
            ` : `
              <div style="font-family: var(--font-tech); font-size: 0.75rem; color: var(--text-muted);">
                Hozircha biron bir loyiha jamoasiga a’zo emas
              </div>
            `}
          </div>

          <div style="margin-top: 1.25rem;">
            <div class="profile-field-label" style="margin-bottom: 0.5rem;">KO‘NIKMALAR VA TEXNOLOGIYALAR:</div>
            <div class="project-tags">
              ${(user.skills || []).map(s => `<span class="project-tag" style="background: rgba(237,255,69,0.1); color: var(--accent-lime); border-color: var(--border-lime);">${escapeHTML(s)}</span>`).join('')}
            </div>
          </div>

          <div class="profile-social-links">
            ${user.github ? `<a href="${escapeHTML(user.github)}" target="_blank" rel="noopener noreferrer" class="social-pill"><i class="fab fa-github"></i> GitHub</a>` : ''}
            ${user.telegram ? `<a href="${escapeHTML(user.telegram)}" target="_blank" rel="noopener noreferrer" class="social-pill"><i class="fab fa-telegram"></i> Telegram</a>` : ''}
            ${user.portfolio ? `<a href="${escapeHTML(user.portfolio)}" target="_blank" rel="noopener noreferrer" class="social-pill"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
          </div>
        </aside>

        <!-- Profile Content & Activity Area -->
        <main class="profile-content-area">
          <div class="profile-tabs-header">
            <button class="profile-tab-btn ${state.profileTab === 'memberships' || !state.profileTab ? 'active' : ''}" onclick="switchProfileTab('memberships')">
              A‘ZOLIK LOYIHALARI (${allMemberProjects.length})
            </button>
            <button class="profile-tab-btn ${state.profileTab === 'projects' ? 'active' : ''}" onclick="switchProfileTab('projects')">
              LOYIHALARI (${userProjects.length})
            </button>
            <button class="profile-tab-btn ${state.profileTab === 'applications' ? 'active' : ''}" onclick="switchProfileTab('applications')">
              ARIZALARI (${userApplications.length})
            </button>
            ${isMe ? `
              <button class="profile-tab-btn ${state.profileTab === 'manage_apps' ? 'active' : ''}" onclick="switchProfileTab('manage_apps')">
                ARIZALARNI BOSHQARISH (${incomingApplications.length})
              </button>
            ` : ''}
          </div>

          <!-- Subview 0: Project Memberships (Requirement 11) -->
          <div class="profile-subview ${state.profileTab === 'memberships' || !state.profileTab ? 'active' : ''}" id="profile-sub-memberships">
            ${allMemberProjects.length === 0 ? `
              <div style="padding: 3rem; text-align: center; background: rgba(4,5,26,0.6); border: 1px dashed var(--border);">
                <i class="fas fa-users" style="font-size: 2.2rem; color: var(--accent-lime); margin-bottom: 0.75rem;"></i>
                <h4 style="font-family: var(--font-hero); font-size: 1.3rem; margin-bottom: 0.35rem; color: var(--text-main);">Hali a’zo bo‘lgan loyihalar mavjud emas</h4>
                <p style="font-family: var(--font-tech); font-size: 0.85rem; color: var(--text-muted);">
                  ${isMe ? 'Loyihalarga ariza topshiring yoki yangi loyiha yaratib jamoangizni shakllantiring!' : 'Ushbu foydalanuvchi hali birorta jamoaga a’zo bo‘lmagan.'}
                </p>
                ${isMe ? `<button class="pl-btn pl-btn-lime pl-btn-sm" onclick="switchView('projects')" style="margin-top: 1rem;">[ LOYIHALARGA QO‘SHILISH ]</button>` : ''}
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${allMemberProjects.map(p => `
                  <div class="membership-project-card">
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; flex-wrap: wrap;">
                        <span class="badge-role-tag">
                          <i class="fas ${p.isOwner ? 'fa-crown' : 'fa-id-badge'}"></i> ${escapeHTML(p.membershipRole)}
                        </span>
                        ${getCategoryBadge(p.category || 'IT')}
                        <span class="status-pill status-${p.status.toLowerCase()}">:${p.status}:</span>
                      </div>
                      <h4 style="font-family: var(--font-hero); font-size: 1.35rem; margin-bottom: 0.35rem; color: var(--text-main); text-transform: uppercase;">
                        ${escapeHTML(p.title)}
                      </h4>
                      <p style="font-family: var(--font-body); font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.6rem;">
                        ${escapeHTML(p.description)}
                      </p>
                      <div style="font-family: var(--font-tech); font-size: 0.74rem; color: var(--text-muted);">
                        Muallif: ${escapeHTML(p.ownerName)} &middot; Manzil: ${escapeHTML(p.location || 'Toshkent')} &middot; Muddat: ${p.deadline || '2025-12-31'}
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; min-width: 140px;">
                      <button class="pl-btn pl-btn-lime pl-btn-sm" onclick="openProjectChat('${p.id}')" title="Loyiha ichki Discord serveri">
                        <i class="fas fa-comments"></i> [ DISCORD CHAT ]
                      </button>
                      <button class="pl-btn pl-btn-ghost pl-btn-sm" onclick="openProjectDetailsModal('${p.id}')">
                        Batafsil &rarr;
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Subview 1: User Projects -->
          <div class="profile-subview ${state.profileTab === 'projects' ? 'active' : ''}" id="profile-sub-projects">
            ${userProjects.length === 0 ? `
              <div style="padding: 3rem; text-align: center; background: rgba(4,5,26,0.6); border: 1px dashed var(--border);">
                <p style="font-family: var(--font-tech); font-size: 0.85rem; color: var(--text-muted);">Ushbu foydalanuvchi hali loyiha e’lon qilmagan.</p>
                ${isMe ? `<button class="pl-btn pl-btn-paper pl-btn-sm" onclick="openCreateProjectModal()" style="margin-top: 1rem;">[ + ILK LOYIHANGIZNI YARATING ]</button>` : ''}
              </div>
            ` : `
              <div class="projects-grid" style="grid-template-columns: 1fr;">
                ${userProjects.map(p => `
                  <div class="project-card" style="margin-bottom: 0;">
                    <div class="project-header-bar">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="project-id-badge">${p.id.toUpperCase()}</span>
                        ${getCategoryBadge(p.category || 'IT')}
                      </div>
                      <span class="status-pill status-${p.status.toLowerCase()}">:${p.status}:</span>
                    </div>
                    <div class="project-body">
                      <h4 class="project-title" style="font-size: 1.35rem;">${escapeHTML(p.title)}</h4>
                      <p class="project-desc">${escapeHTML(p.description)}</p>
                      <div class="project-tags">
                        ${(p.tags || []).map(t => `<span class="project-tag">#${escapeHTML(t)}</span>`).join('')}
                      </div>
                    </div>
                    <div class="project-footer-bar" style="padding: 0.85rem 1.25rem;">
                      <div style="font-family: var(--font-tech); font-size: 0.75rem; color: var(--text-muted);">
                        ${p.applicationsCount || 0} ta ariza tushgan
                      </div>
                      <button class="pl-btn pl-btn-lime pl-btn-sm" onclick="openProjectChat('${p.id}')">
                        <i class="fas fa-comments"></i> Loyiha Chati
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Subview 2: User Outgoing Applications -->
          <div class="profile-subview ${state.profileTab === 'applications' ? 'active' : ''}" id="profile-sub-applications">
            ${userApplications.length === 0 ? `
              <div style="padding: 3rem; text-align: center; background: rgba(4,5,26,0.6); border: 1px dashed var(--border);">
                <p style="font-family: var(--font-tech); font-size: 0.85rem; color: var(--text-muted);">Hali biron bir loyihaga ariza topshirilmagan.</p>
                ${isMe ? `<button class="pl-btn pl-btn-lime pl-btn-sm" onclick="switchView('projects')" style="margin-top: 1rem;">[ LOYIHALARNI KO‘RISH VA TOPSHIRISH ]</button>` : ''}
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${userApplications.map(a => `
                  <div style="background: rgba(4,5,26,0.85); border: 1px solid var(--border); padding: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <strong style="font-family: var(--font-hero); font-size: 1.15rem; color: var(--text-main);">${escapeHTML(a.projectTitle)}</strong>
                      <span class="status-pill status-${a.status}">:${a.status.toUpperCase()}:</span>
                    </div>
                    <div style="font-family: var(--font-tech); font-size: 0.78rem; color: var(--accent-lime); margin-bottom: 0.5rem;">
                      Tanlangan Rol: ${escapeHTML(a.role)} &middot; Sana: ${a.date}
                    </div>
                    <p style="font-family: var(--font-body); font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                      "${escapeHTML(a.note)}"
                    </p>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Subview 3: Incoming Applications for Project Owner (Only creator confirms!) -->
          ${isMe ? `
            <div class="profile-subview ${state.profileTab === 'manage_apps' ? 'active' : ''}" id="profile-sub-manage-apps">
              ${incomingApplications.length === 0 ? `
                <div style="padding: 3rem; text-align: center; background: rgba(4,5,26,0.6); border: 1px dashed var(--border);">
                  <i class="fas fa-inbox" style="font-size: 2rem; color: var(--accent-lime); margin-bottom: 0.75rem;"></i>
                  <p style="font-family: var(--font-tech); font-size: 0.85rem; color: var(--text-muted);">
                    Sizning loyihalaringizga hali nomzodlar ariza topshirmagan.
                  </p>
                </div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                  <div style="font-family: var(--font-tech); font-size: 0.8rem; color: var(--accent-lime); margin-bottom: 0.25rem;">
                    <i class="fas fa-shield-alt"></i> Siz loyiha muallifi sifatida arizalarni tasdiqlash yoki rad etish huquqiga egasiz:
                  </div>
                  ${incomingApplications.map(app => `
                    <div class="incoming-app-card">
                      <div class="incoming-app-header">
                        <div>
                          <strong style="font-family: var(--font-hero); font-size: 1.25rem; color: #ffffff;">${escapeHTML(app.userName)}</strong>
                          <span style="font-family: var(--font-tech); font-size: 0.78rem; color: var(--accent-cyan);"> &rarr; "${escapeHTML(app.projectTitle)}" loyihasiga</span>
                        </div>
                        <span class="status-pill status-${app.status}">:${app.status.toUpperCase()}:</span>
                      </div>
                      <div style="font-family: var(--font-tech); font-size: 0.76rem; color: var(--accent-lime); margin-bottom: 0.5rem;">
                        Rol: ${escapeHTML(app.role)} &middot; Sana: ${app.date}
                      </div>
                      <p style="font-family: var(--font-body); font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; background: rgba(255,255,255,0.03); padding: 0.75rem; border: 1px solid var(--border);">
                        "${escapeHTML(app.note)}"
                      </p>
                      <div class="incoming-app-actions">
                        <button class="pl-btn pl-btn-lime pl-btn-sm" onclick="handleApplicationAction('${app.id}', 'accepted')">
                          <i class="fas fa-check"></i> Qabul qilish
                        </button>
                        <button class="pl-btn pl-btn-ghost pl-btn-sm" onclick="handleApplicationAction('${app.id}', 'rejected')">
                          <i class="fas fa-times"></i> Rad etish
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}
        </main>
      </div>
    </div>
  `;
}

function switchProfileTab(tab) {
  state.profileTab = tab;
  renderUserProfile();
}

// ==========================================================================
// Project Creation & Application Handlers
// ==========================================================================
function openCreateProjectModal() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Loyiha e’lon qilish uchun avval tizimga kiring yoki ro‘yxatdan o‘ting!', 'error');
    openLoginModal();
    return;
  }
  const modal = document.getElementById('modal-create-project');
  if (modal) modal.classList.add('active');
}

function handleCreateProject(e) {
  e.preventDefault();
  const form = e.target;
  const user = getCurrentUser();

  if (!user) {
    showToast('Tizimga kirishingiz talab qilinadi!', 'error');
    openLoginModal();
    return;
  }

  const title = form.title.value.trim();
  const category = form.category ? form.category.value : 'IT';
  const roleNeeded = form.roleNeeded.value.trim();
  const location = form.location.value.trim() || 'Toshkent';
  const deadline = form.deadline.value || '2025-12-31';
  const description = form.description.value.trim();
  const tags = form.tags.value.split(',').map(t => t.trim()).filter(Boolean);

  if (!title || !description || !roleNeeded) {
    showToast('Iltimos, barcha majburiy maydonlarni to‘ldiring', 'error');
    return;
  }

  const catInfo = getCategoryInfo(category);

  const newProject = {
    id: `proj_${Date.now().toString().slice(-4)}`,
    title,
    category: catInfo.id,
    description,
    roleNeeded,
    status: 'Open',
    isFeatured: false,
    ownerId: user.id,
    ownerName: user.name,
    ownerInitials: user.avatarInitials,
    location,
    applicationsCount: 0,
    deadline,
    tags: tags.length ? tags : [catInfo.id, 'Project'],
    requirements: ['Mas’uliyatli va jamoaviy ruh', 'Haftasiga 3-4 soat vaqt']
  };

  state.projects.unshift(newProject);
  addLog('PROJ_POST', `Yangi loyiha e’lon qilindi: "${newProject.title}" [${newProject.category}] by ${user.name}`);
  saveState();

  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    const isSupabaseUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    if (isSupabaseUuid) {
      window.supabaseAdapter.createProject({
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        owner_id: newProject.ownerId,
        owner_name: newProject.ownerName,
        owner_initials: newProject.ownerInitials,
        role_needed: newProject.roleNeeded,
        requirements: newProject.requirements || [],
        tags: newProject.tags || [],
        location: newProject.location || 'Toshkent',
        deadline: newProject.deadline ? newProject.deadline : null,
        status: newProject.status || 'Open',
        applications_count: 0
      }).catch(err => console.warn('[SUPABASE] Project create cloud sync warning:', err));
    }
  }

  closeAllModals();
  form.reset();
  renderProjects();

  if (state.currentView === 'profile') renderUserProfile();
  if (state.currentView === 'admin') renderAdminPanel();
  
  showToast(`Loyiha muvaffaqiyatli e’lon qilindi! Toifa: ${newProject.category}`, 'success');
}

let activeApplyProjectId = null;

function openApplyModal(projectId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Ariza topshirish uchun avval tizimga kiring!', 'error');
    openLoginModal();
    return;
  }

  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  activeApplyProjectId = projectId;

  const titleEl = document.getElementById('apply-project-title');
  const roleEl = document.getElementById('apply-role-display');
  if (titleEl) titleEl.textContent = project.title;
  if (roleEl) roleEl.textContent = `Kerakli mutaxassis: ${project.roleNeeded} | Toifa: ${project.category || 'IT'}`;

  const modal = document.getElementById('modal-apply');
  if (modal) modal.classList.add('active');
}

function handleApplySubmit(e) {
  e.preventDefault();
  const form = e.target;
  const user = getCurrentUser();

  if (!user) {
    showToast('Iltimos, avval tizimga kiring', 'error');
    openLoginModal();
    return;
  }

  const project = state.projects.find(p => p.id === activeApplyProjectId);
  if (!project) {
    showToast('Loyiha topilmadi', 'error');
    return;
  }

  const role = form.role.value.trim() || project.roleNeeded;
  const note = form.note.value.trim();

  if (!note) {
    showToast('Iltimos, o‘zingiz va tajribangiz haqida yozing', 'error');
    return;
  }

  const newApp = {
    id: `app_${Date.now().toString().slice(-4)}`,
    projectId: project.id,
    projectTitle: project.title,
    userId: user.id,
    userName: user.name,
    userHandle: user.handle,
    role,
    note,
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  };

  project.applicationsCount = (project.applicationsCount || 0) + 1;
  state.applications.unshift(newApp);
  addLog('APP_SUBMIT', `${user.name} -> ${project.title} (${role})`);
  saveState();

  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    const isUserUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    if (isUserUuid) {
      window.supabaseAdapter.submitApplication({
        id: newApp.id,
        project_id: newApp.projectId,
        user_id: newApp.userId,
        user_name: newApp.userName,
        user_handle: newApp.userHandle || null,
        role: newApp.role,
        note: newApp.note,
        status: 'pending'
      }).catch(err => console.warn('[SUPABASE] Application submit cloud sync warning:', err));
    }
  }

  closeAllModals();
  form.reset();
  renderProjects();
  if (state.currentView === 'profile') renderUserProfile();
  if (state.currentView === 'admin') renderAdminPanel();

  showToast('Arizangiz muvaffaqiyatli yuborildi!', 'success');
}

function openProjectDetailsModal(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;

  const contentEl = document.getElementById('project-details-content');
  if (contentEl) {
    const catBadge = getCategoryBadge(project.category || 'IT');

    contentEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-family: var(--font-tech); font-size: 0.72rem; color: var(--accent-lime);">
          LOYIHA SPECS // ${project.id.toUpperCase()}
        </span>
        ${catBadge}
      </div>
      <h3 style="font-family: var(--font-hero); font-size: 2rem; line-height: 1.1; margin-bottom: 0.75rem; text-transform: uppercase;">
        ${escapeHTML(project.title)}
      </h3>
      <p style="font-family: var(--font-body); font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.5rem;">
        ${escapeHTML(project.description)}
      </p>

      <div style="background: rgba(255,255,255,0.05); padding: 1rem; border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <div style="font-family: var(--font-tech); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
          ZARUR TALABLAR VA ROLLLAR:
        </div>
        <div style="font-family: var(--font-tech); font-size: 0.82rem; color: var(--text-main); margin-bottom: 0.5rem;">
          <strong style="color: var(--accent-lime);">${escapeHTML(project.roleNeeded)}</strong> &middot; Manzil: ${escapeHTML(project.location || 'Toshkent')} &middot; Topshirish muddati: ${project.deadline || '2025-12-31'}
        </div>
        <ul style="list-style-type: square; padding-left: 1.25rem; font-family: var(--font-body); font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
          ${(project.requirements || []).map(r => `<li>${escapeHTML(r)}</li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        ${(project.tags || []).map(t => `<span class="project-tag">#${escapeHTML(t)}</span>`).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1.25rem;">
        <div class="project-owner-cell" onclick="closeAllModals(); viewUserProfile('${project.ownerId}')">
          <div class="owner-avatar">${project.ownerInitials || 'PL'}</div>
          <div class="owner-meta">
            <div class="owner-name">${escapeHTML(project.ownerName || 'Muallif')}</div>
            <div class="owner-role">Tashabbuskor &middot; :PROFIL:</div>
          </div>
        </div>
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="pl-btn pl-btn-lime" onclick="closeAllModals(); openProjectChat('${project.id}')">
            <i class="fas fa-comments"></i> [ LOYIHA CHATI ]
          </button>
          <button class="pl-btn pl-btn-paper" onclick="closeAllModals(); openApplyModal('${project.id}')">
            [ ARIZA TOPSHIRISH ] &rarr;
          </button>
        </div>
      </div>
    `;
  }

  const modal = document.getElementById('modal-project-details');
  if (modal) modal.classList.add('active');
}

function openEditProfileModal() {
  const user = getCurrentUser();
  if (!user) return;
  const form = document.getElementById('form-edit-profile');
  if (form) {
    form.name.value = user.name || '';
    form.title.value = user.title || '';
    form.university.value = user.university || '';
    form.location.value = user.location || '';
    form.age.value = user.age || '';
    form.bio.value = user.bio || '';
    form.skills.value = (user.skills || []).join(', ');
    form.telegram.value = user.telegram || '';
    form.github.value = user.github || '';
    form.portfolio.value = user.portfolio || '';
  }

  const modal = document.getElementById('modal-edit-profile');
  if (modal) modal.classList.add('active');
}

function handleSaveProfile(e) {
  e.preventDefault();
  const form = e.target;
  const user = getCurrentUser();
  if (!user) return;

  user.name = form.name.value.trim();
  user.title = form.title.value.trim();
  user.university = form.university.value.trim();
  user.location = form.location.value.trim();
  user.age = parseInt(form.age.value, 10) || user.age;
  user.bio = form.bio.value.trim();
  user.skills = form.skills.value.split(',').map(s => s.trim()).filter(Boolean);
  user.telegram = form.telegram.value.trim();
  user.github = form.github.value.trim();
  user.portfolio = form.portfolio.value.trim();
  
  const initials = user.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  user.avatarInitials = initials;

  addLog('PROFILE_EDIT', `${user.name} profili yangilandi`);
  saveState();
  closeAllModals();
  updateHeaderRoleDisplay();
  renderUserProfile();
  renderProjects();
  showToast('Profilingiz muvaffaqiyatli saqlandi!', 'success');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

// ==========================================================================
// Terminal Commands & Copying
// ==========================================================================
const terminalCommands = {
  channel: 'https://t.me/projectlink_uz',
  bot: 'https://t.me/projectlink_bot'
};

function switchInstallTab(tab) {
  document.querySelectorAll('.terminal-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const codeEl = document.getElementById('terminal-hero-command');
  const openBtn = document.getElementById('terminal-open-btn');
  if (codeEl && terminalCommands[tab]) {
    codeEl.textContent = terminalCommands[tab];
  }
  if (openBtn && terminalCommands[tab]) {
    openBtn.href = terminalCommands[tab];
  }
}

function copyTerminalCommand() {
  const codeEl = document.getElementById('terminal-hero-command');
  if (!codeEl) return;
  const text = codeEl.textContent.trim();
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('Terminal buyrug‘i nusxalandi!', 'success');
    addLog('CLIPBOARD', 'Terminal buyrug‘i nusxalandi');
  }).catch(() => {
    showToast('Nusxalashda xatolik yuz berdi', 'error');
  });
}

// Toast Engine
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// Data Export
function exportDataJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `projectlink_backup_${Date.now()}.json`);
  dlAnchor.click();
  showToast('Ma’lumotlar JSON formatida yuklab olindi!', 'success');
}

// HTML Escaping Helper
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// Initialization
// ==========================================================================
function init() {
  loadState();
  updateHeaderRoleDisplay();

  // Attach search listener
  const searchInput = document.getElementById('project-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Attach form listeners
  const formCreate = document.getElementById('form-create-project');
  if (formCreate) formCreate.addEventListener('submit', handleCreateProject);

  const formApply = document.getElementById('form-apply');
  if (formApply) formApply.addEventListener('submit', handleApplySubmit);

  const formEditProfile = document.getElementById('form-edit-profile');
  if (formEditProfile) formEditProfile.addEventListener('submit', handleSaveProfile);

  const formLogin = document.getElementById('form-login');
  if (formLogin) formLogin.addEventListener('submit', handleLogin);

  const formRegister = document.getElementById('form-register');
  if (formRegister) formRegister.addEventListener('submit', handleRegister);

  const formWelcomeLogin = document.getElementById('form-welcome-login');
  if (formWelcomeLogin) formWelcomeLogin.addEventListener('submit', handleLogin);

  const formWelcomeRegister = document.getElementById('form-welcome-register');
  if (formWelcomeRegister) formWelcomeRegister.addEventListener('submit', handleRegister);

  // Close modals on escape key or backdrop click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Telemetry Box 4: Total projects count sync
  updatePreviewTelemetryStats();

  // Check Supabase session & fetch cloud projects
  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    window.supabaseAdapter.getSession().then(async session => {
      if (session && session.user && !state.currentUserId) {
        state.currentUserId = session.user.id;
        updateHeaderRoleDisplay();
      }
      try {
        const cloudProjects = await window.supabaseAdapter.fetchProjects();
        if (cloudProjects && cloudProjects.length > 0) {
          console.log('[SUPABASE] Synced', cloudProjects.length, 'projects from cloud database');
          cloudProjects.forEach(cp => {
            const existingIdx = state.projects.findIndex(p => p.id === cp.id);
            const mappedProj = {
              id: cp.id,
              title: cp.title,
              category: cp.category,
              description: cp.description,
              roleNeeded: cp.role_needed,
              status: cp.status || 'Open',
              isFeatured: false,
              ownerId: cp.owner_id,
              ownerName: cp.owner_name,
              ownerInitials: cp.owner_initials || 'PL',
              location: cp.location || 'Toshkent',
              applicationsCount: cp.applications_count || 0,
              deadline: cp.deadline || '2025-12-31',
              tags: cp.tags || [],
              requirements: cp.requirements || []
            };
            if (existingIdx >= 0) {
              state.projects[existingIdx] = mappedProj;
            } else {
              state.projects.unshift(mappedProj);
            }
          });
          saveState();
          renderProjects();
          updatePreviewTelemetryStats();
        }
      } catch (err) {
        console.warn('[SUPABASE] Cloud sync notice:', err.message || err);
      }
    }).catch(console.warn);
  }

  // Render initial view
  switchView(state.currentView || 'main');
  showToast('ProjectLink Platform online', 'success');

  // Automatic prompt: When visitor enters, ask them to login or register if not authenticated
  if (!getCurrentUser()) {
    setTimeout(() => {
      openWelcomeAuthModal();
    }, 400);
  }
}

// ==========================================================================
// Preview Telemetry Stats
// ==========================================================================
function updatePreviewTelemetryStats() {
  const totalProjectsEl = document.getElementById('preview-total-projects');
  if (totalProjectsEl) {
    totalProjectsEl.textContent = state.projects.length;
  }
}

// ==========================================================================
// Project In-App Discord Server Workspace (Requirement 8)
// ==========================================================================
function getProjectDefaultChannels(project) {
  return [
    { id: 'umumiy-chat', name: 'umumiy-chat', type: 'text', desc: 'Loyiha jamoasining asosiy muloqot va muhokama zali' },
    { id: 'vazifalar-va-kod', name: 'vazifalar-va-kod', type: 'text', desc: 'Topshiriqlar, kodlar, arxitektura va GitHub PR muhokamasi' },
    { id: 'goyalar-va-dizayn', name: 'goyalar-va-dizayn', type: 'text', desc: 'Figma maketlari, vizual konsepsiyalar va yangi g‘oyalar' },
    { id: 'elonlar-standup', name: 'elonlar-standup', type: 'text', desc: 'Loyiha rahbarining muhim e’lonlari va yig‘ilish sanalari' },
    { id: 'ovozli-standup', name: '🔊 Jamoa Standup', type: 'voice', desc: 'Jonli ovozli suhbat xonasi (Online: 3 nafar)' },
    { id: 'ovozli-brainstorm', name: '🔊 Brainstorming', type: 'voice', desc: 'Erkin g‘oyalar va fikr almashish xonasi' }
  ];
}

function initProjectChatState(projectId) {
  if (!state.projectChats) state.projectChats = {};
  if (!state.projectChats[projectId]) {
    const project = state.projects.find(p => p.id === projectId);
    const ownerName = project ? project.ownerName : 'Loyiha Rahbari';
    const ownerInitials = project ? project.ownerInitials : 'LR';
    
    state.projectChats[projectId] = {
      'umumiy-chat': [
        {
          id: 'msg_init_1',
          userId: project ? project.ownerId : 'usr_owner',
          userName: ownerName,
          userRole: 'Loyiha Rahbari',
          userInitials: ownerInitials,
          content: `Assalomu alaykum! "${project ? project.title : 'Loyiha'}" jamoasining ichki ishchi chatiga xush kelibsiz! Loyihamiz bo‘yicha barcha savol va takliflarni shu yerda muhokama qilamiz.`,
          time: 'Bugun 10:15'
        },
        {
          id: 'msg_init_2',
          userId: 'usr_bot',
          userName: 'ProjectLink Bot',
          userRole: 'BOT',
          userInitials: 'PL',
          content: '🚀 Loyiha serveri ishga tushirildi. Jamoa kanallariga a’zolar biriktirildi.',
          time: 'Bugun 10:16'
        }
      ],
      'vazifalar-va-kod': [
        {
          id: 'msg_init_3',
          userId: project ? project.ownerId : 'usr_owner',
          userName: ownerName,
          userRole: 'Loyiha Rahbari',
          userInitials: ownerInitials,
          content: 'Repozitoriy sozlandi. Barcha topshiriqlar va PR larni shu kanalda yozib boring.',
          time: 'Bugun 11:00'
        }
      ],
      'goyalar-va-dizayn': [
        {
          id: 'msg_init_4',
          userId: project ? project.ownerId : 'usr_owner',
          userName: ownerName,
          userRole: 'Loyiha Rahbari',
          userInitials: ownerInitials,
          content: 'Dizayn maketlari va foydalanuvchi interfeysi takliflari shu kanalda qabul qilinadi.',
          time: 'Bugun 11:30'
        }
      ],
      'elonlar-standup': [
        {
          id: 'msg_init_5',
          userId: project ? project.ownerId : 'usr_owner',
          userName: ownerName,
          userRole: 'Loyiha Rahbari',
          userInitials: ownerInitials,
          content: 'Eslatma: Har haftalik online standup uchrashuvimiz rejalashtirilgan.',
          time: 'Bugun 12:00'
        }
      ]
    };
  }
}

async function openProjectChat(projectId, channel = 'umumiy-chat') {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) {
    showToast('Loyiha topilmadi', 'error');
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Loyiha chatiga kirish uchun iltimos tizimga kiring', 'info');
    openWelcomeAuthModal();
    return;
  }

  state.activeChatProjectId = projectId;
  state.activeChatChannel = channel;
  initProjectChatState(projectId);

  // If Supabase is connected, fetch cloud messages
  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    try {
      const cloudMsgs = await window.supabaseAdapter.fetchProjectMessages(projectId, channel);
      if (cloudMsgs && cloudMsgs.length > 0) {
        state.projectChats[projectId][channel] = cloudMsgs.map(m => ({
          id: m.id,
          userId: m.user_id,
          userName: m.user_name,
          userRole: m.user_role || 'A‘zo',
          userInitials: m.user_initials || 'PL',
          content: m.content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      }
      // Subscribe to real-time updates
      window.supabaseAdapter.subscribeToChannel(projectId, channel, (newMsg) => {
        if (!state.projectChats[projectId][channel].some(m => m.id === newMsg.id)) {
          state.projectChats[projectId][channel].push({
            id: newMsg.id,
            userId: newMsg.user_id,
            userName: newMsg.user_name,
            userRole: newMsg.user_role || 'A‘zo',
            userInitials: newMsg.user_initials || 'PL',
            content: newMsg.content,
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          renderDiscordChatStream();
        }
      });
    } catch (err) {
      console.warn('Supabase chat messages fetch fallback:', err);
    }
  }

  renderDiscordServerWorkspace(project);

  const modal = document.getElementById('modal-project-chat');
  if (modal) modal.classList.add('active');
}

function renderDiscordServerWorkspace(project) {
  const container = document.getElementById('discord-server-container');
  if (!container) return;

  const currentUser = getCurrentUser();
  const channels = getProjectDefaultChannels(project);
  const activeChannelObj = channels.find(c => c.id === state.activeChatChannel) || channels[0];

  // Find project members
  const acceptedApps = state.applications.filter(a => a.projectId === project.id && a.status === 'accepted');
  const projectMembersList = [
    {
      id: project.ownerId,
      name: project.ownerName,
      role: 'Loyiha Rahbari',
      initials: project.ownerInitials,
      isOwner: true
    },
    ...acceptedApps.map(a => ({
      id: a.userId,
      name: a.userName,
      role: a.role,
      initials: a.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AZ',
      isOwner: false
    }))
  ];

  // Title in modal bar
  const headerTitle = document.getElementById('discord-modal-header-title');
  if (headerTitle) {
    headerTitle.innerHTML = `<i class="fab fa-discord" style="color: #5865f2;"></i> [ ${escapeHTML(project.title.toUpperCase())} // DISCORD SERVER ]`;
  }

  container.innerHTML = `
    <!-- Left Sidebar: Channels -->
    <aside class="discord-sidebar">
      <div class="discord-server-header">
        <div class="discord-server-title" title="${escapeHTML(project.title)}">
          <i class="fas fa-shield-alt" style="color: var(--accent-lime); margin-right: 0.35rem;"></i>
          ${escapeHTML(project.title)}
        </div>
        <span class="badge-category" style="font-size: 0.65rem; padding: 0.1rem 0.3rem;">
          ${escapeHTML(project.category || 'IT')}
        </span>
      </div>

      <div class="discord-channels-list">
        <div class="discord-category-head">
          <i class="fas fa-chevron-down" style="font-size: 0.6rem;"></i>
          MATNLI KANALLAR
        </div>
        ${channels.filter(c => c.type === 'text').map(ch => `
          <button class="discord-channel-btn ${state.activeChatChannel === ch.id ? 'active' : ''}" onclick="switchDiscordChannel('${ch.id}')">
            <span style="color: var(--text-muted); font-weight: 700;">#</span>
            <span>${ch.name}</span>
          </button>
        `).join('')}

        <div class="discord-category-head" style="margin-top: 0.75rem;">
          <i class="fas fa-chevron-down" style="font-size: 0.6rem;"></i>
          OVOZLI KANALLAR
        </div>
        ${channels.filter(c => c.type === 'voice').map(ch => `
          <button class="discord-channel-btn" onclick="showToast('${ch.name} kanaliga ulanish uchun mikrofon ruxsati talab qilinadi (Demo).', 'info')">
            <i class="fas fa-volume-up" style="color: var(--accent-lime); font-size: 0.75rem;"></i>
            <span>${ch.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Current User Footer in Discord -->
      <div class="discord-user-bar">
        <div class="discord-user-info">
          <div class="discord-avatar-mini">${currentUser ? currentUser.avatarInitials : 'ME'}</div>
          <div style="overflow: hidden;">
            <div style="font-family: var(--font-tech); font-size: 0.8rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHTML(currentUser ? currentUser.name : 'Mehmon')}
            </div>
            <div style="font-family: var(--font-tech); font-size: 0.68rem; color: var(--accent-emerald);">
              ● Onlayn
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 0.4rem; color: var(--text-muted); font-size: 0.8rem;">
          <i class="fas fa-microphone" title="Mikrofon"></i>
          <i class="fas fa-headphones" title="Ovoz"></i>
        </div>
      </div>
    </aside>

    <!-- Center: Active Channel Chat Stream -->
    <main class="discord-chat-main">
      <div class="discord-chat-header">
        <div style="display: flex; align-items: center;">
          <div class="discord-active-channel-name">
            <span style="color: var(--text-muted);">#</span>
            <span>${activeChannelObj.name}</span>
          </div>
          <div class="discord-active-channel-desc">
            ${activeChannelObj.desc}
          </div>
        </div>
        <div style="font-family: var(--font-tech); font-size: 0.75rem; color: var(--text-muted);">
          <i class="fas fa-users"></i> ${projectMembersList.length} a’zo
        </div>
      </div>

      <div class="discord-messages-stream" id="discord-messages-stream">
        <!-- Rendered by renderDiscordChatStream() -->
      </div>

      <div class="discord-input-container">
        <form class="discord-input-form" onsubmit="handleSendDiscordMessage(event)">
          <span style="color: var(--text-muted); font-family: var(--font-tech); font-size: 0.85rem;">#</span>
          <input type="text" id="discord-chat-input" class="discord-input-field" placeholder="#${activeChannelObj.name} kanaliga xabar yozing (Enter bosing)..." autocomplete="off" required>
          <button type="submit" class="discord-send-btn">
            <i class="fas fa-paper-plane"></i> Yuborish
          </button>
        </form>
      </div>
    </main>

    <!-- Right Sidebar: Members -->
    <aside class="discord-members-sidebar">
      <div class="discord-category-head">
        LOYIHA RAHBARI — 1
      </div>
      <div class="discord-member-item" onclick="closeAllModals(); viewUserProfile('${project.ownerId}')">
        <div class="discord-avatar-mini" style="background: var(--accent-lime); color: var(--bg-obsidian);">
          ${project.ownerInitials || 'PL'}
        </div>
        <div style="overflow: hidden;">
          <div class="discord-member-name">${escapeHTML(project.ownerName)}</div>
          <div class="discord-member-sub" style="color: var(--accent-lime); font-weight: 700;">👑 Team Lead</div>
        </div>
      </div>

      <div class="discord-category-head" style="margin-top: 1rem;">
        JAMOADAGILAR — ${acceptedApps.length}
      </div>
      ${acceptedApps.length === 0 ? `
        <div style="font-family: var(--font-tech); font-size: 0.72rem; color: var(--text-muted); padding: 0.4rem 0.5rem;">
          Hali boshqa a’zo qo‘shilmagan
        </div>
      ` : `
        ${acceptedApps.map(a => `
          <div class="discord-member-item" onclick="closeAllModals(); viewUserProfile('${a.userId}')">
            <div class="discord-avatar-mini" style="background: rgba(255,255,255,0.1); color: var(--text-main);">
              ${a.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AZ'}
            </div>
            <div style="overflow: hidden;">
              <div class="discord-member-name">${escapeHTML(a.userName)}</div>
              <div class="discord-member-sub">${escapeHTML(a.role)}</div>
            </div>
          </div>
        `).join('')}
      `}

      <div class="discord-category-head" style="margin-top: 1rem;">
        BOTLAR & TIZIM — 1
      </div>
      <div class="discord-member-item">
        <div class="discord-avatar-mini" style="background: #5865f2; color: #fff;">
          <i class="fas fa-robot"></i>
        </div>
        <div>
          <div class="discord-member-name">ProjectLink Bot</div>
          <div class="discord-member-sub" style="color: #5865f2;">SYSTEM BOT</div>
        </div>
      </div>
    </aside>
  `;

  renderDiscordChatStream();
}

function renderDiscordChatStream() {
  const streamEl = document.getElementById('discord-messages-stream');
  if (!streamEl || !state.activeChatProjectId) return;

  const projectId = state.activeChatProjectId;
  const channel = state.activeChatChannel || 'umumiy-chat';
  initProjectChatState(projectId);

  const messages = (state.projectChats[projectId] && state.projectChats[projectId][channel]) || [];

  if (messages.length === 0) {
    streamEl.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted); font-family: var(--font-tech);">
        <i class="fas fa-comments" style="font-size: 2rem; color: var(--accent-lime); margin-bottom: 0.75rem;"></i>
        <p style="font-size: 0.85rem;">#${channel} kanalida xabarlar mavjud emas.</p>
        <p style="font-size: 0.75rem; margin-top: 0.35rem;">Ilk xabarni yozib jamoa bilan muloqotni boshlang!</p>
      </div>
    `;
    return;
  }

  streamEl.innerHTML = messages.map(msg => `
    <div class="discord-message-row">
      <div class="discord-msg-avatar">${escapeHTML(msg.userInitials || 'PL')}</div>
      <div class="discord-msg-content">
        <div class="discord-msg-meta">
          <span class="discord-msg-author">${escapeHTML(msg.userName)}</span>
          ${msg.userRole ? `<span class="discord-msg-badge">${escapeHTML(msg.userRole)}</span>` : ''}
          <span class="discord-msg-time">${msg.time || 'Bugun'}</span>
        </div>
        <div class="discord-msg-text">${escapeHTML(msg.content)}</div>
      </div>
    </div>
  `).join('');

  // Scroll to bottom
  streamEl.scrollTop = streamEl.scrollHeight;
}

function switchDiscordChannel(channelId) {
  state.activeChatChannel = channelId;
  const project = state.projects.find(p => p.id === state.activeChatProjectId);
  if (project) {
    renderDiscordServerWorkspace(project);
  }
}

async function handleSendDiscordMessage(e) {
  e.preventDefault();
  const input = document.getElementById('discord-chat-input');
  if (!input) return;
  const content = input.value.trim();
  if (!content) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Xabar yuborish uchun tizimga kiring', 'error');
    openWelcomeAuthModal();
    return;
  }

  const projectId = state.activeChatProjectId;
  const channel = state.activeChatChannel || 'umumiy-chat';
  const project = state.projects.find(p => p.id === projectId);
  const isOwner = project && project.ownerId === currentUser.id;

  const userRole = isOwner ? 'Loyiha Rahbari' : (currentUser.role === 'admin' ? 'Administrator' : 'Jamoa A‘zosi');

  const newMsg = {
    id: 'msg_' + Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    userRole,
    userInitials: currentUser.avatarInitials || 'PL',
    content,
    time: 'Bugun ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  initProjectChatState(projectId);
  state.projectChats[projectId][channel].push(newMsg);
  saveState();

  input.value = '';
  renderDiscordChatStream();

  // If Supabase connected, push to cloud
  if (window.supabaseAdapter && window.supabaseAdapter.isConfigured()) {
    try {
      await window.supabaseAdapter.sendProjectMessage({
        project_id: projectId,
        channel: channel,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: userRole,
        user_initials: currentUser.avatarInitials,
        content: content
      });
    } catch (err) {
      console.warn('Supabase message sync error:', err);
    }
  }
}

// Expose global functions for HTML inline callers
window.init = init;
window.switchView = switchView;
window.viewUserProfile = viewUserProfile;
window.switchProfileTab = switchProfileTab;
window.switchAdminTab = switchAdminTab;
window.setAdminCategoryFilter = setAdminCategoryFilter;
window.setProjectCategoryFilter = setProjectCategoryFilter;
window.filterByDirection = filterByDirection;
window.updateProjectCategory = updateProjectCategory;
window.toggleUserVerification = toggleUserVerification;
window.toggleUserRole = toggleUserRole;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.updateProjectStatus = updateProjectStatus;
window.toggleProjectFeatured = toggleProjectFeatured;
window.deleteProject = deleteProject;
window.handleApplicationAction = handleApplicationAction;
window.openCreateProjectModal = openCreateProjectModal;
window.openApplyModal = openApplyModal;
window.openProjectDetailsModal = openProjectDetailsModal;
window.openEditProfileModal = openEditProfileModal;
window.openLoginModal = openLoginModal;
window.openRegisterModal = openRegisterModal;
window.openWelcomeAuthModal = openWelcomeAuthModal;
window.switchWelcomeTab = switchWelcomeTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.loginAsDemo = loginAsDemo;
window.closeAllModals = closeAllModals;
window.switchInstallTab = switchInstallTab;
window.copyTerminalCommand = copyTerminalCommand;
window.exportDataJSON = exportDataJSON;
window.showToast = showToast;
window.openProjectChat = openProjectChat;
window.switchDiscordChannel = switchDiscordChannel;
window.handleSendDiscordMessage = handleSendDiscordMessage;
window.updatePreviewTelemetryStats = updatePreviewTelemetryStats;

// Boot on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}