/* Prairie Light Photography — motion layer (GSAP + ScrollTrigger) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var preloader = document.getElementById("preloader");

  function killPreloader() {
    if (preloader) preloader.style.display = "none";
  }

  /* If GSAP failed to load (or reduced motion), show everything plainly. */
  if (!window.gsap || reduceMotion) {
    killPreloader();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- preloader ---------------- */
  var preNum = document.getElementById("pre-num");
  var preFill = document.getElementById("pre-fill");

  var keyImages = [
    "https://picsum.photos/seed/prairie-elena/900/1200",
    "https://picsum.photos/seed/dawn-field/1800/1100",
    "https://picsum.photos/seed/amber-grain/1800/1100?grayscale"
  ];

  function preload(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = img.onerror = resolve;
      img.src = url;
    });
  }

  var progress = { v: 0 };
  function renderProgress() {
    var n = Math.round(progress.v);
    preNum.textContent = n;
    preFill.style.transform = "scaleX(" + progress.v / 100 + ")";
  }

  var minTime = new Promise(function (r) { setTimeout(r, 1500); });
  var loaded = Promise.all(keyImages.map(preload)).then(function () {
    return gsap.to(progress, { v: 100, duration: 0.6, ease: "power2.out", onUpdate: renderProgress });
  });
  /* ease the counter up while waiting so it never sits at 0 */
  gsap.to(progress, { v: 82, duration: 1.4, ease: "power1.out", onUpdate: renderProgress });

  Promise.all([minTime, loaded]).then(function () {
    var tl = gsap.timeline();
    tl.to(".pre-inner", { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" })
      .to(preloader, {
        yPercent: -100, duration: 0.9, ease: "power4.inOut",
        onComplete: killPreloader
      }, "-=0.1")
      .add(heroIntro, "-=0.55");
  });

  /* Safety: never trap the visitor behind the preloader. */
  setTimeout(function () {
    if (preloader && preloader.style.display !== "none") {
      killPreloader();
      heroIntro();
    }
  }, 8000);

  /* ---------------- hero intro ---------------- */
  gsap.set("[data-hero-line]", { yPercent: 110 });
  gsap.set("[data-hero-media]", { clipPath: "inset(100% 0 0 0)" });
  gsap.set("[data-hero-media] img", { scale: 1.35 });
  gsap.set("[data-hero]", { y: 26, opacity: 0 });

  function heroIntro() {
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to("[data-hero-line]", { yPercent: 0, duration: 1.2, stagger: 0.12 })
      .to("[data-hero-media]", { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power4.inOut" }, 0.15)
      .to("[data-hero-media] img", { scale: 1, duration: 1.6 }, 0.15)
      .to("[data-hero]", { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.5);
    return tl;
  }

  /* ---------------- scroll reveals ---------------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.fromTo(el,
      { y: 44, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
  });

  /* ---------------- parallax work images ---------------- */
  gsap.utils.toArray(".parallax").forEach(function (img) {
    var speed = parseFloat(img.getAttribute("data-speed")) || 10;
    gsap.fromTo(img,
      { yPercent: -speed / 2 },
      {
        yPercent: speed / 2, ease: "none",
        scrollTrigger: { trigger: img.closest(".work-media"), start: "top bottom", end: "bottom top", scrub: true }
      });
  });

  /* ---------------- pinned horizontal filmstrip (desktop) ---------------- */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", function () {
    var track = document.querySelector(".filmstrip-track");
    var viewport = document.querySelector(".filmstrip-viewport");
    if (!track || !viewport) return;
    var getDist = function () {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    };
    var tween = gsap.to(track, {
      x: function () { return -getDist(); },
      ease: "none",
      scrollTrigger: {
        trigger: ".filmstrip",
        start: "top top",
        end: function () { return "+=" + (getDist() + window.innerHeight * 0.4); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
    return function () { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
  });

  /* ---------------- custom cursor ---------------- */
  if (finePointer) {
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    var dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    var dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    var rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power2.out" });
    var ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power2.out" });
    window.addEventListener("mousemove", function (e) {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    });
    document.querySelectorAll("a, button, [data-cursor], .zoomable").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-hover"); });
    });
  } else {
    var cd = document.querySelector(".cursor-dot");
    var cr = document.querySelector(".cursor-ring");
    if (cd) cd.style.display = "none";
    if (cr) cr.style.display = "none";
  }

  /* ---------------- lightbox ---------------- */
  var zoomables = Array.prototype.slice.call(document.querySelectorAll(".zoomable"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var current = 0;

  function openLb(i) {
    current = (i + zoomables.length) % zoomables.length;
    var el = zoomables[current];
    lbImg.src = el.getAttribute("data-full") || el.src;
    lbImg.alt = el.alt || "";
    lbCap.textContent = el.getAttribute("data-caption") || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  zoomables.forEach(function (el, i) {
    el.addEventListener("click", function () { openLb(i); });
  });
  document.querySelector(".lb-close").addEventListener("click", closeLb);
  document.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); openLb(current - 1); });
  document.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); openLb(current + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  window.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(current - 1);
    if (e.key === "ArrowRight") openLb(current + 1);
  });

  /* ---------------- nav background on scroll ---------------- */
  var nav = document.getElementById("nav");
  ScrollTrigger.create({
    start: 80,
    onUpdate: function (self) { nav.classList.toggle("scrolled", self.scroll() > 80); },
    onToggle: function (self) { nav.classList.toggle("scrolled", self.isActive); }
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
