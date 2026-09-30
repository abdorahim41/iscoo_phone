/* =========================================================================
   data.js
   ---------------------------------------------------------------------
   Every editable value for the store lives in this ONE file, grouped
   into clearly numbered sections. You should never need to touch
   index.html, style.css or app.js just to change text, prices, wilayas,
   hero images or products — everything below is the single source of truth.

     1. CONFIG        → bot token, currency, order prefix
     2. BRAND          → footer / contact / social content
     3. I18N           → every piece of UI text, in ar / en / fr
     4. CATEGORIES     → the filter tabs (top) + footer collection links
     5. HERO_IMAGES    → the top image banner (auto-rotates + swipe/drag)
     6. WILAYAS        → delivery price per wilaya
     7. PRODUCTS       → the product catalogue
   ========================================================================= */


/* =========================================================================
   1. CONFIG
   ========================================================================= */
const CONFIG = {
  TELEGRAM_BOT_TOKEN: "8456845689:AAHSnCbiAwS79PUN3v6CvbYePpDs0bmGuQI",   // ضع توكن البوت هنا
  TELEGRAM_CHAT_ID:   "5291254062",     // ضع chat id الخاص بك هنا
  CURRENCY_SUFFIX: { ar: "دج", en: "DZD", fr: "DA" },
  ORDER_PREFIX: "S"
};


/* =========================================================================
   2. BRAND  — footer content, contact details, social links.
   Leave a URL as "#" to hide/disable that link visually (still editable).
   ========================================================================= */
const BRAND = {
  name: "iscoo phone",
  tagline: {
    ar:"إكسسوارات هاتف فاخرة — حيث تلتقي الأناقة بالتقنية.",
    en:"Luxury phone accessories — where elegance meets technology.",
    fr:"Accessoires de téléphone de luxe — où l'élégance rencontre la technologie."
  },
  contactEmail: "contact@iscoo_phone.dz",
  contactPhone: "+213 559388208",
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#"
  }
};


/* =========================================================================
   3. I18N — every static UI string, in three languages.
   To add a language: duplicate one block, translate every key, then add
   a matching <button class="lang-btn" data-lang="xx"> in index.html.
   ========================================================================= */
const I18N = {
  ar: {
    brandName:"iscoo phone",
    announce:"استغل عرض توصيل ب 100دج لجميع الولايات",
    cart:"السلة",

    heroCta:"اكتشف المجموعة",

    trustDelivery:"توصيل سريع لكل الولايات",
    trustCod:"الدفع عند الاستلام",
    trustAuthentic:"جودة مضمونة 100%",
    trustPackaging:"تغليف فاخر مع كل طلب",

    collectionEyebrow:"التشكيلة",
    collectionTitle:"اختر إكسسوارك المثالي",
    categoryAll:"الكل",

    color:"اللون", size:"التوافق", quantity:"الكمية", addToCart:"أضف إلى السلة",
    outOfStock:"غير متوفر", inStock:"متوفر", lastPieces:(n)=>`آخر ${n} قطع`,
    chooseColor:"يرجى اختيار اللون", chooseSize:"يرجى اختيار التوافق",
    noColorSelected:"اضغط على صورة اللون لاختياره",
    addedToCart:"أُضيف إلى سلتك",

    yourCart:"سلتك", emptyCart:"سلتك فارغة", subtotal:"مجموع المنتجات",
    delivery:"التوصيل", total:"المجموع النهائي", checkout:"إتمام الطلب",
    fullName:"الاسم الكامل", phone:"رقم الهاتف", wilaya:"الولاية",
    selectWilaya:"اختر الولاية", reviewOrder:"مراجعة الطلب", backToCart:"العودة إلى السلة",
    confirmOrder:"تأكيد الطلب", editInfo:"تعديل المعلومات",
    orderReceived:"تم استلام طلبك بنجاح ✅", orderNumber:"رقم طلبك",
    willCallYou:"سنتصل بك قريبًا لتأكيد الطلب.", backToProducts:"العودة إلى المنتجات",
    errNameRequired:"الرجاء إدخال الاسم الكامل", errPhoneInvalid:"رقم الهاتف غير صحيح، مثال: 0550123456",
    errWilayaRequired:"الرجاء اختيار الولاية", errCartEmpty:"سلتك فارغة",
    errSendFailed:"فشل إرسال الطلب، يرجى المحاولة مرة أخرى.",
    selectDeliveryFirst:"—",

    footerTagline: BRAND.tagline.ar,
    footerLinksTitle:"التشكيلة",
    footerContactTitle:"تواصل معنا",
    footerFollowTitle:"تابعنا",
    footerRights:(y)=>`© ${y} iscoo phone. جميع الحقوق محفوظة.`
  },
  en: {
    brandName:"iscoo phone",
    announce:"Premium delivery nationwide · Cash on delivery · 30-day exchange guarantee",
    cart:"Cart",

    heroCta:"Discover the Collection",

    trustDelivery:"Fast nationwide delivery",
    trustCod:"Cash on delivery",
    trustAuthentic:"100% quality guaranteed",
    trustPackaging:"Luxury packaging on every order",

    collectionEyebrow:"The Edit",
    collectionTitle:"Find your perfect accessory",
    categoryAll:"All",

    color:"Color", size:"Compatibility", quantity:"Quantity", addToCart:"Add to cart",
    outOfStock:"Out of stock", inStock:"In stock", lastPieces:(n)=>`Only ${n} left`,
    chooseColor:"Please choose a color", chooseSize:"Please choose a compatibility",
    noColorSelected:"Tap a color image to select it",
    addedToCart:"Added to your cart",

    yourCart:"Your cart", emptyCart:"Your cart is empty", subtotal:"Subtotal",
    delivery:"Delivery", total:"Total", checkout:"Checkout",
    fullName:"Full name", phone:"Phone number", wilaya:"Wilaya",
    selectWilaya:"Select wilaya", reviewOrder:"Review order", backToCart:"Back to cart",
    confirmOrder:"Confirm order", editInfo:"Edit information",
    orderReceived:"Your order was received ✅", orderNumber:"Order number",
    willCallYou:"We'll call you shortly to confirm your order.", backToProducts:"Back to products",
    errNameRequired:"Please enter your full name", errPhoneInvalid:"Invalid phone number, e.g. 0550123456",
    errWilayaRequired:"Please select a wilaya", errCartEmpty:"Your cart is empty",
    errSendFailed:"Failed to send the order, please try again.",
    selectDeliveryFirst:"—",

    footerTagline: BRAND.tagline.en,
    footerLinksTitle:"The Collection",
    footerContactTitle:"Get in touch",
    footerFollowTitle:"Follow us",
    footerRights:(y)=>`© ${y} iscoo phone. All rights reserved.`
  },
  fr: {
    brandName:"iscoo phone",
    announce:"Livraison premium dans toute l'Algérie · Paiement à la livraison · Échange garanti 30 jours",
    cart:"Panier",

    heroCta:"Découvrir la collection",

    trustDelivery:"Livraison rapide partout en Algérie",
    trustCod:"Paiement à la livraison",
    trustAuthentic:"Qualité garantie à 100%",
    trustPackaging:"Emballage de luxe à chaque commande",

    collectionEyebrow:"La sélection",
    collectionTitle:"Trouvez votre accessoire idéal",
    categoryAll:"Tout",

    color:"Couleur", size:"Compatibilité", quantity:"Quantité", addToCart:"Ajouter au panier",
    outOfStock:"Rupture de stock", inStock:"En stock", lastPieces:(n)=>`Il en reste ${n}`,
    chooseColor:"Veuillez choisir une couleur", chooseSize:"Veuillez choisir une compatibilité",
    noColorSelected:"Touchez une image de couleur pour la choisir",
    addedToCart:"Ajouté à votre panier",

    yourCart:"Votre panier", emptyCart:"Votre panier est vide", subtotal:"Sous-total",
    delivery:"Livraison", total:"Total", checkout:"Commander",
    fullName:"Nom complet", phone:"Numéro de téléphone", wilaya:"Wilaya",
    selectWilaya:"Choisir la wilaya", reviewOrder:"Vérifier la commande", backToCart:"Retour au panier",
    confirmOrder:"Confirmer la commande", editInfo:"Modifier les informations",
    orderReceived:"Votre commande a été reçue ✅", orderNumber:"Numéro de commande",
    willCallYou:"Nous vous appellerons bientôt pour confirmer votre commande.", backToProducts:"Retour aux produits",
    errNameRequired:"Veuillez entrer votre nom complet", errPhoneInvalid:"Numéro invalide, ex : 0550123456",
    errWilayaRequired:"Veuillez choisir une wilaya", errCartEmpty:"Votre panier est vide",
    errSendFailed:"Échec de l'envoi de la commande, veuillez réessayer.",
    selectDeliveryFirst:"—",

    footerTagline: BRAND.tagline.fr,
    footerLinksTitle:"La collection",
    footerContactTitle:"Nous contacter",
    footerFollowTitle:"Suivez-nous",
    footerRights:(y)=>`© ${y} iscoo phone. Tous droits réservés.`
  }
};


/* =========================================================================
   4. CATEGORIES — powers BOTH the filter tabs above the product grid and
   the clickable "collection" links in the footer, from one single list.

   To add a tab/link: push a new {key, name} object below.
   To remove one: delete its object below.
   "key" MUST exactly match a product's category.en value (see PRODUCTS
   below) so filtering works — order here is also the display order.
   ========================================================================= */
const CATEGORIES = [
  {key:"iPhone Cases", name:{ar:"أونتي شوك آيفون", en:"iPhone Cases", fr:"Coques iPhone"}}
];


/* =========================================================================
   5. HERO_IMAGES — the wide rotating banner at the top of the page.
   - Shows one image at a time, in a shuffled order (fresh on every visit).
   - Auto-advances every 3 seconds.
   - The visitor can also swipe/drag left or right to browse manually
     (dragging always pauses & restarts the 3s timer).

   To add/remove a banner image: just add/remove a filename below — no
   other file needs editing. Place the image files next to index.html
   (or update the paths here to point wherever you keep them, e.g. "images/hero-1.jpg").
   ========================================================================= */
const HERO_IMAGES = [
  "co.jfif",
  "co1.jfif",
  "hero.jpg"
];


/* =========================================================================
   6. WILAYAS — delivery price per wilaya (DZD).
   Edit the "price" field only; everything else renders automatically.
   ========================================================================= */
const WILAYAS = [
  {id:1,name:{ar:"أدرار",en:"Adrar",fr:"Adrar"},price:100},
  {id:2,name:{ar:"الشلف",en:"Chlef",fr:"Chlef"},price:100},
  {id:3,name:{ar:"الأغواط",en:"Laghouat",fr:"Laghouat"},price:100},
  {id:4,name:{ar:"أم البواقي",en:"Oum El Bouaghi",fr:"Oum El Bouaghi"},price:100},
  {id:5,name:{ar:"باتنة",en:"Batna",fr:"Batna"},price:100},
  {id:6,name:{ar:"بجاية",en:"Béjaïa",fr:"Béjaïa"},price:100},
  {id:7,name:{ar:"بسكرة",en:"Biskra",fr:"Biskra"},price:100},
  {id:8,name:{ar:"بشار",en:"Béchar",fr:"Béchar"},price:100},
  {id:9,name:{ar:"البليدة",en:"Blida",fr:"Blida"},price:100},
  {id:10,name:{ar:"البويرة",en:"Bouira",fr:"Bouira"},price:100},
  {id:11,name:{ar:"تمنراست",en:"Tamanrasset",fr:"Tamanrasset"},price:100},
  {id:12,name:{ar:"تبسة",en:"Tébessa",fr:"Tébessa"},price:100},
  {id:13,name:{ar:"تلمسان",en:"Tlemcen",fr:"Tlemcen"},price:100},
  {id:14,name:{ar:"تيارت",en:"Tiaret",fr:"Tiaret"},price:100},
  {id:15,name:{ar:"تيزي وزو",en:"Tizi Ouzou",fr:"Tizi Ouzou"},price:100},
  {id:16,name:{ar:"الجزائر",en:"Algiers",fr:"Alger"},price:100},
  {id:17,name:{ar:"الجلفة",en:"Djelfa",fr:"Djelfa"},price:100},
  {id:18,name:{ar:"جيجل",en:"Jijel",fr:"Jijel"},price:100},
  {id:19,name:{ar:"سطيف",en:"Sétif",fr:"Sétif"},price:100},
  {id:20,name:{ar:"سعيدة",en:"Saïda",fr:"Saïda"},price:100},
  {id:21,name:{ar:"سكيكدة",en:"Skikda",fr:"Skikda"},price:100},
  {id:22,name:{ar:"سيدي بلعباس",en:"Sidi Bel Abbès",fr:"Sidi Bel Abbès"},price:100},
  {id:23,name:{ar:"عنابة",en:"Annaba",fr:"Annaba"},price:100},
  {id:24,name:{ar:"قالمة",en:"Guelma",fr:"Guelma"},price:100},
  {id:25,name:{ar:"قسنطينة",en:"Constantine",fr:"Constantine"},price:100},
  {id:26,name:{ar:"المدية",en:"Médéa",fr:"Médéa"},price:100},
  {id:27,name:{ar:"مستغانم",en:"Mostaganem",fr:"Mostaganem"},price:100},
  {id:28,name:{ar:"المسيلة",en:"M'Sila",fr:"M'Sila"},price:100},
  {id:29,name:{ar:"معسكر",en:"Mascara",fr:"Mascara"},price:100},
  {id:30,name:{ar:"ورقلة",en:"Ouargla",fr:"Ouargla"},price:100},
  {id:31,name:{ar:"وهران",en:"Oran",fr:"Oran"},price:100},
  {id:32,name:{ar:"البيض",en:"El Bayadh",fr:"El Bayadh"},price:100},
  {id:33,name:{ar:"إليزي",en:"Illizi",fr:"Illizi"},price:100},
  {id:34,name:{ar:"برج بوعريريج",en:"Bordj Bou Arréridj",fr:"Bordj Bou Arréridj"},price:100},
  {id:35,name:{ar:"بومرداس",en:"Boumerdès",fr:"Boumerdès"},price:100},
  {id:36,name:{ar:"الطارف",en:"El Tarf",fr:"El Tarf"},price:100},
  {id:37,name:{ar:"تندوف",en:"Tindouf",fr:"Tindouf"},price:100},
  {id:38,name:{ar:"تيسمسيلت",en:"Tissemsilt",fr:"Tissemsilt"},price:100},
  {id:39,name:{ar:"الوادي",en:"El Oued",fr:"El Oued"},price:100},
  {id:40,name:{ar:"خنشلة",en:"Khenchela",fr:"Khenchela"},price:100},
  {id:41,name:{ar:"سوق أهراس",en:"Souk Ahras",fr:"Souk Ahras"},price:100},
  {id:42,name:{ar:"تيبازة",en:"Tipaza",fr:"Tipaza"},price:100},
  {id:43,name:{ar:"ميلة",en:"Mila",fr:"Mila"},price:100},
  {id:44,name:{ar:"عين الدفلى",en:"Aïn Defla",fr:"Aïn Defla"},price:100},
  {id:45,name:{ar:"النعامة",en:"Naâma",fr:"Naâma"},price:100},
  {id:46,name:{ar:"عين تموشنت",en:"Aïn Témouchent",fr:"Aïn Témouchent"},price:100},
  {id:47,name:{ar:"غرداية",en:"Ghardaïa",fr:"Ghardaïa"},price:100},
  {id:48,name:{ar:"غليزان",en:"Relizane",fr:"Relizane"},price:100},
  {id:49,name:{ar:"تيميمون",en:"Timimoun",fr:"Timimoun"},price:100},
  {id:50,name:{ar:"برج باجي مختار",en:"Bordj Badji Mokhtar",fr:"Bordj Badji Mokhtar"},price:100},
  {id:51,name:{ar:"أولاد جلال",en:"Ouled Djellal",fr:"Ouled Djellal"},price:100},
  {id:52,name:{ar:"بني عباس",en:"Béni Abbès",fr:"Béni Abbès"},price:100},
  {id:53,name:{ar:"عين صالح",en:"In Salah",fr:"In Salah"},price:100},
  {id:54,name:{ar:"عين قزام",en:"In Guezzam",fr:"In Guezzam"},price:100},
  {id:55,name:{ar:"تقرت",en:"Touggourt",fr:"Touggourt"},price:100},
  {id:56,name:{ar:"جانت",en:"Djanet",fr:"Djanet"},price:100},
  {id:57,name:{ar:"المغير",en:"El M'Ghair",fr:"El M'Ghair"},price:100},
  {id:58,name:{ar:"المنيعة",en:"El Meniaa",fr:"El Meniaa"},price:100}
];


/* =========================================================================
   7. PRODUCTS — the catalogue.
   To add a product: copy one object below and push it into the array.
   No HTML/CSS editing is ever required — cards, filters and the detail
   modal are all generated automatically from this data.

   Fields:
     id            unique number
     name          {ar,en,fr}
     category      {ar,en,fr} — the "en" value must match a "key" in the
                   CATEGORIES list above for the filter tabs to work
     description   {ar,en,fr}
     mainImage     fallback image (used if "gallery" is empty and no
                   color is selected)
     gallery       [] of extra general photos for this product — e.g. an
                   "all colors together" shot, a side view, a back view.
                   These appear BOTH as the auto-rotating image on the
                   product card AND as the first slides of the image
                   viewer inside the product page, before the per-color
                   photos. Leave [] to skip straight to mainImage/colors.
     originalPrice number (DZD)
     discount      number 0-100 (percentage)
     colors        [] of {name:{ar,en,fr}, hex, image} — leave [] if none.
                   Each color's photo is added automatically after the
                   "gallery" photos in the product-page image viewer, and
                   gets its own circle on the vertical color rail — click
                   a circle (or swipe to it) to jump straight to that
                   color's photo.
     sizes         [] of strings (device compatibility, e.g. "IP 15 PRO")
                   — leave [] if none
     stock         number of units available
     available     true/false — set false to force "out of stock"
   ========================================================================= */
const PRODUCTS = [
  {
    id: 1,

    name: {
        ar: "أونتي شوك مع جيب لحفظ البطاقة",
        en: "Anti-Shock Case with Card Pocket",
        fr: "Coque Anti-Choc avec Poche pour Carte"
    },

    category: {
        ar: "أونتي شوك",
        en: "iPhone Cases",
        fr: "Coques iPhone"
    },

    description: {
        ar: "أونتي شوك مع جيب مخصص لحفظ البطاقة، متوفر بعدة ألوان ومتوافق مع العديد من موديلات آيفون.",
        en: "Anti-shock case with a dedicated card pocket, available in multiple colors and compatible with several iPhone models.",
        fr: "Coque anti-choc avec une poche dédiée pour carte, disponible en plusieurs couleurs et compatible avec plusieurs modèles d’iPhone."
    },

    mainImage: "cases.png",

    // "All colors together" shot, then a side view and a back view —
    // these play on the card automatically and open the product viewer.
    gallery: [
        "cases.png",
        "cases01.png",
        "cases001.jpg"
    ],

    originalPrice: 2500,

    discount: 12,

    colors: [
        {
            name: { ar: "أسود", en: "Black", fr: "Noir" },
            hex: "#000000",
            image: "1case-black.png"
        },
        {
            name: { ar: "أزرق", en: "Blue", fr: "Bleu" },
            hex: "#0066FF",
            image: "1case-blue.jpg"
        },
        {
            name: { ar: "أبيض", en: "White", fr: "Blanc" },
            hex: "#FFFFFF",
            image: "1case-white.png"
        },
        {
            name: { ar: "برتقالي", en: "Orange", fr: "Orange" },
            hex: "#FF7A00",
            image: "1case-orange.png"
        },
        {
            name: { ar: "وردي فاتح", en: "Light Pink", fr: "Rose Clair" },
            hex: "#FFB6C1",
            image: "1case-rose.png"
        }
    ],

    sizes: [
        "IP 13",
        "IP 13 PRO MAX",
        "IP 14 PRO",
        "IP 14 PRO MAX",
        "IP 15 PRO",
        "IP 15 PRO MAX",
        "IP 16 PRO",
        "IP 16 PRO MAX",
        "IP 17 PRO",
        "IP 17 PRO MAX",
        "IP 15 PLUS",
        "IP 16 PLUS"
    ],

    stock: 100,

    available: true
  },
  
 // المنتج الثاني
  {
    id: 2,

  name: { 
   ar: "أونتي شوك آيفون أنيق وحماية متقدمة", 
   en: "Premium iPhone Protective Case", 
    fr: "Coque iPhone Premium et Protectrice" 
  }, 

  category: { 
   ar: "أونتي شوك آيفون", 
   en: "iPhone Cases", 
   fr: "Coques iPhone" 
  }, 

  description: { 
   ar: "أونتي شوك أنيق وعصري يوفر حماية قوية لهاتفك مع تصميم عملي ومريح للاستخدام اليومي. يحمي الهاتف والكاميرا من الخدوش والصدمات، مع تصميم أنيق يحافظ على شكل هاتفك.", 
    en: "A stylish and modern iPhone case designed to provide reliable everyday protection. It helps protect your screen and camera from scratches and impacts while maintaining a sleek and comfortable design.", 
   fr: "Une coque iPhone élégante et moderne conçue pour offrir une protection fiable au quotidien. Elle protège l'écran et la caméra contre les rayures et les chocs tout en conservant un design élégant et confortable." 
  },

    mainImage: "cases2.jpg",

    gallery: [
      "cases2.jpg",
      "cases02.jpg",
      "cases002.jpg"
    ],

    originalPrice: 2800,
    discount: 14.29,

    colors: [
      {
        name: { ar: "أسود", en: "Black", fr: "Noir" },
        hex: "#000000",
        image: "2case-black.jpg"
      },
      {
        name: { ar: "أزرق", en: "Blue", fr: "Bleu" },
        hex: "#0066FF",
        image: "2case-blue.png"
      },
      {
        name: { ar: "بني", en: "brown", fr: "Noir" },
        hex: "#c37142",
        image: "2case-brown.jpg"
      }
      ,
      {
        name: { ar: "رمادي", en: "gray", fr: "Noir" },
        hex: "#767676",
        image: "2case-gray.jpg"
      },
      {
        name: { ar: "برتقالي", en: "orange", fr: "Noir" },
        hex: "#ff3c01",
        image: "2case-orange.jpg"
      }
    ],

    sizes: [
      "IP 13 PRO MAX",
      "IP 14 PRO MAX",
      "IP 16 PRO MAX",
      "IP 17 PRO",
      "IP 17 PRO MAX"
    ],

    stock: 50,
    available: true
  },
  // المنتج الثالث
  {
    id: 3,

    name: { 
    ar: "أونتي شوك آيفون بتهوية وستاند مدمج", 
    en: "iPhone Ventilated Case with Built-in Stand", 
    fr: "Coque iPhone Aérée avec Support Intégré" 
  }, 

category: { 
  ar: "أونتي شوك آيفون", 
  en: "iPhone Cases", 
  fr: "Coques iPhone" 
}, 

description: { 
  ar: "أونتي شوك آيفون بتصميم عصري مزود بفتحات تهوية خلفية للمساعدة على تحسين تدفق الهواء، مع ستاند مدمج قابل للطي لمشاهدة الفيديوهات واستخدام الهاتف براحة. تصميم عملي وأنيق يوفر حماية مناسبة للاستخدام اليومي.", 
  en: "A modern iPhone case featuring rear ventilation openings to help improve airflow, along with a built-in foldable stand for comfortable video viewing and hands-free use. A practical and stylish design made for everyday use.", 
  fr: "Une coque iPhone au design moderne avec des ouvertures arrière pour favoriser la circulation de l'air, ainsi qu'un support intégré pliable pour regarder des vidéos confortablement et utiliser le téléphone en mode mains libres. Un design pratique et élégant pour un usage quotidien." 
},

    mainImage: "new-case.png",

    gallery: [
      "cases3.jpg",
      "cases03.jpg",
      "3case-black.jpg"
    ],

    originalPrice: 2600,
    discount: 15.38,

    colors: [
      {
        name: { ar: "أسود", en: "Black", fr: "Noir" },
        hex: "#000000",
        image: "3case-black.jpg"
      },
      {
        name: { ar: "أزرق", en: "Blue", fr: "Bleu" },
        hex: "#0066FF",
        image: "3case-blue.jpg"
      },
              {
            name: { ar: "أبيض", en: "White", fr: "Blanc" },
            hex: "#FFFFFF",
            image: "3case-white.jpg"
        },

    ],

    sizes: [
      "IP 11",
      "IP 11 PRO MAX",
      "IP 12",
      "IP 12 PRO MAX",
      "IP 13",
      "IP 13 PRO MAX",
      "IP 14",
      "IP 14 PRO MAX",
      "IP 15 PRO MAX",
      "IP 16 PRO MAX"
    ],

    stock: 50,
    available: true
  }
];