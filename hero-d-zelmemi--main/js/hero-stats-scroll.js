// ========== HERO STATS SCROLL KONTROL ==========
function initHeroStatsScrollEffect() {
    const hero = document.querySelector('.hero');
    const stats = document.querySelector('.hero-stats');
    
    if (!hero || !stats) return;
    
    function updateStatsVisibility() {
        const heroBottom = hero.getBoundingClientRect().bottom;
        
        if (heroBottom < 0) {
            // Hero section tamamen yukarı kaydı
            document.body.classList.add('scrolled-past-hero');
        } else {
            // Hala hero section içinde veya altında
            document.body.classList.remove('scrolled-past-hero');
        }
    }
    
    window.addEventListener('scroll', updateStatsVisibility, { passive: true });
    updateStatsVisibility(); // İlk yüklemede kontrol et
}

// Başlatma
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroStatsScrollEffect);
} else {
    initHeroStatsScrollEffect();
}
