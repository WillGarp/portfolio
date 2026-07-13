// ========================================
// PORTFOLIO - SCRIPT PRINCIPAL
// ========================================

// Esperar o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Init] DOM carregado, iniciando aplicação...');
    initializeApp();
    
    // Carregar projetos DEPOIS de tudo estar pronto
    setTimeout(() => {
        loadGitHubProjects();
    }, 500);
});

// ========================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ========================================
function initializeApp() {
    console.log('[Init] Inicializando app...');
    initNavbar();
    initThemeToggle();
    initSmoothScroll();
    initScrollToTop();
    initFormValidation();
    initIntersectionObserver();
    updateFooterYear();
    initSectionHighlight();
}

// ========================================
// CARREGAR PROJETOS DO GITHUB
// ========================================
async function loadGitHubProjects() {
    const username = 'WillGarp'; // ✅ SEM -github
    const container = document.querySelector('.projects-grid');
    
    if (!container) {
        console.error('❌ Container .projects-grid não encontrado!');
        return;
    }
    
    const reposToShow = ['nexatech', 'Portfolio','task-manager','cadastro-usuario','automacao-scripts']; // Ajuste conforme necessário
    
    try {
        console.log('🔄 Carregando projetos do GitHub...');
        console.log('👤 Usuário:', username);
        console.log('📦 Repositórios procurados:', reposToShow);
        
        const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
        console.log('🌐 URL:', url);
        
        const response = await fetch(url);
        
        console.log('📊 Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const repos = await response.json();
        console.log('✅ Total de repos encontrados:', repos.length);
        console.log('📋 Nomes dos repos:', repos.map(r => r.name));
        
        // Filtrar apenas os repositórios selecionados
        const selectedRepos = repos.filter(repo => {
            const isSelected = reposToShow.includes(repo.name);
            const isPublic = !repo.private;
            console.log(`  - ${repo.name}: selecionado=${isSelected}, público=${isPublic}`);
            return isSelected && isPublic;
        });
        
        console.log(`✅ ${selectedRepos.length} projetos compatíveis encontrados`);
        
        // Limpar container
        container.innerHTML = '';
        
        // Se não encontrou, mostrar mensagem
        if (selectedRepos.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p>❌ Nenhum projeto encontrado com os nomes: ${reposToShow.join(', ')}</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem;">
                        Repositórios encontrados: ${repos.map(r => r.name).join(', ')}
                    </p>
                </div>
            `;
            return;
        }
        
        // Renderizar cada projeto
        selectedRepos.forEach(repo => {
            const card = createProjectCard(repo);
            container.appendChild(card);
            console.log(`  ✅ Adicionado: ${repo.name}`);
        });
        
        console.log('✅ Todos os projetos carregados com sucesso!');
        
        // Reinicializar animações
        if (typeof initIntersectionObserver === 'function') {
            initIntersectionObserver();
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #F85149;">
                <h3>❌ Erro ao carregar projetos</h3>
                <p><strong>${error.message}</strong></p>
                <details style="margin-top: 1rem; text-align: left; display: inline-block;">
                    <summary style="cursor: pointer;">Ver mais detalhes</summary>
                    <pre style="background: #1a1a1a; padding: 1rem; border-radius: 5px; overflow-x: auto;">
${error.stack}
                    </pre>
                </details>
            </div>
        `;
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in-up';
    
    // Extrair informações
    const name = repo.name;
    const description = repo.description || 'Sem descrição';
    const url = repo.html_url;
    const language = repo.language || 'JavaScript';
    const stars = repo.stargazers_count;
    const updated = new Date(repo.updated_at).toLocaleDateString('pt-BR');
    
    // Tecnologias por projeto
    const techByRepo = {
        'nexatech': ['HTML5', 'CSS3', 'JavaScript'],
        'Portfolio': ['HTML5', 'CSS3', 'JavaScript'],
        'task-manager': [ 'SpringBoot', 'Java'],
        'cadastro-usuario': [ 'Python','JSON'],
        'automacao-scripts': ['Python'],
    };
    
    const techs = techByRepo[name] || [language];
    const techHTML = techs.map(tech => 
        `<span class="tech-badge">${tech}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="project-image github-img"></div>
        <div class="project-content">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="project-info">
                <span class="info-item">⭐ ${stars} stars</span>
                <span class="info-item">📅 ${updated}</span>
            </div>
            <div class="project-tech">
                ${techHTML}
            </div>
            <div class="project-buttons">
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="project-btn github-btn">
                    GitHub
                </a>
                <a href="${repo.homepage || url}" target="_blank" rel="noopener noreferrer" class="project-btn demo-btn">
                    ${repo.homepage ? 'Demo' : 'Ver'}
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// ========================================
// NAVBAR E MENU MOBILE
// ========================================
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) {
        console.warn('⚠️ Hamburger ou navMenu não encontrados');
        return;
    }
    
    // Toggle menu mobile
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ========================================
// DESTAQUE DE SEÇÃO ATIVA NA NAVBAR
// ========================================
function initSectionHighlight() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// MODO CLARO/ESCURO (THEME TOGGLE)
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.warn('⚠️ themeToggle não encontrado');
        return;
    }
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function applyTheme(theme) {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            themeToggle.textContent = '🌙';
        }
    }
}

// ========================================
// SCROLL SUAVE (SMOOTH SCROLL)
// ========================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignorar links vazios
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) {
        console.warn('⚠️ scrollToTop não encontrado');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// INTERSECTION OBSERVER (ANIMAÇÃO AO SCROLL)
// ========================================
function initIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    const elementsToAnimate = document.querySelectorAll(
        '.tech-card, .project-card, .info-card, .about-content'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// VALIDAÇÃO DE FORMULÁRIO (se houver)
// ========================================
function initFormValidation() {
    const form = document.querySelector('form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Adicione lógica de validação aqui
    });
}

// ========================================
// ATUALIZAR ANO NO FOOTER
// ========================================
function updateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ========================================
// LOG FINAL
// ========================================
console.log('✅ Portfolio inicializado com sucesso!');
