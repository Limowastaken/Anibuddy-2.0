// Anime List App - Main JavaScript
class AnimeApp {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.currentGenre = null;
        this.searchQuery = '';
        this.animeData = [];
        this.genres = [];
        this.favorites = JSON.parse(localStorage.getItem('animeFavorites') || '[]');
        this.init();
    }

    async init() {
        await this.loadGenres();
        this.setupEventListeners();
        this.loadInitialAnime();
        this.initAnimations();
    }

    // Initialize animations and visual effects
    initAnimations() {
        // Background particle effect
        if (typeof PIXI !== 'undefined') {
            this.initParticleEffect();
        }

        // Card animations
        if (typeof anime !== 'undefined') {
            this.initCardAnimations();
        }
    }

    // Initialize PIXI.js particle background
    initParticleEffect() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            antialias: true
        });

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x4a3f8a, 0.3);
            particle.drawCircle(0, 0, Math.random() * 3 + 1);
            particle.endFill();
            
            particle.x = Math.random() * app.screen.width;
            particle.y = Math.random() * app.screen.height;
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;
            
            app.stage.addChild(particle);
            particles.push(particle);
        }

        app.ticker.add(() => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0) particle.x = app.screen.width;
                if (particle.x > app.screen.width) particle.x = 0;
                if (particle.y < 0) particle.y = app.screen.height;
                if (particle.y > app.screen.height) particle.y = 0;
            });
        });

        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }

    // Initialize card animations with Anime.js
    initCardAnimations() {
        const cards = document.querySelectorAll('.anime-card');
        
        anime({
            targets: cards,
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }

    // Load anime genres from Jikan API
    async loadGenres() {
        try {
            const response = await fetch('https://api.jikan.moe/v4/genres/anime');
            const data = await response.json();
            this.genres = data.data || [];
            this.renderGenreFilters();
        } catch (error) {
            console.error('Error loading genres:', error);
            this.genres = this.getDefaultGenres();
            this.renderGenreFilters();
        }
    }

    // Default genres fallback
    getDefaultGenres() {
        return [
            { mal_id: 1, name: 'Action' },
            { mal_id: 2, name: 'Adventure' },
            { mal_id: 4, name: 'Comedy' },
            { mal_id: 8, name: 'Drama' },
            { mal_id: 10, name: 'Fantasy' },
            { mal_id: 22, name: 'Romance' },
            { mal_id: 24, name: 'Sci-Fi' },
            { mal_id: 36, name: 'Slice of Life' }
        ];
    }

    // Render genre filter chips
    renderGenreFilters() {
        const container = document.getElementById('genreFilters');
        if (!container) return;

        container.innerHTML = this.genres.map(genre => `
            <button class="genre-chip" data-genre-id="${genre.mal_id}">
                ${genre.name}
            </button>
        `).join('');

        // Add event listeners to genre chips
        container.querySelectorAll('.genre-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const genreId = e.target.dataset.genreId;
                this.filterByGenre(genreId);
            });
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchQuery = e.target.value;
                this.resetAndSearch();
            }, 300));
        }

        // Infinite scroll
        window.addEventListener('scroll', this.throttle(() => {
            if (this.isNearBottom() && !this.isLoading) {
                this.loadMoreAnime();
            }
        }, 200));

        // Clear filters
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    // Load initial anime data
    async loadInitialAnime() {
        this.showLoading();
        await this.loadAnime();
        this.hideLoading();
    }

    // Load anime from Jikan API
    async loadAnime() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        try {
            let url = '';
            
            if (this.searchQuery) {
                url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}&limit=25`;
            } else if (this.currentGenre) {
                url = `https://api.jikan.moe/v4/anime?genres=${this.currentGenre}&page=${this.currentPage}&limit=25`;
            } else {
                url = `https://api.jikan.moe/v4/top/anime?page=${this.currentPage}&limit=25`;
            }

            const response = await fetch(url);
            const data = await response.json();
            
            if (data.data) {
                if (this.currentPage === 1) {
                    this.animeData = data.data;
                    this.renderAnime();
                } else {
                    this.animeData = [...this.animeData, ...data.data];
                    this.appendAnime(data.data);
                }
            }
        } catch (error) {
            console.error('Error loading anime:', error);
            this.showError();
        } finally {
            this.isLoading = false;
        }
    }

    // Render anime cards
    renderAnime() {
        const container = document.getElementById('animeGrid');
        if (!container) return;

        container.innerHTML = this.animeData.map(anime => this.createAnimeCard(anime)).join('');
        this.attachCardEventListeners();
        this.initCardAnimations();
    }

    // Append new anime cards
    appendAnime(newAnime) {
        const container = document.getElementById('animeGrid');
        if (!container) return;

        const newCards = newAnime.map(anime => this.createAnimeCard(anime)).join('');
        container.insertAdjacentHTML('beforeend', newCards);
        this.attachCardEventListeners();
    }

    // Create individual anime card HTML
    createAnimeCard(anime) {
        const score = anime.score || 'N/A';
        const episodes = anime.episodes || '?';
        const rank = anime.rank || 'N/A';
        const isFavorite = this.favorites.includes(anime.mal_id);
        
        return `
            <div class="anime-card" data-anime-id="${anime.mal_id}">
                <div class="card-image">
                    <img src="${anime.images?.jpg?.image_url || ''}" 
                         alt="${anime.title}" 
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI1IiBoZWlnaHQ9IjMxOCIgdmlld0JveD0iMCAwIDIyNSAzMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjUiIGhlaWdodD0iMzE4IiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjExMi41IiB5PSIxNTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='">
                    <div class="card-overlay">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-anime-id="${anime.mal_id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFavorite ? '#ff6b6b' : 'none'}" stroke="currentColor">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="anime-title">${anime.title}</h3>
                        <div class="anime-rank">#${rank}</div>
                    </div>
                    <div class="card-meta">
                        <div class="anime-score">
                            <span class="score-value">${score}</span>
                            <span class="score-label">Score</span>
                        </div>
                        <div class="anime-episodes">
                            <span class="episodes-value">${episodes}</span>
                            <span class="episodes-label">Episodes</span>
                        </div>
                        <div class="anime-type">${anime.type || 'TV'}</div>
                    </div>
                    <div class="anime-genres">
                        ${(anime.genres || []).slice(0, 3).map(genre => 
                            `<span class="genre-tag">${genre.name}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Attach event listeners to anime cards
    attachCardEventListeners() {
        // Card click for details
        document.querySelectorAll('.anime-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.favorite-btn')) return;
                
                const animeId = card.dataset.animeId;
                this.openAnimeDetails(animeId);
            });
        });

        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const animeId = parseInt(btn.dataset.animeId);
                this.toggleFavorite(animeId);
            });
        });
    }

    // Open anime details page
    openAnimeDetails(animeId) {
        window.location.href = `details.html?id=${animeId}`;
    }

    // Toggle favorite status
    toggleFavorite(animeId) {
        const index = this.favorites.indexOf(animeId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(animeId);
        }
        
        localStorage.setItem('animeFavorites', JSON.stringify(this.favorites));
        this.updateFavoriteButton(animeId);
    }

    // Update favorite button appearance
    updateFavoriteButton(animeId) {
        const btn = document.querySelector(`[data-anime-id="${animeId}"].favorite-btn`);
        if (btn) {
            const isFavorite = this.favorites.includes(animeId);
            btn.classList.toggle('active', isFavorite);
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', isFavorite ? '#ff6b6b' : 'none');
            }
        }
    }

    // Filter by genre
    filterByGenre(genreId) {
        const chip = document.querySelector(`[data-genre-id="${genreId}"]`);
        
        // Toggle genre selection
        if (this.currentGenre === genreId) {
            this.currentGenre = null;
            chip.classList.remove('active');
        } else {
            // Clear previous selection
            document.querySelectorAll('.genre-chip.active').forEach(c => c.classList.remove('active'));
            this.currentGenre = genreId;
            chip.classList.add('active');
        }
        
        this.resetAndSearch();
    }

    // Reset and perform new search
    resetAndSearch() {
        this.currentPage = 1;
        this.animeData = [];
        this.showLoading();
        this.loadAnime().then(() => {
            this.hideLoading();
        });
    }

    // Load more anime (infinite scroll)
    async loadMoreAnime() {
        this.currentPage++;
        await this.loadAnime();
    }

    // Clear all filters
    clearAllFilters() {
        this.searchQuery = '';
        this.currentGenre = null;
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        document.querySelectorAll('.genre-chip.active').forEach(chip => {
            chip.classList.remove('active');
        });
        
        this.resetAndSearch();
    }

    // Utility functions
    isNearBottom() {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
    }

    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    showLoading() {
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = 'block';
    }

    hideLoading() {
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = 'none';
    }

    showError() {
        const container = document.getElementById('animeGrid');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>Failed to load anime data</h3>
                    <p>Please try again later or check your internet connection.</p>
                    <button onclick="location.reload()" class="retry-btn">Retry</button>
                </div>
            `;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animeApp = new AnimeApp();
});

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Utility function to get color based on score
function getScoreColor(score) {
    if (score >= 8.5) return '#00d4ff';
    if (score >= 7.5) return '#7ec8e3';
    if (score >= 6.5) return '#b8b8b8';
    return '#666666';
}