/* Enhancement only. Everything below is additive: with this file blocked the
   page still reads, navigates and reveals every fact via hover and focus. */

(function () {
  "use strict";

  /* --- rail: mark the section you are actually in ------------------------ */

  var ticks = Array.prototype.slice.call(document.querySelectorAll(".rail__tick"));

  if (ticks.length && "IntersectionObserver" in window) {
    var byId = {};
    var targets = [];

    ticks.forEach(function (tick) {
      var id = tick.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = tick;
      targets.push(section);
    });

    var visible = new Set();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });

        // The topmost visible section wins, so the mark never flickers
        // between two sections straddling the viewport.
        var current = null;
        for (var i = 0; i < targets.length; i++) {
          if (visible.has(targets[i].id)) {
            current = targets[i].id;
            break;
          }
        }

        ticks.forEach(function (tick) {
          var id = tick.getAttribute("href").slice(1);
          if (id === current) tick.setAttribute("aria-current", "true");
          else tick.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );

    targets.forEach(function (section) {
      observer.observe(section);
    });
  }

})();
