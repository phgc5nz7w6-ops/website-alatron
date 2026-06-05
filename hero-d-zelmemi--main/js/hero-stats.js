/* ========================================
   ALATRON - HERO STATS SCROLL DETECTOR
   ======================================== */

// Scroll'da hero-stats'i kontrol et
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero');
    const heroStats = document.querySelector('.hero-stats');
    
    if (!heroSection || !heroStats) return;
    
    const heroBottom = heroSection.offsetHeight + heroSection.offsetTop;
    const currentScroll = window.scrollY || window.pageYOffset;
    
    // Hero bölümü tamamen scroll'lanmışsa stats gizle
    if (currentScroll > heroBottom) {
        heroStats.style.display = 'none';
    } else {
        heroStats.style.display = 'block';
    }
}, { passive: true });
