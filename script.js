/**
 * Zara'a - Agricultural SaaS Landing
 * JavaScript with jQuery
 * Design: Jony Ive Philosophy
 * Year: 2026
 */

(function($) {
    'use strict';

    // ===================================
    // Global Variables
    // ===================================
    let currentLang = 'ar';
    let currentTheme = 'light';

    // ===================================
    // Initialize on Document Ready
    // ===================================
    $(document).ready(function() {
        initTheme();
        initLanguage();
        initSmoothScroll();
        initScrollAnimations();
        initNavbar();
        initThemeToggle();
        initLanguageToggle();
    });

    // ===================================
    // Theme Management
    // ===================================
    function initTheme() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }

    function setTheme(theme) {
        currentTheme = theme;
        $('body').removeClass('light-mode dark-mode').addClass(theme + '-mode');
        localStorage.setItem('theme', theme);

        // Update theme toggle button
        updateThemeToggle();
    }

    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    function updateThemeToggle() {
        const $toggle = $('#themeToggle');
        if (currentTheme === 'light') {
            $toggle.find('.sun-icon').show();
            $toggle.find('.moon-icon').hide();
        } else {
            $toggle.find('.sun-icon').hide();
            $toggle.find('.moon-icon').show();
        }
    }

    function initThemeToggle() {
        $('#themeToggle').on('click', function() {
            toggleTheme();
        });
    }

    // ===================================
    // Language Management
    // ===================================
    function initLanguage() {
        // Check for saved language preference or default to 'ar'
        const savedLang = localStorage.getItem('language') || 'ar';
        setLanguage(savedLang);
    }

    function setLanguage(lang) {
        currentLang = lang;
        $('body').attr('data-lang', lang);
        $('html').attr('lang', lang);
        $('html').attr('dir', lang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('language', lang);

        // Update all text content
        updateContent(lang);

        // Update language toggle button
        updateLanguageToggle();
    }

    function updateContent(lang) {
        // Update all elements with data-ar and data-en attributes
        $('[data-ar][data-en]').each(function() {
            const $el = $(this);
            const text = lang === 'ar' ? $el.data('ar') : $el.data('en');
            $el.text(text);
        });
    }

    function toggleLanguage() {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    }

    function updateLanguageToggle() {
        const $toggle = $('#langToggle span');
        const text = currentLang === 'ar' ? 'EN' : 'عربي';
        $toggle.text(text);
    }

    function initLanguageToggle() {
        $('#langToggle').on('click', function() {
            toggleLanguage();
        });
    }

    // ===================================
    // Smooth Scroll
    // ===================================
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            const href = $(this).attr('href');

            // Ignore empty hash or just '#'
            if (href === '#' || href === '') {
                return;
            }

            const $target = $(href);

            if ($target.length) {
                e.preventDefault();

                $('html, body').animate({
                    scrollTop: $target.offset().top - 80
                }, 800, 'swing');

                // Close mobile menu if open
                $('.navbar-collapse').collapse('hide');
            }
        });
    }

    // ===================================
    // Navbar Behavior
    // ===================================
    function initNavbar() {
        let lastScroll = 0;
        const navbar = $('.navbar');

        $(window).on('scroll', function() {
            const currentScroll = $(this).scrollTop();

            // Add/remove glass effect based on scroll position
            if (currentScroll > 50) {
                navbar.addClass('glass-nav');
            } else {
                navbar.removeClass('glass-nav');
            }

            lastScroll = currentScroll;
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.navbar').length) {
                $('.navbar-collapse').collapse('hide');
            }
        });
    }

    // ===================================
    // Scroll Animations (AOS-like)
    // ===================================
    function initScrollAnimations() {
        // Simple intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('aos-animate');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attribute
        $('[data-aos]').each(function() {
            observer.observe(this);
        });
    }

    // ===================================
    // Number Counter Animation
    // ===================================
    function animateCounter($element, target) {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format number
            let displayValue = Math.floor(current);
            if (displayValue >= 1000000) {
                displayValue = (displayValue / 1000000).toFixed(1) + 'M';
            } else if (displayValue >= 1000) {
                displayValue = (displayValue / 1000).toFixed(0) + 'K';
            }

            $element.text(displayValue);
        }, stepDuration);
    }

    // Animate stats when they come into view
    let statsAnimated = false;
    $(window).on('scroll', function() {
        if (!statsAnimated) {
            const statsTop = $('.hero-stats').offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();

            if (windowBottom > statsTop) {
                statsAnimated = true;

                $('.stat-number').each(function() {
                    const $this = $(this);
                    const text = $this.text();
                    const number = parseFloat(text.replace(/[^0-9.]/g, ''));

                    if (!isNaN(number)) {
                        $this.text('0');
                        animateCounter($this, number);

                        // Re-add suffix after animation
                        setTimeout(function() {
                            if (text.includes('M')) {
                                $this.text(number + 'M+');
                            } else if (text.includes('%')) {
                                $this.text(number + '%');
                            }
                        }, 2000);
                    }
                });
            }
        }
    });

    // ===================================
    // Plant Visual Interactive Effect
    // ===================================
    $('.plant-visual').on('mousemove', function(e) {
        const $this = $(this);
        const offset = $this.offset();
        const x = e.pageX - offset.left - $this.width() / 2;
        const y = e.pageY - offset.top - $this.height() / 2;

        const moveX = x / 20;
        const moveY = y / 20;

        $('.plant-emoji').css({
            transform: `translate(${moveX}px, ${moveY}px) scale(1.1)`
        });

        $('.plant-circle').each(function(index) {
            const factor = (index + 1) * 0.3;
            $(this).css({
                transform: `translate(${moveX * factor}px, ${moveY * factor}px)`
            });
        });
    });

    $('.plant-visual').on('mouseleave', function() {
        $('.plant-emoji').css({
            transform: 'translate(0, 0) scale(1)'
        });

        $('.plant-circle').css({
            transform: 'translate(0, 0)'
        });
    });

    // ===================================
    // Phone Mockup Interactive Effect
    // ===================================
    $('.phone-mockup').on('mouseenter', function() {
        $(this).css({
            transform: 'scale(1.05) rotateY(5deg)'
        });
    });

    $('.phone-mockup').on('mouseleave', function() {
        $(this).css({
            transform: 'scale(1) rotateY(0deg)'
        });
    });

    // ===================================
    // Parallax Effect for Hero Background
    // ===================================
    $(window).on('scroll', function() {
        const scrolled = $(this).scrollTop();
        const parallaxSpeed = 0.5;

        $('.hero-section::before').css({
            transform: `translateY(${scrolled * parallaxSpeed}px)`
        });
    });

    // ===================================
    // Form Validation (if forms are added later)
    // ===================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ===================================
    // Modal Management (for future use)
    // ===================================
    function openModal(modalId) {
        $(`#${modalId}`).fadeIn(300);
        $('body').css('overflow', 'hidden');
    }

    function closeModal(modalId) {
        $(`#${modalId}`).fadeOut(300);
        $('body').css('overflow', 'auto');
    }

    // Close modal on outside click
    $('.modal').on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            closeModal($(this).attr('id'));
        }
    });

    // ===================================
    // Loading Animation
    // ===================================
    $(window).on('load', function() {
        // Hide any loading screen
        $('#loading').fadeOut(500);

        // Trigger initial animations
        setTimeout(function() {
            $('[data-aos]').each(function(index) {
                const $this = $(this);
                setTimeout(function() {
                    $this.addClass('aos-animate');
                }, index * 100);
            });
        }, 200);
    });

    // ===================================
    // Performance Optimization
    // ===================================

    // Debounce function for scroll events
    function debounce(func, wait) {
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

    // Throttle function for frequently fired events
    function throttle(func, limit) {
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

    // Apply throttling to scroll events for better performance
    const throttledScroll = throttle(function() {
        // Your scroll logic here
    }, 100);

    $(window).on('scroll', throttledScroll);

    // ===================================
    // Keyboard Navigation Enhancement
    // ===================================

    // Enable keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + K for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleTheme();
        }

        // Ctrl/Cmd + L for language toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            toggleLanguage();
        }
    });

    // ===================================
    // Accessibility Improvements
    // ===================================

    // Focus management for modals
    function trapFocus($element) {
        const focusableElements = $element.find('a[href], button, textarea, input, select');
        const firstFocusable = focusableElements.first();
        const lastFocusable = focusableElements.last();

        $element.on('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable[0]) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable[0]) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ===================================
    // Easter Egg: Konami Code
    // ===================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    $(document).on('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        // Fun animation: make all plant emojis grow
        $('.plant-emoji, .pain-icon, .feature-icon, .testimonial-card').css({
            animation: 'grow 1s ease-in-out 3'
        });

        // Show a fun message
        const message = currentLang === 'ar'
            ? '🌱 أنت مزارع حقيقي! 🌱'
            : '🌱 You are a real farmer! 🌱';

        $('body').append(`
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--color-primary);
                color: white;
                padding: 2rem 3rem;
                border-radius: var(--radius-lg);
                font-size: 2rem;
                font-weight: 700;
                z-index: 10000;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: grow 1s ease-in-out;
            " class="easter-egg-message">
                ${message}
            </div>
        `);

        setTimeout(function() {
            $('.easter-egg-message').fadeOut(500, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // ===================================
    // Analytics Event Tracking (placeholder)
    // ===================================
    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        console.log('Event tracked:', category, action, label);

        // Integrate with Google Analytics, Mixpanel, etc.
        // Example: gtag('event', action, { 'event_category': category, 'event_label': label });
    }

    // Track button clicks
    $('.btn-primary, .btn-outline').on('click', function() {
        const buttonText = $(this).text().trim();
        trackEvent('Button', 'Click', buttonText);
    });

    // Track language changes
    $('#langToggle').on('click', function() {
        trackEvent('Language', 'Toggle', currentLang);
    });

    // Track theme changes
    $('#themeToggle').on('click', function() {
        trackEvent('Theme', 'Toggle', currentTheme);
    });

    // ===================================
    // Print Styles Override
    // ===================================
    window.addEventListener('beforeprint', function() {
        $('body').removeClass('dark-mode').addClass('light-mode');
    });

    // ===================================
    // Browser Detection & Warnings
    // ===================================
    function detectBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident') !== -1) {
            // Internet Explorer detected
            const message = currentLang === 'ar'
                ? 'للحصول على أفضل تجربة، يُرجى استخدام متصفح حديث'
                : 'For the best experience, please use a modern browser';

            console.warn(message);
        }
    }

    detectBrowser();

    // ===================================
    // Expose Functions for External Use
    // ===================================
    window.ZaraaApp = {
        setTheme: setTheme,
        setLanguage: setLanguage,
        toggleTheme: toggleTheme,
        toggleLanguage: toggleLanguage,
        trackEvent: trackEvent
    };

})(jQuery);
