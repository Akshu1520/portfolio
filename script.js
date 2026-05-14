/* ============================================================
   DEVOPS PORTFOLIO — script.js
   ============================================================ */

/* ---- Navbar scroll state ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---- Mobile hamburger ---- */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- Terminal typer ---- */
const terminalLines = [
  {
    cmd: 'whoami',
    output: [
      '<span class="t-green">alex.mercer</span> <span class="t-dim">— Senior DevOps Engineer</span>',
      '<span class="t-dim">Location:</span> <span class="t-cyan">Remote / Worldwide</span>',
    ]
  },
  {
    cmd: 'kubectl get nodes',
    output: [
      '<span class="t-dim">NAME                    STATUS   ROLES    AGE</span>',
      '<span class="t-green">k8s-prod-us-east-1a</span>   <span class="t-green">Ready</span>    master   180d',
      '<span class="t-green">k8s-prod-us-east-1b</span>   <span class="t-green">Ready</span>    worker   180d',
      '<span class="t-green">k8s-prod-eu-west-1a</span>   <span class="t-green">Ready</span>    worker   120d',
    ]
  },
  {
    cmd: 'terraform plan --out=infra.plan',
    output: [
      '<span class="t-dim">Refreshing Terraform state...</span>',
      '<span class="t-green">Plan:</span> 12 to add, 3 to change, 0 to destroy.',
      '<span class="t-dim">Saved the plan to:</span> <span class="t-cyan">infra.plan</span>',
    ]
  },
  {
    cmd: 'cat uptime.json | jq .sla',
    output: [
      '<span class="t-green">"99.99%"</span>',
      '<span class="t-dim">// Last 365 days — zero critical incidents</span>',
    ]
  },
  {
    cmd: 'echo "Hire me? → alex@mercer.dev"',
    output: [
      '<span class="t-orange">Hire me? → alex@mercer.dev</span>',
    ]
  },
];

const cmdEl    = document.getElementById('typeCmd');
const outputEl = document.getElementById('terminalOutput');
let lineIndex  = 0;
let charIndex  = 0;
let isTyping   = false;

function typeLine(text, onDone) {
  isTyping = true;
  charIndex = 0;
  cmdEl.textContent = '';

  const interval = setInterval(() => {
    cmdEl.textContent += text[charIndex];
    charIndex++;
    if (charIndex >= text.length) {
      clearInterval(interval);
      isTyping = false;
      onDone && onDone();
    }
  }, 55);
}

function showOutput(lines, onDone) {
  outputEl.innerHTML = '';
  lines.forEach((line, i) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.innerHTML = line;
      outputEl.appendChild(p);
      if (i === lines.length - 1) onDone && onDone();
    }, i * 180);
  });
}

function runNextLine() {
  const entry = terminalLines[lineIndex % terminalLines.length];
  typeLine(entry.cmd, () => {
    setTimeout(() => {
      showOutput(entry.output, () => {
        lineIndex++;
        setTimeout(runNextLine, 2800);
      });
    }, 350);
  });
}

// Start terminal after a short delay
setTimeout(runNextLine, 1000);

/* ---- Counter animation ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

/* ---- Intersection Observer: reveal + counters + skill bars ---- */
const revealEls   = document.querySelectorAll('.reveal');
const statNums    = document.querySelectorAll('.stat__num');
const skillFills  = document.querySelectorAll('.skill-bar__fill');

const statsTriggered  = new Set();
const skillsTriggered = new Set();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

/* Counters observer */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statNums.forEach(num => {
      if (!statsTriggered.has(num)) {
        statsTriggered.add(num);
        animateCounter(num);
      }
    });
    statsObserver.disconnect();
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

/* Skill bars observer */
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    skillFills.forEach(fill => {
      if (!skillsTriggered.has(fill)) {
        skillsTriggered.add(fill);
        // small stagger per bar
        setTimeout(() => fill.classList.add('animate'), Math.random() * 200);
      }
    });
    skillsObserver.disconnect();
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

/* ---- Add reveal class to key elements ---- */
function addReveal(selector, delayClass = '') {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (delayClass) {
      const d = Math.min(i + 1, 4);
      el.classList.add(`reveal-delay-${d}`);
    }
  });
}

addReveal('.about__text p', true);
addReveal('.about__card', true);
addReveal('.skill-category', true);
addReveal('.project-card', true);
addReveal('.timeline__item', true);
addReveal('.cert-badge', true);

// Re-observe after classes added
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
const btnText     = document.getElementById('btnText');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    btnText.textContent = 'Sending...';

    // Simulate async send
    setTimeout(() => {
      btnText.textContent = 'Sent ✓';
      formSuccess.classList.add('visible');
      contactForm.reset();
      setTimeout(() => {
        btnText.textContent = 'Send Message';
        formSuccess.classList.remove('visible');
      }, 4000);
    }, 1200);
  });
}

/* ---- Smooth active nav highlight on scroll ---- */
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    allNavLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${entry.target.id}`) {
        link.style.color = 'var(--green)';
      }
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));