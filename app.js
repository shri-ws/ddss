/* Interactive Prototype Logic - Dhwani Dance School */

document.addEventListener('DOMContentLoaded', () => {
    
    // Global User State
    const userState = {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@gmail.com',
        timezone: '',
        selectedDate: '',
        selectedTime: '',
        selectedPlanName: '3-Day Pass',
        selectedPlanPrice: '$50.00',
        currentStep: 1
    };

    // Fetch and parse course_data.csv on startup
    let localCourses = [];
    fetch('course_data.csv')
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.split('\n');
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const columns = line.split(',');
                if (columns.length >= 3) {
                    localCourses.push({
                        name: columns[0].trim(),
                        duration: columns[1].trim(),
                        fee: columns[2].trim()
                    });
                }
            }
            populateLocalCoursesDropdown();
        })
        .catch(err => {
            console.warn("Could not load local courses from CSV, falling back to defaults.", err);
        });

    function populateLocalCoursesDropdown() {
        const localSelect = document.getElementById('local-course-select');
        if (!localSelect) return;
        localSelect.innerHTML = '';
        localCourses.forEach((course, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${course.name} (${course.duration}m) - ₹${parseFloat(course.fee).toLocaleString()}`;
            localSelect.appendChild(opt);
        });
        
        localSelect.addEventListener('change', () => {
            if (userState.selectedPlanName.includes('Local') || document.getElementById('pass-local').classList.contains('active')) {
                updateLocalSelection();
            }
        });
    }

    function updateLocalSelection() {
        const localSelect = document.getElementById('local-course-select');
        if (!localSelect || localCourses.length === 0) return;
        const selectedIdx = localSelect.value;
        const course = localCourses[selectedIdx];
        
        userState.selectedPlanName = `Local ${course.name}`;
        userState.selectedPlanPrice = `₹${parseFloat(course.fee).toLocaleString()}`;
        
        checkoutAmountDisplay.textContent = `₹${parseFloat(course.fee).toLocaleString()}`;
        submitPaymentBtn.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Book Regional Course (₹${parseFloat(course.fee).toLocaleString()})`;
    }

    // DOM Elements
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const openBookingTriggers = document.querySelectorAll('.open-booking-trigger');
    
    // Auth UI Header Elements
    const loggedOutActions = document.getElementById('logged-out-actions');
    const userProfileMenu = document.getElementById('user-profile-menu');
    const profileTriggerBtn = document.getElementById('profile-trigger-btn');
    const headerUsername = document.getElementById('header-username');
    const headerLogoutBtn = document.getElementById('header-logout-btn');
    const headerLoginTrigger = document.getElementById('header-login-trigger');
    const dropdownDashLink = document.getElementById('dropdown-dash-link');

    // Login Modal Elements
    const loginModalBackdrop = document.getElementById('login-modal-backdrop');
    const loginModalCloseBtn = document.getElementById('login-modal-close-btn');
    const loginForm = document.getElementById('login-form');
    const loginSpinner = document.getElementById('login-spinner');

    // Theme Toggle Elements
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    // Modal Steps
    const stepIndicators = [
        document.getElementById('step-1-indicator'),
        document.getElementById('step-2-indicator'),
        document.getElementById('step-3-indicator'),
        document.getElementById('step-4-indicator')
    ];
    const stepLines = [
        document.getElementById('line-1'),
        document.getElementById('line-2'),
        document.getElementById('line-3')
    ];
    const stepContents = [
        document.getElementById('step-1-content'),
        document.getElementById('step-2-content'),
        document.getElementById('step-3-content'),
        document.getElementById('step-4-content')
    ];

    // STEP 1 Elements (OAuth)
    const googleAuthBtn = document.getElementById('google-auth-btn');
    const authSpinner = document.getElementById('auth-spinner');

    // STEP 2 Elements (Booking)
    const clientTimezoneText = document.getElementById('client-timezone');
    const daysWrapper = document.getElementById('days-wrapper');
    const slotsWrapper = document.getElementById('slots-wrapper');
    const confirmBookingBtn = document.getElementById('confirm-booking-btn');
    const backToStep1 = document.getElementById('back-to-step-1');

    // STEP 3 Elements (Checkout)
    const priceOptions = document.querySelectorAll('.pricing-card-option');
    const submitPaymentBtn = document.getElementById('submit-payment-btn');
    const checkoutAmountDisplay = document.getElementById('checkout-amount-display');
    const paymentSpinner = document.getElementById('payment-spinner');
    const paymentLoadingText = document.getElementById('payment-loading-text');
    const backToStep2 = document.getElementById('back-to-step-2');
    const whatsappConsent = document.getElementById('whatsapp-consent');

    // STEP 4 Elements (Success webhooks)
    const webhookOnScreen = document.getElementById('webhook-on-screen');
    const webhookEmail = document.getElementById('webhook-email');
    const webhookWhatsapp = document.getElementById('webhook-whatsapp');
    const waWebhookDescription = document.getElementById('wa-webhook-description');
    const mockEmailDevice = document.getElementById('mock-email-device');
    const mockWhatsappDevice = document.getElementById('mock-whatsapp-device');
    const redirectCounter = document.getElementById('redirect-counter');
    const countdownProgress = document.getElementById('countdown-progress');
    const bypassRedirectBtn = document.getElementById('bypass-redirect-btn');
    const webhookEmailVal = document.getElementById('webhook-email-val');

    // Dashboard Elements
    const memberDashboard = document.getElementById('member-dashboard');
    const dashUsername = document.getElementById('dash-username');
    const dashDay = document.getElementById('dash-day');
    const dashTime = document.getElementById('dash-time');
    const dashTz = document.getElementById('dash-tz');
    const dashPlanName = document.getElementById('dash-plan-name');
    const dashPlanPrice = document.getElementById('dash-plan-price');
    const upgradePromoBox = document.getElementById('upgrade-promo-box');


    /* --- THEME MANAGER (DARK / LIGHT TOGGLE) --- */
    
    // Initialize Theme state
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    // Toggle click handler
    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        if (isLight) {
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });


    /* --- USER SESSION SESSIONS MANAGER --- */

    // Load active session from storage
    let activeSession = null;
    try {
        activeSession = JSON.parse(localStorage.getItem('userSession'));
    } catch(e) {
        activeSession = null;
    }

    // Update login status and UI displays
    function updateAuthUI(session) {
        if (session) {
            loggedOutActions.classList.add('hidden');
            userProfileMenu.classList.remove('hidden');
            headerUsername.textContent = session.name.split(' ')[0] || session.name;
            
            // Populating student dashboard details
            dashUsername.textContent = session.name.split(' ')[0] || session.name;
            dashDay.textContent = session.date.split(',').slice(0, 2).join(',');
            dashTime.textContent = session.time;
            dashTz.textContent = getTimeZoneAbbreviation(session.timezone);
            dashPlanName.textContent = session.planName;
            dashPlanPrice.textContent = session.planPrice;

            if (session.planName.includes('Certification')) {
                document.getElementById('dash-status-text').textContent = 'Certification Pass Active';
                upgradePromoBox.classList.add('hidden');
            } else {
                document.getElementById('dash-status-text').textContent = '3-Day Pass Active';
                upgradePromoBox.classList.remove('hidden');
            }

            memberDashboard.classList.remove('hidden');
        } else {
            loggedOutActions.classList.remove('hidden');
            userProfileMenu.classList.add('hidden');
            memberDashboard.classList.add('hidden');
        }
    }

    // Run UI layout check initially
    updateAuthUI(activeSession);

    // Profile Trigger Menu Toggle
    profileTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userProfileMenu.classList.toggle('open');
    });

    // Close Dropdowns on outside click
    document.addEventListener('click', () => {
        userProfileMenu.classList.remove('open');
    });

    // Handle scroll on dashboard dropdown link click
    dropdownDashLink.addEventListener('click', (e) => {
        e.preventDefault();
        userProfileMenu.classList.remove('open');
        memberDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Log out Trigger
    headerLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userSession');
        activeSession = null;
        updateAuthUI(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* --- LOGIN MODAL LOGIC --- */
    
    headerLoginTrigger.addEventListener('click', () => {
        loginModalBackdrop.classList.add('active');
    });

    loginModalCloseBtn.addEventListener('click', () => {
        loginModalBackdrop.classList.remove('active');
    });

    loginModalBackdrop.addEventListener('click', (e) => {
        if (e.target === loginModalBackdrop) loginModalBackdrop.classList.remove('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredEmail = document.getElementById('login-email').value;
        
        loginSpinner.classList.remove('hidden');
        
        setTimeout(() => {
            loginSpinner.classList.add('hidden');
            loginModalBackdrop.classList.remove('active');
            
            // Generate standard session credentials
            const sessionData = {
                name: enteredEmail.includes('jenkins') ? 'Sarah Jenkins' : 'Dance Scholar',
                email: enteredEmail,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
                date: 'Tuesday, August 11, 2026',
                time: '02:00 PM',
                planName: '3-Day Pass',
                planPrice: '$50.00'
            };
            
            localStorage.setItem('userSession', JSON.stringify(sessionData));
            activeSession = sessionData;
            updateAuthUI(sessionData);
            
            // Redirect smooth
            setTimeout(() => {
                memberDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
        }, 1200);
    });


    /* --- FAQ ACCORDION LOGIC --- */
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');
            
            // Close all active FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });


    /* --- REGISTRATION MODAL CONTROLLER (STEP-BY-STEP) --- */
    
    const openModal = () => {
        modalBackdrop.classList.add('active');
        navigateToStep(1);
    };

    const closeModal = () => {
        modalBackdrop.classList.remove('active');
    };

    openBookingTriggers.forEach(btn => btn.addEventListener('click', openModal));
    modalCloseBtn.addEventListener('click', closeModal);
    
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    function navigateToStep(stepNum) {
        userState.currentStep = stepNum;
        
        stepContents.forEach((content, index) => {
            if (index === stepNum - 1) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        stepIndicators.forEach((indicator, index) => {
            if (index < stepNum) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        stepLines.forEach((line, index) => {
            if (index < stepNum - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });

        if (stepNum === 2) {
            setupSmartScheduler();
        }
    }

    // STEP 1: Google OAuth
    googleAuthBtn.addEventListener('click', () => {
        authSpinner.classList.remove('hidden');
        setTimeout(() => {
            authSpinner.classList.add('hidden');
            webhookEmailVal.textContent = userState.email;
            navigateToStep(2);
        }, 1500);
    });

    // STEP 2: Timezone and dynamic scheduling slot conversions (India Standard Time Constraint)
    backToStep1.addEventListener('click', () => navigateToStep(1));

    function setupSmartScheduler() {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
        userState.timezone = tz;
        clientTimezoneText.textContent = `${tz} (${getTimeZoneAbbreviation(tz)})`;

        daysWrapper.innerHTML = '';
        slotsWrapper.innerHTML = '';
        confirmBookingBtn.disabled = true;
        
        // Generate next 3 days
        const days = [];
        const baseDate = new Date();
        for (let i = 1; i <= 3; i++) {
            const nextDay = new Date(baseDate);
            nextDay.setDate(baseDate.getDate() + i);
            days.push(nextDay);
        }

        // Render localized calendar cards
        days.forEach((date, i) => {
            const dayOption = document.createElement('div');
            dayOption.classList.add('day-option');
            if (i === 0) dayOption.classList.add('active');
            
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            dayOption.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="day-date">${dayDate}</span>
            `;
            
            dayOption.dataset.fullDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            daysWrapper.appendChild(dayOption);

            dayOption.addEventListener('click', () => {
                document.querySelectorAll('.day-option').forEach(opt => opt.classList.remove('active'));
                dayOption.classList.add('active');
                userState.selectedDate = dayOption.dataset.fullDate;
                renderTimeSlots(date, tz);
            });
        });

        userState.selectedDate = days[0].toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        renderTimeSlots(days[0], tz);
    }

    // Dynamic slot renderer mapping India Standard Time (IST) operational windows (07:30 AM to 09:30 PM IST)
    function renderTimeSlots(dateObj, timezone) {
        slotsWrapper.innerHTML = '';
        confirmBookingBtn.disabled = true;

        // School operates at selective slots in IST (UTC+5.5)
        // E.g., 08:30 AM IST (03:00 AM UTC), 01:30 PM IST (08:00 AM UTC), 05:30 PM IST (12:00 PM UTC), 08:30 PM IST (03:00 PM UTC)
        const istHours = [8.5, 13.5, 17.5, 20.5]; 

        istHours.forEach(istHour => {
            const tempDate = new Date(dateObj);
            
            // Convert IST hours to UTC hours (IST is UTC + 5.5)
            const decUtcHour = istHour - 5.5;
            const utcHour = Math.floor(decUtcHour);
            const utcMin = (decUtcHour % 1) * 60;
            
            tempDate.setUTCHours(utcHour, utcMin, 0, 0);

            // Format hours using the student's local timezone
            const formattedTime = tempDate.toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const slotOpt = document.createElement('div');
            slotOpt.classList.add('slot-option');
            slotOpt.textContent = formattedTime;
            
            slotsWrapper.appendChild(slotOpt);

            slotOpt.addEventListener('click', () => {
                document.querySelectorAll('.slot-option').forEach(opt => opt.classList.remove('active'));
                slotOpt.classList.add('active');
                userState.selectedTime = formattedTime;
                confirmBookingBtn.disabled = false;
            });
        });
    }

    confirmBookingBtn.addEventListener('click', () => {
        navigateToStep(3);
    });

    // Helper for timezone abbreviation
    function getTimeZoneAbbreviation(timezoneString) {
        try {
            return new Intl.DateTimeFormat('en-US', { timeZoneName: 'short', timeZone: timezoneString })
                .formatToParts(new Date())
                .find(part => part.type === 'timeZoneName').value;
        } catch (e) {
            return 'EST';
        }
    }


    /* STEP 3: Premium Checkout UI */
    
    backToStep2.addEventListener('click', () => navigateToStep(2));

    priceOptions.forEach(card => {
        card.addEventListener('click', () => {
            priceOptions.forEach(opt => opt.classList.remove('active'));
            card.classList.add('active');
            
            const price = card.dataset.price;
            const name = card.dataset.name;
            
            if (price === '50') {
                userState.selectedPlanName = name;
                userState.selectedPlanPrice = '$50.00';
                checkoutAmountDisplay.textContent = '$50.00';
                submitPaymentBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Authorize & Secure Spot';
            } else if (price === '1599') {
                userState.selectedPlanName = name;
                userState.selectedPlanPrice = '$1,599.00';
                checkoutAmountDisplay.textContent = '$1,599.00';
                submitPaymentBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Set Up 0% EMI ($133.25/mo)';
            } else if (price === 'local') {
                updateLocalSelection();
            }
        });
    });

    submitPaymentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cardNameInput = document.getElementById('card-name').value || 'Sarah Jenkins';
        userState.name = cardNameInput;
        
        paymentSpinner.classList.remove('hidden');
        paymentLoadingText.textContent = "Connecting Stripe gateway...";
        
        setTimeout(() => {
            paymentLoadingText.textContent = "Processing credit card split-tokenization...";
            setTimeout(() => {
                paymentLoadingText.textContent = "Authorizing transaction...";
                setTimeout(() => {
                    paymentSpinner.classList.add('hidden');
                    navigateToStep(4);
                    runWebhooksPipeline();
                }, 1000);
            }, 800);
        }, 1000);
    });


    /* STEP 4: Success Redirection & Webhooks Simulation */
    
    function runWebhooksPipeline() {
        // Reset webhooks visual states
        webhookOnScreen.className = 'webhook-item pending';
        webhookEmail.className = 'webhook-item pending';
        webhookWhatsapp.className = 'webhook-item pending';
        mockEmailDevice.classList.add('hidden');
        mockWhatsappDevice.classList.add('hidden');
        bypassRedirectBtn.disabled = true;

        const isWhatsAppOptedIn = whatsappConsent.checked;

        // Custom device payloads updates
        document.getElementById('email-to-name').textContent = userState.name;
        document.getElementById('wa-to-name').textContent = userState.name;
        document.querySelectorAll('.email-time-val').forEach(el => {
            el.textContent = `${userState.selectedDate} at ${userState.selectedTime}`;
        });

        // Trigger logs
        setTimeout(() => {
            // 1. Success on-screen
            webhookOnScreen.className = 'webhook-item success';
            webhookOnScreen.querySelector('.webhook-status').innerHTML = '<i class="fa-solid fa-circle-check wh-check"></i>';
            
            setTimeout(() => {
                // 2. Email pipeline
                webhookEmail.className = 'webhook-item success';
                webhookEmail.querySelector('.webhook-status').innerHTML = '<i class="fa-solid fa-circle-check wh-check"></i>';
                mockEmailDevice.classList.remove('hidden');
                
                setTimeout(() => {
                    // 3. WhatsApp pipeline dependent on GDPR opt-in checkbox
                    if (isWhatsAppOptedIn) {
                        webhookWhatsapp.className = 'webhook-item success';
                        webhookWhatsapp.querySelector('.webhook-status').innerHTML = '<i class="fa-solid fa-circle-check wh-check"></i>';
                        waWebhookDescription.textContent = "Push notification verification successful. Message delivered.";
                        mockWhatsappDevice.classList.remove('hidden');
                    } else {
                        webhookWhatsapp.className = 'webhook-item';
                        webhookWhatsapp.querySelector('.webhook-icon').style.color = 'var(--text-muted)';
                        webhookWhatsapp.querySelector('.webhook-icon').style.background = 'rgba(255,255,255,0.02)';
                        webhookWhatsapp.querySelector('.webhook-status').innerHTML = '<i class="fa-solid fa-circle-minus" style="color: var(--text-muted);"></i>';
                        waWebhookDescription.textContent = "Skipped. Customer opted out of WhatsApp updates (GDPR Compliance).";
                        mockWhatsappDevice.classList.add('hidden');
                    }
                    
                    bypassRedirectBtn.disabled = false;
                    startRedirectTimer();
                }, 1200);
            }, 1200);
        }, 800);
    }

    let redirectTimer = null;
    function startRedirectTimer() {
        let secondsLeft = 5;
        redirectCounter.textContent = secondsLeft;
        countdownProgress.style.width = '100%';
        
        let width = 100;
        const intervalTime = 100;
        const stepWidth = 100 / (5000 / intervalTime);

        clearInterval(redirectTimer);
        
        redirectTimer = setInterval(() => {
            width -= stepWidth;
            countdownProgress.style.width = `${Math.max(0, width)}%`;

            if (width % 20 === 0) {
                secondsLeft = Math.ceil((width / 100) * 5);
                redirectCounter.textContent = Math.max(0, secondsLeft);
            }

            if (width <= 0) {
                clearInterval(redirectTimer);
                redirectToDashboard();
            }
        }, intervalTime);
    }

    bypassRedirectBtn.addEventListener('click', () => {
        clearInterval(redirectTimer);
        redirectToDashboard();
    });

    function redirectToDashboard() {
        closeModal();
        
        // Define session object to save in localstorage
        const newSession = {
            name: userState.name,
            email: userState.email,
            timezone: userState.timezone,
            date: userState.selectedDate,
            time: userState.selectedTime,
            planName: userState.selectedPlanName,
            planPrice: userState.selectedPlanPrice
        };

        localStorage.setItem('userSession', JSON.stringify(newSession));
        activeSession = newSession;
        updateAuthUI(newSession);

        // Smooth scroll to dashboard
        setTimeout(() => {
            memberDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }


    /* CANVAS AUTOPLAY BRAND VIDEO SIMULATOR */
    
    const canvas = document.getElementById('video-canvas');
    const ctx = canvas.getContext('2d');
    const soundBtn = document.getElementById('sound-btn');
    const heroAudio = document.getElementById('hero-audio');
    const soundIcon = document.getElementById('sound-icon');
    const soundText = document.getElementById('sound-text');
    let soundEnabled = false;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            heroAudio.volume = 0.4;
            heroAudio.play().catch(() => {
                soundEnabled = false;
                alert("Browser policy requires interaction to play audio. Try clicking again.");
            });
            soundIcon.className = 'fa-solid fa-volume-high';
            soundText.textContent = 'Mute';
            soundBtn.style.background = 'var(--gold-gradient)';
            soundBtn.style.color = 'var(--text-dark)';
            if (document.body.classList.contains('light-theme')) {
                soundBtn.style.background = 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)';
                soundBtn.style.color = '#ffffff';
            }
        } else {
            heroAudio.pause();
            soundIcon.className = 'fa-solid fa-volume-xmark';
            soundText.textContent = 'Tap for Sound';
            soundBtn.style.background = 'rgba(22, 9, 12, 0.85)';
            soundBtn.style.color = 'var(--text-white)';
            if (document.body.classList.contains('light-theme')) {
                soundBtn.style.background = 'rgba(255, 255, 255, 0.9)';
                soundBtn.style.color = 'var(--primary)';
            }
        }
    });

    const particles = [];
    const maxParticles = 60;
    let angle = 0;

    class Particle {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.005;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= this.decay;
        }
    }

    function animateVideoSimulation() {
        requestAnimationFrame(animateVideoSimulation);
        
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;
        
        // Dynamic clear colors based on theme
        const isLightTheme = document.body.classList.contains('light-theme');
        ctx.fillStyle = isLightTheme ? 'rgba(250, 246, 244, 0.18)' : 'rgba(18, 7, 9, 0.15)';
        ctx.fillRect(0, 0, w, h);

        // Alignment geometries styling
        ctx.strokeStyle = isLightTheme ? 'rgba(128, 26, 43, 0.05)' : 'rgba(230, 194, 128, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w/2, h/2, Math.min(w, h)*0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w/2, h/2, Math.min(w, h)*0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs alignment
        ctx.beginPath();
        ctx.moveTo(w/2, 20);
        ctx.lineTo(w/2, h - 20);
        ctx.moveTo(20, h/2);
        ctx.lineTo(w - 20, h/2);
        ctx.stroke();

        // Draw elegant curve representing mudras
        angle += 0.02;
        const radiusMultiplier = Math.min(w, h) * 0.28;
        const targetX = w/2 + Math.sin(angle * 1.5) * Math.cos(angle) * radiusMultiplier;
        const targetY = h/2 + Math.cos(angle * 2.2) * radiusMultiplier;

        // Dust particle emitter
        if (particles.length < maxParticles) {
            const goldColor = isLightTheme ? '#c59e3d' : '#e6c280';
            const primaryColor = '#801a2b';
            particles.push(new Particle(
                targetX, 
                targetY, 
                Math.random() * 3 + 1, 
                Math.random() > 0.3 ? goldColor : primaryColor,
                {
                    x: (Math.random() - 0.5) * 1.2,
                    y: (Math.random() - 0.5) * 1.2
                }
            ));
        }

        // Render particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        // Draw dynamic hand pointer position
        const primaryGlow = isLightTheme ? '#801a2b' : '#e6c280';
        ctx.shadowBlur = 15;
        ctx.shadowColor = primaryGlow;
        ctx.fillStyle = primaryGlow;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    animateVideoSimulation();

    // Scroll Reveal Intersection Observer
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });
    reveals.forEach(el => revealObserver.observe(el));

    // Ken Burns background slideshow rotator for video-wrapper
    const slides = document.querySelectorAll('.video-slideshow .slide');
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);

});
