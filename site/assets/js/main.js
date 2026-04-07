const SITE_CONFIG = {
  companyName: "Transportes Santa Fe del Norte",
  phone: "+56 9 2075 8945",
  whatsapp: "+56 9 2075 8945",
  email: "contacto@santafedelnorte.cl",
  address: "",
  domain: "https://kcortes765.github.io/transportes-santa-fe-del-norte-web",
  formEndpoint: "",
};

const PLACEHOLDER_PATTERN = /\{\{[^}]+\}\}/;

function isPendingValue(value) {
  return !value || PLACEHOLDER_PATTERN.test(value);
}

function sanitizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

function sanitizeWhatsApp(value) {
  return value.replace(/\D/g, "");
}

function resolveLink(key, value) {
  switch (key) {
    case "phone":
      return `tel:${sanitizePhone(value)}`;
    case "email":
      return `mailto:${value}`;
    case "whatsapp":
      return `https://wa.me/${sanitizeWhatsApp(value)}`;
    default:
      return value;
  }
}

function populateFields() {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const key = element.dataset.field;
    const value = SITE_CONFIG[key];
    const pending = isPendingValue(value);
    element.textContent = pending
      ? element.dataset.pending || "Dato pendiente"
      : value;
    element.dataset.pendingState = pending ? "true" : "false";
  });

  document.querySelectorAll("[data-link]").forEach((element) => {
    const key = element.dataset.link;
    const value = SITE_CONFIG[key];
    const pending = isPendingValue(value);
    const fallback = element.dataset.fallback || "#contacto";
    const label = element.querySelector("[data-link-label]");

    if (label && !label.dataset.defaultLabel) {
      label.dataset.defaultLabel = label.textContent.trim();
    }

    if (pending) {
      element.setAttribute("href", fallback);
      element.classList.add("is-pending");
      element.setAttribute("aria-disabled", "true");
      if (label) {
        label.textContent = element.dataset.pendingLabel || "Ver formulario";
      }
      return;
    }

    element.classList.remove("is-pending");
    element.removeAttribute("aria-disabled");
    element.setAttribute("href", resolveLink(key, value));
    if (key === "whatsapp") {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
    if (label && label.dataset.defaultLabel) {
      label.textContent = label.dataset.defaultLabel;
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function setupPendingVisibility() {
  document.querySelectorAll("[data-hide-if-pending]").forEach((element) => {
    const field = element.querySelector("[data-field]");
    if (!field) {
      return;
    }

    const key = field.dataset.field;
    const value = SITE_CONFIG[key];
    element.hidden = isPendingValue(value);
  });
}

function setupMobileMenu() {
  const button = document.querySelector("[data-menu-button]");
  const panel = document.querySelector("[data-mobile-panel]");

  if (!button || !panel) {
    return;
  }

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    panel.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  };

  const openMenu = () => {
    button.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    panel.classList.add("is-open");
    document.body.classList.add("is-menu-open");
  };

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function setupHeaderState() {
  const header = document.querySelector("[data-site-header]");
  if (!header) {
    return;
  }

  const applyState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  applyState();
  window.addEventListener("scroll", applyState, { passive: true });
}

function setupMobileCtaBar() {
  const bar = document.querySelector(".mobile-cta-bar");
  const contactSection = document.querySelector("#contacto");

  if (!bar || window.innerWidth > 760) {
    return;
  }

  const applyState = () => {
    const contactNearViewport = contactSection
      ? contactSection.getBoundingClientRect().top < window.innerHeight * 0.82
      : false;

    bar.classList.toggle(
      "is-visible",
      window.scrollY > 280 && !contactNearViewport,
    );
  };

  applyState();
  window.addEventListener("scroll", applyState, { passive: true });
  window.addEventListener("resize", applyState, { passive: true });
}

function setupSmoothScroll() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", href);
    });
  });
}

function setupActiveNavigation() {
  const sections = document.querySelectorAll("[data-nav-section]");
  const links = document.querySelectorAll(".site-nav__link");

  if (!sections.length || !links.length) {
    return;
  }

  const linkMap = new Map();
  links.forEach((link) => {
    linkMap.set(link.getAttribute("href"), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.remove("is-current"));
        const activeLink = linkMap.get(id);
        if (activeLink) {
          activeLink.classList.add("is-current");
        }
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: 0.05,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) {
    return;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach((button) => {
        const panel = document.getElementById(
          button.getAttribute("aria-controls"),
        );
        button.setAttribute("aria-expanded", "false");
        if (panel) {
          panel.hidden = true;
        }
      });

      if (!expanded) {
        const panel = document.getElementById(
          trigger.getAttribute("aria-controls"),
        );
        trigger.setAttribute("aria-expanded", "true");
        if (panel) {
          panel.hidden = false;
        }
      }
    });
  });
}

function setupRevealAnimations() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) {
    return;
  }

  items.forEach((item) => item.classList.add("is-visible"));
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) {
    return;
  }

  const status = form.querySelector("[data-form-status]");

  const setStatus = (message, type = "") => {
    if (!status) {
      return;
    }

    status.textContent = message;
    status.className = "form-status";
    if (type) {
      status.classList.add(`is-${type}`);
    }
  };

  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      setStatus("Revisa los campos obligatorios antes de enviar.", "warning");
      return;
    }

    if (isPendingValue(SITE_CONFIG.formEndpoint)) {
      event.preventDefault();
      setStatus(
        "El formulario aún no está conectado. Por ahora escríbenos por WhatsApp, correo o teléfono.",
        "warning",
      );
      return;
    }

    form.action = SITE_CONFIG.formEndpoint;
    setStatus("Enviando solicitud...", "success");
  });

  form.addEventListener("input", () => {
    setStatus("");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateFields();
  setupPendingVisibility();
  setupMobileMenu();
  setupHeaderState();
  setupMobileCtaBar();
  setupSmoothScroll();
  setupActiveNavigation();
  setupAccordion();
  setupRevealAnimations();
  setupContactForm();
});
