document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Add to Cart Buttons
  const cart = JSON.parse(localStorage.getItem("CART") || "[]");

  function saveCart() {
    localStorage.setItem("CART", JSON.stringify(cart));
  }

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);

      const item = cart.find(i => i.name === name);
      if (item) item.qty++;
      else cart.push({ name, price, qty: 1 });

      saveCart();
    });
  });

  // CART PAGE
  const cartBody = document.getElementById("cartBody");
  if (cartBody) {
    const empty = document.getElementById("emptyCart");
    const table = document.getElementById("cartTable");
    const totalBox = document.getElementById("cartTotalBox");

    if (cart.length === 0) {
      empty.classList.remove("hidden");
    } else {
      empty.classList.add("hidden");
      table.classList.remove("hidden");
      totalBox.classList.remove("hidden");

      let total = 0;

      cart.forEach((p, index) => {
        const row = document.createElement("tr");
        total += p.qty * p.price;

        row.innerHTML = `
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.qty}</td>
          <td>${p.qty * p.price}</td>
          <td><button class="remove-btn" data-index="${index}">X</button></td>
        `;

        cartBody.appendChild(row);
      });

      document.getElementById("cartTotal").textContent = total;

      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          cart.splice(btn.dataset.index, 1);
          saveCart();
          location.reload();
        });
      });
    }
  }

  // CONTACT FORM
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "thankyou.html";
    });
  }

  // PURCHASE FORM
  const purchaseForm = document.getElementById("purchaseForm");
  if (purchaseForm) {
    purchaseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.removeItem("CART");
      window.location.href = "thankyou.html";
    });
  }
});
