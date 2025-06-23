// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and interactions
    initializeMusic();
    initializeTypewriter();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeParallax();
    
    // Add scroll event listener for navbar
    window.addEventListener('scroll', handleNavbarScroll);
});

// Music Control
function initializeMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isPlaying = false;
    
    // Set volume for background music
    backgroundMusic.volume = 0.3;
    
    // Create beautiful romantic piano melody using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = null;
    let gainNode = null;
    let filterNode = null;
    
    function playBeautifulMelody() {
        if (oscillator) {
            oscillator.stop();
        }
        
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        filterNode = audioContext.createBiquadFilter();
        
        // Create a more sophisticated audio chain
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Beautiful romantic melody - "Clair de Lune" inspired
        const melody = [
            {freq: 261.63, duration: 1.5}, // C4
            {freq: 293.66, duration: 0.5}, // D4
            {freq: 329.63, duration: 1.0}, // E4
            {freq: 293.66, duration: 0.5}, // D4
            {freq: 261.63, duration: 1.0}, // C4
            {freq: 220.00, duration: 1.0}, // A3
            {freq: 246.94, duration: 2.0}, // B3
            {freq: 261.63, duration: 1.5}, // C4
            {freq: 329.63, duration: 0.5}, // E4
            {freq: 392.00, duration: 1.0}, // G4
            {freq: 329.63, duration: 0.5}, // E4
            {freq: 293.66, duration: 1.0}, // D4
            {freq: 261.63, duration: 2.0}  // C4
        ];
        
        let noteIndex = 0;
        let startTime = audioContext.currentTime;
        
        function playNextNote() {
            if (isPlaying && noteIndex < melody.length) {
                const note = melody[noteIndex];
                const noteStartTime = startTime + (noteIndex * 0.8);
                
                // Set frequency with smooth transitions
                oscillator.frequency.setValueAtTime(note.freq, noteStartTime);
                
                // Create gentle attack and decay
                gainNode.gain.setValueAtTime(0, noteStartTime);
                gainNode.gain.linearRampToValueAtTime(0.08, noteStartTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.02, noteStartTime + note.duration);
                
                // Add subtle filter sweep for warmth
                filterNode.frequency.setValueAtTime(800, noteStartTime);
                filterNode.frequency.linearRampToValueAtTime(1200, noteStartTime + note.duration / 2);
                filterNode.frequency.linearRampToValueAtTime(600, noteStartTime + note.duration);
                
                noteIndex++;
                setTimeout(playNextNote, note.duration * 800);
            } else if (isPlaying) {
                // Loop the melody
                noteIndex = 0;
                startTime = audioContext.currentTime;
                setTimeout(playNextNote, 1000);
            }
        }
        
        // Use a warm triangle wave instead of sine
        oscillator.type = 'triangle';
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(1000, audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, audioContext.currentTime);
        
        oscillator.start();
        playNextNote();
    }
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            // Stop both audio sources
            if (oscillator) {
                oscillator.stop();
                oscillator = null;
            }
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.style.opacity = '0.7';
            isPlaying = false;
        } else {
            audioContext.resume().then(() => {
                // Try to play the background music first
                backgroundMusic.play().then(() => {
                    console.log('Background music playing');
                }).catch(() => {
                    // If background music fails, use the generated melody
                    playBeautifulMelody();
                });
                
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.style.opacity = '1';
                isPlaying = true;
            });
        }
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriterText');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    let i = 0;
    const speed = 50; // milliseconds per character
    
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typewriter effect when element comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeWriter, 1000); // Delay start by 1 second
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(typewriterElement);
}

// Scroll Animations
function initializeScrollAnimations() {
    const reasonItems = document.querySelectorAll('.reason-item');
    const ownershipTexts = document.querySelectorAll('.ownership-text');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reasonItems.forEach(item => observer.observe(item));
    ownershipTexts.forEach(text => observer.observe(text));
}

// Smooth Scrolling for Navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero-background, .everything-section, .ownership-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('hero-background')) {
                element.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
    }
}

// Heart Animation Enhancement
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = '20px';
    heart.style.zIndex = '-1';
    heart.style.pointerEvents = 'none';
    heart.style.opacity = '0.6';
    
    document.body.appendChild(heart);
    
    // Animate the heart
    let position = window.innerHeight;
    const speed = 2 + Math.random() * 3;
    
    function animateHeart() {
        position -= speed;
        heart.style.top = position + 'px';
        heart.style.transform = `rotate(${position * 0.5}deg)`;
        
        if (position < -50) {
            heart.remove();
        } else {
            requestAnimationFrame(animateHeart);
        }
    }
    
    animateHeart();
}

// Create floating hearts periodically
setInterval(createFloatingHeart, 3000);

// Add sparkle effect on hover for important elements
function addSparkleEffect() {
    const sparkleElements = document.querySelectorAll('.hero-title, .ownership-title, .final-title');
    
    sparkleElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(212, 135, 156, 0.5), 0 0 20px rgba(212, 135, 156, 0.3), 0 0 30px rgba(212, 135, 156, 0.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
}

// Initialize sparkle effect
addSparkleEffect();

// Add gentle shake animation to hearts on click
document.addEventListener('click', function(e) {
    // Create temporary hearts at click position
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + (Math.random() - 0.5) * 50 + 'px';
        heart.style.top = e.clientY + (Math.random() - 0.5) * 50 + 'px';
        heart.style.fontSize = '16px';
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none';
        heart.style.opacity = '0.8';
        heart.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.style.transform = 'translateY(-100px) scale(0)';
            heart.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            heart.remove();
        }, 1100);
    }
});

// Add loading animation
window.addEventListener('load', function() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 1s ease-in';
    
    setTimeout(() => {
        body.style.opacity = '1';
    }, 100);
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Recalculate animations if needed
    const windowWidth = window.innerWidth;
    
    if (windowWidth < 768) {
        // Mobile adjustments
        document.documentElement.style.setProperty('--heart-size', '16px');
    } else {
        // Desktop adjustments
        document.documentElement.style.setProperty('--heart-size', '20px');
    }
});

// Initialize performance optimization
function optimizePerformance() {
    // Throttle scroll events
    let ticking = false;
    
    function updateScrollAnimations() {
        handleNavbarScroll();
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize performance optimizations
optimizePerformance();

// Quote carousel functionality
let currentQuote = 1;
const totalQuotes = 5;

function nextQuote() {
    currentQuote = currentQuote >= totalQuotes ? 1 : currentQuote + 1;
    updateQuoteDisplay();
}

function previousQuote() {
    currentQuote = currentQuote <= 1 ? totalQuotes : currentQuote - 1;
    updateQuoteDisplay();
}

function goToQuote(quoteNumber) {
    currentQuote = quoteNumber;
    updateQuoteDisplay();
}

function updateQuoteDisplay() {
    // Remove all classes first
    document.querySelectorAll('.quote-card').forEach(card => {
        card.classList.remove('active', 'prev', 'next');
    });
    
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Add active class to current quote
    const activeCard = document.querySelector(`[data-quote="${currentQuote}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
    
    // Add active class to current indicator
    const activeIndicator = document.querySelector(`.indicator[data-quote="${currentQuote}"]`);
    if (activeIndicator) {
        activeIndicator.classList.add('active');
    }
    
    // Add prev/next classes for 3D effect
    const prevQuote = currentQuote <= 1 ? totalQuotes : currentQuote - 1;
    const nextQuote = currentQuote >= totalQuotes ? 1 : currentQuote + 1;
    
    const prevCard = document.querySelector(`[data-quote="${prevQuote}"]`);
    const nextCard = document.querySelector(`[data-quote="${nextQuote}"]`);
    
    if (prevCard) prevCard.classList.add('prev');
    if (nextCard) nextCard.classList.add('next');
}

// Auto-rotate quotes
setInterval(nextQuote, 6000);

// Add click handlers for indicators
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const quoteNumber = parseInt(this.getAttribute('data-quote'));
            goToQuote(quoteNumber);
        });
    });
    
    // Initialize quote display
    updateQuoteDisplay();
});

// Enhanced typewriter effect with multiple texts
function initializeEnhancedTypewriter() {
    const quotes = [
        "You are my sunshine on the cloudiest days...",
        "In your smile, I find my home...",
        "Your love is my greatest adventure...",
        "With you, every moment feels like magic..."
    ];
    
    let quoteIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;
    
    const typewriterElement = document.querySelector('.hero-subtitle');
    
    function typeEffect() {
        const currentQuote = quotes[quoteIndex];
        
        if (!isDeleting) {
            typewriterElement.textContent = currentQuote.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentQuote.length) {
                setTimeout(() => { isDeleting = true; }, pauseTime);
            }
        } else {
            typewriterElement.textContent = currentQuote.substring(0, charIndex);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                quoteIndex = (quoteIndex + 1) % quotes.length;
            }
        }
        
        const speed = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(typeEffect, speed);
    }
    
    setTimeout(typeEffect, 1000);
}

// Initialize enhanced typewriter
initializeEnhancedTypewriter();

// Parallax enhancement for multiple elements
function enhancedParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Parallax for floating hearts
        document.querySelectorAll('.floating-hearts .heart').forEach((heart, index) => {
            const speed = 0.3 + (index * 0.1);
            heart.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Parallax for rose petals
        document.querySelectorAll('.petal').forEach((petal, index) => {
            const speed = 0.2 + (index * 0.05);
            petal.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

enhancedParallax();

// Promises animation observer
function initializePromisesAnimation() {
    const promiseItems = document.querySelectorAll('.promise-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    promiseItems.forEach(item => observer.observe(item));
}

// Initialize promises animation
document.addEventListener('DOMContentLoaded', initializePromisesAnimation);

// Text reveal animation for quotes
function createTextRevealAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target;
                const content = text.textContent;
                text.textContent = '';
                
                content.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.animationDelay = `${index * 50}ms`;
                    span.classList.add('char-reveal');
                    text.appendChild(span);
                });
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.quote-text').forEach(quote => {
        observer.observe(quote);
    });
}

// Add CSS for character reveal animation
const style = document.createElement('style');
style.textContent = `
    .char-reveal {
        opacity: 0;
        animation: charReveal 0.5s ease forwards;
    }
    
    @keyframes charReveal {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

createTextRevealAnimation();

// Magnetic cursor effect for buttons
function createMagneticEffect() {
    const magneticElements = document.querySelectorAll('.quote-nav-btn, .music-btn');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

createMagneticEffect();

// Particle system for background
function createParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-2';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width || 
                particle.y < 0 || particle.y > canvas.height) {
                particles[index] = createParticle();
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 135, 156, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }
    
    updateParticles();
}

// Initialize particle system
createParticleSystem();

// Enhanced 3D scroll effects
function create3DScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // 3D effect for section titles
        document.querySelectorAll('.section-title').forEach((title, index) => {
            const rect = title.getBoundingClientRect();
            const elementTop = rect.top;
            const elementVisible = elementTop < windowHeight && elementTop > -rect.height;
            
            if (elementVisible) {
                const progress = 1 - (elementTop / windowHeight);
                const rotateX = (progress - 0.5) * 20;
                const translateZ = progress * 100;
                title.style.transform = `perspective(1000px) rotateX(${rotateX}deg) translateZ(${translateZ}px)`;
            }
        });
        
        // 3D parallax for background elements
        document.querySelectorAll('.rose-petals .petal').forEach((petal, index) => {
            const speed = 0.1 + (index * 0.02);
            const rotationSpeed = 0.05 + (index * 0.01);
            petal.style.transform = `
                translateY(${scrolled * speed}px) 
                rotateX(${scrolled * rotationSpeed}deg) 
                rotateY(${scrolled * rotationSpeed * 1.5}deg)
                translateZ(${Math.sin(scrolled * 0.01 + index) * 50}px)
            `;
        });
        
        // 3D effect for ownership section
        const ownershipSection = document.querySelector('.ownership-section');
        if (ownershipSection) {
            const rect = ownershipSection.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const rotateY = (progress - 0.5) * 30;
                ownershipSection.style.transform = `perspective(2000px) rotateY(${rotateY}deg)`;
            }
        }
    });
}

create3DScrollEffects();

// 3D hover effects for navigation
function enhance3DNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(500px) rotateX(10deg) translateZ(20px) translateY(-3px)';
            this.style.textShadow = '0 5px 15px rgba(212, 135, 156, 0.4)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(500px) rotateX(0deg) translateZ(0px) translateY(0px)';
            this.style.textShadow = 'none';
        });
    });
}

enhance3DNavigation();

// 3D typing effect enhancement
function create3DTypingEffect() {
    const typewriterText = document.querySelector('.typewriter-text');
    if (typewriterText) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    entry.target.innerHTML = '';
                    
                    text.split('').forEach((char, index) => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.style.display = 'inline-block';
                        span.style.opacity = '0';
                        span.style.transform = 'perspective(500px) rotateY(90deg) translateZ(-50px)';
                        span.style.transition = `all 0.6s ease ${index * 30}ms`;
                        entry.target.appendChild(span);
                        
                        setTimeout(() => {
                            span.style.opacity = '1';
                            span.style.transform = 'perspective(500px) rotateY(0deg) translateZ(0px)';
                        }, index * 30 + 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(typewriterText);
    }
}

create3DTypingEffect();

// Enhanced floating hearts with 3D movement
function createEnhanced3DHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = ['💖', '💕', '💗', '💝', '💜'][Math.floor(Math.random() * 5)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        heart.style.fontSize = (15 + Math.random() * 15) + 'px';
        heart.style.zIndex = '-1';
        heart.style.pointerEvents = 'none';
        heart.style.opacity = '0.7';
        heart.style.transformStyle = 'preserve-3d';
        
        document.body.appendChild(heart);
        
        let position = window.innerHeight;
        let rotation = { x: 0, y: 0, z: 0 };
        const speed = 1 + Math.random() * 2;
        const rotationSpeed = { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 };
        
        function animate3DHeart() {
            position -= speed;
            rotation.x += rotationSpeed.x;
            rotation.y += rotationSpeed.y;
            rotation.z += rotationSpeed.z;
            
            const wave = Math.sin(position * 0.01) * 30;
            
            heart.style.top = position + 'px';
            heart.style.transform = `
                translateX(${wave}px)
                rotateX(${rotation.x}deg)
                rotateY(${rotation.y}deg)
                rotateZ(${rotation.z}deg)
                translateZ(${Math.sin(position * 0.02) * 100}px)
            `;
            
            if (position < -100) {
                heart.remove();
            } else {
                requestAnimationFrame(animate3DHeart);
            }
        }
        
        animate3DHeart();
    }, 2000);
}

createEnhanced3DHearts();

// 3D card flip effect for quotes
function enhance3DQuoteCards() {
    const cards = document.querySelectorAll('.quote-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateX(0) rotateY(5deg) translateZ(80px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateX(0) rotateY(0deg) translateZ(50px) scale(1)';
            }
        });
    });
}

enhance3DQuoteCards();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const nextSection = getNextSection(currentSection);
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const prevSection = getPrevSection(currentSection);
        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            return section;
        }
    }
    
    return sections[0];
}

function getNextSection(currentSection) {
    const sections = Array.from(document.querySelectorAll('section'));
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex + 1] || null;
}

function getPrevSection(currentSection) {
    const sections = Array.from(document.querySelectorAll('section'));
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex - 1] || null;
}
