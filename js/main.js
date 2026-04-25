(() => {
  /* =========================
     NAV / HEADER
  ========================= */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".nav-mobile");
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
      const open = document.body.classList.contains("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* =========================
     SCROLL HEADER EFFECT
  ========================= */
  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY || 0;
      if (header && Math.abs(y - lastY) > 8) {
        header.classList.toggle("is-scrolled", y > 48);
        lastY = y;
      }
    },
    { passive: true }
  );

  /* =========================
     SMOOTH SCROLL (FIXED)
  ========================= */
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth"
      });
    });
  });

  /* =========================
     REVEAL ANIMATION
  ========================= */
  if (!prefersReduced) {
    const reveals = document.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    reveals.forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el =>
      el.classList.add("visible")
    );
  }

  /* =========================
     TYPEWRITER
  ========================= */
  const typeEl = document.getElementById("typewriter");

  if (typeEl) {
    const lines = [
      "Build scalable Flutter platforms.",
      "Launch AI-powered products.",
      "Turn ideas into production systems.",
      "Scale apps for real-world users."
    ];

    let line = 0;
    let char = 0;
    let deleting = false;

    function type() {
      const current = lines[line];

      typeEl.textContent = current.substring(0, char);

      if (!deleting) char++;
      else char--;

      let speed = deleting ? 35 : 65;
      speed += Math.random() * 25;

      if (!deleting && char > current.length) {
        deleting = true;
        speed = 1200;
      }

      if (deleting && char < 0) {
        deleting = false;
        line = (line + 1) % lines.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    type();
  }

  /* =========================
     FORM (SAFE)
  ========================= */
  const form = document.getElementById("contact-form-el");

  if (form) {
    const btn = document.getElementById("submit-btn");
    const status = document.getElementById("form-status");
    const fields = ["name", "email", "need", "overview"];

    function showError(input, msg) {
      const row = input.parentElement;
      row.classList.add("error");
      row.querySelector(".form-error").textContent = msg;
    }

    function clearError(input) {
      input.parentElement.classList.remove("error");
    }

    function validate() {
      let valid = true;

      fields.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        const value = input.value.trim();
        clearError(input);

        if (!value) {
          showError(input, "Required");
          valid = false;
        }

        if (id === "email") {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!ok) {
            showError(input, "Invalid email");
            valid = false;
          }
        }
      });

      return valid;
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!validate()) return;

      const formData = new FormData(form);
      if (formData.get("_gotcha")) return;

      btn?.classList.add("loading");
      if (btn) btn.disabled = true;

      try {
        const res = await fetch("https://formspree.io/f/xeepbkdb", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (res.ok) {
          form.reset();
          status.textContent = "✓ Message sent successfully";
          status.className = "form-success";
        } else {
          status.textContent = "Something went wrong.";
        }
      } catch {
        status.textContent = "Network error.";
      }

      btn?.classList.remove("loading");
      if (btn) btn.disabled = false;
    });
  }


  
  /* =========================
     PARALLAX
  ========================= */
  const images = document.querySelectorAll(".about-photo img");

  if (images.length) {
    let scrollY = window.scrollY;
    let targetY = scrollY;

    function update() {
      scrollY += (targetY - scrollY) * 0.05;

      images.forEach(img => {
        const rect = img.parentElement.getBoundingClientRect();
        const progress =
          (rect.top + rect.height / 2 - window.innerHeight / 2) /
          window.innerHeight;

        const move = progress * 60;
        img.style.transform = `translateY(${move}px) scale(1.05)`;
      });

      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", () => {
      targetY = window.scrollY;
    });

    update();
  }
})();
// =========================
// CASE STUDIES TOGGLE (FIXED)
// =========================
const btn = document.getElementById("toggleProjects");
const hidden = document.querySelector(".hidden-projects");

// Initialize state
if (hidden) {
  hidden.style.maxHeight = "0px";
  hidden.style.overflow = "hidden"; // Ensure hidden state
}

if (btn && hidden) {
  btn.addEventListener("click", () => {
    // If the height is 0, we open it
    if (hidden.style.maxHeight === "0px" || hidden.style.maxHeight === "") {
      hidden.style.maxHeight = hidden.scrollHeight + "px";
      btn.textContent = "Show Less Projects";
    } else {
      // If it is open, we close it
      hidden.style.maxHeight = "0px";
      btn.innerHTML = 'View More Projects <span class="badge">+10</span>';
    }
  });
}