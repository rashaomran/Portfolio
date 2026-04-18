(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".nav-mobile");
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
      const open = document.body.classList.contains("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("visible");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  });

  var y = 0;
  window.addEventListener(
    "scroll",
    function () {
      const ny = window.scrollY || 0;
      if (header && Math.abs(ny - y) > 8) {
        if (ny > 48) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
        y = ny;
      }
    },
    { passive: true }
  );
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typewriter");

  if (!el) {
    console.error("Typewriter element not found");
    return;
  }

 const lines = [
  "Build scalable Flutter platforms.",
  "Launch AI-powered products.",
  "Turn ideas into production systems.",
  "Scale apps for real-world users."
];

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = lines[lineIndex];

    if (!isDeleting) {
      el.innerHTML = current.substring(0, charIndex);
      charIndex++;
    } else {
      el.innerHTML = current.substring(0, charIndex);
      charIndex--;
    }

    let speed = isDeleting ? 35 : 65;
    speed += Math.random() * 25;

    // finished typing
    if (!isDeleting && charIndex > current.length) {
      isDeleting = true;
      speed = 1200;
    }

    // finished deleting
    if (isDeleting && charIndex < 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
});


/* Form */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form-el");
  const btn = document.getElementById("submit-btn");
  const status = document.getElementById("form-status");

  const fields = ["name", "email", "need", "overview"];

  function showError(input, message) {
    const row = input.parentElement;
    row.classList.add("error");
    row.querySelector(".form-error").textContent = message;
  }

  function clearError(input) {
    const row = input.parentElement;
    row.classList.remove("error");
  }

  function validate() {
    let valid = true;

    fields.forEach(id => {
      const input = document.getElementById(id);
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

  fields.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => {
      validate();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData(form);

    // Honeypot protection
    if (formData.get("_gotcha")) return;

    btn.classList.add("loading");
    btn.disabled = true;
    status.textContent = "";

    try {
      const res = await fetch("https://formspree.io/f/xeepbkdb", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        form.reset();

        status.className = "form-success";
        status.textContent = "✓ Message sent successfully";
        status.style.color = "#31F604";

      } else {
        status.textContent = "Something went wrong. Try again.";
        status.style.color = "#ef4444";
      }

    } catch {
      status.textContent = "Network error. Try again.";
      status.style.color = "#ef4444";
    }

    btn.classList.remove("loading");
    btn.disabled = false;
  });
});


// =========================
// PARALLAX (ULTRA SMOOTH)
// =========================
(function () {
  const images = document.querySelectorAll(".about-photo img");

  let scrollY = window.scrollY;
  let targetY = scrollY;

  function update() {
    // smooth interpolation (GSAP-like)
   scrollY += (targetY - scrollY) * 0.05;

    images.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      const windowH = window.innerHeight;

      // progress: -1 (above) → 0 (center) → 1 (below)
      const progress = (rect.top + rect.height / 2 - windowH / 2) / windowH;

      const move = progress * 60; // 🔥 strength (adjust 20–60)

      img.style.transform = `translateY(${move}px) scale(1.05)`;
    });

    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", () => {
    targetY = window.scrollY;
  });

  update();
})();