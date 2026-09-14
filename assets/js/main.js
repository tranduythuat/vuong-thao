(() => {
  "use strict";

  /* ======================================================
       HELPERS
    ====================================================== */
  const qs = (selector, parent = document) => parent.querySelector(selector);

  const qsa = (selector, parent = document) =>
    parent.querySelectorAll(selector);

  let swiperInitialized = false;

  /* ======================================================
       SWIPER
    ====================================================== */

  function initSwiper() {
    if (swiperInitialized || typeof Swiper === "undefined") return;

    const mainSwiperEl = document.querySelector(".main-swiper");
    // const thumbSwiperEl = document.querySelector(".thumb-swiper");

    if (!mainSwiperEl) return;

    // const thumbSwiper = new Swiper(thumbSwiperEl, {
    //   spaceBetween: 10,
    //   slidesPerView: 4,
    //   freeMode: true,
    //   watchSlidesProgress: true,
    //   observer: true,
    //   observeParents: true,
    // });

    const mainSwiper = new Swiper(mainSwiperEl, {
      spaceBetween: 10,
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
      // thumbs: {
      //   swiper: thumbSwiper,
      // },
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: true,
      },
      loop: true,
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: 1000,
      observer: true,
      observeParents: true,
    });

    swiperInitialized = true;

    requestAnimationFrame(() => {
      mainSwiper.update();
      thumbSwiper.update();
    });
  }

  /* ======================================================
       MUSIC
    ====================================================== */

  function initMusic() {
    const audio = qs("#audio");
    const icon = qs("#iconSvg");
    const btn = qs("#player-btn");
    const label = qs("#musicLabel");

    let isOpen = true

    if (!audio || !icon || !btn || !label) return;
    audio.volume = 0.5

    // 👉 GSAP timeline cho label
    const tl = gsap.timeline({ paused: true });

    tl.to(label, {
      x: 200,
      // opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      pointerEvents: "none"
    });

    btn.addEventListener("click", () => {
      if (!audio.src) return;
      audio.paused ? audio.play() : audio.pause();

      // toggle label
      if (isOpen) {
        tl.play();
      } else {
        tl.reverse();
      }
      isOpen = !isOpen;
    });

    audio.addEventListener("play", () => icon.classList.add("spin"));
    audio.addEventListener("pause", () => icon.classList.remove("spin"));
  }

  async function loadGuest() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get("invite");
    if (!inviteCode)
      return;

    const response = await fetch(
      'https://opensheet.elk.sh/1wsd98a0CaDPlSIFLMPXab0oKKWiq4l8r0y6sJCWzhf8/T%C3%AAn%20kh%C3%A1ch%20m%E1%BB%9Di%20'
    );

    const data = await response.json();
    console.log('--- DATA ---', data);
    // Tìm khách mời
    const guest = data.find(
      row =>
        row.slug &&
        row.slug.trim() === inviteCode
    );

    // Đổ tên vào giao diện
    if (guest) {
      document.querySelector('.guest-name').textContent =
        guest.name;
    } else {
      document.querySelector('.guest-name').textContent =
        'Quý Khách';
    }
  }

  /* ======================================================
       DRESSCODE ANIMATION
    ====================================================== */

  function initDresscodeAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".dresscode",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".color1", { x: -100, opacity: 0, duration: 0.8 })
      .from(".color2", { x: -100, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".color3", { x: -100, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".color4", { x: -100, opacity: 0, duration: 0.8 }, "-=0.4");
  }

  function initPage() {
    const tl = gsap.timeline({ paused: true });
    const audio = document.querySelector("#audio");
    const openCard = document.getElementById("open-card");
    const params = new URLSearchParams(window.location.search);
    const isCardOpened = params.get("opened") === "1";

    let isLocked = false;
    let lockedScrollY = 0;

    function lockInteraction() {
      isLocked = true;
      lockedScrollY = window.scrollY;
      document.body.classList.add("page-locked");
      // Giữ trang đứng yên
      window.scrollTo(0, lockedScrollY);
    }

    function unlockInteraction() {
      isLocked = false;
      document.body.classList.remove("page-locked");
    }

    function preventInteraction(e) {
      if (!isLocked) return;

      e.preventDefault();
      e.stopPropagation();
    }

    // Chặn wheel
    window.addEventListener("wheel", preventInteraction, {
      passive: false,
    });

    // Chặn swipe trên mobile
    window.addEventListener("touchmove", preventInteraction, {
      passive: false,
    });

    // Giữ scroll position
    function preventScroll() {
      if (!isLocked) return;

      window.scrollTo(0, lockedScrollY);
    }

    window.addEventListener("scroll", preventScroll, {
      passive: false,
    });

    function markCardOpened() {
      const url = new URL(window.location.href);
      url.searchParams.set("opened", 1);
      window.history.replaceState({}, "", url);
    }

    if (isCardOpened) {
      gsap.set(".letter-section", { display: "none", opacity: 0 });
      gsap.set(".container", { display: "block", opacity: 1 });
      initSwiper();
      ScrollTrigger.refresh();
      return;
    }

    tl.set(".container", { display: "block", opacity: 1 })
      .set(".container .content", { opacity: 1 })
      .fromTo(".text-open, .click", { opacity: "1", y: 0, duration: .5 }, { opacity: "0", y: 120, duration: 1 }, "")
      // .to(".group-name", { opacity: "0", y: -120, duration: 1.5 }, "-=1")
      .to(".left", { x: -250, duration: 2.5 },)
      .to(".right", { x: 250, duration: 2.5 }, "<")
      .set(".click", { display: "none" },)
      .to(".letter-section", {
        opacity: 0,
      }, "-=.5")
      .set(".letter-section", { display: "none" },)
      .call(() => {
        // Unlock interactions right after letter is hidden so user can interact immediately.
        try {
          unlockInteraction();
          console.log("UNLOCK (letter hidden)", performance.now());
        } catch (err) {
          console.warn('unlockInteraction failed', err);
        }
      })
      .call(() => {
        console.log("TIMELINE COMPLETE", performance.now());

        initSwiper();
        initAnimations();

        console.log("INIT ANIMATIONS COMPLETE", performance.now());

        if (window.ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
          ScrollTrigger.refresh();
          console.log("REFRESH COMPLETE", performance.now());
        }
      })
    // .to(".container .content", {
    //   onComplete: () => {

    //   }
    // });

    if (!openCard) return;

    openCard.addEventListener("click", (e) => {
      if (isLocked) return;
      markCardOpened();

      lockInteraction();

      if (audio && audio.paused) {
        audio.volume = 0.5
        audio.play().catch(err => {
          console.log("Autoplay blocked:", err);
        });
      }
      tl.play();
    });
  }

  function initLetterAnimation() {
    const section = qs(".letter-section");
    if (!section) return;

    const content = section.querySelector(".content");
    const letter = section.querySelector(".letter");
    const invitation = section.querySelector(".invitation");
    const joinUs = section.querySelector(".join-us");
    const coupleName = section.querySelector(".couple-name");
    const handClick = section.querySelector(".hand-click");

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
    tl.fromTo(
      letter,
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

    tl.from(
      invitation,
      {
        x: -120,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.2)",
        transformOrigin: "center center"
      },
      "-=0.5"
    );

    tl.fromTo(
      joinUs,
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
      coupleName,
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

    if (handClick) {
      tl.fromTo(
        handClick,
        { opacity: 0, scale: 0.5, y: -10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Sau khi xuất hiện xong thì bắt đầu nhấp nhô liên tục
            gsap.to(handClick, {
              scale: "+=0.1",
              duration: 0.8,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true
            });
          }
        },
        "-=0.3"
      );
    }

    // tl.fromTo(
    //   wife,
    //   { opacity: 0, x: 30 },
    //   {
    //     opacity: 1,
    //     x: 0,
    //     duration: 1,
    //     ease: "power2.out",
    //   },
    //   "-=1"
    // );

    // tl.fromTo(
    //   divider,
    //   {
    //     rotation: -120,
    //     scale: 0,
    //     opacity: 0
    //   },
    //   {
    //     rotation: 0,
    //     scale: 1,
    //     opacity: 1,
    //     duration: 1.2,
    //     ease: "back.out(1.6)",
    //     transformOrigin: "50% 50%"
    //   },
    //   "-=0.4"
    // );

    // tl.fromTo(
    //   ".welcome",
    //   { opacity: 0, y: 50, filter: "blur(10px)" },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     filter: "blur(0px)",
    //     duration: 1,
    //     ease: "power2.out",
    //     clearProps: "filter"
    //   },
    //   "-=0.8"
    // );


    // tl.fromTo(
    //   ".subtext",
    //   { opacity: 0, y: 50, filter: "blur(10px)" },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     filter: "blur(0px)",
    //     duration: 1,
    //     ease: "power2.out",
    //     clearProps: "filter"
    //   },
    //   "-=0.8"
    // );



    // tl.fromTo(
    //   ".open-card",
    //   { opacity: 0, y: 50, filter: "blur(10px)" },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     filter: "blur(0px)",
    //     duration: 1,
    //     ease: "power2.out",
    //     clearProps: "filter"
    //   },
    //   "-=0.8"
    // );
    // tl.from(date, { y: 100, opacity: 0 }, "-=0.4");
  }

  /* ======================================================
       TIMELINE ANIMATION
    ====================================================== */

  function initTimeline() {
    const section = document.querySelector(".timeline");
    if (!section) return;

    const content = section.querySelector(".timeline-container");
    // const bg = section.querySelector(".cover-bg");
    // const divider = section.querySelector(".divider-flower");
    // const title = section.querySelector(".timeline-title");
    const items = section.querySelectorAll(".timeline-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse",
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

    // tl.from(
    //   bg,
    //   {
    //     rotateY: -180,
    //     scale: 0.8,
    //     opacity: 0,
    //     duration: 1.8,
    //     ease: "back.out(1.2)",
    //     transformOrigin: "center center"
    //   },
    //   "-=0.5"
    // );

    // tl.from([divider, title], {
    //   opacity: 0,
    //   y: 40,
    //   duration: 0.8,
    //   stagger: 0.15,
    //   ease: "power2.out"
    // }, "-=1.5");

    // =========================
    // Animate từng item theo thứ tự
    // =========================
    items.forEach((item, index) => {
      const label = item.querySelector(".event-name");
      const icon = item.querySelector(".icon-animate");
      const time = item.querySelector(".event-time");
      const overlap = index === 0 ? 0 : 0.2 + index * 0.1;

      // Item fade
      tl.from(
        item,
        {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power2.out"
        },
        `-=1.5`
      );

      // Time fade
      if (label) {
        tl.from(
          label,
          {
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "power2.out"
          },
          "<0.2"
        );
      }

      // Icon pop
      if (icon) {
        tl.from(
          icon,
          {
            scale: 0,
            rotation: -220,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.6)"
          },
          "<0.5"
        );
      }

      // Time fade
      if (time) {
        tl.from(
          time,
          {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: "power2.out"
          },
          "<0.5"
        );
      }


    });
  }

  /* ======================================================
       FAQ
    ====================================================== */

  function initFAQ() {
    const items = qsa(".faq-item");

    function openItem(el) {
      const content = qs(".faq-content", el);
      const icon = qs(".icon", el);
      if (!content || !icon) return;

      el.classList.add("active");

      gsap.to(content, { height: "auto", duration: 0.4, ease: "power2.out" });
      gsap.to(icon, {
        rotate: 180,
        duration: 0.3,
        onComplete: () => (icon.textContent = "−"),
      });
    }

    function closeItem(el) {
      const content = qs(".faq-content", el);
      const icon = qs(".icon", el);
      if (!content || !icon) return;

      el.classList.remove("active");

      gsap.to(content, { height: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(icon, {
        rotate: 0,
        duration: 0.3,
        onComplete: () => (icon.textContent = "+"),
      });
    }

    items.forEach((item) => {
      const header = qs(".faq-header", item);
      const content = qs(".faq-content", item);
      if (!header) return;

      if (item.classList.contains("active")) {
        gsap.set(content, { height: "auto" });
      }

      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        items.forEach((el) => {
          if (el !== item) closeItem(el);
        });

        isOpen ? closeItem(item) : openItem(item);
      });
    });
  }

  /* ======================================================
       COUNTDOWN
    ====================================================== */

  function startCountdown(targetDate) {
    const daysEl = qs("#days");
    const hoursEl = qs("#hours");
    const minsEl = qs("#mins");
    const secsEl = qs("#secs");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const timer = setInterval(update, 1000);
    update();

    function update() {
      const distance = targetDate - Date.now();

      if (distance <= 0) {
        clearInterval(timer);
        daysEl.textContent =
          hoursEl.textContent =
          minsEl.textContent =
          secsEl.textContent =
          "00";
        return;
      }

      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const mins = Math.floor((distance % 3600000) / 60000);
      const secs = Math.floor((distance % 60000) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(mins).padStart(2, "0");
      secsEl.textContent = String(secs).padStart(2, "0");
    }
  }

  /* ======================================================
       RSVP
    ====================================================== */

  function clearRSVPValidationUI(form) {
    form.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("is-invalid");
      const messageEl = group.querySelector(".field-error-message");
      if (messageEl) {
        messageEl.textContent = "";
      }
    });
  }

  function renderRSVPValidationUI(form, validation) {
    clearRSVPValidationUI(form);

    validation.errors.forEach(({ field, message }) => {
      const selectorMap = {
        confirm: ".form-group.confirm",
        name: ".form-group.name",
        guest_info: ".form-group.guest-info",
        related: ".form-group.related",
        note: ".form-group.note",
      };
      const group = form.querySelector(selectorMap[field] || `.form-group.${field}`);
      if (!group) return;

      group.classList.add("is-invalid");
      const messageEl = group.querySelector(".field-error-message");
      if (messageEl) {
        messageEl.textContent = message;
      }
    });
  }

  function bindRSVPFieldEvents(form) {
    const clearFieldError = (target) => {
      const group = target.closest(".form-group");
      if (!group) return;

      group.classList.remove("is-invalid");
      const messageEl = group.querySelector(".field-error-message");
      if (messageEl) {
        messageEl.textContent = "";
      }
    };

    form.addEventListener("input", (e) => {
      const target = e.target;
      if (target.matches("textarea, input[type='text'], input[type='number']")) {
        clearFieldError(target);
      }
    });

    form.addEventListener("change", (e) => {
      if (e.target.matches('input[name="confirm"], input[name="related"]')) {
        clearFieldError(e.target);
      }

      if (e.target.matches('input[name="related"]')) {
        const selectedValue = form.querySelector('input[name="related"]:checked')?.value?.trim().toLowerCase();
        if (selectedValue === "no" || selectedValue === "không") {
          const noteGroup = form.querySelector('.form-group.note');
          if (noteGroup) {
            noteGroup.classList.remove('is-invalid');
            const messageEl = noteGroup.querySelector('.field-error-message');
            if (messageEl) {
              messageEl.textContent = '';
            }
          }
        }
      }
    });
  }

  function validateRSVPForm(form, data, lang = "vi") {
    const messages = {
      vi: {
        title: "Thiếu thông tin",
        general: "Vui lòng điền đầy đủ thông tin bắt buộc trước khi gửi.",
        missingSelection: "Vui lòng chọn một lựa chọn về việc tham dự.",
        missingName: "Vui lòng nhập tên khách mời tham dự.",
        missingGuestInfo: "Vui lòng cung cấp thông tin liên hệ.",
        missingRelated: "Vui lòng cho biết có hạn chế hoặc dị ứng về ẩm thực hay không.",
        missingNote: "Vui lòng ghi rõ thêm thông tin hoặc yêu cầu.",
      },
      en: {
        title: "Missing information",
        general: "Please complete all required fields before submitting.",
        missingSelection: "Please select your availability.",
        missingName: "Please enter the name of the attending guest.",
        missingGuestInfo: "Please provide your contact information.",
        missingRelated: "Please let us know whether you have any dietary restrictions or allergies.",
        missingNote: "Please specify any additional notes or requests.",
      },
    };

    const t = messages[lang] || messages.vi;
    const errors = [];
    const selectedConfirm = form.querySelector('input[name="confirm"]:checked');
    const isCannotAttend = selectedConfirm?.id === "confirm-no";
    const relatedValue = String(data.related || "").trim().toLowerCase();
    const isRelatedNo = relatedValue === "no" || relatedValue === "không";

    if (!selectedConfirm) {
      errors.push({ field: "confirm", message: t.missingSelection });
    }

    if (!String(data.name || "").trim()) {
      errors.push({ field: "name", message: t.missingName });
    }

    if (!isCannotAttend) {
      if (!String(data.guest_info || "").trim()) {
        errors.push({ field: "guest_info", message: t.missingGuestInfo });
      }

      if (!String(data.related || "").trim()) {
        errors.push({ field: "related", message: t.missingRelated });
      }

      if (!isRelatedNo && !String(data.note || "").trim()) {
        errors.push({ field: "note", message: t.missingNote });
      }
    }

    return {
      isValid: errors.length === 0,
      message: errors.length
        ? `${t.general}\n\n- ${errors.map((error) => error.message).join("\n- ")}`
        : "",
      errors,
    };
  }

  async function handleFormSubmit(e, code = "", lang = "vi") {
    e.preventDefault();
    // const form = document.forms["rsvpForm"];

    // form.addEventListener("submit", (e) => {
    //   e.preventDefault();

    //   const data = new FormData(form);
    //   console.log(Object.fromEntries(data));
    // });

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!form) {
      return;
    }

    const {
      name,
      confirm,
      guest_number,
      wish,
    } = data;

    // =========================
    // i18n Messages
    // =========================
    const messages = {
      vi: {
        sendingTitle: "Đang gửi...",
        sendingText: "Vui lòng chờ trong giây lát",
        successTitle: "Thành công!",
        successText:
          "Cảm ơn bạn đã xác nhận. Thông tin đã được chuyển đến cô dâu và chú rể rồi nha.",
        errorTitle: "Lỗi!",
        errorServer: "OPPS! Không tìm thấy server",
        errorRetry: "Thử lại",
      },
      en: {
        sendingTitle: "Sending...",
        sendingText: "Please wait a moment",
        successTitle: "Success!",
        successText:
          "Thank you for your confirmation. Your information has been forwarded to the bride and groom.",
        errorTitle: "Error!",
        errorServer: "OPPS! Server not found",
        errorRetry: "Try again",
      },
    };

    const t = messages[lang] || messages.vi;
    // const validation = validateRSVPForm(form, data, lang);
    // renderRSVPValidationUI(form, validation);

    // if (!validation.isValid) {
    //   return;
    // }

    // =========================
    // Loading popup
    // =========================
    Swal.fire({
      title: t.sendingTitle,
      text: t.sendingText,
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // const SHEET_ENDPOINTS = {
    //   nha_gai: "https://script.google.com/macros/s/AKfycbyxsV_F4MTOm7s-o9pbQQ2zi56-NcS4f86Q0GHKhPtknSRvlHJCzTVP9cc1hN1F3Tqcxg/exec?sheet=nha-gai",
    //   nha_trai_209: "https://script.google.com/macros/s/AKfycbyxsV_F4MTOm7s-o9pbQQ2zi56-NcS4f86Q0GHKhPtknSRvlHJCzTVP9cc1hN1F3Tqcxg/exec?sheet=nha-trai-20-9",
    //   nha_trai_219: "https://script.google.com/macros/s/AKfycbyxsV_F4MTOm7s-o9pbQQ2zi56-NcS4f86Q0GHKhPtknSRvlHJCzTVP9cc1hN1F3Tqcxg/exec?sheet=nha-trai-21-9",
    // };

    // let sheetURL = SHEET_ENDPOINTS[code] || SHEET_ENDPOINTS['nha_gai'];
    let sheetURL = "?sheet=confirm";

    try {
      const res = await fetch(sheetURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name,
          confirm,
          guest_number,
          wish,
        }),
      });

      // Nếu server lỗi HTTP
      if (!res.ok) {
        throw new Error("Server response not OK");
      }

      const result = await res.json().catch(() => null);

      if (!result) {
        Swal.fire({
          title: t.errorTitle,
          text: t.errorServer,
          icon: "error",
          confirmButtonText: t.errorRetry,
          confirmButtonColor: "#3c7fc2",
        });
        return;
      }

      form.reset();
      clearRSVPValidationUI(form);

      Swal.fire({
        title: t.successTitle,
        text: t.successText,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3c7fc2",
      });
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        title: t.errorTitle,
        text: error.message || t.errorServer,
        icon: "error",
        confirmButtonText: t.errorRetry,
        confirmButtonColor: "#3c7fc2",
      });
    }
  }

  function initRSVP() {
    const form = document.forms["rsvpForm"];

    if (form) {
      // bindRSVPFieldEvents(form);
      form.addEventListener("submit", (e) => handleFormSubmit(e, "", "en"));
    }
  }

  function initAnimations() {
    const animationMap = {
      "flip": gsapFlipIn,
      "flip-yoyo": gsapFlipInThenYoyo,

      "fade-in": gsapFadeIn,
      "fade-in-end": gsapFadeInForEnd,
      "fade-in-yoyo": gsapFadeInThenYoyo,
      "fade-in-pulse": gsapFadeInThenPulse,

      "zoom-in": gsapZoomIn,
      "zoom-out": gsapZoomOut,

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
      "roll-in-right": gsapRollInRight,
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
    // initPage();
    // initLetterAnimation();
    initAnimations();
    initSwiper();
    // loadGuest();
    initMusic();
    // initDresscodeAnimation();
    initTimeline();
    // initFAQ();
    initRSVP();
    // startCountdown(new Date("2026-09-19T11:00:00"));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
