/* =========================================================================
   app.js
   ---------------------------------------------------------------------
   All application logic. Reads its data (CONFIG, BRAND, I18N, CATEGORIES,
   HERO_IMAGES, WILAYAS, PRODUCTS) from data.js, which must be loaded
   before this file.

     1. State & small helpers        10. Cart drawer open/close + steps
     2. Language switching           11. Wilaya select
     3. Category tabs                12. Form validation
     4. Hero carousel                13. Order review
     5. Product grid                 14. Order id + full validation
     6. Product detail + image rail  15. Telegram send
     7. Add to cart + toast          16. Confirm order handler
     8. Cart state (localStorage)    17. Footer content
     9. Cart rendering               18. Init
   ========================================================================= */


/* =========================================================================
   1. STATE & SMALL HELPERS
   ========================================================================= */
const state = {
  lang: localStorage.getItem("dz_store_lang") || "ar",
  cart: JSON.parse(localStorage.getItem("dz_store_cart") || "[]"),
  activeCategory: "all",
  currentProduct: null,
  selection: { color:null, size:null, qty:1 },
  selectedWilayaId: null,
  lastOrder: null
};

function currency(amount){
  const n = Math.round(amount).toLocaleString(state.lang==="ar"?"ar-DZ":(state.lang==="fr"?"fr-DZ":"en-US"));
  return `${n} ${CONFIG.CURRENCY_SUFFIX[state.lang]}`;
}
function localized(field){ return field[state.lang]; }

// Stable category key (always English), independent of the active language —
// used to filter/group products so switching languages never breaks a filter.
function categoryKey(product){ return product.category.en; }

// Reads the CATEGORIES array from data.js (single source of truth for both
// the top filter tabs and the footer "collection" links).
function getCategories(){
  return CATEGORIES.map(cat=>({ key: cat.key, label: localized(cat.name) }));
}

// Shared by both the top tabs and the footer links: sets the active
// category, re-renders the grid, and scrolls the products section into view.
function goToCategory(key){
  state.activeCategory = key;
  renderCategoryTabs();
  renderProducts();
  document.getElementById("products").scrollIntoView({ behavior:"smooth", block:"start" });
}

// Fisher–Yates shuffle — used by the hero banner so the image order feels
// different on each visit, without ever mutating the original array.
function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}


/* =========================================================================
   2. LANGUAGE SWITCHING
   (Only text direction/font of text blocks changes — layout stays fixed)
   ========================================================================= */
function applyLanguage(){
  document.body.classList.toggle("lang-ar", state.lang==="ar");
  document.documentElement.setAttribute("lang", state.lang);
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(typeof I18N[state.lang][key] === "string"){ el.textContent = I18N[state.lang][key]; }
  });
  document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.lang===state.lang);
  });
  localStorage.setItem("dz_store_lang", state.lang);

  renderWilayaOptions();
  renderCategoryTabs();
  renderProducts();
  renderCart();
  renderFooter();
  if(state.currentProduct){
    renderPdViewer(pdCarousel.index);   // keeps the same slide, refreshes labels
    renderProductDetail(state.currentProduct);
  }
}

document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    state.lang = btn.dataset.lang;
    applyLanguage();
  });
});


/* =========================================================================
   3. CATEGORY TABS
   ========================================================================= */
function renderCategoryTabs(){
  const wrap = document.getElementById("categoryTabs");
  wrap.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "tab-btn" + (state.activeCategory==="all" ? " active":"");
  allBtn.textContent = I18N[state.lang].categoryAll;
  allBtn.addEventListener("click", ()=>{ state.activeCategory = "all"; renderCategoryTabs(); renderProducts(); });
  wrap.appendChild(allBtn);

  getCategories().forEach(cat=>{
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab-btn" + (state.activeCategory===cat.key ? " active":"");
    btn.textContent = cat.label;
    btn.addEventListener("click", ()=>{ state.activeCategory = cat.key; renderCategoryTabs(); renderProducts(); });
    wrap.appendChild(btn);
  });
  // (Footer "collection" links reuse goToCategory(), which also scrolls
  // the grid into view — see section 17.)
}


/* =========================================================================
   4. HERO CAROUSEL — the wide banner at the top of the page.
   Autoplays every 3s; the visitor can also swipe/drag to browse manually.
   Images come from HERO_IMAGES in data.js, shown in a shuffled order.
   ========================================================================= */
const heroState = { images: [], index: 0, timer: null };

function initHeroCarousel(){
  const track = document.getElementById("heroTrack");
  const dotsWrap = document.getElementById("heroDots");
  if(!track || !Array.isArray(HERO_IMAGES) || HERO_IMAGES.length===0) return;

  heroState.images = shuffleArray(HERO_IMAGES);
  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  heroState.images.forEach(src=>{
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.draggable = false;
    track.appendChild(img);
  });

  if(heroState.images.length>1){
    heroState.images.forEach((src,i)=>{
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot" + (i===0 ? " active":"");
      dot.setAttribute("aria-label", `${i+1}`);
      dot.addEventListener("click", ()=>goToHeroSlide(i));
      dotsWrap.appendChild(dot);
    });
    startHeroAutoplay();
    attachHeroDragHandlers();
  }

  setHeroIndex(0);
}

function setHeroIndex(i){
  const total = heroState.images.length;
  if(total===0) return;
  heroState.index = (i+total)%total;
  document.getElementById("heroTrack").style.transform = `translateX(-${heroState.index*100}%)`;
  document.querySelectorAll(".hero-dot").forEach((dot,idx)=>{
    dot.classList.toggle("active", idx===heroState.index);
  });
}
function nextHeroSlide(){ setHeroIndex(heroState.index+1); }          // autoplay tick — no timer restart
function goToHeroSlide(i){ setHeroIndex(i); restartHeroAutoplay(); }  // manual (dots or drag)

function startHeroAutoplay(){ heroState.timer = setInterval(nextHeroSlide, 3000); }
function restartHeroAutoplay(){ clearInterval(heroState.timer); startHeroAutoplay(); }

function attachHeroDragHandlers(){
  const carousel = document.getElementById("heroCarousel");
  let startX = 0, dragging = false;
  const THRESHOLD = 40;

  carousel.addEventListener("pointerdown", (e)=>{
    dragging = true; startX = e.clientX;
    carousel.setPointerCapture(e.pointerId);
  });
  carousel.addEventListener("pointerup", (e)=>{
    if(!dragging) return;
    dragging = false;
    const delta = e.clientX - startX;
    if(delta > THRESHOLD) goToHeroSlide(heroState.index-1);
    else if(delta < -THRESHOLD) goToHeroSlide(heroState.index+1);
  });
  carousel.addEventListener("pointercancel", ()=>{ dragging = false; });
}


/* =========================================================================
   5. PRODUCT GRID
   Each card shows a small self-rotating set of photos when the product
   provides more than one (via "gallery", or falling back to its color
   photos) — purely visual, independent of the language/category state.
   ========================================================================= */
let cardCarouselTimers = [];

function stockBadge(product){
  if(!product.available || product.stock<=0){
    return `<span class="badge-stock out">${I18N[state.lang].outOfStock}</span>`;
  }
  if(product.stock<=5){
    return `<span class="badge-stock low">${I18N[state.lang].lastPieces(product.stock)}</span>`;
  }
  return `<span class="badge-stock">${I18N[state.lang].inStock}</span>`;
}

function finalPrice(product){
  return product.originalPrice * (1 - product.discount/100);
}

// The set of photos a card cycles through: the product's own gallery,
// or — if it has none — its main image, or its colors' photos as a
// last resort. Returning just one image is fine; the card simply won't animate.
function productCardImages(product){
  if(product.gallery && product.gallery.length) return product.gallery;
  if(product.mainImage) return [product.mainImage];
  if(product.colors && product.colors.length) return product.colors.map(c=>c.image);
  return [];
}

function renderProducts(){
  // Stop previous card carousels before rebuilding
  cardCarouselTimers.forEach(id => clearInterval(id));
  cardCarouselTimers = [];

  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  const list = state.activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => categoryKey(p) === state.activeCategory);

  list.forEach((product, idx) => {

    // الصور العامة للبطاقة فقط:
    // أمام / جانب / خلف / أي صور موجودة في gallery
    const images = productCardImages(product);
    const firstImg = images[0] || "";

    const card = document.createElement("div");

    card.className = "card";
    card.style.animationDelay = `${Math.min(idx, 8) * 45}ms`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    card.innerHTML = `
      <div class="card-media">

        <img
          src="${firstImg}"
          alt="${localized(product.name)}"
          loading="lazy"
        >

        ${
          product.discount > 0
            ? `<span class="badge-discount">-${product.discount}%</span>`
            : ""
        }

        ${stockBadge(product)}

      </div>

      <div class="card-body">

        <p class="card-category text-block">
          ${localized(product.category)}
        </p>

        <p class="card-name text-block">
          ${localized(product.name)}
        </p>

        <div class="card-prices">

          <span class="price-final price-num">
            ${currency(finalPrice(product))}
          </span>

          ${
            product.discount > 0
              ? `
                <span class="price-original price-num">
                  ${currency(product.originalPrice)}
                </span>
              `
              : ""
          }

        </div>

      </div>
    `;

    // فتح تفاصيل المنتج عند الضغط على البطاقة
    card.addEventListener("click", () => {
      openProductDetail(product);
    });

    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter"){
        openProductDetail(product);
      }
    });

    grid.appendChild(card);

    // الصور العامة تتغير تلقائياً
    if(images.length > 1){

      const imgEl = card.querySelector(".card-media img");

      let ci = 0;

      const timer = setInterval(() => {

        ci = (ci + 1) % images.length;

        imgEl.classList.add("fading");

        setTimeout(() => {
          imgEl.src = images[ci];
          imgEl.classList.remove("fading");
        }, 180);

      }, 2800);

      cardCarouselTimers.push(timer);
    }

  });
}


/* =========================================================================
   6. PRODUCT DETAIL — image viewer (with vertical color rail) + info
   The main photo is a small swipeable carousel built from the product's
   "gallery" photos followed by its per-color photos. The color rail runs
   down one side of the photo: each circle is one of those slides — click
   a color circle (or swipe to it) and the photo AND the selected color
   update together, in sync.
   ========================================================================= */
const pdOverlay = document.getElementById("pdOverlay");
const pdCarousel = { seq: [], index: 0 };

// Builds the ordered slide list for the viewer: general "gallery" photos
// first, then one slide per color. Falls back to mainImage if a product
// has neither.
function buildPdSequence(product){

  const seq = [];

  // داخل صفحة المنتج نعرض صور الألوان فقط
  if(product.colors && product.colors.length){

    product.colors.forEach(color => {

      seq.push({
        src: color.image,
        color: color
      });

    });

  }
  // إذا لم توجد ألوان، نستخدم الصورة الرئيسية فقط
  else if(product.mainImage){

    seq.push({
      src: product.mainImage,
      color: null
    });

  }
  // احتياطياً إذا لم توجد mainImage
  else if(product.gallery && product.gallery.length){

    seq.push({
      src: product.gallery[0],
      color: null
    });

  }

  return seq;
}

function openProductDetail(product){
  state.currentProduct = product;
  state.selection = { color:null, size:null, qty:1 };
  renderPdViewer(0);
  renderProductDetail(product);
  pdOverlay.classList.add("open");

  // Meta Pixel — ViewContent
  if (typeof fbq === "function") {
    fbq("track", "ViewContent", {
      content_ids: [String(product.id)],
      content_name: localized(product.name),
      content_type: "product",
      value: finalPrice(product),
      currency: "DZD"
    });
  }
}

function closeProductDetail(){
  pdOverlay.classList.remove("open");
  state.currentProduct = null;
}
document.getElementById("pdCloseBtn").addEventListener("click", closeProductDetail);
pdOverlay.addEventListener("click", (e)=>{ if(e.target===pdOverlay) closeProductDetail(); });

// Rebuilds the image track + the vertical rail of circles for the current
// product, then selects "startIndex" (kept across a language switch).
function renderPdViewer(startIndex){
  const track = document.getElementById("pdTrack");
  const rail = document.getElementById("pdSwatchRail");
  const product = state.currentProduct;
  if(!track || !product) return;

  pdCarousel.seq = buildPdSequence(product);
  track.innerHTML = "";
  rail.innerHTML = "";

  pdCarousel.seq.forEach(slide=>{
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = "";
    img.draggable = false;
    track.appendChild(img);
  });

  if(pdCarousel.seq.length>1){
    pdCarousel.seq.forEach((slide,i)=>{
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "swatch";
      dot.title = slide.color ? localized(slide.color.name) : "";
      dot.innerHTML = slide.color
        ? `<span style="background:${slide.color.hex}"></span>`
        : `<span class="swatch-general"></span>`;
      dot.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

dot.addEventListener("pointerup", (e) => {
  e.stopPropagation();
});

dot.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  setPdIndex(i);
});
      rail.appendChild(dot);
    });
    rail.style.display = "";
  } else {
    rail.style.display = "none";
  }

  setPdIndex(startIndex || 0);
}

// Moves the viewer to slide "i": slides the track, highlights the matching
// rail circle, and syncs the selected color (null on a general photo).
function setPdIndex(i){
  const total = pdCarousel.seq.length;
  if(total===0) return;
  pdCarousel.index = (i+total)%total;

  const track = document.getElementById("pdTrack");
  track.style.transform = `translateX(-${pdCarousel.index*100}%)`;
  document.querySelectorAll("#pdSwatchRail .swatch").forEach((el,idx)=>{
    el.classList.toggle("selected", idx===pdCarousel.index);
  });

  state.selection.color = pdCarousel.seq[pdCarousel.index].color;
  updatePdColorName();
}
function nextPdSlide(){ setPdIndex(pdCarousel.index+1); }
function prevPdSlide(){ setPdIndex(pdCarousel.index-1); }

function updatePdColorName(){
  const el = document.getElementById("pdColorName");
  if(!el) return;
  el.textContent = state.selection.color
    ? localized(state.selection.color.name)
    : I18N[state.lang].noColorSelected;
}

// Drag/swipe on the main photo — attached once; reads the current
// sequence length at drag-time so it always matches the open product.
(function attachPdDragHandlersOnce(){
  const wrap = document.getElementById("pdMediaWrap");
  if(!wrap) return;
  let startX = 0, dragging = false;
  const THRESHOLD = 40;

  wrap.addEventListener("pointerdown", (e)=>{
    if(pdCarousel.seq.length<=1) return;
    dragging = true; startX = e.clientX;
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener("pointerup", (e)=>{
    if(!dragging) return;
    dragging = false;
    const delta = e.clientX - startX;
    if(delta > THRESHOLD) prevPdSlide();
    else if(delta < -THRESHOLD) nextPdSlide();
  });
  wrap.addEventListener("pointercancel", ()=>{ dragging = false; });
})();

function renderProductDetail(product){
  const sel = state.selection;

  document.getElementById("pdCategory").textContent = localized(product.category);
  document.getElementById("pdName").textContent = localized(product.name);
  document.getElementById("pdPriceFinal").textContent = currency(finalPrice(product));

  const origEl = document.getElementById("pdPriceOriginal");
  const pillEl = document.getElementById("pdDiscountPill");
  if(product.discount>0){
    origEl.textContent = currency(product.originalPrice); origEl.style.display="";
    pillEl.textContent = `-${product.discount}%`; pillEl.style.display="";
  } else { origEl.style.display="none"; pillEl.style.display="none"; }
  document.getElementById("pdDesc").textContent = localized(product.description);

  const stockLine = document.getElementById("pdStockLine");
  if(!product.available || product.stock<=0){
    stockLine.textContent = I18N[state.lang].outOfStock;
    stockLine.className = "pd-stock-line out";
  } else if(product.stock<=5){
    stockLine.textContent = I18N[state.lang].lastPieces(product.stock);
    stockLine.className = "pd-stock-line low";
  } else {
    stockLine.textContent = I18N[state.lang].inStock;
    stockLine.className = "pd-stock-line ok";
  }

  // Color: picked via the image rail (section above) — here we only show
  // or hide the label row and keep its text in sync.
  const colorGroup = document.getElementById("pdColorGroup");
  colorGroup.style.display = (product.colors && product.colors.length) ? "" : "none";
  updatePdColorName();

  // Sizes / formats
  const sizeGroup = document.getElementById("pdSizeGroup");
  const sizeWrap = document.getElementById("pdSizes");
  if(product.sizes.length){
    sizeGroup.style.display = "";
    sizeWrap.innerHTML = "";
    product.sizes.forEach(size=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "size-btn" + (sel.size===size ? " selected":"");
      btn.textContent = size;
      btn.disabled = !product.available || product.stock<=0;
      btn.addEventListener("click", ()=>{ state.selection.size = size; renderProductDetail(product); });
      sizeWrap.appendChild(btn);
    });
  } else { sizeGroup.style.display = "none"; }

  // Quantity
  document.getElementById("pdQtyVal").textContent = sel.qty;
  const maxQty = product.stock;
  document.getElementById("pdQtyPlus").disabled = sel.qty >= maxQty || maxQty<=0;
  document.getElementById("pdQtyMinus").disabled = sel.qty <= 1;

  // Add button / error
  document.getElementById("pdError").textContent = "";
  const addBtnHost = document.getElementById("pdAddBtn");
  if(!product.available || product.stock<=0){
    addBtnHost.outerHTML = `<button class="btn-outofstock text-block" id="pdAddBtn" disabled>${I18N[state.lang].outOfStock}</button>`;
  } else {
    addBtnHost.outerHTML = `<button class="btn-primary text-block" id="pdAddBtn">${I18N[state.lang].addToCart}</button>`;
    document.getElementById("pdAddBtn").addEventListener("click", ()=>handleAddToCart(product));
  }
}

document.getElementById("pdQtyMinus").addEventListener("click", ()=>{
  if(state.selection.qty>1){ state.selection.qty--; renderProductDetail(state.currentProduct); }
});
document.getElementById("pdQtyPlus").addEventListener("click", ()=>{
  const max = state.currentProduct ? state.currentProduct.stock : 1;
  if(state.selection.qty<max){ state.selection.qty++; renderProductDetail(state.currentProduct); }
});


/* =========================================================================
   7. ADD TO CART + TOAST
   The cart drawer intentionally does NOT open automatically — a quiet
   toast confirms the action instead, so browsing isn't interrupted.
   ========================================================================= */
function handleAddToCart(product){
  const sel = state.selection;
  const errEl = document.getElementById("pdError");
  if(product.colors.length && !sel.color){ errEl.textContent = I18N[state.lang].chooseColor; return; }
  if(product.sizes.length && !sel.size){ errEl.textContent = I18N[state.lang].chooseSize; return; }
  errEl.textContent = "";
  addToCart(product, sel.color, sel.size, sel.qty);
  closeProductDetail();
  showToast(I18N[state.lang].addedToCart);
}

let toastTimer = null;
function showToast(message){
  const toast = document.getElementById("toast");
  toast.querySelector(".toast-msg").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove("show"), 2200);
}


/* =========================================================================
   8. CART STATE + LOCALSTORAGE
   ========================================================================= */
function saveCart(){
  localStorage.setItem("dz_store_cart", JSON.stringify(state.cart));
}

function cartLineId(productId, colorName, size){
  return `${productId}__${colorName||"nc"}__${size||"ns"}`;
}

function addToCart(product, color, size, qty){
  const lineId = cartLineId(product.id, color ? color.name.en : null, size);
  const existing = state.cart.find(i => i.lineId === lineId);
  const maxQty = product.stock;

  if(existing){
    existing.qty = Math.min(existing.qty + qty, maxQty);
  } else {
    state.cart.push({
      lineId,
      productId: product.id,
      name: product.name,
      image: color ? color.image : (product.mainImage || product.colors[0]?.image || ""),
      unitPrice: finalPrice(product),
      color: color ? color.name : null,
      size: size || null,
      qty: Math.min(qty, maxQty),
      maxQty
    });
  }

  // Meta Pixel — AddToCart
  if (typeof fbq === "function") {
    fbq("track", "AddToCart", {
      content_ids: [String(product.id)],
      content_name: localized(product.name),
      content_type: "product",
      value: finalPrice(product) * qty,
      currency: "DZD"
    });
  }

  saveCart();
  renderCart();
}

function updateCartQty(lineId, delta){
  const item = state.cart.find(i=>i.lineId===lineId);
  if(!item) return;
  item.qty += delta;
  if(item.qty < 1) item.qty = 1;
  if(item.qty > item.maxQty) item.qty = item.maxQty;
  saveCart();
  renderCart();
}

function removeCartItem(lineId){
  state.cart = state.cart.filter(i=>i.lineId!==lineId);
  saveCart();
  renderCart();
}

function cartCount(){ return state.cart.reduce((sum,i)=>sum+i.qty,0); }
function cartSubtotal(){ return state.cart.reduce((sum,i)=>sum+i.qty*i.unitPrice,0); }
function currentDeliveryPrice(){
  const w = WILAYAS.find(w=>w.id===state.selectedWilayaId);
  return w ? w.price : 0;
}


/* =========================================================================
   9. CART RENDERING
   ========================================================================= */
function renderCart(){
  const badge = document.getElementById("cartBadge");
  const count = cartCount();
  badge.textContent = count;
  badge.hidden = count===0;

  const wrap = document.getElementById("cartItemsWrap");
  const summary = document.getElementById("cartSummary");
  if(state.cart.length===0){
    wrap.innerHTML = `<div class="cart-empty text-block">${I18N[state.lang].emptyCart}</div>`;
    summary.style.display = "none";
    document.getElementById("checkoutBtn").disabled = true;
    return;
  }
  document.getElementById("checkoutBtn").disabled = false;
  summary.style.display = "";
  wrap.innerHTML = "";
  state.cart.forEach(item=>{
    const variantParts = [];
    if(item.color) variantParts.push(localized(item.color));
    if(item.size) variantParts.push(item.size);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="cart-item-info">
        <p class="cart-item-name text-block">${localized(item.name)}</p>
        ${variantParts.length ? `<p class="cart-item-variant text-block">${variantParts.join(" / ")}</p>` : ""}
        <div class="cart-item-bottom">
          <span class="cart-item-price price-num">${currency(item.unitPrice*item.qty)}</span>
          <div class="cart-qty">
            <button type="button" data-action="minus">&minus;</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button type="button" data-action="plus">+</button>
          </div>
        </div>
        <button class="cart-item-remove text-block" type="button">🗑</button>
      </div>`;
    row.querySelector('[data-action="minus"]').addEventListener("click", ()=>updateCartQty(item.lineId,-1));
    row.querySelector('[data-action="plus"]').addEventListener("click", ()=>updateCartQty(item.lineId,1));
    row.querySelector(".cart-item-remove").addEventListener("click", ()=>removeCartItem(item.lineId));
    wrap.appendChild(row);
  });

  document.getElementById("sumSubtotal").textContent = currency(cartSubtotal());
  document.getElementById("sumDelivery").textContent = state.selectedWilayaId ? currency(currentDeliveryPrice()) : I18N[state.lang].selectDeliveryFirst;
  document.getElementById("sumTotal").textContent = currency(cartSubtotal() + currentDeliveryPrice());
}


/* =========================================================================
   10. CART DRAWER OPEN/CLOSE + STEP NAVIGATION
   ========================================================================= */
const cartOverlay = document.getElementById("cartOverlay");
function showStep(step){
  ["cartStepList","checkoutStepForm","orderReview","successPanel"].forEach(id=>{
    const el = document.getElementById(id);
    if(id==="cartStepList"){ el.style.display = step==="list" ? "flex":"none"; }
    else { el.classList.toggle("active", step===({checkoutStepForm:"form",orderReview:"review",successPanel:"success"})[id]); }
  });
}
function openCart(){ showStep("list"); renderCart(); cartOverlay.classList.add("open"); }
function closeCart(){ cartOverlay.classList.remove("open"); }
document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", (e)=>{ if(e.target===cartOverlay) closeCart(); });

document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  if(state.cart.length===0) return;

  // Meta Pixel — InitiateCheckout
  if (typeof fbq === "function") {
    fbq("track", "InitiateCheckout", {
      content_ids: state.cart.map(item => String(item.productId)),
      content_type: "product",
      num_items: cartCount(),
      value: cartSubtotal() + currentDeliveryPrice(),
      currency: "DZD"
    });
  }

  showStep("form");
});


/* =========================================================================
   11. WILAYA SELECT
   ========================================================================= */
function renderWilayaOptions(){
  const select = document.getElementById("inputWilaya");
  const prev = select.value;
  select.innerHTML = `<option value="">${I18N[state.lang].selectWilaya}</option>` +
    WILAYAS.map(w=>`<option value="${w.id}">${w.id}. ${localized(w.name)}</option>`).join("");
  if(prev) select.value = prev;
}
document.getElementById("inputWilaya").addEventListener("change", (e)=>{
  state.selectedWilayaId = e.target.value ? parseInt(e.target.value) : null;
  renderCart();
});


/* =========================================================================
   12. FORM VALIDATION
   ========================================================================= */
function validatePhoneDZ(phone){
  const cleaned = phone.replace(/\s|-/g,"");
  return /^(05|06|07)[0-9]{8}$/.test(cleaned);
}

function validateCustomerForm(){
  let ok = true;
  const name = document.getElementById("inputName").value.trim();
  const phone = document.getElementById("inputPhone").value.trim();
  const wilaya = document.getElementById("inputWilaya").value;

  document.getElementById("errName").textContent = "";
  document.getElementById("errPhone").textContent = "";
  document.getElementById("errWilaya").textContent = "";

  if(!name){ document.getElementById("errName").textContent = I18N[state.lang].errNameRequired; ok=false; }
  if(!validatePhoneDZ(phone)){ document.getElementById("errPhone").textContent = I18N[state.lang].errPhoneInvalid; ok=false; }
  if(!wilaya){ document.getElementById("errWilaya").textContent = I18N[state.lang].errWilayaRequired; ok=false; }

  return ok;
}

document.getElementById("toReviewBtn").addEventListener("click", ()=>{
  if(!validateCustomerForm()) return;
  renderOrderReview();
  showStep("review");
});
document.getElementById("backToFormBtn").addEventListener("click", ()=> showStep("form"));


/* =========================================================================
   13. ORDER REVIEW
   ========================================================================= */
function renderOrderReview(){
  const wrap = document.getElementById("reviewItemsWrap");
  wrap.innerHTML = "";
  state.cart.forEach(item=>{
    const variantParts = [];
    if(item.color) variantParts.push(localized(item.color));
    if(item.size) variantParts.push(item.size);
    const row = document.createElement("div");
    row.className = "review-item";
    row.innerHTML = `
      <span>
        <span class="ri-name text-block">${localized(item.name)} × ${item.qty}</span>
        ${variantParts.length ? `<span class="ri-meta text-block">${variantParts.join(" / ")}</span>` : ""}
      </span>
      <span class="price-num">${currency(item.unitPrice*item.qty)}</span>`;
    wrap.appendChild(row);
  });
  document.getElementById("revSubtotal").textContent = currency(cartSubtotal());
  document.getElementById("revDelivery").textContent = currency(currentDeliveryPrice());
  document.getElementById("revTotal").textContent = currency(cartSubtotal() + currentDeliveryPrice());
}


/* =========================================================================
   14. ORDER ID + FULL VALIDATION (pre-send safety net)
   ========================================================================= */
function generateOrderId(){
  const rand = Math.floor(1000 + Math.random()*9000);
  return `#${CONFIG.ORDER_PREFIX}-${rand}`;
}

function validateFullOrder(){
  if(state.cart.length===0) return I18N[state.lang].errCartEmpty;
  const name = document.getElementById("inputName").value.trim();
  const phone = document.getElementById("inputPhone").value.trim();
  const wilaya = document.getElementById("inputWilaya").value;
  if(!name) return I18N[state.lang].errNameRequired;
  if(!validatePhoneDZ(phone)) return I18N[state.lang].errPhoneInvalid;
  if(!wilaya) return I18N[state.lang].errWilayaRequired;
  for(const item of state.cart){
    if(item.qty > item.maxQty) return I18N[state.lang].errCartEmpty; // stock changed mid-session
  }
  return null;
}


/* =========================================================================
   15. SEND ORDER TO TELEGRAM
   ========================================================================= */
async function sendOrderToTelegram(order){
  const wilaya = WILAYAS.find(w=>w.id===state.selectedWilayaId);
  let message = `🛍️ طلب جديد / New Order\n\n`;
  message += `رقم الطلب / Order: ${order.id}\n\n`;
  message += `👤 العميل / Customer:\n${order.name}\n\n`;
  message += `📞 الهاتف / Phone:\n${order.phone}\n\n`;
  message += `📍 الولاية / Wilaya:\n${localized(wilaya.name)}\n\n`;
  message += `📦 المنتجات / Products:\n`;
  order.items.forEach((item,idx)=>{
    const variant = [item.color?localized(item.color):null, item.size].filter(Boolean).join(" / ");
    message += `${idx+1}. ${localized(item.name)}${variant?`\n   ${variant}`:""}\n   x${item.qty} — ${currency(item.unitPrice*item.qty)}\n`;
  });
  message += `\n💰 مجموع المنتجات / Subtotal:\n${currency(order.subtotal)}\n`;
  message += `🚚 التوصيل / Delivery:\n${currency(order.delivery)}\n`;
  message += `💵 المجموع النهائي / Total:\n${currency(order.total)}`;

  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text: message })
  });
  if(!res.ok) throw new Error("telegram_send_failed");
  return true;
}


/* =========================================================================
   16. CONFIRM ORDER HANDLER + SUCCESS / ERROR STATES
   ========================================================================= */
document.getElementById("confirmOrderBtn").addEventListener("click", async ()=>{
  const errMsg = validateFullOrder();
  const sendErrEl = document.getElementById("sendError");
  sendErrEl.classList.remove("active");
  if(errMsg){
    sendErrEl.textContent = errMsg;
    sendErrEl.classList.add("active");
    return;
  }

  const confirmBtn = document.getElementById("confirmOrderBtn");
  confirmBtn.disabled = true;

  const order = {
    id: generateOrderId(),
    name: document.getElementById("inputName").value.trim(),
    phone: document.getElementById("inputPhone").value.trim(),
    wilayaId: state.selectedWilayaId,
    items: JSON.parse(JSON.stringify(state.cart)),
    subtotal: cartSubtotal(),
    delivery: currentDeliveryPrice(),
    total: cartSubtotal() + currentDeliveryPrice()
  };

try{
    await sendOrderToTelegram(order);

    // Meta Pixel — Purchase
    if (typeof fbq === "function") {
      fbq("track", "Purchase", {
        content_ids: order.items.map(item => String(item.productId)),
        content_type: "product",
        num_items: order.items.reduce((sum, item) => sum + item.qty, 0),
        value: order.total,
        currency: "DZD"
      });
    }

    state.lastOrder = order;
    state.cart = [];
    saveCart();
    document.getElementById("successOrderId").textContent = order.id;
    showStep("success");
  } catch(err){
    sendErrEl.textContent = I18N[state.lang].errSendFailed;
    sendErrEl.classList.add("active");
  } finally {
    confirmBtn.disabled = false;
  }
});

document.getElementById("backToProductsBtn").addEventListener("click", ()=>{
  closeCart();
  document.getElementById("inputName").value = "";
  document.getElementById("inputPhone").value = "";
  document.getElementById("inputWilaya").value = "";
  state.selectedWilayaId = null;
  showStep("list");
});


/* =========================================================================
   17. FOOTER CONTENT — brand tagline, category links, contact, socials
   Built from BRAND (data.js) + CATEGORIES, so it always stays in sync
   with the catalogue without any manual editing.
   ========================================================================= */
const SOCIAL_ICONS = {
  instagram:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1"/></svg>`,
  facebook:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 2h-2.5A4.5 4.5 0 0 0 10 6.5V9H7.5v4H10v9h4v-9h2.8l.7-4H14V6.7c0-.6.4-1.2 1-1.2H17z"/></svg>`,
  tiktok:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3v11.2a3.8 3.8 0 1 1-3-3.7"/><path d="M14 3a5.5 5.5 0 0 0 5 5"/></svg>`
};

function renderFooter(){
  document.getElementById("footerTagline").textContent = I18N[state.lang].footerTagline;
  document.getElementById("footerRights").textContent = I18N[state.lang].footerRights(new Date().getFullYear());

  const emailEl = document.getElementById("footerEmail");
  emailEl.textContent = BRAND.contactEmail;
  emailEl.href = `mailto:${BRAND.contactEmail}`;

  const phoneEl = document.getElementById("footerPhone");
  phoneEl.textContent = BRAND.contactPhone;
  phoneEl.href = `tel:${BRAND.contactPhone.replace(/\s/g,"")}`;

  const listWrap = document.getElementById("footerCategoryList");
  listWrap.innerHTML = "";
  getCategories().forEach(cat=>{
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "footer-link-btn text-block";
    btn.textContent = cat.label;
    btn.addEventListener("click", ()=>goToCategory(cat.key));
    listWrap.appendChild(btn);
  });

  const socialWrap = document.getElementById("socialRow");
  socialWrap.innerHTML = "";
  Object.keys(BRAND.social).forEach(key=>{
    const a = document.createElement("a");
    a.className = "social-icon";
    a.href = BRAND.social[key];
    a.setAttribute("aria-label", key);
    a.innerHTML = SOCIAL_ICONS[key] || "";
    socialWrap.appendChild(a);
  });
}


/* =========================================================================
   18. INIT
   ========================================================================= */
initHeroCarousel();
applyLanguage();
