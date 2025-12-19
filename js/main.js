// ABC Fitness Studio - Touchstone Task 3.2 (Web Storage)
// Implements:
// - Subscribe alerts on all pages
// - Shopping cart using sessionStorage on Gallery page (Add to Cart, View Cart modal, Clear Cart, Process Order)
// - Custom order form saving to localStorage on About Us/Contact page

(function () {
  "use strict";

  var CART_KEY = "abc_cart";
  var ORDER_KEY = "abc_custom_orders";
  var LAST_ORDER_KEY = "abc_last_order";

  function readJson(storage, key, fallback) {
    try {
      var raw = storage.getItem(key);
      if (!raw) { return fallback; }
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function getCart() {
    return readJson(sessionStorage, CART_KEY, []);
  }

  function setCart(cart) {
    writeJson(sessionStorage, CART_KEY, cart);
  }

  function clearCart() {
    sessionStorage.removeItem(CART_KEY);
  }

  function addToCart(item) {
    var cart = getCart();
    var existing = cart.find(function (x) { return x.id === item.id; });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      item.qty = 1;
      cart.push(item);
    }
    setCart(cart);
  }

  function formatMoney(n) {
    var num = Number(n || 0);
    return "$" + num.toFixed(2);
  }

  // -----------------------------
  // Subscribe (all pages)
  // -----------------------------
  function wireSubscribeAlerts() {
    var subscribeButtons = document.querySelectorAll("footer form button[type='submit']");
    subscribeButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        alert("Thank you for subscribing.");
      });
    });
  }

  // -----------------------------
  // Gallery cart + modal
  // -----------------------------
  function renderCartModal() {
    var list = document.getElementById("cartItemsList");
    var totalEl = document.getElementById("cartTotal");
    var emptyMsg = document.getElementById("cartEmptyMsg");
    var cart = getCart();

    if (!list || !totalEl || !emptyMsg) { return; }

    // Clear list
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (!cart.length) {
      emptyMsg.hidden = false;
      totalEl.textContent = "";
      return;
    }

    emptyMsg.hidden = true;

    var total = 0;
    cart.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "cart-item";

      var name = (item.name || "Item");
      var qty = Number(item.qty || 1);
      var price = Number(item.price || 0);

      total += (price * qty);

      li.textContent = name + " (x" + qty + ") - " + formatMoney(price * qty);
      list.appendChild(li);
    });

    totalEl.textContent = "Total: " + formatMoney(total);
  }

  function openCartModal() {
    var modal = document.getElementById("cartModal");
    var closeBtn = document.getElementById("closeCartBtn");
    if (!modal) { return; }

    renderCartModal();
    modal.hidden = false;

    // Focus the close button for keyboard users
    if (closeBtn) { closeBtn.focus(); }
  }

  function closeCartModal() {
    var modal = document.getElementById("cartModal");
    if (!modal) { return; }
    modal.hidden = true;
  }

  function wireGalleryCart() {
    // Add to Cart buttons
    var addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-item-id") || "";
        var name = btn.getAttribute("data-item-name") || "Item";
        var price = btn.getAttribute("data-item-price") || "0";

        addToCart({
          id: id,
          name: name,
          price: Number(price)
        });

        alert("Item added to the cart.");
      });
    });

    // View Cart button
    var viewBtn = document.getElementById("viewCartBtn");
    if (viewBtn) {
      viewBtn.addEventListener("click", function () {
        openCartModal();
      });
    }

    // Close cart button
    var closeBtn = document.getElementById("closeCartBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeCartModal();
      });
    }

    // Overlay click to close
    var modal = document.getElementById("cartModal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        var target = e.target;
        if (target && target.getAttribute && target.getAttribute("data-close") === "true") {
          closeCartModal();
        }
      });
    }

    // Clear Cart button
    var clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        clearCart();
        renderCartModal();
        alert("Cart cleared.");
      });
    }

    // Process Order button
    var processBtn = document.getElementById("processOrderBtn");
    if (processBtn) {
      processBtn.addEventListener("click", function () {
        clearCart();
        renderCartModal();
        alert("Thank you for your order.");
      });
    }

    // ESC closes modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var m = document.getElementById("cartModal");
        if (m && !m.hidden) {
          closeCartModal();
        }
      }
    });
  }

  // -----------------------------
  // About/Contact form -> localStorage
  // -----------------------------
  function wireContactFormStorage() {
    var form = document.getElementById("contactForm");
    if (!form) { return; }

    form.addEventListener("submit", function (e) {
      // Let the browser handle built-in validation prompts
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        return;
      }

      e.preventDefault();

      var payload = {
        timestamp: new Date().toISOString(),
        fullName: (document.getElementById("fullName") || {}).value || "",
        email: (document.getElementById("email") || {}).value || "",
        phone: (document.getElementById("phone") || {}).value || "",
        contactReason: (document.getElementById("topic") || {}).value || "",
        message: (document.getElementById("message") || {}).value || "",
        customOrder: (document.getElementById("customOrder") || {}).value || ""
      };

      var orders = readJson(localStorage, ORDER_KEY, []);
      orders.push(payload);

      writeJson(localStorage, ORDER_KEY, orders);
      writeJson(localStorage, LAST_ORDER_KEY, payload);

      alert("Thank you for your message.");
      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireSubscribeAlerts();
    wireGalleryCart();
    wireContactFormStorage();
  });
})();
