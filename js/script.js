// ========================================
// PORTFOLIO - SCRIPT PRINCIPAL
// ========================================

// Esperar o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// ========================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ========================================
function initializeApp() {
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
// NAVBAR E MENU MOBILE
// ========================================
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

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

    // Atualizar link ativo baseado no scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop -  200) {
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
    const html = document.documentElement;
    const body = document.body;

    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            document.getElementById('themeToggle').textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            document.getElementById('themeToggle').textContent = '🌙';
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
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
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

    // Mostrar/ocultar botão baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Voltar ao topo com animação suave
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
                // Adicionar classe de animação
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observar todos os cards e elementos que devem animar
    const elementsToAnimate = document.querySelectorAll(
        '.tech-card, .project-card, .info-card, .about-content'
    );

    elementsToAnimate.forEach(element => {
        observer.observe(element);
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
// FUNÇÕES UTILITÁRIAS
// ========================================

// Log para debug
function log(message) {
    console.log(`[Portfolio] ${message}`);
}

// Detectar cliques fora de um elemento
document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu && navbar) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ========================================
// EVENT LISTENERS GLOBAIS
// ========================================

// Prevenir comportamento padrão de links vazios
document.addEventListener('click', (e) => {
    if (e.target.href === '#') {
        e.preventDefault();
    }
});

log('Portfolio inicializado com sucesso!');

// ========================================
// CARREGAR PROJETOS DO GITHUB
// ========================================

async function loadGitHubProjects() {
    const username = 'WillGarp-github'; // ← MUDE AQUI COM SEU USUÁRIO
    const container = document.querySelector('.projects-grid');
    
    // Lista de repositórios que você quer mostrar
    const reposToShow = ['nexatech', 'portfolio']; // ← MUDE AQUI COM SEUS REPOS
    
    try {
        console.log('🔄 Carregando projetos do GitHub...');
        
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );
        
        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filtrar apenas os repositórios selecionados
        const selectedRepos = repos.filter(repo => 
            reposToShow.includes(repo.name) && !repo.private
        );
        
        console.log(`✅ ${selectedRepos.length} projetos encontrados`);
        
        // Limpar container
        container.innerHTML = '';
        
        // Se não encontrou, mostrar mensagem
        if (selectedRepos.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p>Nenhum projeto encontrado. Verifique o nome do usuário e repositórios.</p>
                </div>
            `;
            return;
        }
        
        // Renderizar cada projeto
        selectedRepos.forEach(repo => {
            const card = createProjectCard(repo);
            container.appendChild(card);
        });
        
        // Reinicializar animações
        if (typeof initIntersectionObserver === 'function') {
            initIntersectionObserver();
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>Erro ao carregar projetos. Verifique a conexão e tente novamente.</p>
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
        'portfolio': ['HTML5', 'CSS3', 'JavaScript'],
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

// Executar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubProjects();
    initializeApp(); // Suas outras inicializações
});