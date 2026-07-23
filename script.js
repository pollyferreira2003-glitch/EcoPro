const header = document.querySelector(".header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const contactForm = document.getElementById("contactForm");
const counters = document.querySelectorAll("[data-count]");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  });
}

if (menuToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

  let countersStarted = false;
  const numbersSection = document.querySelector(".numbers");

  if (numbersSection && counters.length) {
    const numberObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;

            counters.forEach(counter => {
              const target = Number(counter.dataset.count) || 0;
              const duration = 1500;
              const startTime = performance.now();

              function updateCounter(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * eased).toLocaleString("pt-BR");

                if (progress < 1) requestAnimationFrame(updateCounter);
              }

              requestAnimationFrame(updateCounter);
            });

            numberObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    numberObserver.observe(numbersSection);
  }
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
  counters.forEach(counter => {
    counter.textContent = (Number(counter.dataset.count) || 0).toLocaleString("pt-BR");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const service = document.getElementById("service")?.value || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const whatsappNumber = "5511975515124";
    const text = [
      "Olá! Gostaria de solicitar um orçamento.",
      "",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Serviço: ${service}`,
      `Mensagem: ${message || "Não informada"}`
    ].join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}
