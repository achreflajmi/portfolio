/* Enhancement only. With this file blocked the page still reads, navigates
   and shows every fact — the run line simply stays unfilled and the section
   readout never appears (it is aria-hidden and duplicated by real headings).

   One scroll listener, one rAF per frame, and every layout read is cached
   outside the write phase so nothing thrashes. */

(function () {
  "use strict";

  var spine = document.querySelector(".spine");
  var tick = document.querySelector(".spine__tick");
  var bar = document.querySelector(".bar");
  var ind = document.querySelector("[data-ind]");
  var indN = document.querySelector("[data-ind-n]");
  var indT = document.querySelector("[data-ind-t]");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".bar__nav a"));

  var LABELS = {
    manifesto: "Principle",
    work: "Work",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    contact: "Contact",
  };

  /* ---- collect sections once ----------------------------------------- */

  var sections = [];
  Array.prototype.forEach.call(document.querySelectorAll("main section[id]"), function (el) {
    if (!el.querySelector("h2")) return; // the hero has no h2 and is not a stop
    sections.push({ el: el, id: el.id, label: LABELS[el.id] || el.id, top: 0 });
  });

  /* ---- read phase: cache everything that forces layout ---------------- */

  var docH = 0;
  var viewH = 0;
  var spineH = 0;

  function measure() {
    viewH = window.innerHeight;
    docH = document.documentElement.scrollHeight - viewH;
    spineH = spine ? spine.offsetHeight : 0;
    var pageTop = window.scrollY;
    for (var i = 0; i < sections.length; i++) {
      // absolute document offset, so the write phase never reads layout again
      sections[i].top = sections[i].el.getBoundingClientRect().top + pageTop;
    }
  }

  /* ---- write phase: transforms and text only -------------------------- */

  var lastIndex = -1;
  var queued = false;

  function paint() {
    queued = false;
    var y = window.scrollY;

    if (spine) {
      var p = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
      spine.style.setProperty("--progress", p.toFixed(4));
      if (tick) spine.style.setProperty("--tick", (p * spineH).toFixed(1) + "px");
      spine.classList.toggle("spine--live", y > 24);
      spine.classList.toggle("spine--past-gate", p > 0.42);
    }

    var past = y > viewH * 0.6;
    if (ind) ind.classList.toggle("ind--on", past);
    if (bar) bar.classList.toggle("bar--scrolled", past);

    if (past && sections.length) {
      var line = y + viewH * 0.35;
      var current = 0;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].top <= line) current = i;
      }
      if (current !== lastIndex) {
        lastIndex = current;
        var s = sections[current];
        if (indN) indN.textContent = String(current + 1).padStart(2, "0");
        if (indT) indT.textContent = s.label;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href").slice(1) === s.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      }
    } else if (lastIndex !== -1) {
      lastIndex = -1;
      navLinks.forEach(function (a) {
        a.removeAttribute("aria-current");
      });
    }
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  }

  function onResize() {
    measure();
    onScroll();
  }

  measure();
  paint();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  // images land late and change the document height
  window.addEventListener("load", onResize);
})();
