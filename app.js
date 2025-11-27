// PRODUCT DATA (id must be unique)
const PRODUCT_DATA = [
  // Lips
  {
    id: "lip-rose",
    name: "Velvet Matte Lipstick - Rose Crush",
    shade: "Rose Pink",
    category: "lips",
    price: 699,
    description: "Highly pigmented velvet matte lipstick with a soft, comfy finish.",
  },
  {
    id: "lip-nude",
    name: "Soft Satin Lipstick - Warm Nude",
    shade: "Warm Nude",
    category: "lips",
    price: 649,
    description: "Everyday nude lipstick with a satin, non-drying finish.",
  },
  {
    id: "lip-gloss",
    name: "High Shine Lip Gloss - Crystal",
    shade: "Clear",
    category: "lips",
    price: 599,
    description: "Non-sticky gloss for glass-like shine and hydration.",
  },

  // Face
  {
    id: "foundation-ff",
    name: "Flawless Filter Foundation",
    shade: "Medium Neutral",
    category: "face",
    price: 1299,
    description: "Medium-to-full coverage foundation with a natural radiant finish.",
  },
  {
    id: "concealer",
    name: "Perfect Coverage Concealer",
    shade: "Medium Warm",
    category: "face",
    price: 799,
    description: "Creamy concealer to brighten under-eyes and conceal blemishes.",
  },
  {
    id: "blush-cream",
    name: "Cream Blush - Peach Pop",
    shade: "Peach",
    category: "face",
    price: 749,
    description: "Blendable cream blush for a natural flushed look.",
  },

  // Eyes
  {
    id: "palette-soft",
    name: "Soft Glam Eyeshadow Palette",
    shade: "Warm Neutrals",
    category: "eyes",
    price: 1599,
    description: "12-shade warm neutral palette for day to night looks.",
  },
  {
    id: "eyeliner",
    name: "Ultra Black Liquid Liner",
    shade: "Black",
    category: "eyes",
    price: 599,
    description: "Smudge-proof, matte black liner with a precise brush tip.",
  },
  {
    id: "mascara",
    name: "Volume+ Length Mascara",
    shade: "Black",
    category: "eyes",
    price: 699,
    description: "Buildable volume and length with zero clumps.",
  },
];

// --- CART HELPERS (localStorage) ---
const CART_KEY = "glowglam_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getProductById(id) {
  return PRODUCT_DATA.find((p) => p.id === id);
}

// Add product to cart
function addToCart(id) {
  const product = getProductById(id);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert("Added to cart: " + product.name);
}

// Remove product
function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

// Update qty
function updateCartQty(id, qty) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  const n = Number(qty);
  if (!n || n <= 0) {
    cart = cart.filter((i) => i.id !== id);
  } else {
    item.qty = n;
  }
  saveCart(cart);
  renderCart();
  updateCartCount();
}

// Cart count in header
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
}

// --- RENDER PRODUCTS ON products.html ---
function renderProductsPage() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return; // not on products page

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  function applyFilters() {
    const searchTerm = (searchInput.value || "").toLowerCase();
    const category = categoryFilter.value;

    grid.innerHTML = "";

    const filtered = PRODUCT_DATA.filter((p) => {
      const matchCategory = category === "all" || p.category === category;
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.shade.toLowerCase().includes(searchTerm);
      return matchCategory && matchSearch;
    });

    filtered.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.id = p.id;

      card.innerHTML = `
        <div class="product-image-placeholder">${p.category.toUpperCase()}</div>
        <h3>${p.name}</h3>
        <p class="product-meta">Shade: ${p.shade}</p>
        <p class="product-desc">${p.description}</p>
        <p class="price">₹${p.price}</p>
        <button class="btn small primary" data-add-to-cart="${p.id}">
          Add to Cart
        </button>
      `;

      grid.appendChild(card);
    });

    // Attach listeners
    grid.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.addToCart));
    });
  }

  applyFilters();

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
}

// --- RENDER CART ON checkout.html ---
function renderCart() {
  const tbody = document.getElementById("cartTableBody");
  const emptyEl = document.getElementById("cartEmpty");
  const cartContent = document.getElementById("cartContent");

  if (!tbody || !emptyEl || !cartContent) return; // not on checkout page

  const cart = getCart();

  if (cart.length === 0) {
    emptyEl.classList.remove("hidden");
    cartContent.classList.add("hidden");
    return;
  } else {
    emptyEl.classList.add("hidden");
    cartContent.classList.remove("hidden");
  }

  tbody.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;

    const itemSubtotal = product.price * item.qty;
    subtotal += itemSubtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.shade}</td>
      <td>₹${product.price}</td>
      <td>
        <input type="number" min="1" value="${item.qty}"
               class="cart-qty-input" data-cart-qty="${item.id}" />
      </td>
      <td>₹${itemSubtotal}</td>
      <td>
        <button class="cart-delete" data-cart-remove="${item.id}">
          Remove
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Simple shipping rule: free over ₹999
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const subtotalAmount = document.getElementById("subtotalAmount");
  const shippingAmount = document.getElementById("shippingAmount");
  const totalAmount = document.getElementById("totalAmount");

  if (subtotalAmount) subtotalAmount.textContent = "₹" + subtotal;
  if (shippingAmount) shippingAmount.textContent = "₹" + shipping;
  if (totalAmount) totalAmount.textContent = "₹" + total;

  // Attach events
  tbody.querySelectorAll("[data-cart-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.cartRemove));
  });

  tbody.querySelectorAll("[data-cart-qty]").forEach((input) => {
    input.addEventListener("change", () =>
      updateCartQty(input.dataset.cartQty, input.value)
    );
  });
}

// --- NAV TOGGLE & YEAR ---
function initLayoutHelpers() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("nav-open");
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// --- CHECKOUT FORM ---
function initCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty. Add some products before paying.");
      return;
    }

    // Simple demo validation already handled by 'required'
    alert("Thank you for your order! (Demo only)");
    // Clear cart
    saveCart([]);
    renderCart();
    updateCartCount();
  });
}

// --- INITIALIZE ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  initLayoutHelpers();
  updateCartCount();
  renderProductsPage();
  renderCart();
  initCheckoutForm();
});
