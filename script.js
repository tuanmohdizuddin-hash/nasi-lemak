// Daun Emas — interaksi laman
(() => {
  // Nombor WhatsApp untuk tempahan (format antarabangsa, tanpa + atau sengkang)
  const WHATSAPP_NUMBER = "60123456789";

  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  // Nav berubah bila skrol
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mudah alih
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Animasi reveal
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  const observe = (el) => (io ? io.observe(el) : el.classList.add("in"));
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observe(el);
  });

  // Tab menu
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".menu-panel");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", String(t === tab)); });
    panels.forEach((p) => {
      const show = p.dataset.panel === tab.dataset.tab;
      p.hidden = !show;
      p.classList.toggle("active", show);
      if (show) p.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    });
  }));

  // Slider ulasan
  const reviews = document.querySelectorAll(".review");
  const dots = document.querySelectorAll(".dot");
  let current = 0, timer;
  const show = (i) => {
    current = i;
    reviews.forEach((r, j) => r.classList.toggle("active", j === i));
    dots.forEach((d, j) => d.classList.toggle("active", j === i));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => show((current + 1) % reviews.length), 6000); };
  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); auto(); }));
  auto();

  // Borang tempahan → WhatsApp
  const form = document.getElementById("bookingForm");
  const msg = document.getElementById("formMsg");
  const dateInput = document.getElementById("tarikh");
  dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach((el) => {
      const bad = !el.value.trim() || (el.type === "number" && Number(el.value) < 1);
      el.closest(".field").classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = "Sila lengkapkan semua ruangan yang diperlukan."; return; }

    const d = Object.fromEntries(new FormData(form));
    const tarikh = new Date(d.tarikh).toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const text = [
      "Assalamualaikum Daun Emas, saya ingin membuat tempahan:",
      `• Nama: ${d.nama}`,
      `• Tarikh: ${tarikh}`,
      `• Masa: ${d.masa}`,
      `• Tetamu: ${d.tetamu} orang`,
      `• Pakej: ${d.pakej}`,
      d.nota ? `• Nota: ${d.nota}` : "",
    ].filter(Boolean).join("\n");

    msg.textContent = "Membuka WhatsApp…";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
