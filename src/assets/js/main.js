/* RONAC by Aquatia — interactions */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Countdown ---- */
  var cd = document.querySelector("[data-countdown]");
  if (cd) {
    var target = new Date(cd.getAttribute("data-countdown")).getTime();
    var fields = {
      d: cd.querySelector("[data-d]"),
      h: cd.querySelector("[data-h]"),
      m: cd.querySelector("[data-m]"),
      s: cd.querySelector("[data-s]")
    };
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) { diff = 0; }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (fields.d) fields.d.textContent = pad(d);
      if (fields.h) fields.h.textContent = pad(h);
      if (fields.m) fields.m.textContent = pad(m);
      if (fields.s) fields.s.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Cookie banner (lightweight, no external libs) ---- */
  var cookie = document.querySelector(".cookie");
  if (cookie) {
    var KEY = "ronac_cookie_consent";
    try {
      if (!localStorage.getItem(KEY)) {
        setTimeout(function () { cookie.classList.add("show"); }, 900);
      }
    } catch (e) { setTimeout(function () { cookie.classList.add("show"); }, 900); }
    cookie.querySelectorAll("[data-cookie]").forEach(function (b) {
      b.addEventListener("click", function () {
        try { localStorage.setItem(KEY, b.getAttribute("data-cookie")); } catch (e) {}
        cookie.classList.remove("show");
      });
    });
  }
})();
