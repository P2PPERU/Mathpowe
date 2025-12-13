/**
 * MATH POWER - SCRIPTS PRINCIPALES
 * Funcionalidad completa de la landing page
 */

// ================================================
// VARIABLES GLOBALES
// ================================================
const state = {
    menuOpen: false,
    scrolled: false
};

// ================================================
// INICIALIZACIÓN
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Inicializar todos los módulos
    initMobileMenu();
    initStickyNavbar();
    initContactForm();
    initScrollAnimations();
    initLazyLoading();
    initSmoothScroll();
    initLucideIcons();
    
    console.log('✅ Math Power - Sitio cargado correctamente');
}

// ================================================
// MENÚ MÓVIL
// ================================================
function initMobileMenu() {
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a[href^="#"]');
    
    if (!menuButton || !mobileMenu) return;
    
    // Toggle menu
    menuButton.addEventListener('click', () => {
        state.menuOpen = !state.menuOpen;
        mobileMenu.classList.toggle('hidden');
        menuButton.setAttribute('aria-expanded', state.menuOpen);
        
        // Prevenir scroll cuando el menú está abierto
        document.body.classList.toggle('no-scroll', state.menuOpen);
    });
    
    // Cerrar menú al hacer click en un link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            state.menuOpen = false;
            menuButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (state.menuOpen && 
            !mobileMenu.contains(e.target) && 
            !menuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            state.menuOpen = false;
            menuButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ================================================
// NAVEGACIÓN STICKY
// ================================================
function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const handleScroll = () => {
        const scrolled = window.scrollY > 50;
        
        if (scrolled !== state.scrolled) {
            state.scrolled = scrolled;
            navbar.classList.toggle('sticky-nav', scrolled);
        }
    };
    
    // Throttle para mejor performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Ejecutar al cargar
    handleScroll();
}

// ================================================
// FORMULARIO DE CONTACTO
// ================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm(form)) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Deshabilitar botón de envío
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Enviando...';
        
        try {
            // Simular envío (aquí integrarías con tu backend)
            await simulateFormSubmission(data);
            
            // Mostrar mensaje de éxito
            showSuccessMessage(successMessage);
            
            // Limpiar formulario
            form.reset();
            
            // Opcional: Redirigir a WhatsApp con mensaje pre-escrito
            const whatsappMessage = encodeURIComponent(
                `Hola, soy ${data.name}. Acabo de enviar un formulario de contacto. Mi email es ${data.email} y mi teléfono es ${data.phone}.`
            );
            
            // Comentado por defecto, puedes habilitarlo si lo deseas
            // setTimeout(() => {
            //     window.open(`https://wa.me/51999999999?text=${whatsappMessage}`, '_blank');
            // }, 2000);
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente o contáctanos por WhatsApp.');
        } finally {
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Validación de formulario
function validateForm(form) {
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    
    // Validar nombre
    if (name.length < 3) {
        alert('Por favor, ingresa un nombre válido (mínimo 3 caracteres)');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un email válido');
        return false;
    }
    
    // Validar teléfono (9 dígitos para Perú)
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('Por favor, ingresa un número de teléfono válido (9 dígitos)');
        return false;
    }
    
    return true;
}

// Simular envío de formulario
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('📧 Datos del formulario:', data);
        
        // Aquí integrarías con tu backend
        // Ejemplo: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
        
        setTimeout(resolve, 1500); // Simular delay de red
    });
}

// Mostrar mensaje de éxito
function showSuccessMessage(element) {
    if (!element) return;
    
    element.classList.remove('hidden');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
    
    // Scroll suave al mensaje
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ================================================
// ANIMACIONES AL HACER SCROLL
// ================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);
    
    // Observar todas las tarjetas y secciones
    const animatedElements = document.querySelectorAll(
        '.card-hover, .testimonial-card, section > div'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('section-animate');
        observer.observe(el);
    });
}

// ================================================
// LAZY LOADING DE IMÁGENES
// ================================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antiguos
        images.forEach(img => img.classList.add('loaded'));
    }
}

// ================================================
// SMOOTH SCROLL
// ================================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignorar links que solo son "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Ajustar por navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin hacer scroll
                history.pushState(null, null, href);
            }
        });
    });
}

// ================================================
// INICIALIZAR LUCIDE ICONS
// ================================================
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ================================================
// UTILIDADES
// ================================================

// Función para trackear eventos (preparada para Google Analytics)
function trackEvent(category, action, label) {
    console.log(`📊 Event: ${category} - ${action} - ${label}`);
    
    // Integración con Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Función para obtener parámetros de URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Detectar si el usuario viene de una campaña específica
const utmSource = getUrlParameter('utm_source');
if (utmSource) {
    console.log(`📢 Usuario viene de: ${utmSource}`);
    trackEvent('Campaign', 'Visit', utmSource);
}

// ================================================
// PERFORMANCE MONITORING
// ================================================
window.addEventListener('load', () => {
    // Medir performance
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Página cargada en: ${pageLoadTime}ms`);
    }
});

// ================================================
// ERROR HANDLING GLOBAL
// ================================================
window.addEventListener('error', (e) => {
    console.error('❌ Error global:', e.message);
    // Aquí podrías enviar errores a un servicio de logging
});

// ================================================
// ENVIAR FORMULARIO A WHATSAPP
// ================================================
function sendToWhatsApp(e) {
    e.preventDefault();
    
    const form = document.getElementById('contact-form');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const message = form.querySelector('#message').value.trim();
    
    // Validar campos obligatorios
    if (name.length < 3) {
        alert('Por favor, ingresa un nombre válido (mínimo 3 caracteres)');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }
    
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('Por favor, ingresa un número de teléfono válido (9 dígitos)');
        return;
    }
    
    // Construir mensaje para WhatsApp
    let whatsappMessage = `Hola, soy ${name}.%0A`;
    whatsappMessage += `Email: ${email}%0A`;
    whatsappMessage += `Teléfono: ${phone}%0A`;
    if (message) {
        whatsappMessage += `Consulta: ${message}`;
    }
    
    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/51921658125?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Mostrar mensaje de éxito
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
    
    // Limpiar formulario
    form.reset();
}

// ================================================
// EXPORTAR FUNCIONES PARA USO GLOBAL (opcional)
// ================================================
window.MathPower = {
    trackEvent,
    getUrlParameter,
    sendToWhatsApp
};