/* Enhancement only. With this file blocked the page still reads, navigates
   and shows every fact. */

(function () {
  "use strict";

  var links = Array.prototype.slice.call(document.querySelectorAll(".bar__nav a"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  var targets = [];
  links.forEach(function (link) {
    var section = document.getElementById(link.getAttribute("href").slice(1));
    if (section) targets.push(section);
  });

  var visible = new Set();

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // topmost visible section wins, so the mark never flickers between two
      var current = null;
      for (var i = 0; i < targets.length; i++) {
        if (visible.has(targets[i].id)) {
          current = targets[i].id;
          break;
        }
      }

      links.forEach(function (link) {
        if (link.getAttribute("href").slice(1) === current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
  );

  targets.forEach(function (s) {
    observer.observe(s);
  });
})();
