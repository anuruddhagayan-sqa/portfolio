/* ==========================================================
   EDITABLE CONTENT: add or change items in these two lists.
   ========================================================== */

// PROJECTS: copy one { ... } line, paste it below, and edit the text.
// "category" is used by the filter buttons (any word works, e.g. "JMeter").
const projects = [
  { title: "Personal Expense Control Using IT", meta: "2022 · 4th Year Research", category: "Research",
    text: "Applied data analysis techniques to help control expenses in line with income and support personal financial management." },
  { title: "Sign Language Recognition Module", meta: "2020–2021 · 3rd Year Project", category: "Development",
    text: "Recognizes sign language gestures to improve accessibility.", tags: "Python, Google Teachable Machine, Android Studio" },
  { title: "Faculty Results Management System", meta: "2019 · 2nd Year Project", category: "Development",
    text: "A web system for managing faculty exam results.", tags: "HTML, CSS, JavaScript, PHP, MySQL" },
  // ---- Future QA automation slots: replace text and remove "placeholder: true" when ready ----
  { title: "JMeter Performance Project", meta: "Coming soon", category: "JMeter", placeholder: true,
    text: "Load test plan and results will go here.", tags: "JMeter" },
  { title: "UI Automation Project", meta: "Coming soon", category: "UI Automation", placeholder: true,
    text: "Cypress, Selenium or Playwright suite will go here.", tags: "Cypress, Playwright" },
  { title: "API Automation Project", meta: "Coming soon", category: "API Automation", placeholder: true,
    text: "Postman or API test suite will go here.", tags: "Postman" }
];

// QA NOTES: add a new { ... } entry at the top for a new article.
// Optional: add url: "https://..." to link to the full article.
const notes = [
  { title: "Smoke vs. regression testing", date: "Sample note",
    text: "Smoke tests confirm a build is stable enough to test. Regression tests confirm that old features still work after a change." },
  { title: "Writing a useful bug report", date: "Sample note",
    text: "State the steps, expected result, actual result and environment. Add a screenshot or log so developers can reproduce it fast." },
  { title: "When to automate a test", date: "Sample note",
    text: "Automate stable, repeated, high-value flows first. Keep exploratory and one-off checks manual." }
];

/* ==========================================================
   RENDERING (no need to edit below for content changes)
   ========================================================== */

// Build one card element from an item. Uses textContent so text is never parsed as HTML.
function buildCard(item) {
  const card = document.createElement("article");
  card.className = "card" + (item.placeholder ? " placeholder" : "");
  const h = document.createElement("h3");
  if (item.url) {
    const a = document.createElement("a");
    a.href = item.url; a.target = "_blank"; a.rel = "noopener"; a.textContent = item.title;
    h.appendChild(a);
  } else { h.textContent = item.title; }
  card.appendChild(h);
  const sub = item.meta || item.date;
  if (sub) { const m = document.createElement("p"); m.className = "muted"; m.textContent = sub; card.appendChild(m); }
  const p = document.createElement("p"); p.textContent = item.text; card.appendChild(p);
  if (item.tags) { const t = document.createElement("p"); t.className = "tags"; t.textContent = item.tags; card.appendChild(t); }
  return card;
}

function render(containerId, items) {
  const box = document.getElementById(containerId);
  box.replaceChildren(...items.map(buildCard));
}

// Project filter buttons, built from the categories found in "projects"
function setupFilters() {
  const bar = document.getElementById("project-filters");
  const cats = ["All", ...new Set(projects.map(p => p.category))];
  cats.forEach(cat => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = cat;
    b.setAttribute("aria-pressed", cat === "All");
    b.addEventListener("click", () => {
      bar.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      render("project-grid", cat === "All" ? projects : projects.filter(p => p.category === cat));
    });
    bar.appendChild(b);
  });
  render("project-grid", projects);
}

// Mobile menu toggle; closes after a link is tapped
function setupMenu() {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", e => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
  });
}

// Highlight the nav link of the section currently in view
function setupActiveLink() {
  const links = [...document.querySelectorAll(".nav-links a")];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => obs.observe(s));
}

// Contact form: client-side validation and feedback.
// To actually send messages, replace the marked line with a fetch() to a form service (e.g. Formspree).
function setupForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const rules = {
    name: v => v.trim().length >= 2 || "Enter your name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    message: v => v.trim().length >= 10 || "Write at least 10 characters."
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    Object.keys(rules).forEach(f => {
      const input = form.elements[f];
      const res = rules[f](input.value);
      form.querySelector(`[data-error-for="${f}"]`).textContent = res === true ? "" : res;
      input.setAttribute("aria-invalid", res !== true);
      if (res !== true) ok = false;
    });
    status.className = "status";
    if (!ok) { status.textContent = "Please fix the highlighted fields."; return; }
    // --- Replace this block with a real submission (fetch to a form service) ---
    status.textContent = "Thanks! Your message is ready to send. Connect a form service in script.js to deliver it.";
    status.classList.add("ok");
    form.reset();
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
render("notes-grid", notes);
setupFilters();
setupMenu();
setupActiveLink();
setupForm();
