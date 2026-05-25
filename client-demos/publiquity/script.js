const socialLinks = {
  tiktok: "https://www.tiktok.com/@publiquity?_r=1&_t=ZP-96fD2NihJok",
  instagram: "https://www.instagram.com/publiquity"
};

const products = [
  {
    id: "air-pro-bundle",
    title: "Premium Headphone & Audio Returns Bundle",
    category: "electronics",
    condition: "open-box",
    fulfillment: ["pickup", "shipping"],
    price: 149,
    retail: 349,
    margin: 57,
    rating: 4.8,
    tag: "TikTok hot",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    details: [
      "Inspected open-box units with cosmetic grading",
      "Good for livestream bundles and single-item flips",
      "Includes assorted premium headphone and earbud styles"
    ]
  },
  {
    id: "countertop-pallet",
    title: "Kitchen Countertop Appliance Lot",
    category: "home",
    condition: "new",
    fulfillment: ["pickup", "shipping"],
    price: 289,
    retail: 760,
    margin: 62,
    rating: 4.7,
    tag: "New case",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80",
    details: [
      "Air fryers, blenders, mini makers, and accessory kits",
      "Shelf-pull and overstock mix",
      "Strong fit for home goods resellers"
    ]
  },
  {
    id: "beauty-mystery",
    title: "Beauty Mystery Box: Viral Care Mix",
    category: "beauty",
    condition: "mixed",
    fulfillment: ["pickup", "shipping"],
    price: 59,
    retail: 180,
    margin: 67,
    rating: 4.9,
    tag: "Mystery",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    details: [
      "10-14 pieces per box",
      "Skin care, hair care, tools, and giftable accessories",
      "Designed for TikTok unboxing content"
    ]
  },
  {
    id: "general-pallet",
    title: "General Merchandise Pallet",
    category: "bulk",
    condition: "returns",
    fulfillment: ["pickup"],
    price: 695,
    retail: 2480,
    margin: 72,
    rating: 4.6,
    tag: "Manifested",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
    details: [
      "65-95 units per pallet",
      "Manifest available before pickup",
      "Mixed home, electronics accessories, toys, and seasonal goods"
    ]
  },
  {
    id: "gaming-accessories",
    title: "Gaming Accessories Flash Deal Box",
    category: "electronics",
    condition: "open-box",
    fulfillment: ["pickup", "shipping"],
    price: 119,
    retail: 315,
    margin: 62,
    rating: 4.7,
    tag: "Flash",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=900&q=80",
    details: [
      "Controllers, headsets, charging stands, RGB accessories",
      "Great for bundle pricing",
      "All units visually inspected"
    ]
  },
  {
    id: "home-reset",
    title: "Home Reset Cleaning & Organization Case",
    category: "home",
    condition: "new",
    fulfillment: ["pickup", "shipping"],
    price: 84,
    retail: 210,
    margin: 60,
    rating: 4.5,
    tag: "Bundle",
    image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=900&q=80",
    details: [
      "Shelf-pull household essentials",
      "Good for local marketplace bundles",
      "Clean UPCs and easy listing copy"
    ]
  },
  {
    id: "small-electronics-case",
    title: "Small Electronics Case Pack",
    category: "electronics",
    condition: "mixed",
    fulfillment: ["pickup", "shipping"],
    price: 399,
    retail: 1180,
    margin: 66,
    rating: 4.8,
    tag: "Wholesale",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    details: [
      "Chargers, smart home accessories, computer peripherals",
      "40-70 sellable units",
      "Designed for repeat reseller ordering"
    ]
  },
  {
    id: "apparel-surprise",
    title: "Apparel & Accessories Surprise Lot",
    category: "beauty",
    condition: "returns",
    fulfillment: ["pickup"],
    price: 179,
    retail: 620,
    margin: 71,
    rating: 4.4,
    tag: "Pickup",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    details: [
      "Mixed sizes and styles",
      "Includes bags, accessories, and soft goods",
      "Best for sellers comfortable sorting inventory"
    ]
  }
];

const state = {
  query: "",
  category: "all",
  condition: "all",
  maxPrice: 1500,
  fulfillment: new Set(),
  sort: "featured",
  cart: new Map()
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const grid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const cartCount = document.querySelector("#cartCount");
const cartTitle = document.querySelector("#cartTitle");
const cartLines = document.querySelector("#cartLines");
const cartTotal = document.querySelector("#cartTotal");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const conditionFilter = document.querySelector("#conditionFilter");
const priceFilter = document.querySelector("#priceFilter");
const priceLabel = document.querySelector("#priceLabel");
const sortSelect = document.querySelector("#sortSelect");
const quickView = document.querySelector("#quickView");
const quickViewBody = document.querySelector("#quickViewBody");
const quoteModal = document.querySelector("#quoteModal");

function productBadgeClass(product) {
  if (product.category === "bulk") return "bulk";
  if (product.tag.toLowerCase().includes("hot") || product.tag.toLowerCase().includes("flash")) return "hot";
  return "";
}

function filteredProducts() {
  let items = products.filter((product) => {
    const matchesQuery = [product.title, product.category, product.tag, product.condition]
      .join(" ")
      .toLowerCase()
      .includes(state.query.toLowerCase());
    const matchesCategory = state.category === "all" || product.category === state.category;
    const matchesCondition = state.condition === "all" || product.condition === state.condition;
    const matchesPrice = product.price <= state.maxPrice;
    const matchesFulfillment =
      state.fulfillment.size === 0 ||
      [...state.fulfillment].every((method) => product.fulfillment.includes(method));

    return matchesQuery && matchesCategory && matchesCondition && matchesPrice && matchesFulfillment;
  });

  if (state.sort === "price-low") {
    items = items.sort((a, b) => a.price - b.price);
  } else if (state.sort === "price-high") {
    items = items.sort((a, b) => b.price - a.price);
  } else if (state.sort === "margin") {
    items = items.sort((a, b) => b.margin - a.margin);
  } else {
    items = items.sort((a, b) => b.rating - a.rating);
  }

  return items;
}

function renderProducts() {
  const items = filteredProducts();
  resultCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  grid.innerHTML = items
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <span class="badge ${productBadgeClass(product)}">${product.tag}</span>
          </div>
          <div class="product-body">
            <div class="rating">★★★★★ <span>${product.rating}</span></div>
            <h3>${product.title}</h3>
            <div class="product-meta">
              <span>${product.condition.replace("-", " ")}</span>
              <span>${product.fulfillment.join(" + ")}</span>
            </div>
            <div class="price-row">
              <div>
                <div class="price">${money.format(product.price)}</div>
                <div class="retail">${money.format(product.retail)} retail</div>
              </div>
              <span class="margin">${product.margin}% margin</span>
            </div>
            <div class="card-actions">
              <button class="add-btn" type="button" data-add="${product.id}">Add to cart</button>
              <button class="quick-btn" type="button" aria-label="Quick view ${product.title}" data-view="${product.id}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  if (!items.length) {
    grid.innerHTML = `<div class="empty-cart">No deals match those filters yet.</div>`;
  }
}

function cartItems() {
  return [...state.cart.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return { ...product, quantity };
  });
}

function renderCart() {
  const items = cartItems();
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  cartCount.textContent = quantity;
  cartTitle.textContent = `${quantity} item${quantity === 1 ? "" : "s"}`;
  cartTotal.textContent = money.format(total);

  if (!items.length) {
    cartLines.innerHTML = `<div class="empty-cart"><p>Your cart is ready for today's drop.</p></div>`;
    return;
  }

  cartLines.innerHTML = items
    .map(
      (item) => `
        <div class="cart-line">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <strong>${item.title}</strong>
            <span>${money.format(item.price)} each</span>
            <div class="qty-row">
              <button type="button" aria-label="Decrease quantity" data-dec="${item.id}">−</button>
              <b>${item.quantity}</b>
              <button type="button" aria-label="Increase quantity" data-add="${item.id}">+</button>
            </div>
          </div>
          <div class="line-total">${money.format(item.quantity * item.price)}</div>
        </div>
      `
    )
    .join("");
}

function addToCart(id) {
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  renderCart();
}

function decreaseCart(id) {
  const quantity = state.cart.get(id) || 0;
  if (quantity <= 1) state.cart.delete(id);
  else state.cart.set(id, quantity - 1);
  renderCart();
}

function openCart() {
  document.body.classList.add("drawer-open");
  document.querySelector("[data-cart]").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("drawer-open");
  document.querySelector("[data-cart]").setAttribute("aria-hidden", "true");
}

function openQuickView(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  quickViewBody.innerHTML = `
    <div class="quick-view-grid">
      <img src="${product.image}" alt="${product.title}" />
      <div class="quick-copy">
        <p class="eyebrow">${product.tag}</p>
        <h2>${product.title}</h2>
        <p>${product.condition.replace("-", " ")} inventory with ${product.fulfillment.join(" and ")} available.</p>
        <div class="price-row">
          <div>
            <div class="price">${money.format(product.price)}</div>
            <div class="retail">${money.format(product.retail)} estimated retail</div>
          </div>
          <span class="margin">${product.margin}% resale margin</span>
        </div>
        <ul class="detail-list">
          ${product.details.map((detail) => `<li>${detail}</li>`).join("")}
        </ul>
        <button class="btn primary full" type="button" data-add="${product.id}" data-modal-add>Add to cart</button>
      </div>
    </div>
  `;

  quickView.showModal();
}

function updateFiltersFromControls() {
  state.query = searchInput.value.trim();
  state.category = categorySelect.value;
  state.condition = conditionFilter.value;
  state.maxPrice = Number(priceFilter.value);
  state.sort = sortSelect.value;
  state.fulfillment = new Set(
    [...document.querySelectorAll(".fulfillment-filter:checked")].map((input) => input.value)
  );
  priceLabel.textContent = money.format(state.maxPrice);
  renderProducts();
}

document.addEventListener("click", (event) => {
  const addId = event.target.closest("[data-add]")?.dataset.add;
  const decId = event.target.closest("[data-dec]")?.dataset.dec;
  const viewId = event.target.closest("[data-view]")?.dataset.view;
  const filterCategory = event.target.closest("[data-filter-link]")?.dataset.filterLink;

  if (addId) {
    addToCart(addId);
    if (!event.target.hasAttribute("data-modal-add")) openCart();
  }

  if (decId) decreaseCart(decId);
  if (viewId) openQuickView(viewId);

  if (filterCategory) {
    categorySelect.value = filterCategory;
    updateFiltersFromControls();
  }

  if (event.target.closest("[data-cart-open]")) openCart();
  if (event.target.closest("[data-cart-close]")) closeCart();
  if (event.target.closest("[data-modal-close]")) quickView.close();

  if (event.target.closest("[data-wholesale-open]")) quoteModal.showModal();
  if (event.target.closest("[data-quote-close]")) quoteModal.close();

  if (event.target.closest("[data-nav-toggle]")) {
    document.querySelector("[data-nav]").classList.toggle("is-open");
  }

  if (event.target.closest("[data-clear-filters]")) {
    searchInput.value = "";
    categorySelect.value = "all";
    conditionFilter.value = "all";
    priceFilter.value = "1500";
    sortSelect.value = "featured";
    document.querySelectorAll(".fulfillment-filter").forEach((input) => {
      input.checked = false;
    });
    updateFiltersFromControls();
  }
});

document.querySelector(".search").addEventListener("submit", (event) => {
  event.preventDefault();
  updateFiltersFromControls();
  document.querySelector("#deals").scrollIntoView({ behavior: "smooth", block: "start" });
});

[searchInput, categorySelect, conditionFilter, priceFilter, sortSelect].forEach((control) => {
  control.addEventListener("input", updateFiltersFromControls);
  control.addEventListener("change", updateFiltersFromControls);
});

document.querySelectorAll(".fulfillment-filter").forEach((control) => {
  control.addEventListener("change", updateFiltersFromControls);
});

document.querySelectorAll('a[href="#tiktok"]').forEach((link) => {
  link.href = socialLinks.tiktok;
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelector(".footer div:last-child").insertAdjacentHTML(
  "beforeend",
  `<a href="${socialLinks.instagram}" target="_blank" rel="noopener">Instagram</a>`
);

quickView.addEventListener("click", (event) => {
  if (event.target === quickView) quickView.close();
});

quoteModal.addEventListener("click", (event) => {
  if (event.target === quoteModal) quoteModal.close();
});

renderProducts();
renderCart();
