(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector("#site-nav");
  var year = document.querySelector("#year");
  var form = document.querySelector("#contact-form");
  var status = document.querySelector("#form-status");
  var interest = document.querySelector("#interest");
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  document.querySelectorAll("a[data-interest]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (!interest) return;
      interest.value = link.getAttribute("data-interest");
    });
  });

  var sections = Array.prototype.map
    .call(navLinks, function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var current = link.getAttribute("href") === "#" + entry.target.id;
            if (current) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var topic = String(data.get("interest") || "General inquiry").trim();
      var message = String(data.get("message") || "").trim();
      var subject = encodeURIComponent("Inquiry from " + name + " — " + topic);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nInterest: " + topic + "\n\n" + message
      );
      var mailto =
        "mailto:shelbyweltestories@gmail.com?subject=" + subject + "&body=" + body;

      if (status) {
        status.textContent =
          "Your email app is opening with this message to shelbyweltestories@gmail.com.";
      }

      window.location.href = mailto;
    });
  }

  if (header) {
    header.dataset.ready = "true";
  }
})();
