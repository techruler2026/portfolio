// =====================================================
// PREMIUM ACCOUNTANT PORTFOLIO — SCRIPT.JS
// Animations, counters, scroll effects, interactions
// =====================================================

// ---- Initialize AOS ----
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

// =====================================================
// NAVBAR — Scroll Effects + Mobile Menu
// =====================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll-based navbar behavior
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  handleScrollTop();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Active nav link based on scroll position
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// =====================================================
// TYPED TEXT EFFECT
// =====================================================
const typedWords = ['Trust', 'Savings', 'Results'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  if (!typedEl) return;

  const currentWord = typedWords[wordIndex];
  
  if (isDeleting) {
    charIndex--;
    typedEl.textContent = currentWord.substring(0, charIndex);
  } else {
    charIndex++;
    typedEl.textContent = currentWord.substring(0, charIndex);
  }

  let speed = isDeleting ? 80 : 130;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typedWords.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

// Start after a delay
setTimeout(typeEffect, 1800);

// =====================================================
// ANIMATED PARTICLE GENERATION
// =====================================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.4 + 0.2;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${opacity};
    `;

    container.appendChild(p);
  }
}

createParticles();

// =====================================================
// ANIMATED COUNTERS
// =====================================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// Intersection observer for counters
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(c => animateCounter(c));
    }
  });
}, { threshold: 0.3 });

counters.forEach(c => counterObserver.observe(c));

// =====================================================
// SKILL BARS ANIMATION
// =====================================================
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(fill => skillObserver.observe(fill));

// =====================================================
// SCROLL TO TOP BUTTON
// =====================================================
const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================================================
// BOOKING FORM SUBMISSION (SUPABASE + VALIDATION)
// =====================================================
// Initialize Supabase client
let _supabaseBooking = null;
try {
  if (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.url !== "YOUR_SUPABASE_URL") {
    _supabaseBooking = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
} catch (err) {
  console.error("Supabase client initialization failed in script.js:", err);
}

// Initialize intl-tel-input for Phone Number field
let iti = null;
const phoneInput = document.getElementById('phone');
if (phoneInput && typeof window.intlTelInput !== 'undefined') {
  iti = window.intlTelInput(phoneInput, {
    initialCountry: "in", // Default to India (+91)
    preferredCountries: ["in", "us", "ae", "gb"],
    strictMode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/utils.js"
  });
}

const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Simple validation
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const originalText = submitBtn.querySelector('span').textContent;
    const originalIcon = submitBtn.querySelector('i');

    // Legitimacy Verification: Phone Number Structure Check
    if (iti && !iti.isValidNumber()) {
      alert("Legitimacy Check Failed: The phone number does not exist or is invalid for the selected country.");
      return;
    }

    // Visual feedback
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.querySelector('span').textContent = 'Verifying Email...';
    if (originalIcon) originalIcon.className = 'fas fa-spinner fa-spin';

    // Get Form Data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const preferredDate = document.getElementById('preferredDate').value || null;
    const message = document.getElementById('message').value;

    // Legitimacy Verification: Email deliverability & DNS check
    try {
      const emailVerifyRes = await fetch(`https://disify.com/api/email/${encodeURIComponent(email)}`);
      if (emailVerifyRes.ok) {
        const verifyData = await emailVerifyRes.json();
        if (verifyData.format === false || verifyData.dns === false) {
          alert("Legitimacy Check Failed: The email domain does not exist or is invalid.");
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.querySelector('span').textContent = originalText;
          if (originalIcon) originalIcon.className = 'fas fa-arrow-right';
          return;
        }
        if (verifyData.disposable === true) {
          alert("Legitimacy Check Failed: Disposable / temporary email addresses are not allowed.");
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.querySelector('span').textContent = originalText;
          if (originalIcon) originalIcon.className = 'fas fa-arrow-right';
          return;
        }
      }
    } catch (err) {
      console.warn("Disify API verification failed or timed out. Skipping check. Details:", err);
    }

    // Set processing message
    submitBtn.querySelector('span').textContent = 'Booking...';

    // Format phone with international code
    const formattedPhone = iti ? iti.getNumber() : phone;

    if (!_supabaseBooking) {
      console.warn("Supabase is not configured. Setup the database and config.js to save data.");
      // Fallback local visual behavior
      setTimeout(() => {
        bookingForm.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeInUp 0.6s ease forwards';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.querySelector('span').textContent = originalText;
        if (originalIcon) originalIcon.className = 'fas fa-arrow-right';
      }, 1500);
      return;
    }

    try {
      const { error } = await _supabaseBooking
        .from('bookings')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: formattedPhone, // Saved with international code
            service: service,
            preferred_date: preferredDate,
            message: message
          }
        ]);

      if (error) throw error;

      // Send email notification to Amith Kumar via Web3Forms
      if (typeof WEB3FORMS_KEY !== 'undefined' && WEB3FORMS_KEY && WEB3FORMS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY") {
        try {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              access_key: WEB3FORMS_KEY,
              subject: `Consultation Slot Request: ${firstName} ${lastName}`,
              from_name: "Portfolio Booking System",
              to_name: "Amith Kumar",
              "Client Name": `${firstName} ${lastName}`,
              "Client Email": email,
              "Client Phone": formattedPhone,
              "Requested Service": service.toUpperCase(),
              "Preferred Date": preferredDate || "Not Specified",
              "Message": message || "No message provided",
              "Action Required": "Confirm/Decline requested slot. Contact client directly to notify."
            })
          });
        } catch (err) {
          console.warn("Email notification failed to send:", err);
        }
      }

      bookingForm.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.style.animation = 'fadeInUp 0.6s ease forwards';
    } catch (error) {
      console.error("Booking submission error:", error.message || error);
      alert("Failed to submit booking: " + (error.message || "Unknown error. Please check your setup."));
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.querySelector('span').textContent = originalText;
      if (originalIcon) originalIcon.className = 'fas fa-arrow-right';
    }
  });
}

// =====================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// =====================================================
// HERO SERVICE CARDS — Stagger animation on hover
// =====================================================
const heroCards = document.querySelectorAll('.hero-service-card');
heroCards.forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 8px 30px rgba(21, 101, 255, 0.35)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// =====================================================
// SERVICE CARDS — Tilt effect on hover
// =====================================================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s ease';
  });
});

// =====================================================
// LOGO BADGE COLOR ANIMATION
// =====================================================
const logoBadge = document.querySelectorAll('.logo-badge');
let hue = 220;

setInterval(() => {
  hue = (hue + 1) % 360;
}, 50);

// =====================================================
// NUMBER TICKER CONFETTI ON STATS
// =====================================================
const statItems = document.querySelectorAll('.stat-item');
statItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-4px)';
    item.style.transition = 'transform 0.3s ease';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// =====================================================
// FORM FIELD ANIMATION
// =====================================================
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('label').style.color = '#1565ff';
  });
  input.addEventListener('blur', () => {
    input.parentElement.querySelector('label').style.color = '';
  });
});

// =====================================================
// BOOKING DATE — Set min date to today
// =====================================================
const dateInput = document.getElementById('preferredDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// =====================================================
// FADE IN ANIMATIONS ON LOAD
// =====================================================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';

  // Hero content entrance animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.animation = 'fadeInLeft 1s ease forwards';
  }
});

// Define keyframes via JS for dynamic animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  body { opacity: 0; transition: opacity 0.3s ease; }
`;
document.head.appendChild(style);

// =====================================================
// GLITCH EFFECT ON LOGO NAME (SUBTLE)
// =====================================================
const logoName = document.querySelector('.logo-name');
if (logoName) {
  setInterval(() => {
    logoName.style.textShadow = '1px 0 #1565ff, -1px 0 #00b4ff';
    setTimeout(() => {
      logoName.style.textShadow = '';
    }, 100);
  }, 5000);
}

// =====================================================
// RIPPLE EFFECT ON BUTTONS
// =====================================================
function addRipple(el) {
  el.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
  });
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.btn-primary, .btn-book, .btn-submit').forEach(btn => addRipple(btn));

// =====================================================
// CONSOLE EASTER EGG
// =====================================================
console.log('%c🚀 Amith Kumar — Tax Professional Portfolio', 'color:#1565ff; font-size:18px; font-weight:bold;');
console.log('%cBuilt with premium quality • $10,000 design', 'color:#00b4ff; font-size:12px;');

// =====================================================
// LOAD DYNAMIC TESTIMONIALS FROM DATABASE (POSITIVE ONLY + ANIMATED)
// =====================================================
async function loadDynamicTestimonials() {
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  if (!testimonialsGrid) return;

  // Verify Supabase client is initialized
  let _supabaseClient = null;
  try {
    if (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.url !== "YOUR_SUPABASE_URL") {
      _supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
  } catch (err) {
    console.error("Failed to initialize Supabase for testimonials:", err);
  }

  if (!_supabaseClient) {
    console.log("Supabase not configured. Using default static testimonials.");
    return; // Leave fallback static cards alone
  }

  try {
    // Fetch latest positive feedbacks from database (rating >= 4)
    const { data: feedbacks, error } = await _supabaseClient
      .from('feedback')
      .select('full_name, rating, message, created_at')
      .gte('rating', 4) // ONLY POSITIVE FEEDBACK (4 or 5 stars)
      .order('created_at', { ascending: false })
      .limit(12); // Fetch up to 12 reviews

    if (error) throw error;

    if (feedbacks && feedbacks.length > 0) {
      // Clear fallback cards
      testimonialsGrid.innerHTML = '';
      
      // If we have <= 3 feedbacks, just show them statically
      if (feedbacks.length <= 3) {
        feedbacks.forEach((feedback, idx) => {
          renderTestimonialCard(testimonialsGrid, feedback, idx);
        });
        if (typeof AOS !== 'undefined') AOS.refresh();
        return;
      }

      // If we have > 3 feedbacks, we render the first 3 and start rotation
      let currentIndex = 0;
      
      // Render first 3 reviews
      for (let i = 0; i < 3; i++) {
        const feedback = feedbacks[i];
        if (feedback) renderTestimonialCard(testimonialsGrid, feedback, i);
      }
      if (typeof AOS !== 'undefined') AOS.refresh();

      // Start the auto-rotation loop every 6 seconds
      setInterval(() => {
        const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
        
        // 1. Trigger the fade-out/out-animation
        cards.forEach(card => card.classList.add('fade-out'));
        
        setTimeout(() => {
          // Increment starting index
          currentIndex = (currentIndex + 3) % feedbacks.length;
          
          // 2. Update contents for the next set of reviews
          cards.forEach((card, i) => {
            const nextFeedbackIndex = (currentIndex + i) % feedbacks.length;
            const feedback = feedbacks[nextFeedbackIndex];
            
            if (feedback) {
              const starsCount = feedback.rating || 5;
              const starsStr = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
              
              // Get initials
              const nameParts = feedback.full_name.trim().split(' ');
              const initials = nameParts.length > 1 
                ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
                : nameParts[0].slice(0, 2).toUpperCase();
                
              card.querySelector('.stars').innerHTML = starsStr;
              card.querySelector('p').innerHTML = `"${escapeHtml(feedback.message)}"`;
              card.querySelector('.ta-avatar').innerHTML = escapeHtml(initials);
              card.querySelector('strong').innerHTML = escapeHtml(feedback.full_name);
            }
          });
          
          // 3. Trigger the fade-in/in-animation
          setTimeout(() => {
            cards.forEach(card => card.classList.remove('fade-out'));
          }, 50);
          
        }, 400); // Sync with CSS transition duration (400ms)
        
      }, 6000); // Rotation cycle duration
    }
  } catch (error) {
    console.warn("Could not load database reviews. Falling back to default reviews.", error.message || error);
  }
}

// Render helper for single review card
function renderTestimonialCard(parent, feedback, idx) {
  const starsCount = feedback.rating || 5;
  const starsStr = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);

  const nameParts = feedback.full_name.trim().split(' ');
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
    : nameParts[0].slice(0, 2).toUpperCase();

  const card = document.createElement('div');
  card.className = 'testimonial-card';
  card.id = `dyn-tc${idx}`;
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', `${idx * 100}`);

  card.innerHTML = `
    <div class="stars">${starsStr}</div>
    <p>"${escapeHtml(feedback.message)}"</p>
    <div class="testimonial-author">
      <div class="ta-avatar">${escapeHtml(initials)}</div>
      <div>
        <strong>${escapeHtml(feedback.full_name)}</strong>
        <span>Verified Client</span>
      </div>
    </div>
  `;

  parent.appendChild(card);
}

// Simple HTML escaping helper for security
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Run loading logic on execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDynamicTestimonials);
} else {
  loadDynamicTestimonials();
}
