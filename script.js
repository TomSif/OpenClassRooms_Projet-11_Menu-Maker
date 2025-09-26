// Configuration des données du projet
const PROJECT_DATA = {
    tasks: {
        p1: [
            { title: "Landing non connectée", points: 5, assignee: "Thomas", epic: "Landing" },
            { title: "Modale de connexion", points: 5, assignee: "Thomas", epic: "Connexion" },
            { title: "Gestion catégories", points: 5, assignee: "Thomas", epic: "Menu" },
            { title: "Formulaire création plats", points: 8, assignee: "Thomas", epic: "Menu" },
            { title: "Personnalisation design", points: 8, assignee: "Thomas", epic: "Menu" },
            { title: "Export PDF", points: 8, assignee: "Thomas", epic: "Menu" },
            { title: "Gestion menus précédents", points: 6, assignee: "Thomas", epic: "BackOffice" },
            { title: "Auth par email", points: 6, assignee: "Henriette", epic: "Connexion" },
            { title: "API création plats", points: 6, assignee: "Henriette", epic: "Menu" },
            { title: "API préférences", points: 3, assignee: "Henriette", epic: "Menu" },
            { title: "Intégration impression", points: 5, assignee: "Henriette", epic: "BackOffice" },
            { title: "API historique menus", points: 4, assignee: "Henriette", epic: "BackOffice" }
        ],
        p2: [
            { title: "Mentions légales", points: 3, assignee: "Thomas", epic: "Legal" },
            { title: "Dashboard blog", points: 6, assignee: "Thomas", epic: "Dashboard" },
            { title: "Page tarifs", points: 1, assignee: "Thomas", epic: "Marketing" },
            { title: "Déconnexion", points: 2, assignee: "Thomas", epic: "Auth" },
            { title: "Gestion utilisateur", points: 4, assignee: "Thomas", epic: "Profil" },
            { title: "API Deliveroo", points: 8, assignee: "Henriette", epic: "Intégrations" },
            { title: "API Instagram", points: 6, assignee: "Henriette", epic: "Intégrations" },
            { title: "Emails multiples", points: 4, assignee: "Henriette", epic: "Auth" },
            { title: "Gestion sessions", points: 2, assignee: "Henriette", epic: "Auth" },
            { title: "Infrastructure", points: 3, assignee: "DevOps", epic: "Infrastructure" }
        ],
        p3: [
            { title: "Interface branding", points: 5, assignee: "Thomas", epic: "Branding" },
            { title: "API branding", points: 3, assignee: "Henriette", epic: "Branding" },
            { title: "Tests validation", points: 5, assignee: "Soufiane", epic: "QA" }
        ]
    },
    
    stats: {
        thomas: 68,
        henriette: 43,
        devOps: 3,
        validation: 5
    }
};

// Fonctions pour le filtrage des cartes Kanban
function filterCards(type) {
    const cards = document.querySelectorAll('.card-kanban');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Reset active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let visibleCount = 0;
    
    cards.forEach(card => {
        let shouldShow = false;
        
        if (type === 'all') {
            shouldShow = true;
        } else if (type === 'front' && card.dataset.type === 'front') {
            shouldShow = true;
        } else if (type === 'back' && card.dataset.type === 'back') {
            shouldShow = true;
        } else if (type === 'devops' && card.dataset.type === 'devops') {
            shouldShow = true;
        } else if (type === 'po' && card.dataset.type === 'po') {
            shouldShow = true;
        } else if (card.dataset.priority === type) {
            shouldShow = true;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update column count
    updateColumnCount(visibleCount);
}

function updateColumnCount(count = null) {
    if (count === null) {
        const visibleCards = document.querySelectorAll('.card-kanban:not([style*="display: none"])');
        count = visibleCards.length;
    }
    
    const columnCount = document.querySelector('.column-count');
    if (columnCount) {
        columnCount.textContent = count;
    }
}

// Setup des boutons expand/collapse pour les descriptions longues
function setupExpandButtons() {
    document.querySelectorAll('.card-description').forEach(desc => {
        if (desc.scrollHeight > 100) {
            const expandBtn = document.createElement('button');
            expandBtn.textContent = 'Voir plus...';
            expandBtn.className = 'expand-btn';
            expandBtn.onclick = function() {
                desc.classList.toggle('expanded');
                expandBtn.textContent = desc.classList.contains('expanded') ? 'Voir moins' : 'Voir plus...';
            };
            desc.parentNode.insertBefore(expandBtn, desc.nextSibling);
        }
    });
}

// Fonction pour initialiser les interactions du Kanban
function initializeKanbanInteractions() {
    // Setup expand buttons pour les descriptions
    setupExpandButtons();
    
    // Gestion des touches clavier pour l'accessibilité
    document.addEventListener('keydown', (e) => {
        // Navigation par touches fléchées dans les cartes Kanban
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const focusedCard = document.activeElement;
            if (focusedCard && focusedCard.classList.contains('card-kanban')) {
                e.preventDefault();
                const cards = Array.from(document.querySelectorAll('.card-kanban:not([style*="display: none"])'));
                const currentIndex = cards.indexOf(focusedCard);
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % cards.length;
                } else {
                    nextIndex = (currentIndex - 1 + cards.length) % cards.length;
                }
                
                cards[nextIndex].focus();
            }
        }
        
        // Filtres rapides par touches
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    filterCards('p1');
                    break;
                case '2':
                    e.preventDefault();
                    filterCards('p2');
                    break;
                case '3':
                    e.preventDefault();
                    filterCards('p3');
                    break;
                case 'f':
                    e.preventDefault();
                    filterCards('front');
                    break;
                case 'b':
                    e.preventDefault();
                    filterCards('back');
                    break;
                case 'a':
                    e.preventDefault();
                    filterCards('all');
                    break;
            }
        }
    });
    
    // Rendre les cartes focusables pour l'accessibilité
    const cards = document.querySelectorAll('.card-kanban');
    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Tâche: ${card.querySelector('.card-title-kanban').textContent}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Expand/collapse la description si elle existe
                const expandBtn = card.querySelector('.expand-btn');
                if (expandBtn) {
                    expandBtn.click();
                }
            }
        });
    });
    
    // Animation d'entrée pour les cartes
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 100);
}

// Fonction pour calculer et afficher les statistiques
function updateProjectStats() {
    const allCards = document.querySelectorAll('.card-kanban');
    const visibleCards = document.querySelectorAll('.card-kanban:not([style*="display: none"])');
    
    // Mettre à jour le compteur de tâches visible
    const totalTasksElement = document.querySelector('.stat-number-kanban');
    if (totalTasksElement) {
        totalTasksElement.textContent = visibleCards.length;
    }
    
    // Calculer les story points des cartes visibles
    let totalPoints = 0;
    visibleCards.forEach(card => {
        const pointsElement = card.querySelector('.story-points');
        if (pointsElement) {
            const points = parseInt(pointsElement.textContent.replace(' pts', ''));
            totalPoints += points;
        }
    });
    
    // Mettre à jour le compteur de story points si nécessaire
    const statsElements = document.querySelectorAll('.stat-number-kanban');
    if (statsElements[1]) {
        statsElements[1].textContent = totalPoints;
    }
}

// Extension de la classe principale pour gérer le Kanban
class MenuMakerDocs {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showSection('home');
    }
    
    setupEventListeners() {
        // Navigation principale
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });
        
        // Cartes de navigation sur la page d'accueil
        const menuCards = document.querySelectorAll('.menu-card');
        menuCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });
        
        // Gestion des touches clavier pour l'accessibilité
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showSection('home');
            }
        });
    }
    
    showSection(sectionId) {
        // Masquer toutes les sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Retirer la classe active de tous les liens de navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Afficher la section sélectionnée
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Activer le lien de navigation correspondant
        const activeNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavLink && activeNavLink.classList.contains('nav-link')) {
            activeNavLink.classList.add('active');
        }
        
        // Actions spécifiques selon la section
        if (sectionId === 'kanban') {
            this.loadKanbanContent();
        }
        
        this.currentSection = sectionId;
        
        // Scroll vers le haut
        window.scrollTo(0, 0);
        
        // Focus management pour l'accessibilité
        this.manageFocus(sectionId);
    }
    
    manageFocus(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const firstHeading = section.querySelector('h2');
            if (firstHeading) {
                firstHeading.setAttribute('tabindex', '-1');
                firstHeading.focus();
                // Retirer le tabindex après le focus pour ne pas perturber la navigation
                setTimeout(() => {
                    firstHeading.removeAttribute('tabindex');
                }, 100);
            }
        }
    }
    
    loadKanbanContent() {
        // Initialiser les interactions Kanban
        setTimeout(() => {
            initializeKanbanInteractions();
            updateProjectStats();
        }, 100);
    }
    
    // Méthode utilitaire pour exporter les données (pour debugging)
    exportProjectData() {
        return {
            currentSection: this.currentSection,
            projectData: PROJECT_DATA,
            totalStoryPoints: this.getTotalStoryPoints(),
            tasksByAssignee: this.getTasksByAssignee()
        };
    }
    
    getTotalStoryPoints() {
        let total = 0;
        Object.keys(PROJECT_DATA.tasks).forEach(priority => {
            total += this.calculateTotalPoints(priority);
        });
        return total;
    }
    
    getTasksByAssignee() {
        const assignees = {};
        Object.keys(PROJECT_DATA.tasks).forEach(priority => {
            PROJECT_DATA.tasks[priority].forEach(task => {
                if (!assignees[task.assignee]) {
                    assignees[task.assignee] = { tasks: 0, points: 0 };
                }
                assignees[task.assignee].tasks++;
                assignees[task.assignee].points += task.points;
            });
        });
        return assignees;
    }
    
    calculateTotalPoints(priority) {
        return PROJECT_DATA.tasks[priority].reduce((total, task) => total + task.points, 0);
    }
}

// Fonctions utilitaires globales
const Utils = {
    // Animation pour les transitions entre sections
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    // Sauvegarde de l'état de l'application
    saveState: (key, value) => {
        try {
            localStorage.setItem(`menumaker_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    },
    
    // Chargement de l'état de l'application
    loadState: (key, defaultValue = null) => {
        try {
            const saved = localStorage.getItem(`menumaker_${key}`);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.warn('Error loading state:', e);
            return defaultValue;
        }
    },
    
    // Formatage des nombres
    formatNumber: (num) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    },
    
    // Debounce pour les événements répétitifs
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser l'application principale
    window.menuMakerApp = new MenuMakerDocs();
    
    // Gestion des erreurs globales
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
    });
    
    // Gestion de l'accessibilité au clavier
    document.addEventListener('keydown', (e) => {
        // Navigation par touches fléchées dans le Kanban
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const focusedCard = document.activeElement;
            if (focusedCard && focusedCard.classList.contains('task-card')) {
                e.preventDefault();
                const cards = Array.from(document.querySelectorAll('.task-card'));
                const currentIndex = cards.indexOf(focusedCard);
                
                let nextIndex;
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % cards.length;
                } else {
                    nextIndex = (currentIndex - 1 + cards.length) % cards.length;
                }
                
                cards[nextIndex].focus();
            }
        }
    });
    
    // Faire les cartes de tâches focusables pour l'accessibilité
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const taskCards = document.querySelectorAll('.task-card');
                taskCards.forEach(card => {
                    if (!card.hasAttribute('tabindex')) {
                        card.setAttribute('tabindex', '0');
                        card.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                // Ici on pourrait ajouter une action sur la tâche
                                console.log('Task selected:', card.querySelector('.task-title').textContent);
                            }
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Gestion de la performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Précharger les sections pour une navigation plus fluide
            const sections = ['kanban', 'specs', 'veille', 'presentation'];
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    // Préparation en arrière-plan
                    element.style.willChange = 'opacity, transform';
                }
            });
        });
    }
    
    console.log('Menu Maker Documentation loaded successfully');
    console.log('Total story points:', window.menuMakerApp.getTotalStoryPoints());
});

// Export pour les tests (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MenuMakerDocs, Utils, PROJECT_DATA };
}