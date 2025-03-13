// Main JavaScript file for Study Planner

document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    const setupMobileNav = () => {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-toggle');
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.display = 'none';

        const nav = document.querySelector('nav');
        nav.prepend(mobileMenuBtn);

        // Only show mobile menu button on small screens
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                document.querySelectorAll('.nav-links').forEach(el => {
                    el.classList.add('mobile-hidden');
                });
            } else {
                mobileMenuBtn.style.display = 'none';
                document.querySelectorAll('.nav-links').forEach(el => {
                    el.classList.remove('mobile-hidden');
                    el.style.display = 'flex';
                });
            }
        };

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function () {
            document.querySelectorAll('.nav-links').forEach(el => {
                if (el.style.display === 'none' || el.style.display === '') {
                    el.style.display = 'flex';
                    el.style.flexDirection = 'column';
                    el.style.position = 'absolute';
                    el.style.top = '80px';
                    el.style.left = '0';
                    el.style.width = '100%';
                    el.style.backgroundColor = '#f0f8ff';
                    el.style.padding = '20px';
                    el.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
                } else {
                    el.style.display = 'none';
                }
            });
        });

        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };

    // Smooth scrolling for anchor links
    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    e.preventDefault();
                    document.querySelector(targetId).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Add animation to CTA button
    const setupButtonAnimation = () => {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s ease';
            });

            ctaButton.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });
        }
    };

    // Initialize all functions
    setupMobileNav();
    setupSmoothScrolling();
    setupButtonAnimation();
});