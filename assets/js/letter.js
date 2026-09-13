(() => {
  "use strict";

  const qs = (selector, parent = document) => parent.querySelector(selector);

  function initTimeline() {
    const section = document.querySelector(".letter-section");
    if (!section) return;

    const content = section.querySelector(".content");
    const logo = section.querySelector(".logo-img");
    const husband = section.querySelector(".husband");
    const ampersand = section.querySelector(".ampersand");
    const wife = section.querySelector(".wife");
    const divider = section.querySelector(".divider-img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 95%",
        toggleActions: "play none none none",
      }
    });

    // =========================
    // Section intro
    // =========================
   

    tl.fromTo(
      content,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      }
    );

     tl.from(
      logo,
      {
        rotateY: -180,
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.2)",
        transformOrigin: "center center"
      },
      "-=0.5"
    );

    tl.fromTo(
      husband,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
      },
       "-=1"
    );

    tl.fromTo(
      ampersand,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      },
       "-=1"
    );

    tl.fromTo(
      wife,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
      },
       "-=1"
    );

    tl.fromTo(
      divider,
      {
        rotation: -120,
        scale: 0,
        opacity: 0
      },
      {
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.6)",
        transformOrigin: "50% 50%"
      },
      "-=0.4"
    );

    tl.fromTo(
      ".welcome",
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      },
       "-=0.8"
    );


    tl.fromTo(
      ".subtext",
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      },
       "-=0.8"
    );

    tl.fromTo(
      ".open-card",
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        clearProps: "filter"
      },
       "-=0.8"
    );



    
    // tl.from(date, { y: 100, opacity: 0 }, "-=0.4");
  }

  function initSwitchLanguage() {
    const letter = qs("#letter");
  
    letter.addEventListener("click", (e) => {
      e.preventDefault();
  
      Swal.fire({
        showConfirmButton: false,
        showCancelButton: false,
        showDenyButton: false,
        showCloseButton: false,
  
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster"
        },
        
        background: "#f8f6f2",
        backdrop: "rgba(0,0,0,0.4)",
  
        customClass: {
          popup: "wedding-lang-popup"
        },
  
        didOpen: () => {
          const container = Swal.getHtmlContainer();
  
          container.insertAdjacentHTML(
            "beforeend",
            `
            <div class="btn-group">
              <button id="btnVi" class="lang-btn">Tiếng việt</button>
              <button id="btnEn" class="lang-btn">English</button>
            </div>
            `
          );
  
          document.getElementById("btnVi").onclick = () => {
            Swal.close();
            window.location.href = "invitationvi.html";
          };
  
          document.getElementById("btnEn").onclick = () => {
            Swal.close();
            window.location.href = "invitationen.html";
          };
        }
      });
    });
  }

  function initAnimations() {
    const animationMap = {
      flip: gsapFlipIn,
      "flip-yoyo": gsapFlipInThenYoyo,

      "fade-in": gsapFadeIn,
      "fade-in-end": gsapFadeInForEnd,
      "fade-in-yoyo": gsapFadeInThenYoyo,
      "fade-in-pulse": gsapFadeInThenPulse,

      "fade-right": gsapFadeRight,
      "fade-left": gsapFadeLeft,
      "fade-up": gsapFadeUp,
      "fade-down": gsapFadeDown,

      "rotate-bl": gsapRotateBottomLeft,
      "rotate-br": gsapRotateBottomRight,
      "rotate-bl-yoyo": gsapRotateBottomLeftThenYoyo,
      "rotate-br-yoyo": gsapRotateBottomRightThenYoyo,

      "flip-vertical-left": gsapFlipVerticalLeft,
      "flip-vertical-bottom": gsapFlipVerticalBottom,

      "roll-in-left": gsapRollInLeft,
      "rotate-bl--float": gsap_rotate_bl__float,
    };

    document.querySelectorAll("[data-animate]").forEach((el) => {
      const type = el.dataset.animate;
      const fn = animationMap[type];

      if (!fn) {
        console.warn(`Animation "${type}" not found.`);
        return;
      }

      const options = {
        delay: parseFloat(el.dataset.animateDelay) || 0,
        duration: parseFloat(el.dataset.animateDuration) || 1,
        scrollStart: el.dataset.animateScrollStart || "top 85%",
      };

      fn(el, options);
    });
  }

  /* ======================================================
       BOOTSTRAP
    ====================================================== */

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    initAnimations();
    // initSwitchLanguage();
    initTimeline();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
