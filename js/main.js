// ABC Fitness Studio - Touchstone Task 3.1 (JavaScript Alerts Only)
// This file intentionally implements ONLY simple alert() placeholders as required by Task 3.1.
// Shopping cart logic and web storage will be implemented in Task 3.2.

(function () {
  "use strict";

  function textEquals(el, expected) {
    return (el && el.textContent || "").trim().toLowerCase() === expected.toLowerCase();
  }

  function wireSubscribeAlerts() {
    // Footer "Subscribe" buttons on all pages
    var subscribeButtons = document.querySelectorAll("footer form button[type='submit']");
    subscribeButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var form = btn.closest("form");
        // Use built-in HTML validation (required/email format)
        if (form && !form.checkValidity()) {
          // Show browser validation messages
          form.reportValidity();
          return;
        }
        e.preventDefault();
        alert("Thank you for subscribing.");
        if (form) form.reset();
      });
    });
  }

  function wireGalleryCartPlaceholderAlerts() {
    // Gallery: "Add to Cart" buttons (no cart logic required in Task 3.1)
    var addButtons = Array.from(document.querySelectorAll("main button.btn")).filter(function (b) {
      return textEquals(b, "Add to Cart");
    });

    addButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        alert("Item added to the cart.");
      });
    });

    var clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        alert("Cart cleared.");
      });
    }

    var processBtn = document.getElementById("processOrderBtn");
    if (processBtn) {
      processBtn.addEventListener("click", function () {
        alert("Thank you for your order.");
      });
    }
  }

  function wireContactFormAlert() {
    // About page: Submit button alert (use HTML required validation)
    var contactForm = document.querySelector("main form");
    if (!contactForm) return;

    var submitBtn = contactForm.querySelector("button[type='submit']");
    if (!submitBtn) return;

    submitBtn.addEventListener("click", function (e) {
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity(); // browser validation UI
        return;
      }
      e.preventDefault();
      alert("Thank you for your message.");
      contactForm.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireSubscribeAlerts();
    wireGalleryCartPlaceholderAlerts();
    wireContactFormAlert();
  });
})();
