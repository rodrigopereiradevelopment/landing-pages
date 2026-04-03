# 🖥️ Landing Pages — Rodrigo Pereira

Coleção de landing pages responsivas desenvolvidas com HTML, CSS e JavaScript puro. Cada projeto representa um nicho diferente, com identidade visual própria e formulário funcional via EmailJS.

🔗 **[Ver portfólio ao vivo](https://rodrigopereiradevelopment.github.io/landing-pages/)**

---

## 📁 Projetos

| Projeto | Nicho | Status | Demo |
|---|---|---|---|
| `vulcano-pizzaria` | Restaurante / Pizzaria | ✅ Concluído | [Ver](https://rodrigopereiradevelopment.github.io/landing-pages/vulcano-pizzaria/) |
| `clinica` | Saúde / Clínica | 🚧 Em breve | — |
| `ong` | Terceiro Setor | 🚧 Em breve | — |
| `oferta` | E-commerce / Promoção | 🚧 Em breve | — |

---

## 🛠️ Stack

- **HTML5** semântico
- **CSS3** — variáveis, grid, flexbox, animações
- **JavaScript** puro — Intersection Observer, EmailJS
- **Deploy** via GitHub Pages

---

## 📂 Estrutura

```
landing-pages/
├── index.html              ← Página inicial do portfólio
├── README.md
├── vulcano-pizzaria/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── obrigado.html
├── clinica/
├── ong/
└── oferta/
```

---

## ✉️ Formulário de contato

Os formulários utilizam [EmailJS](https://emailjs.com) — chamada direta do JavaScript, sem backend. Para configurar em cada projeto, substitua no `script.js`:

```js
emailjs.init("SEU_PUBLIC_KEY");
const SERVICE_ID  = "SEU_SERVICE_ID";
const TEMPLATE_ID = "SEU_TEMPLATE_ID";
```

---

## 👨‍💻 Sobre

Desenvolvido por **Rodrigo Pereira** — estudante de Técnico em Desenvolvimento de Sistemas na ETEC Pedro Ferreira Alves, Mogi Mirim, SP.

Workflow mobile-first: **Android + Termux + Acode**.

- 🔗 [GitHub](https://github.com/rodrigopereiradevelopment)
- 🔗 [LinkedIn](https://linkedin.com/in/seu-perfil)
- 🚀 [Projeto principal — ARCA](https://github.com/rodrigopereiradevelopment/arca-ionic)
