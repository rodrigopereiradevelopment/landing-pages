// 1. EmailJS — não interrompe timer/FAQ/ScrollReveal se a chave for placeholder
const PUBLIC_KEY = "SUA_PUBLIC_KEY"; // Troque pela sua
let emailjsReady = false;
if (typeof emailjs !== "undefined" && PUBLIC_KEY !== "SUA_PUBLIC_KEY") {
    try {
        emailjs.init(PUBLIC_KEY);
        emailjsReady = true;
    } catch (e) {
        console.warn("EmailJS:", e);
    }
}

// 2. Timer persistente (fixo até 30/04/2026) — mesmo após F5; ISO evita ambiguidade de locale
const targetDate = new Date("2026-04-30T23:59:59").getTime();

const timerFunc = () => {
    const now = new Date().getTime();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    if (daysEl) {
        daysEl.innerText = d.toString().padStart(2, "0");
        document.getElementById("hours").innerText = h.toString().padStart(2, "0");
        document.getElementById("minutes").innerText = m.toString().padStart(2, "0");
        document.getElementById("seconds").innerText = s.toString().padStart(2, "0");
    }
    const navTimer = document.getElementById("nav-timer");
    if (navTimer) {
        const dayPart = d > 0 ? `${d}d ` : "";
        navTimer.innerText = `${dayPart}${h}h ${m}m ${s}s`;
    }
};

timerFunc();
setInterval(timerFunc, 1000);

// 3. FAQ com rotação de ícone
document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
        const answer = item.querySelector(".faq-answer");
        const icon = item.querySelector("i");

        document.querySelectorAll(".faq-answer").forEach((el) => {
            if (el !== answer) el.style.display = "none";
        });
        document.querySelectorAll(".faq-item i").forEach((ic) => {
            if (ic !== icon) {
                ic.style.transform = "rotate(0deg)";
                ic.style.transition = "0.3s";
            }
        });

        const isVisible = answer.style.display === "block";
        answer.style.display = isVisible ? "none" : "block";

        if (icon) {
            icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
            icon.style.transition = "0.3s";
        }
    });
});

// 4. Formulário (EmailJS)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const btn = document.getElementById("btn-submit");
        if (!emailjsReady) {
            alert("Configure EmailJS (PUBLIC_KEY, service e template) em script.js para enviar.");
            return;
        }
        if (!btn) return;
        btn.disabled = true;
        btn.innerText = "Enviando...";
        emailjs
            .sendForm("SEU_SERVICE_ID", "TEMPLATE_ID", this)
            .then(() => {
                window.location.href = "obrigado.html";
            })
            .catch((err) => {
                alert("Erro ao enviar: " + JSON.stringify(err));
                btn.disabled = false;
                btn.innerText = "Tentar Novamente";
            });
    });
}

// 5. ScrollReveal com fallback
const showAllReveals = () => {
    document.querySelectorAll(".reveal").forEach((el) => {
        el.style.opacity = "1";
    });
};

const initReveal = () => {
    if (typeof ScrollReveal === "function") {
        try {
            ScrollReveal().reveal(".reveal", {
                delay: 200,
                distance: "30px",
                origin: "bottom",
                duration: 800,
                interval: 100,
                afterReveal: function (el) {
                    el.style.opacity = "1";
                },
            });
        } catch (e) {
            console.warn("ScrollReveal:", e);
            showAllReveals();
        }
    } else {
        showAllReveals();
    }
};

// ============================================================
// CANVAS — Túnel 3D  
// ============================================================

const canvas = document.getElementById('cyber-bg');
const ctx    = canvas.getContext('2d');

// --- Caracteres mistos: binário + hex + símbolos terminal ---
const CHARS = '01 01 01 10 FF 00 A3 B7 4E 9C 守 盾 力 闇 零 戦 >> << ## && || !$ %^ ~* <>'.split(' ');

// --- Paleta com profundidade: longe=azul-esverdeado, perto=verde brilhante ---
function depthColor(z, maxZ) {
    const t = 1 - z / maxZ; // 0 = longe, 1 = perto
    if (t < 0.3) return `rgba(0, 80,  60,  ${t * 0.6})`;   // fundo escuro azulado
    if (t < 0.6) return `rgba(0, 160, 100, ${t * 0.8})`;   // médio teal
    return `rgba(0, 255, 65, ${0.6 + t * 0.4})`;           // frente verde brilhante
}

let W, H, particles;
const COUNT = 220;
const FOV   = 400;

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function initParticle(p) {
    // Distribui em formato cônico — mais partículas nas bordas
    const angle  = Math.random() * Math.PI * 2;
    const radius = Math.pow(Math.random(), 0.5) * 1.2; // raiz: mais espalhado
    p.ox = Math.cos(angle) * radius; // posição relativa ao centro (-1 a 1)
    p.oy = Math.sin(angle) * radius;
    p.z  = Math.random() * W;        // profundidade inicial aleatória
    p.speed = 1.5 + Math.random() * 4; // velocidade variada por partícula
    p.char  = randomChar();
    p.changeTimer = Math.floor(Math.random() * 30);
}

function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    particles = Array.from({ length: COUNT }, () => {
        const p = {};
        initParticle(p);
        p.z = Math.random() * W; // espalha no início
        return p;
    });
}

function draw() {
    // Rastro translúcido — cria motion blur
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;

    particles.forEach(p => {
        // Avança em direção à câmera
        p.z -= p.speed;

        // Reseta quando passa pela câmera
        if (p.z <= 1) {
            initParticle(p);
            p.z = W;
        }

        // Troca char ocasionalmente (efeito glitch)
        p.changeTimer--;
        if (p.changeTimer <= 0) {
            p.char = randomChar();
            p.changeTimer = 15 + Math.floor(Math.random() * 40);
        }

        // Projeção perspectiva
        const scale = FOV / p.z;
        const x2d   = p.ox * W * scale + cx;
        const y2d   = p.oy * H * scale + cy;

        // Descarta o que saiu da tela
        if (x2d < -40 || x2d > W + 40 || y2d < -40 || y2d > H + 40) return;

        const fontSize = Math.max(8, Math.ceil(scale * 40));

        ctx.fillStyle = depthColor(p.z, W);
        ctx.font      = `${fontSize}px 'Courier New', monospace`;
        ctx.fillText(p.char, x2d, y2d);
    });

    requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
    init();
});

// --- Inicialização geral (substitui o window.onload do final) ---
window.onload = function () {
    initReveal(); // ScrollReveal original
    init();
    draw();
};