(() => {
  "use strict";

  const prefersReducedMotion = false;
  
  /* ------------------------------------------------------------
     Navbar: scroll state + active link + mobile toggle
  ------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const links = Array.from(navLinks.querySelectorAll("a"));
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const scrollProgress = document.getElementById("scrollProgress");
  let scrollTicking = false;

  function onScroll() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);

    if (scrollProgress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrollProgress.style.width = pct + "%";
    }

    let current = sections[0];
    const y = window.scrollY + 140;
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec;
    }
    links.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current.id}`);
    });

    document.getElementById("toTop").classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      onScroll();
      scrollTicking = false;
    });
  }, { passive: true });
  onScroll();

  navToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("menu-open");
    navToggle.classList.toggle("is-open", isOpen);
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navbar.classList.remove("menu-open");
      navToggle.classList.remove("is-open");
    }
  });

  document.getElementById("toTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ------------------------------------------------------------
     Scroll reveal (IntersectionObserver)
  ------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(".reveal, .skill-card, .project-card, .cert-card");
  revealTargets.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty("--i", i % 8);
        entry.target.classList.add("is-visible");

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  revealTargets.forEach(el => io.observe(el));

  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------
     Language (EN / AR) — copy lives in the HTML:
     English is the default text, Arabic sits in data-ar* attributes.
  ------------------------------------------------------------ */
  const STORAGE_KEY = "portfolio-lang";
  const TEXT = {
    en: {
      name: "Youssef Osama",
      roles: [
        "Junior Front-End Developer | Website Designer",
        "Modern, responsive websites",
        "Landing pages & clinic websites",
        "HTML · CSS · JavaScript"
      ],
      caseShow: "Case study ",
      caseHide: "Hide case study ",
      title: "Youssef Osama — Junior Front-End Developer | Website Designer",
      description: "Junior front-end developer and website designer in Cairo, Egypt. Responsive websites and landing pages with HTML, CSS and JavaScript, including clinic websites.",
      toggleLabel: "العربية",
      toggleAria: "Switch language to Arabic",
      ogLocale: "en_US", ogAlt: "ar_EG"
    },
    ar: {
      name: "يوسف أسامة",
      roles: [
        "مطوّر واجهات أمامية مبتدئ | مصمم مواقع",
        "مواقع حديثة ومتجاوبة",
        "صفحات هبوط ومواقع عيادات",
        "HTML · CSS · JavaScript"
      ],
      caseShow: "دراسة الحالة ",
      caseHide: "إخفاء دراسة الحالة ",
      title: "يوسف أسامة — مطوّر واجهات أمامية مبتدئ | مصمم مواقع",
      description: "مطوّر واجهات أمامية مبتدئ ومصمم مواقع في القاهرة، مصر. أبني مواقع وصفحات هبوط متجاوبة باستخدام HTML وCSS وJavaScript، ومنها مواقع العيادات.",
      toggleLabel: "English",
      toggleAria: "التبديل إلى اللغة الإنجليزية",
      ogLocale: "ar_EG", ogAlt: "en_US"
    }
  };
  let currentLang = "en";

  // Swap one attribute-based translation (cache the English original first)
  function swapAttr(el, attr, arAttr, lang) {
    const cacheKey = "en" + attr.replace(/(^|-)(\w)/g, (m, d, c) => c.toUpperCase());
    if (!(cacheKey in el.dataset)) el.dataset[cacheKey] = el.getAttribute(attr) || "";
    const ar = el.getAttribute(arAttr);
    if (ar === null) return;
    el.setAttribute(attr, lang === "ar" ? ar : el.dataset[cacheKey]);
  }

  function setMeta(selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  }

  function applyLanguage(lang) {
    currentLang = lang === "ar" ? "ar" : "en";
    const t = TEXT[currentLang];
    const root = document.documentElement;
    root.lang = currentLang;
    root.dir = currentLang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-ar]").forEach(el => {
      if (el.dataset.enText === undefined) el.dataset.enText = el.textContent;
      el.textContent = currentLang === "ar" ? el.getAttribute("data-ar") : el.dataset.enText;
    });
    document.querySelectorAll("[data-ar-html]").forEach(el => {
      if (el.dataset.enHtml === undefined) el.dataset.enHtml = el.innerHTML;
      el.innerHTML = currentLang === "ar" ? el.getAttribute("data-ar-html") : el.dataset.enHtml;
    });
    document.querySelectorAll("[data-ar-aria-label]").forEach(el => swapAttr(el, "aria-label", "data-ar-aria-label", currentLang));
    document.querySelectorAll("[data-ar-alt]").forEach(el => swapAttr(el, "alt", "data-ar-alt", currentLang));
    document.querySelectorAll("[data-copy-ar]").forEach(el => {
      if (el.dataset.copyEn === undefined) el.dataset.copyEn = el.dataset.copy;
      el.dataset.copy = currentLang === "ar" ? el.dataset.copyAr : el.dataset.copyEn;
    });

    // Case-study buttons keep their open/closed state
    document.querySelectorAll(".expand-btn").forEach(btn => {
      const label = btn.querySelector(".expand-label");
      if (label) label.textContent = btn.classList.contains("is-open") ? t.caseHide : t.caseShow;
    });

    // Language button, document title and share metadata
    langToggle.textContent = t.toggleLabel;
    langToggle.setAttribute("aria-label", t.toggleAria);
    langToggle.lang = currentLang === "ar" ? "en" : "ar";
    document.title = t.title;
    setMeta('meta[name="description"]', "content", t.description);
    setMeta('meta[property="og:title"]', "content", t.title);
    setMeta('meta[property="og:description"]', "content", t.description);
    setMeta('meta[name="twitter:title"]', "content", t.title);
    setMeta('meta[name="twitter:description"]', "content", t.description);
    setMeta('meta[property="og:locale"]', "content", t.ogLocale);
    setMeta('meta[property="og:locale:alternate"]', "content", t.ogAlt);

    try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (e) { /* storage may be blocked */ }

    startTyping();
  }

  /* ------------------------------------------------------------
     Hero: typed name + typed role (restart when the language changes)
  ------------------------------------------------------------ */
  const typedName = document.getElementById("typedName");
  const typedRole = document.getElementById("typedRole");
  const typedQuery = document.getElementById("typedQuery");
  const langToggle = document.getElementById("langToggle");
  let typingRun = 0;

  function startTyping() {
    const run = ++typingRun;          // older loops stop when this changes
    const t = TEXT[currentLang];
    const alive = () => run === typingRun;

    // Name (one pass)
    if (typedName) {
      if (prefersReducedMotion) {
        typedName.textContent = t.name;
      } else {
        let n = 0;
        (function typeName() {
          if (!alive()) return;
          typedName.textContent = t.name.slice(0, n);
          n++;
          if (n <= t.name.length) setTimeout(typeName, 75);
        })();
      }
    }

    // Rotating role / service lines
    if (typedRole) {
      if (prefersReducedMotion) {
        typedRole.textContent = t.roles[0];
      } else {
        let roleIndex = 0, charIndex = 0, deleting = false;
        (function tick() {
          if (!alive()) return;
          const word = t.roles[roleIndex];
          if (!deleting) {
            charIndex++;
            typedRole.textContent = word.slice(0, charIndex);
            if (charIndex === word.length) {
              deleting = true;
              setTimeout(tick, 1600);
              return;
            }
          } else {
            charIndex--;
            typedRole.textContent = word.slice(0, charIndex);
            if (charIndex === 0) {
              deleting = false;
              roleIndex = (roleIndex + 1) % t.roles.length;
            }
          }
          setTimeout(tick, deleting ? 30 : 55);
        })();
      }
    }

    // Code panel: one typed CSS value (language-independent)
    if (typedQuery) {
      const text = "grid; }";
      if (prefersReducedMotion) {
        typedQuery.textContent = text;
      } else if (run === 1) {
        let i = 0;
        (function step() {
          typedQuery.textContent = text.slice(0, i);
          i++;
          if (i <= text.length) setTimeout(step, 90);
        })();
      }
    }
  }

  langToggle.addEventListener("click", () => applyLanguage(currentLang === "ar" ? "en" : "ar"));

  /* ------------------------------------------------------------
     Ambient cursor glow (desktop only, respects reduced motion)
  ------------------------------------------------------------ */
  const glow = document.getElementById("cursorGlow");
  if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let raf = null;
    window.addEventListener("mousemove", (e) => {
      glow.classList.add("is-active");
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      });
    });
    document.addEventListener("mouseleave", () => glow.classList.remove("is-active"));
  }

  /* ------------------------------------------------------------
     Count-up numbers (stats strip) — observed once, replayable on click
  ------------------------------------------------------------ */
  function runCountUp(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1000;
    const start = performance.now();
    (function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    })(start);
  }

  const statNums = document.querySelectorAll(".stat-num[data-count]");
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      runCountUp(entry.target);
      countIo.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  statNums.forEach(el => countIo.observe(el));

  // Click any stat to replay its count-up — small reward for exploring
  document.querySelectorAll(".stat-item").forEach(item => {
    item.addEventListener("click", () => {
      const num = item.querySelector(".stat-num");
      if (num) {
        num.textContent = "0";
        requestAnimationFrame(() => runCountUp(num));
      }
    });
  });

  /* ------------------------------------------------------------
     Project filters
  ------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === "all" || card.dataset.cat.split(" ").includes(filter);
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ------------------------------------------------------------
     Project case-study expand/collapse
  ------------------------------------------------------------ */
  document.querySelectorAll(".expand-btn").forEach(btn => {
    const card = btn.closest(".project-card");
    const detail = card && card.querySelector(".project-detail");
    if (!detail) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      detail.classList.toggle("is-open", isOpen);
      const label = btn.querySelector(".expand-label");
      if (label) label.textContent = isOpen ? TEXT[currentLang].caseHide : TEXT[currentLang].caseShow;
    });
  });

  /* ------------------------------------------------------------
     Copy-to-clipboard on contact items
  ------------------------------------------------------------ */
  document.querySelectorAll(".contact-item[data-copy]").forEach(item => {
    item.addEventListener("click", async () => {
      const value = item.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const toast = item.querySelector(".copy-toast");
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1400);
      }
    });
  });

  /* ------------------------------------------------------------
     3D tilt-on-hover — cards, console, profile photo react to the
     mouse instead of sitting still once revealed
  ------------------------------------------------------------ */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function attachTilt(el, { max = 8, lift = -6 } = {}) {
    if (!el || !canHover || prefersReducedMotion) return;
    let raf = null;
    let rect = null;

    el.addEventListener("mouseenter", () => {
      rect = el.getBoundingClientRect();
      el.classList.add("is-tilting");
    });

    el.addEventListener("mousemove", (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;    // 0..1
      const rotY = (px - 0.5) * max * 2;
      const rotX = (0.5 - py) * max * 2;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${lift}px)`;
        el.style.setProperty("--mx", (px * 100) + "%");
        el.style.setProperty("--my", (py * 100) + "%");
      });
    });

    el.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
      el.classList.remove("is-tilting");
      rect = null;
    });

    // Recompute on resize/scroll only when needed (rect is nulled on leave anyway)
    window.addEventListener("resize", () => { rect = null; }, { passive: true });
  }

  document.querySelectorAll(".card").forEach(card => attachTilt(card, { max: 6, lift: -6 }));
  attachTilt(document.querySelector(".console"), { max: 5, lift: 0 });

  // About photo: lighter tilt, image already zooms via CSS
  const aboutFrame = document.querySelector(".about-photo .frame");
  if (aboutFrame && canHover && !prefersReducedMotion) {
    const aboutPhoto = document.querySelector(".about-photo");
    let raf2 = null;
    let rect2 = null;
    aboutPhoto.addEventListener("mouseenter", () => {
      rect2 = aboutPhoto.getBoundingClientRect();
    });
    aboutPhoto.addEventListener("mousemove", (e) => {
      if (!rect2) rect2 = aboutPhoto.getBoundingClientRect();
      const px = (e.clientX - rect2.left) / rect2.width;
      const py = (e.clientY - rect2.top) / rect2.height;
      const rotY = (px - 0.5) * 10;
      const rotX = (0.5 - py) * 10;
      if (raf2) cancelAnimationFrame(raf2);
      raf2 = requestAnimationFrame(() => {
        aboutFrame.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    });
    aboutPhoto.addEventListener("mouseleave", () => {
      if (raf2) cancelAnimationFrame(raf2);
      aboutFrame.style.transform = "";
      rect2 = null;
    });
  }

  /* ------------------------------------------------------------
     Button ripple — every click gives visible feedback
  ------------------------------------------------------------ */
  document.querySelectorAll(".btn, .filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (prefersReducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* ------------------------------------------------------------
     Boot: saved language (or ?lang=ar) → otherwise English
  ------------------------------------------------------------ */
  let initialLang = "en";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const saved = localStorage.getItem(STORAGE_KEY);
    initialLang = fromUrl === "ar" || fromUrl === "en" ? fromUrl : (saved === "ar" ? "ar" : "en");
  } catch (e) { /* ignore */ }
  applyLanguage(initialLang);

})();
