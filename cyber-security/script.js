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

// Executa após o carregamento da página
window.onload = initReveal;