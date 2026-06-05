// ALATRON - Ana JavaScript Dosyası
console.log('ALATRON JS Yüklendi');

/* ================================================================
   ANDROID / iOS VIEWPORT YÜKSEKLİK DÜZELTMESİ
   
   Problem: Android Chrome'da 100vh adres çubuğunu hesaba katmaz.
   CSS dvh desteği yoksa JS ile --vh custom property set ediyoruz.
   
   Bu fonksiyon hero section'ın tam ekran görünmesini garanti eder.
   ================================================================ */
(function fixViewportHeight() {
    // dvh desteği var mı kontrol et
    const supportsDvh = CSS && CSS.supports && CSS.supports('height', '100dvh');
    
    if (!supportsDvh) {
        // dvh desteklenmiyor → JS ile gerçek viewport yüksekliğini hesapla
        function setVhVar() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        }
        
        setVhVar();
        
        // Resize ve orientationchange'de güncelle (klavye açılınca da)
        window.addEventListener('resize', setVhVar, { passive: true });
        window.addEventListener('orientationchange', function() {
            setTimeout(setVhVar, 300); // orientation değişimi sonrası bekleme
        });
    }
})();

// ========== BAŞLANGIC KONTROL ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    initMobileMenu();
    initNavbarScroll();
    initFormHandling();
    initGalleryLightbox();
    initReferenceSlider();
    setActivePage();
}

// ========== MOBİL MENÜ ==========
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileBtn || !navMenu) return;

    // Menüyü açma/kapama
    mobileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Menü linklerine tıklayınca kapat
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Sayfada başka yere tıklayınca menüyü kapat
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Esc tuşu ile menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    function toggleMenu() {
        navMenu.classList.toggle('active');
        updateMenuIcon();
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        updateMenuIcon();
        document.body.style.overflow = '';
    }

    function updateMenuIcon() {
        const icon = mobileBtn.querySelector('i');
        if (!icon) return;

        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

// ========== NAVBAR SCROLL EFEKTI ==========
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollTop = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

// ========== FORM HANDLING (FORMSPREE) ==========
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Form alanlarını al
        const nameInput = this.querySelector('input[name="name"]');
        const emailInput = this.querySelector('input[name="email"]');
        const subjectInput = this.querySelector('input[name="subject"]');
        const messageInput = this.querySelector('textarea[name="message"]');
        const submitBtn = this.querySelector('button[type="submit"]');

        // Validasyon
        if (!validateForm(nameInput, emailInput, subjectInput, messageInput)) {
            return;
        }

        // Buton devre dışı bırak
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

        try {
            const formData = new FormData(this);
            const response = await fetch('https://formspree.io/f/mzdoglbj', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showSuccessMessage('Mesajınız başarıyla gönderildi!');
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            } else {
                throw new Error('Form gönderimi başarısız oldu');
            }
        } catch (error) {
            console.error('Form hatası:', error);
            showErrorMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm(nameInput, emailInput, subjectInput, messageInput) {
    // Ad kontrolü
    if (!nameInput.value.trim()) {
        showErrorMessage('Lütfen adınızı girin');
        nameInput.focus();
        return false;
    }

    // E-posta kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showErrorMessage('Lütfen geçerli bir e-posta adresi girin');
        emailInput.focus();
        return false;
    }

    // Konu kontrolü
    if (!subjectInput.value.trim()) {
        showErrorMessage('Lütfen konu girin');
        subjectInput.focus();
        return false;
    }

    // Mesaj kontrolü
    if (!messageInput.value.trim()) {
        showErrorMessage('Lütfen mesajınızı yazın');
        messageInput.focus();
        return false;
    }

    return true;
}

function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle" style="font-size: 24px; color: #c9a03d; flex-shrink: 0;"></i>
            <div>
                <h4 style="margin: 0; color: white; font-size: 1rem;">Başarılı!</h4>
                <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    // Auto-remove
    setTimeout(() => {
        div.classList.add('fade-out');
        setTimeout(() => div.remove(), 500);
    }, 5000);
}

function showErrorMessage(message) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.style.background = '#dc2626';
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-exclamation-circle" style="font-size: 24px; color: white; flex-shrink: 0;"></i>
            <div>
                <h4 style="margin: 0; color: white; font-size: 1rem;">Hata</h4>
                <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    // Auto-remove
    setTimeout(() => {
        div.classList.add('fade-out');
        setTimeout(() => div.remove(), 500);
    }, 4000);
}

// ========== GALERİ LIGHTBOX ==========
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(this.querySelector('img'), index, galleryItems);
        });
    });
}

function openLightbox(img, currentIndex, allItems) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';

    const imageSrc = img.src;
    const imageAlt = img.alt;

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Kapat">&times;</button>
            <img src="${imageSrc}" alt="${imageAlt}" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px;">
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: white; font-size: 14px;">
                ${currentIndex + 1} / ${allItems.length}
            </div>
        </div>
    `;

    document.body.appendChild(lightbox);

    // Kapatma butonuna tıkla
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        closeLightbox(lightbox);
    });

    // Overlay'e tıkla
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });

    // Esc tuşu
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Oklar ile navigasyon
    const arrowHandler = (e) => {
        if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % allItems.length;
            closeLightbox(lightbox);
            openLightbox(allItems[nextIndex].querySelector('img'), nextIndex, allItems);
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
            closeLightbox(lightbox);
            openLightbox(allItems[prevIndex].querySelector('img'), prevIndex, allItems);
        }
    };
    document.addEventListener('keydown', arrowHandler);
}

function closeLightbox(lightbox) {
    if (lightbox) {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => lightbox.remove(), 300);
    }
}

// ========== REFERANS SLİDER ==========
function initReferenceSlider() {
    const track = document.getElementById('sliderTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const cards = document.querySelectorAll('.ref-card');

    if (!track || !nextBtn || !prevBtn || cards.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval = null;

    function updateSlider() {
        if (cards.length === 0) return;

        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
    }

    function getVisibleCards() {
        const containerWidth = track.parentElement.offsetWidth;
        const cardWidth = cards[0].offsetWidth + 30;
        return Math.max(1, Math.floor(containerWidth / cardWidth));
    }

    function nextSlide() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        updateSlider();
    }

    function prevSlide() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    // Resize olayında update yap
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlider();
    }, { passive: true });

    // İlk yüklemede başlat
    updateSlider();
    startAutoSlide();

    // Fare gelince otomatik kaydırmayı durdur
    track.parentElement.addEventListener('mouseenter', stopAutoSlide);
    track.parentElement.addEventListener('mouseleave', startAutoSlide);
}

// ========== AKTİF SAYFA AYARLAMA ==========
function setActivePage() {
   const currentPage = window.location.pathname.split('/').pop() || 'index.html';
// Eğer pathname boşsa index.html olarak ayarla
if (!currentPage || currentPage === '') {
    currentPage = 'index.html';
}
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== SCROLL TO TOP ==========
function initScrollToTop() {
    // Scroll-down indicator tıklaması
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
}

// Sayfanız fully loaded olduktan sonra scroll-to-top'ı başlat
window.addEventListener('load', initScrollToTop);

// ========== PERFORMANS: LAZY LOADING ==========
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// ========== SMOOTH SCROLL ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== PERFORMANCE MONITORING ==========
if (window.location.hash === '#debug') {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Sayfa yüklenme süresi: ' + pageLoadTime + 'ms');
    });
}

console.log('ALATRON Web Sitesi Hazır!');