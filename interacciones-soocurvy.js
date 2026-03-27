/* =========================================================
   SOO CURVY TALLAS EXTRAS
   JAVASCRIPT - PARTE 1 DE 4
   Base general + menú móvil + reveal on scroll + anchors
========================================================= */

(() => {
  "use strict";

  /* =========================
     HELPERS
  ========================= */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const state = {
    menuAbierto: false,
    reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    breakpointTablet: 992
  };

  /* =========================
     INIT
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    initBase();
    initMenuMovil();
    initAnimacionesScroll();
    initScrollSuaveAnclas();
  });

  /* =========================
     BASE
  ========================= */
  function initBase() {
    document.body.classList.add("animaciones-activas");

    if (state.reduceMotion) {
      document.body.classList.remove("animaciones-activas");

      $$("[data-animacion]").forEach((elemento) => {
        elemento.classList.add("animado");
      });
    }
  }

  /* =========================
     MENÚ MÓVIL
  ========================= */
  function initMenuMovil() {
    const botonMenu = $("#botonMenuMovil");
    const botonCerrar = $("#cerrarMenuMovil");
    const menu = $("#menuMovil");
    const overlay = $("#overlayMenuMovil");
    const linksMenu = $$("#menuMovil a");

    if (!botonMenu || !menu || !overlay) return;

    const abrirMenu = () => {
      menu.classList.add("activo");
      overlay.classList.add("activo");
      document.body.classList.add("bloqueado-scroll");
      botonMenu.setAttribute("aria-expanded", "true");
      state.menuAbierto = true;
    };

    const cerrarMenu = () => {
      menu.classList.remove("activo");
      overlay.classList.remove("activo");
      document.body.classList.remove("bloqueado-scroll");
      botonMenu.setAttribute("aria-expanded", "false");
      state.menuAbierto = false;
    };

    const alternarMenu = () => {
      if (state.menuAbierto) {
        cerrarMenu();
      } else {
        abrirMenu();
      }
    };

    botonMenu.addEventListener("click", alternarMenu);

    if (botonCerrar) {
      botonCerrar.addEventListener("click", cerrarMenu);
    }

    overlay.addEventListener("click", cerrarMenu);

    linksMenu.forEach((link) => {
      link.addEventListener("click", () => {
        cerrarMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.menuAbierto) {
        cerrarMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > state.breakpointTablet && state.menuAbierto) {
        cerrarMenu();
      }
    });
  }

  /* =========================
     ANIMACIONES AL HACER SCROLL
  ========================= */
  function initAnimacionesScroll() {
    const elementosAnimados = $$("[data-animacion]");

    if (!elementosAnimados.length) return;

    if (state.reduceMotion || !("IntersectionObserver" in window)) {
      elementosAnimados.forEach((elemento) => {
        elemento.classList.add("animado");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const elemento = entry.target;
          const retraso = elemento.dataset.delay;

          if (retraso) {
            setTimeout(() => {
              elemento.classList.add("animado");
            }, Number(retraso));
          } else {
            elemento.classList.add("animado");
          }

          obs.unobserve(elemento);
        });
      },
      {
        root: null,
        threshold: 0.16,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    elementosAnimados.forEach((elemento) => observer.observe(elemento));
  }

  /* =========================
     SCROLL SUAVE CON OFFSET
  ========================= */
  function initScrollSuaveAnclas() {
    const linksInternos = $$('a[href^="#"]');

    if (!linksInternos.length) return;

    linksInternos.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const destino = document.querySelector(href);
        if (!destino) return;

        event.preventDefault();

        const offset = obtenerOffsetHeader();
        const topDestino =
          destino.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: Math.max(topDestino, 0),
          behavior: state.reduceMotion ? "auto" : "smooth"
        });
      });
    });
  }

  function obtenerOffsetHeader() {
    const topbar = document.querySelector(".topbar");
    const header = document.querySelector(".header-principal");

    const altoTopbar = topbar ? topbar.offsetHeight : 0;
    const altoHeader = header ? header.offsetHeight : 0;

    return altoTopbar + altoHeader + 12;
  }
})();


/* =========================================================
   SOO CURVY TALLAS EXTRAS
   JAVASCRIPT - PARTE 2 DE 4
   Header dinámico + sección activa + parallax + hover cards
========================================================= */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initSeccionActivaMenu();
    initHeroParallax();
    initHoverCards3D();
    initEntradaBotonesFlotantes();
  });

  /* =========================
     HEADER CON EFECTO AL SCROLL
  ========================= */
  function initHeaderScroll() {
    const header = $(".header-principal");
    if (!header) return;

    const actualizarHeader = () => {
      const scrolled = window.scrollY > 18;

      if (scrolled) {
        header.classList.add("header-principal--scroll");
        header.style.boxShadow = "0 12px 28px rgba(88, 38, 101, 0.12)";
        header.style.background = "rgba(255, 248, 252, 0.92)";
      } else {
        header.classList.remove("header-principal--scroll");
        header.style.boxShadow = "";
        header.style.background = "";
      }
    };

    actualizarHeader();
    window.addEventListener("scroll", actualizarHeader, { passive: true });
  }

  /* =========================
     LINK ACTIVO DEL MENÚ
  ========================= */
  function initSeccionActivaMenu() {
    const links = $$(
      '.nav-desktop a[href^="#"], .menu-movil__lista a[href^="#"]'
    );

    if (!links.length || !("IntersectionObserver" in window)) return;

    const mapaLinks = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      if (!mapaLinks.has(id)) mapaLinks.set(id, []);
      mapaLinks.get(id).push(link);
    });

    const secciones = [...mapaLinks.keys()]
      .map((id) => document.querySelector(id))
      .filter(Boolean);

    if (!secciones.length) return;

    const limpiarActivos = () => {
      links.forEach((link) => {
        link.classList.remove("activo");
      });
    };

    const marcarActivo = (id) => {
      limpiarActivos();
      const grupo = mapaLinks.get(id);
      if (!grupo) return;

      grupo.forEach((link) => {
        link.classList.add("activo");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibles = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibles.length) return;

        const seccion = visibles[0].target;
        const id = `#${seccion.id}`;
        marcarActivo(id);
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-18% 0px -45% 0px"
      }
    );

    secciones.forEach((seccion) => observer.observe(seccion));
  }

  /* =========================
     PARALLAX SUAVE EN HERO
  ========================= */
  function initHeroParallax() {
    if (reduceMotion) return;

    const hero = $(".hero-soocurvy");
    const monita = $(".hero-soocurvy__monita");
    const texturaIzquierda = $(".hero-soocurvy__textura--izquierda");
    const texturaDerecha = $(".hero-soocurvy__textura--derecha");
    const destellos = $$(".hero-soocurvy__destello");

    if (!hero || !monita) return;

    let ticking = false;

    const actualizarParallax = () => {
      const rect = hero.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;

      if (rect.bottom < 0 || rect.top > viewportH) {
        ticking = false;
        return;
      }

      const progreso = rect.top / viewportH;

      monita.style.transform = `translateY(${progreso * -18}px)`;
      if (texturaIzquierda) {
        texturaIzquierda.style.transform = `translateY(${progreso * -10}px) translateX(${progreso * 8}px)`;
      }
      if (texturaDerecha) {
        texturaDerecha.style.transform = `translateY(${progreso * 12}px) translateX(${progreso * -8}px)`;
      }

      destellos.forEach((destello, index) => {
        const factor = (index + 1) * 5;
        destello.style.transform = `translateY(${progreso * factor * -1}px)`;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(actualizarParallax);
        ticking = true;
      }
    };

    actualizarParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* =========================
     HOVER 3D SUAVE EN TARJETAS
  ========================= */
  function initHoverCards3D() {
    if (reduceMotion) return;

    const tarjetas = $$(
      [
        ".tarjeta-sobre",
        ".card-prenda",
        ".producto-card__imagen-wrap",
        ".frase-card",
        ".paso-compra",
        ".card-envio",
        ".card-costo-envio",
        ".dato-ubicacion",
        ".card-tiktok__portada-wrap"
      ].join(", ")
    );

    if (!tarjetas.length) return;

    tarjetas.forEach((tarjeta) => {
      let rafId = null;

      const resetear = () => {
        tarjeta.style.transform = "";
      };

      const mover = (event) => {
        const rect = tarjeta.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centroX = rect.width / 2;
        const centroY = rect.height / 2;

        const rotateY = ((x - centroX) / centroX) * 3.5;
        const rotateX = ((centroY - y) / centroY) * 3.5;

        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          tarjeta.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
      };

      tarjeta.addEventListener("mousemove", mover);
      tarjeta.addEventListener("mouseleave", resetear);
      tarjeta.addEventListener("blur", resetear);
    });
  }

  /* =========================
     ENTRADA SUAVE BOTONES FLOTANTES
  ========================= */
  function initEntradaBotonesFlotantes() {
    const contenedor = $(".botones-flotantes");
    if (!contenedor) return;

    if (reduceMotion) {
      contenedor.style.opacity = "1";
      contenedor.style.transform = "none";
      return;
    }

    contenedor.style.opacity = "0";
    contenedor.style.transform = "translateY(24px) scale(0.94)";

    const mostrar = () => {
      contenedor.style.transition =
        "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      contenedor.style.opacity = "1";
      contenedor.style.transform = "translateY(0) scale(1)";
    };

    window.requestAnimationFrame(() => {
      setTimeout(mostrar, 220);
    });
  }
})();

/* =========================================================
   SOO CURVY TALLAS EXTRAS
   NUEVA SECCIÓN
   LOOKS QUE CAMBIAN CONTIGO
========================================================= */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    initCambioLooks();
  });

  function initCambioLooks() {
    const slider = $("#sliderLooks");
    const imagenes = $$(".cambio-looks__imagen", slider);
    const prev = $("#looksPrev");
    const next = $("#looksNext");
    const wipeLine = $(".cambio-looks__wipe-line", slider);
    const dots = $$(".cambio-looks__dot");
    const cards = $$(".look-card");

    if (!slider || !imagenes.length || !prev || !next || !wipeLine || !dots.length || !cards.length) {
      return;
    }

    const state = {
      index: Math.max(
        0,
        imagenes.findIndex((img) => img.classList.contains("is-active"))
      ),
      total: imagenes.length,
      autoplayDelay: reduceMotion ? 6500 : 3600,
      autoplayId: null,
      paused: false,
      isAnimating: false,
      touchStartX: 0,
      touchEndX: 0,
      isTouching: false
    };

    if (state.index < 0) state.index = 0;

    const lookMap = imagenes.map((img) => img.dataset.look || "");

    function getImageByIndex(index) {
      return imagenes[index] || null;
    }

    function getLookNameByIndex(index) {
      return lookMap[index] || "";
    }

    function actualizarCards(index) {
      const lookActivo = getLookNameByIndex(index);

      cards.forEach((card) => {
        const coincide = card.dataset.lookInfo === lookActivo;
        card.classList.toggle("is-active", coincide);
        card.classList.toggle("is-inactive", !coincide);
        card.setAttribute("aria-current", coincide ? "true" : "false");
      });
    }

    function actualizarDots(index) {
      dots.forEach((dot, i) => {
        const activo = i === index;
        dot.classList.toggle("is-active", activo);
        dot.setAttribute("aria-current", activo ? "true" : "false");
      });
    }

    function posicionInicialImagenes() {
      imagenes.forEach((img, i) => {
        img.classList.toggle("is-active", i === state.index);
        img.classList.remove("is-reveal");
        img.style.zIndex = i === state.index ? "2" : "1";
        img.style.clipPath = "";
      });

      actualizarDots(state.index);
      actualizarCards(state.index);
    }

    function animarWipeLine() {
      if (reduceMotion) return;

      wipeLine.classList.remove("is-animating");
      void wipeLine.offsetWidth;
      wipeLine.classList.add("is-animating");
    }

    function limpiarImagenesDespuesDeAnimar(indexActivo) {
      imagenes.forEach((img, i) => {
        img.classList.toggle("is-active", i === indexActivo);
        img.classList.remove("is-reveal");
        img.style.zIndex = i === indexActivo ? "2" : "1";
        img.style.clipPath = "";
      });
    }

    function irA(indexDestino) {
      if (state.isAnimating) return;
      if (indexDestino === state.index) return;

      const actual = getImageByIndex(state.index);
      const siguiente = getImageByIndex(indexDestino);

      if (!actual || !siguiente) return;

      state.isAnimating = true;

      actualizarDots(indexDestino);
      actualizarCards(indexDestino);

      if (reduceMotion) {
        actual.classList.remove("is-active", "is-reveal");
        siguiente.classList.add("is-active");
        siguiente.classList.remove("is-reveal");

        state.index = indexDestino;
        state.isAnimating = false;
        return;
      }

      const ancho = siguiente.getBoundingClientRect().width || 400;

      siguiente.classList.add("is-reveal");
      siguiente.classList.remove("is-active");
      siguiente.style.zIndex = "3";
      siguiente.style.clipPath = `inset(0 ${ancho}px 0 0)`;

      actual.classList.add("is-active");
      actual.style.zIndex = "2";

      animarWipeLine();

      requestAnimationFrame(() => {
        siguiente.style.transition =
          "clip-path 0.95s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease, visibility 0.25s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
        siguiente.style.clipPath = "inset(0 0 0 0)";
      });

      setTimeout(() => {
        state.index = indexDestino;
        limpiarImagenesDespuesDeAnimar(state.index);
        state.isAnimating = false;
      }, 360);
    }

    function siguiente() {
      const nuevo = (state.index + 1) % state.total;
      irA(nuevo);
    }

    function anterior() {
      const nuevo = (state.index - 1 + state.total) % state.total;
      irA(nuevo);
    }

    function detenerAutoplay() {
      if (state.autoplayId) {
        clearInterval(state.autoplayId);
        state.autoplayId = null;
      }
    }

    function iniciarAutoplay() {
      detenerAutoplay();

      if (state.total <= 1) return;

      state.autoplayId = setInterval(() => {
        if (document.hidden || state.paused || state.isAnimating) return;
        siguiente();
      }, state.autoplayDelay);
    }

    function reiniciarAutoplay() {
      detenerAutoplay();
      iniciarAutoplay();
    }

    function bindControles() {
      next.addEventListener("click", () => {
        siguiente();
        reiniciarAutoplay();
      });

      prev.addEventListener("click", () => {
        anterior();
        reiniciarAutoplay();
      });

      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          if (i === state.index) return;
          irA(i);
          reiniciarAutoplay();
        });
      });

      cards.forEach((card) => {
        card.addEventListener("click", () => {
          const look = card.dataset.lookInfo;
          const index = lookMap.findIndex((item) => item === look);

          if (index < 0 || index === state.index) return;

          irA(index);
          reiniciarAutoplay();
        });
      });
    }

    function bindHoverPause() {
      slider.addEventListener("mouseenter", () => {
        state.paused = true;
      });

      slider.addEventListener("mouseleave", () => {
        state.paused = false;
      });

      slider.addEventListener("focusin", () => {
        state.paused = true;
      });

      slider.addEventListener("focusout", () => {
        state.paused = false;
      });
    }

    function bindKeyboard() {
      slider.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          siguiente();
          reiniciarAutoplay();
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          anterior();
          reiniciarAutoplay();
        }

        if (event.key === "Home") {
          event.preventDefault();
          irA(0);
          reiniciarAutoplay();
        }

        if (event.key === "End") {
          event.preventDefault();
          irA(state.total - 1);
          reiniciarAutoplay();
        }
      });
    }

    function bindTouch() {
      slider.addEventListener(
        "touchstart",
        (event) => {
          if (!event.touches || !event.touches.length) return;
          state.touchStartX = event.touches[0].clientX;
          state.touchEndX = state.touchStartX;
          state.isTouching = true;
        },
        { passive: true }
      );

      slider.addEventListener(
        "touchmove",
        (event) => {
          if (!state.isTouching || !event.touches || !event.touches.length) return;
          state.touchEndX = event.touches[0].clientX;
        },
        { passive: true }
      );

      slider.addEventListener(
        "touchend",
        () => {
          if (!state.isTouching) return;

          const distancia = state.touchStartX - state.touchEndX;
          const umbral = 50;

          if (distancia > umbral) {
            siguiente();
            reiniciarAutoplay();
          } else if (distancia < -umbral) {
            anterior();
            reiniciarAutoplay();
          }

          state.isTouching = false;
          state.touchStartX = 0;
          state.touchEndX = 0;
        },
        { passive: true }
      );
    }

    function bindVisibility() {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          detenerAutoplay();
        } else {
          iniciarAutoplay();
        }
      });
    }

    function bindResize() {
      let resizeTimeout = null;

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          limpiarImagenesDespuesDeAnimar(state.index);
        }, 80);
      });
    }

    function bindAccesibilidadCards() {
      cards.forEach((card) => {
        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            const look = card.dataset.lookInfo;
            const index = lookMap.findIndex((item) => item === look);

            if (index < 0 || index === state.index) return;

            irA(index);
            reiniciarAutoplay();
          }
        });
      });
    }

    posicionInicialImagenes();
    bindControles();
    bindHoverPause();
    bindKeyboard();
    bindTouch();
    bindVisibility();
    bindResize();
    bindAccesibilidadCards();
    iniciarAutoplay();

    window.sooCurvyLooks = {
      next: () => {
        siguiente();
        reiniciarAutoplay();
      },
      prev: () => {
        anterior();
        reiniciarAutoplay();
      },
      goTo: (index) => {
        const destino = Math.max(0, Math.min(index, state.total - 1));
        irA(destino);
        reiniciarAutoplay();
      },
      pause: () => {
        state.paused = true;
      },
      play: () => {
        state.paused = false;
        reiniciarAutoplay();
      },
      refresh: () => {
        limpiarImagenesDespuesDeAnimar(state.index);
        actualizarDots(state.index);
        actualizarCards(state.index);
      }
    };
  }
})();

/* =========================================================
   SOO CURVY TALLAS EXTRAS
   JAVASCRIPT - PARTE 3 DE 4
   Carrusel / galería de productos
========================================================= */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  document.addEventListener("DOMContentLoaded", () => {
    initCarruselGaleria();
  });

  function initCarruselGaleria() {
    const track = $("#galeriaTrack");
    const btnPrev = $("#galeriaPrev");
    const btnNext = $("#galeriaNext");
    const viewport = $(".galeria-productos__viewport");

    if (!track || !btnPrev || !btnNext || !viewport) return;

    const slides = $$(".producto-card", track);
    if (!slides.length) return;

    const state = {
      index: 0,
      slidesPorVista: 4,
      maxIndex: 0,
      slideWidth: 0,
      gap: 20,
      touchStartX: 0,
      touchEndX: 0,
      isDragging: false
    };

    function obtenerGap() {
      const estilosTrack = window.getComputedStyle(track);
      const gap = parseFloat(estilosTrack.gap || estilosTrack.columnGap || "20");
      return Number.isNaN(gap) ? 20 : gap;
    }

    function obtenerSlidesPorVista() {
      const ancho = window.innerWidth;

      if (ancho <= 576) return 1;
      if (ancho <= 768) return 2;
      if (ancho <= 992) return 2;
      if (ancho <= 1200) return 3;
      return 4;
    }

    function calcularMedidas() {
      const primerSlide = slides[0];
      if (!primerSlide) return;

      state.gap = obtenerGap();
      state.slidesPorVista = obtenerSlidesPorVista();

      const slideRect = primerSlide.getBoundingClientRect();
      state.slideWidth = slideRect.width;

      state.maxIndex = Math.max(0, slides.length - state.slidesPorVista);

      if (state.index > state.maxIndex) {
        state.index = state.maxIndex;
      }
    }

    function actualizarBotones() {
      const desactivarPrev = state.index <= 0;
      const desactivarNext = state.index >= state.maxIndex;

      btnPrev.disabled = desactivarPrev;
      btnNext.disabled = desactivarNext;

      btnPrev.setAttribute("aria-disabled", String(desactivarPrev));
      btnNext.setAttribute("aria-disabled", String(desactivarNext));

      btnPrev.style.opacity = desactivarPrev ? "0.45" : "1";
      btnNext.style.opacity = desactivarNext ? "0.45" : "1";

      btnPrev.style.pointerEvents = desactivarPrev ? "none" : "auto";
      btnNext.style.pointerEvents = desactivarNext ? "none" : "auto";
    }

    function actualizarCarrusel(animar = true) {
      calcularMedidas();

      const desplazamiento = state.index * (state.slideWidth + state.gap);

      if (!animar) {
        const transicionAnterior = track.style.transition;
        track.style.transition = "none";
        track.style.transform = `translateX(-${desplazamiento}px)`;

        requestAnimationFrame(() => {
          track.style.transition = transicionAnterior || "";
        });
      } else {
        track.style.transform = `translateX(-${desplazamiento}px)`;
      }

      actualizarBotones();
      actualizarA11ySlides();
    }

    function actualizarA11ySlides() {
      slides.forEach((slide, i) => {
        const visible =
          i >= state.index && i < state.index + state.slidesPorVista;

        slide.setAttribute("aria-hidden", visible ? "false" : "true");
        slide.tabIndex = visible ? 0 : -1;
      });
    }

    function moverSiguiente() {
      const paso = obtenerPaso();
      state.index = Math.min(state.index + paso, state.maxIndex);
      actualizarCarrusel();
    }

    function moverAnterior() {
      const paso = obtenerPaso();
      state.index = Math.max(state.index - paso, 0);
      actualizarCarrusel();
    }

    function obtenerPaso() {
      if (window.innerWidth <= 576) return 1;
      if (window.innerWidth <= 992) return 1;
      return state.slidesPorVista;
    }

    function irAIndice(indice, animar = true) {
      state.index = Math.max(0, Math.min(indice, state.maxIndex));
      actualizarCarrusel(animar);
    }

    btnNext.addEventListener("click", moverSiguiente);
    btnPrev.addEventListener("click", moverAnterior);

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moverSiguiente();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moverAnterior();
      }
    });

    viewport.setAttribute("tabindex", "0");

    /* =========================
       SWIPE / TOUCH
    ========================= */
    function onTouchStart(event) {
      if (!event.touches || !event.touches.length) return;
      state.touchStartX = event.touches[0].clientX;
      state.touchEndX = state.touchStartX;
      state.isDragging = true;
    }

    function onTouchMove(event) {
      if (!state.isDragging || !event.touches || !event.touches.length) return;
      state.touchEndX = event.touches[0].clientX;
    }

    function onTouchEnd() {
      if (!state.isDragging) return;

      const distancia = state.touchStartX - state.touchEndX;
      const umbral = 50;

      if (distancia > umbral) {
        moverSiguiente();
      } else if (distancia < -umbral) {
        moverAnterior();
      }

      state.isDragging = false;
    }

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });

    /* =========================
       DRAG CON MOUSE
    ========================= */
    let mouseDownX = 0;
    let mouseUpX = 0;
    let mouseDragging = false;

    function onMouseDown(event) {
      mouseDragging = true;
      mouseDownX = event.clientX;
      viewport.classList.add("is-dragging");
    }

    function onMouseUp(event) {
      if (!mouseDragging) return;

      mouseUpX = event.clientX;
      const distancia = mouseDownX - mouseUpX;
      const umbral = 60;

      if (distancia > umbral) {
        moverSiguiente();
      } else if (distancia < -umbral) {
        moverAnterior();
      }

      mouseDragging = false;
      viewport.classList.remove("is-dragging");
    }

    function onMouseLeave() {
      mouseDragging = false;
      viewport.classList.remove("is-dragging");
    }

    viewport.addEventListener("mousedown", onMouseDown);
    viewport.addEventListener("mouseup", onMouseUp);
    viewport.addEventListener("mouseleave", onMouseLeave);

    /* =========================
       REAJUSTE EN RESIZE
    ========================= */
    let resizeTimeout = null;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        calcularMedidas();
        actualizarCarrusel(false);
      }, 120);
    });

    /* =========================
       INICIALIZACIÓN
    ========================= */
    calcularMedidas();
    actualizarCarrusel(false);

    /* =========================
       API OPCIONAL GLOBAL
    ========================= */
    window.sooCurvyGaleria = {
      next: moverSiguiente,
      prev: moverAnterior,
      goTo: irAIndice,
      refresh: () => actualizarCarrusel(false)
    };
  }
})();


/* =========================================================
   SOO CURVY TALLAS EXTRAS
   JAVASCRIPT - PARTE 4 DE 4 (CORREGIDA)
   Microinteracciones finales + botones flotantes + TikTok
========================================================= */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    initBotonesInteractivos();
    initBurbujaWhatsapp();
    initHoverTikTokAvanzado();
    initAccesibilidadExtra();
  });

  /* =========================
     BOTONES CON MICROREBOTE
  ========================= */
  function initBotonesInteractivos() {
    const botones = $$(".boton, .boton-flotante, .control-carrusel");

    if (!botones.length || reduceMotion) return;

    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        boton.classList.remove("js-pop");
        void boton.offsetWidth;
        boton.classList.add("js-pop");

        setTimeout(() => {
          boton.classList.remove("js-pop");
        }, 380);
      });

      boton.addEventListener("mouseenter", () => {
        boton.style.willChange = "transform";
      });

      boton.addEventListener("mouseleave", () => {
        boton.style.willChange = "auto";
      });
    });

    insertarEstilosMicroInteracciones();
  }

  function insertarEstilosMicroInteracciones() {
    if ($("#estilosMicroInteracciones")) return;

    const style = document.createElement("style");
    style.id = "estilosMicroInteracciones";
    style.textContent = `
      .js-pop {
        animation: sooCurvyPop 0.38s cubic-bezier(0.22, 1, 0.36, 1);
      }

      @keyframes sooCurvyPop {
        0% { transform: scale(1); }
        35% { transform: scale(1.08); }
        60% { transform: scale(0.97); }
        100% { transform: scale(1); }
      }

      .boton-flotante--whatsapp.js-destacar {
        animation:
          sooCurvyWhatsappBounce 0.9s cubic-bezier(0.22,1,0.36,1),
          pulsoBurbuja 2.9s ease-in-out infinite;
      }

      @keyframes sooCurvyWhatsappBounce {
        0% { transform: translateY(0) scale(1); }
        20% { transform: translateY(-12px) scale(1.08); }
        40% { transform: translateY(2px) scale(0.96); }
        60% { transform: translateY(-6px) scale(1.03); }
        100% { transform: translateY(0) scale(1); }
      }

      .card-tiktok.js-hover-intenso .card-tiktok__overlay {
        opacity: 1 !important;
        transform: translateY(0) scale(1.02) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* =========================
     BURBUJA FIJA DE WHATSAPP
  ========================= */
  function initBurbujaWhatsapp() {
    const burbujaWhatsapp = $(".boton-flotante--whatsapp");
    if (!burbujaWhatsapp || reduceMotion) return;

    let ultimoScroll = window.scrollY;
    let timeoutDestacar = null;
    let permitidoAnimar = true;

    const destacar = () => {
      if (!permitidoAnimar) return;

      burbujaWhatsapp.classList.remove("js-destacar");
      void burbujaWhatsapp.offsetWidth;
      burbujaWhatsapp.classList.add("js-destacar");

      clearTimeout(timeoutDestacar);
      timeoutDestacar = setTimeout(() => {
        burbujaWhatsapp.classList.remove("js-destacar");
      }, 1100);
    };

    setTimeout(() => {
      destacar();
    }, 1400);

    setInterval(() => {
      if (document.hidden) return;
      destacar();
    }, 14000);

    window.addEventListener(
      "scroll",
      () => {
        const actual = window.scrollY;
        const diferencia = Math.abs(actual - ultimoScroll);

        if (actual > 500 && diferencia > 180) {
          destacar();
        }

        ultimoScroll = actual;
      },
      { passive: true }
    );

    burbujaWhatsapp.addEventListener("mouseenter", () => {
      permitidoAnimar = false;
      burbujaWhatsapp.classList.remove("js-destacar");
    });

    burbujaWhatsapp.addEventListener("mouseleave", () => {
      permitidoAnimar = true;
    });
  }

  /* =========================
     TIKTOK HOVER MEJORADO
  ========================= */
  function initHoverTikTokAvanzado() {
    const cardsTikTok = $$(".card-tiktok");

    if (!cardsTikTok.length || reduceMotion) return;

    cardsTikTok.forEach((card) => {
      const portada = $(".card-tiktok__portada-wrap", card);

      if (!portada) return;

      card.addEventListener("mouseenter", () => {
        card.classList.add("js-hover-intenso");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("js-hover-intenso");
        portada.style.transform = "";
      });

      card.addEventListener("mousemove", (event) => {
        const rect = portada.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 3;
        const rotateX = ((centerY - y) / centerY) * 3;

        portada.style.transform = `
          perspective(900px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-6px)
        `;
      });
    });
  }

  /* =========================
     ACCESIBILIDAD EXTRA
  ========================= */
  function initAccesibilidadExtra() {
    const focuseables = $$("a, button, [tabindex]");

    focuseables.forEach((el) => {
      el.addEventListener("keyup", (event) => {
        if (event.key === "Tab") {
          el.classList.add("js-focus-visible");
        }
      });

      el.addEventListener("blur", () => {
        el.classList.remove("js-focus-visible");
      });
    });

    if (!$("#estilosFocusVisible")) {
      const style = document.createElement("style");
      style.id = "estilosFocusVisible";
      style.textContent = `
        .js-focus-visible {
          outline: 3px solid rgba(183, 130, 255, 0.55);
          outline-offset: 4px;
        }
      `;
      document.head.appendChild(style);
    }

    $$('a[target="_blank"]').forEach((link) => {
      const rel = link.getAttribute("rel") || "";
      if (!rel.includes("noopener")) {
        link.setAttribute("rel", `${rel} noopener noreferrer`.trim());
      }
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  initSliderPrendas();
});

function initSliderPrendas() {
  const track = document.getElementById("prendasTrack");
  const prev = document.getElementById("prendasPrev");
  const next = document.getElementById("prendasNext");
  const viewport = document.getElementById("prendasViewport");

  if (!track || !prev || !next || !viewport) return;

  const cards = [...track.querySelectorAll(".card-prenda")];
  if (!cards.length) return;

  const state = {
    index: 0,
    visibles: 4,
    maxIndex: 0,
    cardWidth: 0,
    gap: 20
  };

  function getVisibles() {
    const w = window.innerWidth;
    if (w <= 576) return 1;
    if (w <= 992) return 2;
    if (w <= 1200) return 3;
    return 4;
  }

  function measure() {
    const first = cards[0];
    if (!first) return;

    const styles = window.getComputedStyle(track);
    state.gap = parseFloat(styles.gap || "20");
    state.cardWidth = first.getBoundingClientRect().width;
    state.visibles = getVisibles();
    state.maxIndex = Math.max(0, cards.length - state.visibles);

    if (state.index > state.maxIndex) {
      state.index = state.maxIndex;
    }
  }

  function update() {
    measure();
    const offset = state.index * (state.cardWidth + state.gap);
    track.style.transform = `translateX(-${offset}px)`;

    prev.disabled = state.index <= 0;
    next.disabled = state.index >= state.maxIndex;

    prev.style.opacity = state.index <= 0 ? "0.45" : "1";
    next.style.opacity = state.index >= state.maxIndex ? "0.45" : "1";

    prev.style.pointerEvents = state.index <= 0 ? "none" : "auto";
    next.style.pointerEvents = state.index >= state.maxIndex ? "none" : "auto";
  }

  function step() {
    return window.innerWidth <= 992 ? 1 : state.visibles;
  }

  next.addEventListener("click", () => {
    state.index = Math.min(state.index + step(), state.maxIndex);
    update();
  });

  prev.addEventListener("click", () => {
    state.index = Math.max(state.index - step(), 0);
    update();
  });

  let startX = 0;
  let endX = 0;

  viewport.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    const diff = startX - endX;

    if (diff > 50) {
      state.index = Math.min(state.index + 1, state.maxIndex);
      update();
    } else if (diff < -50) {
      state.index = Math.max(state.index - 1, 0);
      update();
    }

    startX = 0;
    endX = 0;
  });

  window.addEventListener("resize", () => {
    update();
  });

  update();
}