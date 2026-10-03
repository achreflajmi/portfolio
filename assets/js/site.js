/* Enhancement only. With this file blocked the page still reads, navigates
   and shows every fact — the spine simply stays unfilled.

   Two jobs: fill the run line to scroll position, and mark the section you
   are in. Both write only transform / custom properties, and all layout
   reads are batched outside the write phase (no thrashing). */

(function () {
  "use strict";

  var spine = document.querySelector(".spine");
  var tick = document.querySelector(".spine__tick");
  var links = Array.prototype.slice.call(document.querySelectorAll(".bar__nav a"));

  /* ---- run line: progress + tick ------------------------------------- */

  if (spine && tick) {
    var docH = 0;
    var viewH = 0;
    var spineH = 0;
    var queued = false;

    // read phase: cache everything that forces layout
    function measure() {
      viewH = window.innerHeight;
      docH = document.documentElement.scrollHeight - viewH;
      spineH = spine.offsetHeight;
    }

    // write phase: only custom properties feeding transforms
    function paint() {
      queued = false;
      var p = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      spine.style.setProperty("--progress", p.toFixed(4));
      spine.style.setProperty("--tick", (p * spineH).toFixed(1) + "px");
      spine.classList.toggle("spine--live", window.scrollY > 24);
      // past the gate, the tick carries the human colour
      spine.classList.toggle("spine--past-gate", p > 0.42);
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    }

    measure();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(
      "resize",
      function () {
        measure();
        onScroll();
      },
      { passive: true }
    );
  }

  /* ---- nav: mark the section you are actually in ---------------------- */

  if (links.length && "IntersectionObserver" in window) {
    var sections = [];
    links.forEach(function (link) {
      var el = document.getElementById(link.getAttribute("href").slice(1));
      if (el) sections.push(el);
    });

    var seen = new Set();

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        });

        // topmost visible section wins, so the mark never flickers
        var current = null;
        for (var i = 0; i < sections.length; i++) {
          if (seen.has(sections[i].id)) {
            current = sections[i].id;
            break;
          }
        }

        links.forEach(function (link) {
          if (link.getAttribute("href").slice(1) === current) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      io.observe(s);
    });
  }
})();
