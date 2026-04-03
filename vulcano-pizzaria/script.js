// =========================================
// VULCANO PIZZARIA — script.js
// =========================================

// ---- EmailJS init ----
// Substitua pelos seus IDs do EmailJS:
// 1. Acesse emailjs.com → crie conta gratuita
// 2. Crie um Email Service (Gmail, etc)
// 3. Crie um Email Template
// 4. Copie Public Key, Service ID e Template ID
emailjs.init("SEU_PUBLIC_KEY"); // <- trocar

const SERVICE_ID  = "SEU_SERVICE_ID";   // <- trocar
const TEMPLATE_ID = "SEU_TEMPLATE_ID";  // <- trocar

// ---- Nav scroll ----
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// ---- Mobile menu ----
const toggle = document.getElementById("navToggle");
const links  = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  links.classList.toggle("open");
});

links.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => links.classList.remove("open"));
});

// ---- Reveal on scroll ----
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards
      const delay = entry.target.closest(".menu-grid, .gallery-grid")
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Trigger hero reveals immediately
document.querySelectorAll(".hero .reveal").forEach((el, i) => {
  setTimeout(() => el.classList.add("visible"), 200 + i * 150);
});

// ---- Form submit ----
const form      = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;

  const params = {
    nome:      form.nome.value,
    email:     form.email.value,
    telefone:  form.telefone.value,
    mensagem:  form.mensagem.value,
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
    window.location.href = "obrigado.html";
  } catch (err) {
    console.error("EmailJS error:", err);
    submitBtn.textContent = "Erro ao enviar. Tente novamente.";
    submitBtn.style.background = "#c0392b";
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = "";
      submitBtn.disabled = false;
    }, 3000);
  }
});
