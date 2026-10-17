
/* ==========================================================
   ECOPROPRAGA - BRASIL
   SCRIPT.JS COMPLETO
   ========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================
     1. CONFIGURAÇÕES
  ========================================== */

  const WHATSAPP_NUMBER = "5511975515124";

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const contactForm = document.getElementById("contactForm");
  const yearElement = document.getElementById("year");

  /* ==========================================
     2. MENU RESPONSIVO
  ========================================== */

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove(
      "active",
      "open",
      "is-open",
      "show"
    );

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }

  function openMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    }
  }

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Fechar menu ao clicar em um link */

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    /* Fechar menu ao clicar fora */

    document.addEventListener("click", function (event) {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedMenuButton = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedMenuButton) {
        closeMenu();
      }
    });

    /* Fechar menu com a tecla ESC */

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    /* Fechar menu quando a tela aumentar */

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) {
        closeMenu();
      }
    });
  }

  /* ==========================================
     3. FORMULÁRIO DE ORÇAMENTO
     ENVIO PELO WHATSAPP
  ========================================== */

  if (contactForm) {

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = document.getElementById("name");
      const phone = document.getElementById("phone");
      const service = document.getElementById("service");
      const message = document.getElementById("message");

      if (!name || !phone || !service || !message) {
        alert("Não foi possível localizar todos os campos do formulário.");
        return;
      }

      const customerName = name.value.trim();
      const customerPhone = phone.value.trim();
      const selectedService = service.value.trim();
      const customerMessage = message.value.trim();

      if (!customerName || !customerPhone || !selectedService) {
        alert("Preencha nome, telefone e serviço.");
        return;
      }

      const whatsappMessage = [
        "Olá! Gostaria de solicitar um orçamento na EcoPro.",
        "",
        "*Nome:* " + customerName,
        "*Telefone:* " + customerPhone,
        "*Serviço:* " + selectedService,
        "",
        "*Mensagem:*",
        customerMessage || "Não informada."
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(whatsappMessage);

      /* Abre o WhatsApp com a mensagem preenchida */

      const newWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      /* Caso o navegador bloqueie a nova aba */

      if (!newWindow) {
        window.location.href = whatsappURL;
      }
    });
  }

  /* ==========================================
     4. ANO AUTOMÁTICO NO RODAPÉ
  ========================================== */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================
     5. CONTADORES ANIMADOS
  ========================================== */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(element) {
    if (element.dataset.animated === "true") {
      return;
    }

    const target = Number(element.dataset.count);

    if (!Number.isFinite(target) || target < 0) {
      return;
    }

    element.dataset.animated = "true";

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /* Suavização da animação */

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(
        target * easedProgress
      );

      element.textContent = currentValue.toLocaleString("pt-BR");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString("pt-BR");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (counters.length > 0) {

    if ("IntersectionObserver" in window) {

      const counterObserver = new IntersectionObserver(
        function (entries, observer) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }

          });

        },
        {
          threshold: 0.3
        }
      );

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });

    } else {

      counters.forEach(function (counter) {
        animateCounter(counter);
      });

    }
  }

  /* ==========================================
     6. ANIMAÇÃO DAS SEÇÕES
  ========================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {

    if ("IntersectionObserver" in window) {

      const revealObserver = new IntersectionObserver(
        function (entries, observer) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              observer.unobserve(entry.target);
            }

          });

        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -30px 0px"
        }
      );

      revealElements.forEach(function (element) {
        revealObserver.observe(element);
      });

    } else {

      revealElements.forEach(function (element) {
        element.classList.add("active");
      });

    }
  }

  /* ==========================================
     7. NAVEGAÇÃO SUAVE
  ========================================== */

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const targetSection = document.querySelector(targetId);

      if (!targetSection) {
        return;
      }

      event.preventDefault();

      targetSection.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      closeMenu();
    });

  });

  /* ==========================================
     8. CABEÇALHO AO ROLAR A PÁGINA
  ========================================== */

  const header = document.querySelector(".header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  if (header) {
    window.addEventListener("scroll", updateHeader, {
      passive: true
    });

    updateHeader();
  }

  /* ==========================================
     9. IMAGENS COM CARREGAMENTO TARDIO
  ========================================== */

  const lazyImages = document.querySelectorAll(
    'img[loading="lazy"]'
  );

  lazyImages.forEach(function (image) {

    image.addEventListener("error", function () {
      console.warn(
        "EcoPro: imagem não encontrada:",
        image.getAttribute("src")
      );
    });

  });

  /* ==========================================
     10. INICIALIZAÇÃO FINAL
  ========================================== */

  console.log("EcoPro - Site inicializado.");

});

/* ==========================================================
   FIM DO SCRIPT.JS
   ========================================================== */
