// =========================================
// INSTITUTO RAIZ — script.js
// =========================================

emailjs.init("SEU_PUBLIC_KEY");
const SERVICE_ID  = "SEU_SERVICE_ID";
const TEMPLATE_ID = "SEU_TEMPLATE_ID";

// Nav scroll
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// Mobile menu
const toggle = document.getElementById("navToggle");
const links  = document.querySelector(".nav-links");
toggle.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest(".programs-grid, .impact-grid, .hero-numbers");
    const delay  = parent
      ? Array.from(parent.children).indexOf(entry.target) * 100
      : 0;
    setTimeout(() => entry.target.classList.add("visible"), delay);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.querySelectorAll(".hero .reveal").forEach((el, i) => {
  setTimeout(() => el.classList.add("visible"), 150 + i * 130);
});

// Copiar chave PIX
document.getElementById("copyPix").addEventListener("click", function () {
  navigator.clipboard.writeText("00.000.000/0001-00").then(() => {
    this.textContent = "Copiado!";
    setTimeout(() => this.textContent = "Copiar chave", 2000);
  });
});

// Form
const form      = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const original = submitBtn.textContent;
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      nome:     form.nome.value,
      email:    form.email.value,
      mensagem: form.mensagem.value,
    });
    window.location.href = "obrigado.html";
  } catch {
    submitBtn.textContent = "Erro. Tente novamente.";
    submitBtn.style.background = "#c0392b";
    setTimeout(() => {
      submitBtn.textContent = original;
      submitBtn.style.background = "";
      submitBtn.disabled = false;
    }, 3000);
  }
});
