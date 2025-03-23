// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    const loader = document.querySelector('.loader');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            clearInterval(loadingInterval);
            progress = 100;
            
            // Hide loader after a short delay
            setTimeout(() => {
                loader.classList.add('hidden');
                // Trigger entrance animations for page elements
                animateOnScroll();
            }, 500);
        }
    }, 200);
    
    // 3D Hero cart hover effect
    const hero = document.getElementById('hero');
    const heroCart = document.querySelector('.hero-3d-cart');
    
    if (hero && heroCart) {
        hero.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = hero.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            heroCart.style.transform = `rotateY(${x * 30}deg) rotateX(${y * -30}deg)`;
        });
        
        hero.addEventListener('mouseleave', () => {
            heroCart.style.transform = 'rotateY(0deg) rotateX(15deg)';
        });
    }
    
    // Feature cards animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Testimonial slider functionality
    const testimonialsSlides = document.querySelector('.testimonials-slides');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    function switchSlide(index) {
        currentSlide = index;
        testimonialsSlides.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active dot
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            switchSlide(index);
        });
    });
    
    // Auto-advance testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % sliderDots.length;
        switchSlide(currentSlide);
    }, 5000);
    
    // Modal functionality
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const ctaBtn = document.getElementById('ctaBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));
    if (ctaBtn) ctaBtn.addEventListener('click', () => openModal(signupModal));
    if (closeLoginModal) closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    if (closeSignupModal) closeSignupModal.addEventListener('click', () => closeModal(signupModal));
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(signupModal);
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(signupModal);
            openModal(loginModal);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === signupModal) closeModal(signupModal);
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Here you would normally connect to a backend service
            console.log('Login attempt with:', { email });
            
            // Simulate success
            alert('Login successful!');
            closeModal(loginModal);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
            
            if (password !== passwordConfirm) {
                alert('Passwords do not match');
                return;
            }
            
            // Here you would normally connect to a backend service
            console.log('Signup attempt with:', { name, email });
            
            // Simulate success
            alert('Account created successfully!');
            closeModal(signupModal);
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animation handler
    function animateOnScroll() {
        const elements = document.querySelectorAll('.section-header, .feature-card, .step, .testimonial, .cta-content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 1s forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            // Initially set opacity to 0
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }
    
    // Parallax effect on hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });
    
    // CTA button hover effect
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Floating effect for the 3D cart
    if (heroCart) {
        function floatAnimation() {
            let floatY = 0;
            let direction = 1;
            const floatInterval = setInterval(() => {
                floatY += 0.2 * direction;
                
                if (floatY > 20) {
                    direction = -1;
                } else if (floatY < 0) {
                    direction = 1;
                }
                
                heroCart.style.transform = `translateY(${floatY}px) rotateY(${floatY}deg) rotateX(15deg)`;
            }, 50);
        }
        
        // Start the floating animation
        floatAnimation();
    }
    
    // Add animation to navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            link.style.transition = 'var(--transition)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Animate logo on page load
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            logo.style.transition = 'var(--transition)';
            logo.style.opacity = '1';
            logo.style.transform = 'translateX(0)';
        }, 600);
    }
    
    // Add rotating animation to feature icons on hover
    const featureIcons = document.querySelectorAll('.feature-card i');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'rotate(360deg) scale(1.2)';
            icon.style.transition = 'transform 0.8s ease';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'rotate(0) scale(1)';
        });
    });
});