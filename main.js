const header = document.querySelector(".header");
const searchBtn = document.querySelector(".header__search");
const searchCloseBtn = document.querySelector(".header__search-close");
const searchInput = document.querySelector(".header__search-input");

function toggleSearch() {
  header.classList.toggle("search-active");

  if (header.classList.contains("search-active")) {
    setTimeout(() => {
      searchInput.focus();
    }, 100);
    document.body.classList.add("no-scroll");
  } else {
    searchInput.blur();
    document.body.classList.remove("no-scroll");
  }
}

if (searchBtn && searchCloseBtn) {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSearch();
  });

  searchCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("search-active")) {
      toggleSearch();
    }
  });

  document.addEventListener("click", (e) => {
    const isClickInside = header.contains(e.target);
    if (!isClickInside && header.classList.contains("search-active")) {
      toggleSearch();
    }
  });
}

const burgerBtn = document.querySelector(".header__burger");
const headerElement = document.querySelector(".header");
const menuLinks = document.querySelectorAll(".header__menu a");

if (burgerBtn && headerElement) {
  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("is-active");

    headerElement.classList.toggle("menu-open");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("is-active");
      headerElement.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", (e) => {
    const isClickInside = headerElement.contains(e.target);
    if (!isClickInside && headerElement.classList.contains("menu-open")) {
      burgerBtn.classList.remove("is-active");
      headerElement.classList.remove("menu-open");
    }
  });
}

const headerScroll = document.querySelector(".header");

function handleScroll() {
  if (window.scrollY > 50) {
    headerScroll.classList.add("header--scrolled");
  } else {
    headerScroll.classList.remove("header--scrolled");
  }
}

window.addEventListener("scroll", handleScroll);

handleScroll();

const scrollLinks = document.querySelectorAll(".js-scroll-link");

scrollLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const headerHeight = document.querySelector(".header").offsetHeight;

      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.scrollY - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (document.querySelector(".header").classList.contains("menu-open")) {
        document.querySelector(".header__burger").click();
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".clients-swiper")) {
    new Swiper(".clients-swiper", {
      loop: true,
      speed: 4000,
      slidesPerView: "auto",
      spaceBetween: 0,

      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },

      allowTouchMove: false,
      grabCursor: false,
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("reviews-track");

  if (!track) return;

  const REVIEWS_URL = "reviews.json";

  function generateStars(rating) {
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      starsHtml += `<span class="star" aria-hidden="true"></span>`;
    }
    return starsHtml;
  }

  function createReviewCard(review) {
    const li = document.createElement("li");
    li.className = "review-card";

    const safeName = encodeURIComponent(review.name).replace(/'/g, "%27");

    li.innerHTML = `
            <div class="review-card__header">
                <img 
                    class="review-card__avatar" 
                    src="${review.avatar}" 
                    alt="${review.name}" 
                    loading="lazy"
                    onerror="this.src='https:
                >
            </div>
            <div class="review-card__name">${review.name}</div>
            
            <div class="review-card__stars" aria-label="Оцінка ${
              review.rating
            } з 5">
                ${generateStars(review.rating)}
            </div>
            
            <p class="review-card__text">
                ${review.text}
            </p>
        `;
    return li;
  }

  async function loadReviews() {
    try {
      const response = await fetch(REVIEWS_URL);
      if (!response.ok) throw new Error("Failed to load reviews");

      const reviews = await response.json();

      track.innerHTML = "";

      const fragment = document.createDocumentFragment();

      reviews.forEach((review) => {
        const card = createReviewCard(review);
        fragment.appendChild(card);
      });

      track.appendChild(fragment);

      initReviewsNavigation();
    } catch (error) {
      console.error("Error loading reviews:", error);
      track.innerHTML =
        '<p style="text-align:center; padding: 20px;">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>';
    }
  }

  loadReviews();
});

function initReviewsNavigation() {
  const viewport = document.getElementById("reviews-viewport");
  const prevBtn = document.querySelector(".reviews__nav--prev");
  const nextBtn = document.querySelector(".reviews__nav--next");
  const dotsContainer = document.querySelector(".reviews__dots");

  if (!viewport) return;

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: -300, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: 300, behavior: "smooth" });
    });
  }

  if (dotsContainer) {
    const cards = document.querySelectorAll(".review-card");
    dotsContainer.innerHTML = "";

    cards.forEach((card, index) => {
      const dot = document.createElement("button");
      dot.className = index === 0 ? "dot is-active" : "dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Слайд ${index + 1}`);

      dot.addEventListener("click", () => {
        const leftPos = card.offsetLeft - viewport.offsetLeft;
        viewport.scrollTo({ left: leftPos, behavior: "smooth" });

        updateActiveDot(index);
      });

      dotsContainer.appendChild(dot);
    });

    function updateActiveDot(index) {
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((d) => d.classList.remove("is-active"));
      if (dots[index]) dots[index].classList.add("is-active");
    }

    viewport.addEventListener("scroll", () => {
      const isAtEnd =
        viewport.scrollLeft + viewport.offsetWidth >= viewport.scrollWidth - 5;

      if (isAtEnd) {
        updateActiveDot(cards.length - 1);
      } else {
        let bestIndex = 0;
        let minDiff = Infinity;

        cards.forEach((card, index) => {
          const diff = Math.abs(
            card.getBoundingClientRect().left -
              viewport.getBoundingClientRect().left
          );
          if (diff < minDiff) {
            minDiff = diff;
            bestIndex = index;
          }
        });

        updateActiveDot(bestIndex);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("products-grid");

  if (!productsGrid) return;

  const PRODUCTS_URL = "products.json";

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " грн";
  }

  function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";
    article.setAttribute("role", "listitem");

    const link = product.link || "#";

    article.innerHTML = `
            <a class="product-card__media" href="${link}" aria-label="${
      product.title
    } — детальніше">
                <img
                    class="product-card__img"
                    src="${product.image}"
                    alt="${product.title}"
                    loading="lazy"
                    onerror="this.src='https:
                />
            </a>

            <div class="product-card__body">
                <h3 class="product-card__title">
                    <a class="product-card__titleLink" href="${link}">${
      product.title
    }</a>
                </h3>

                <p class="product-card__desc">
                    ${product.description}
                </p>

                <div class="product-card__meta">
                    <div class="product-card__price">${formatPrice(
                      product.price
                    )}</div>
                </div>

                <div class="product-card__actions">
                    <a class="product-card__btn product-card__btn--primary" href="${link}">
                        Детальніше <span aria-hidden="true">→</span>
                    </a>

                    <button class="product-card__btn product-card__btn--secondary" type="button" aria-label="Підібрати ${
                      product.title
                    }">
                        Підібрати цю
                    </button>
                </div>
            </div>
        `;
    return article;
  }

  async function loadProducts() {
    try {
      const response = await fetch(PRODUCTS_URL);
      if (!response.ok) throw new Error("Failed to load products");

      const products = await response.json();

      productsGrid.innerHTML = "";

      const fragment = document.createDocumentFragment();

      products.forEach((product) => {
        const card = createProductCard(product);
        fragment.appendChild(card);
      });

      productsGrid.appendChild(fragment);
    } catch (error) {
      console.error("Error loading products:", error);
      productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #53627A;">
                    <p>На жаль, не вдалося завантажити товари. Спробуйте оновити сторінку.</p>
                </div>
            `;
    }
  }

  loadProducts();
});

let lastScrollTop = 0;
const smartTabs = document.getElementById("smart-tabs");
const body = document.body;
const scrollThreshold = 100;

window.addEventListener(
  "scroll",
  function () {
    if (!smartTabs) return;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      body.classList.add("is-scrolled");
    } else {
      body.classList.remove("is-scrolled");
    }

    if (scrollTop > scrollThreshold) {
      if (scrollTop > lastScrollTop) {
        smartTabs.classList.add("nav-up");
      } else {
        smartTabs.classList.remove("nav-up");
      }
    } else {
      smartTabs.classList.remove("nav-up");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  },
  { passive: true }
);

function switchTab(tabName) {
  const btnService = document.getElementById("tab-btn-service");
  const btnInstall = document.getElementById("tab-btn-install");

  const panelService = document.getElementById("panel-service");
  const panelInstall = document.getElementById("panel-install");

  if (!btnService || !btnInstall || !panelService || !panelInstall) return;

  if (tabName === "service") {
    btnService.classList.add("seg-btn--active");
    btnInstall.classList.remove("seg-btn--active");
    panelService.classList.remove("hidden");
    panelInstall.classList.add("hidden");
  } else if (tabName === "install") {
    btnInstall.classList.add("seg-btn--active");
    btnService.classList.remove("seg-btn--active");
    panelInstall.classList.remove("hidden");
    panelService.classList.add("hidden");
  }

  if (window.scrollY > 100) {
    window.scrollTo({ top: 100, behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const quizSteps = [
    {
      id: "source",
      question: "Звідки у вас вода?",
      type: "single",
      options: [
        { value: "city", label: "🏢 Централізоване (міська вода)" },
        { value: "borehole", label: "🕳 Свердловина" },
        { value: "well", label: "💧 Колодязь" },
        { value: "other", label: "🤷‍♂️ Інше / не знаю" },
      ],
    },
    {
      id: "object_type",
      question: "Для якого об’єкта потрібна система?",
      type: "single",
      options: [
        { value: "apartment", label: "🏢 Квартира" },
        { value: "house", label: "🏠 Приватний будинок" },
        { value: "office", label: "💼 Офіс / невеликий бізнес" },
        { value: "horeca", label: "☕ Заклад HoReCa (кафе, ресторан)" },
      ],
    },
    {
      id: "people",
      question: "Скільки людей регулярно користуються водою?",
      type: "single",
      options: [
        { value: "1-2", label: "👤 1–2 особи" },
        { value: "3-4", label: "👨‍👩‍👧‍👦 3–4 особи" },
        { value: "5-7", label: "🚌 5–7 осіб" },
        { value: "8+", label: "🏢 8+ осіб" },
      ],
    },
    {
      id: "problems",
      question: "Які основні проблеми з водою ви помічаєте? (можна кілька)",
      type: "multiple",
      options: [
        { value: "smell", label: "🤢 Неприємний запах" },
        { value: "cloudy", label: "🟤 Каламутність / осад / іржа" },
        { value: "scale", label: "🫖 Накип у чайнику / техніці" },
        { value: "chlorine", label: "🧪 Смак хлору" },
        { value: "other", label: "🤷‍♂️ Інше / важко сказати" },
      ],
    },
    {
      id: "purpose",
      question: "Для чого саме вам потрібна очищена вода?",
      type: "single",
      options: [
        { value: "drinking_only", label: "🥤 Тільки питна вода" },
        { value: "cooking", label: "🥘 Пиття + приготування їжі" },
        { value: "whole_house", label: "🚿 Для всієї квартири / будинку" },
        { value: "business", label: "⚙️ Для обладнання / бізнесу" },
      ],
    },
    {
      id: "budget",
      question: "Який орієнтовний бюджет ви готові розглядати?",
      type: "single",
      options: [
        { value: "economy", label: "💸 До 7 000 грн" },
        { value: "standard", label: "💵 7 000 – 12 000 грн" },
        { value: "optima", label: "💎 12 000 – 18 000 грн" },
        { value: "premium", label: "👑 18 000+ грн (Преміум)" },
      ],
    },
    {
      id: "service",
      question: "Який формат обслуговування вам зручніший?",
      type: "single",
      options: [
        { value: "full_service", label: "🛠 Майстер «під ключ»" },
        { value: "self", label: "🔧 Встановлю сам за інструкцією" },
        { value: "advice", label: "🆘 Не знаю, потрібна порада" },
      ],
    },

    {
      id: "loading",
      type: "loading",
      duration: 2000,
    },
    {
      id: "lead-form",
      type: "form",
      question: "Розрахунок готовий!",
    },
  ];

  const modal = document.getElementById("calc-modal");
  if (!modal) return;

  const triggers = document.querySelectorAll(
    "#calc-trigger-card, #calc-trigger-btn"
  );
  const closeBtn = document.getElementById("calc-modal-close");
  const backdrop = document.getElementById("calc-modal-backdrop");

  const stepInfoEl = document.querySelector(".calc-modal__step-info");
  const progressBar = document.getElementById("calc-progress-bar");
  const modalBody = document.getElementById("calc-modal-body");
  const btnBack = document.getElementById("calc-btn-back");
  const btnNext = document.getElementById("calc-btn-next");

  let currentStepIndex = 0;
  let userAnswers = {};
  let isNavigating = false;

  const totalQuestions = quizSteps.filter(
    (s) => s.type !== "loading" && s.type !== "form"
  ).length;

  function openModal() {
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
    renderStep(currentStepIndex);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      currentStepIndex = 0;
      userAnswers = {};
      isNavigating = false;
    }, 500);
  }

  function renderStep(index) {
    const step = quizSteps[index];

    if (step.type !== "loading" && step.type !== "form") {
      stepInfoEl.style.opacity = "1";
      stepInfoEl.innerHTML = `Крок <span id="calc-step-num">${
        index + 1
      }</span> з ${totalQuestions}`;
      const progressPercent = ((index + 1) / totalQuestions) * 100;
      progressBar.style.width = `${progressPercent}%`;
      progressBar.parentElement.style.opacity = "1";
    } else {
      stepInfoEl.style.opacity = "0";
      if (step.type === "form") progressBar.style.width = `100%`;
      else progressBar.parentElement.style.opacity = "0";
    }

    modalBody.innerHTML = "";
    modalBody.className = "calc-modal__body fade-in-up";
    setTimeout(() => modalBody.classList.remove("fade-in-up"), 400);

    if (step.type === "loading") {
      renderLoadingState(step);
      updateButtons("hidden");
    } else if (step.type === "form") {
      renderFormState(step);
      updateButtons("form");
    } else {
      renderQuestionState(step);
      updateButtons("nav");
    }
  }

  function renderQuestionState(step) {
    const title = document.createElement("h3");
    title.className = "calc-modal__question";
    title.textContent = step.question;
    modalBody.appendChild(title);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "calc-modal__options";

    step.options.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "calc-option";
      const inputType = step.type === "multiple" ? "checkbox" : "radio";

      let isChecked = false;
      if (userAnswers[step.id]) {
        if (Array.isArray(userAnswers[step.id])) {
          isChecked = userAnswers[step.id].includes(opt.value);
        } else {
          isChecked = userAnswers[step.id] === opt.value;
        }
      }

      label.innerHTML = `
                <input class="calc-option__input" type="${inputType}" name="${
        step.id
      }" value="${opt.value}" ${isChecked ? "checked" : ""}>
                <span class="calc-option__pill">${opt.label}</span>
            `;

      const input = label.querySelector("input");
      input.addEventListener("change", () => {
        handleSelection(step);

        if (step.type === "single") {
          if (!isNavigating) {
            setTimeout(() => goNext(), 250);
          }
        }
      });

      optionsContainer.appendChild(label);
    });

    modalBody.appendChild(optionsContainer);
    validateStep(step);
  }

  function renderLoadingState(step) {
    modalBody.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:300px; gap:24px; text-align:center;">
                <div class="spinner"></div>
                <div>
                    <h3 class="calc-modal__question" style="margin-bottom:8px;">Аналізуємо ваші відповіді...</h3>
                    <p style="color:#53627A;">Підбираємо оптимальну конфігурацію обладнання</p>
                </div>
            </div>
            <style>
                .spinner { width:48px; height:48px; border:4px solid #E9F7FF; border-top-color:#0F5C8C; border-radius:50%; animation:spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            </style>
        `;

    setTimeout(() => {
      currentStepIndex++;
      renderStep(currentStepIndex);
    }, step.duration);
  }

  function renderFormState(step) {
    modalBody.innerHTML = `
            <h3 class="calc-modal__question" style="text-align:center;">${step.question}</h3>
            <p style="text-align:center; color:#53627A; margin-bottom:24px;">
                Ми підібрали 3 варіанти систем.<br>Заповніть форму, щоб отримати розрахунок:
            </p>
            
            <div class="drop__form" style="width:100%; max-width:100%;">
                
                <label class="drop__field" style="max-width:100%;">
                    <input class="drop__input" type="text" placeholder="Ваше ім’я" id="calc-name">
                    <span class="error-message" id="error-name">Введіть ім'я (мін. 2 літери)</span>
                </label>

                <label class="drop__field" style="max-width:100%;">
                    <input class="drop__input" type="tel" placeholder="0XX XXX XX XX" id="calc-phone" maxlength="13">
                    <span class="error-message" id="error-phone">Невірний формат номеру</span>
                </label>
                
                <div style="display:flex; gap:16px; justify-content:center; margin-top:8px;">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                        <input type="radio" name="messenger" value="telegram" checked> 
                        <span style="font-size:14px; font-weight:500;">Telegram</span>
                    </label>
                    <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                        <input type="radio" name="messenger" value="viber"> 
                        <span style="font-size:14px; font-weight:500;">Viber</span>
                    </label>
                </div>
            </div>
        `;

    const nameInput = document.getElementById("calc-name");
    const phoneInput = document.getElementById("calc-phone");
    const errorName = document.getElementById("error-name");
    const errorPhone = document.getElementById("error-phone");

    function checkFormValidity() {
      const isNameValid = validateName(nameInput.value, false);
      const isPhoneValid = validatePhone(phoneInput.value, false);

      if (isNameValid && isPhoneValid) {
        btnNext.disabled = false;
      } else {
        btnNext.disabled = true;
      }
    }

    function validateName(value, showError = true) {
      const isValid = value.trim().length >= 2;

      if (showError) {
        if (!isValid) {
          nameInput.classList.add("is-invalid");
          nameInput.classList.remove("is-valid");
          errorName.classList.add("visible");
        } else {
          nameInput.classList.remove("is-invalid");
          nameInput.classList.add("is-valid");
          errorName.classList.remove("visible");
        }
      }
      return isValid;
    }

    nameInput.addEventListener("input", () => {
      validateName(nameInput.value, true);
      checkFormValidity();
    });

    nameInput.addEventListener("blur", () => {
      validateName(nameInput.value, true);
      checkFormValidity();
    });

    function validatePhone(value, showError = true) {
      const digits = value.replace(/\D/g, "");

      const isValid = digits.length >= 10 && digits.length <= 12;

      if (showError) {
        if (!isValid) {
          phoneInput.classList.add("is-invalid");
          phoneInput.classList.remove("is-valid");
          errorPhone.classList.add("visible");

          if (digits.length === 0)
            errorPhone.textContent = "Введіть номер телефону";
          else errorPhone.textContent = "Перевірте формат (мінімум 10 цифр)";
        } else {
          phoneInput.classList.remove("is-invalid");
          phoneInput.classList.add("is-valid");
          errorPhone.classList.remove("visible");
        }
      }
      return isValid;
    }

    phoneInput.addEventListener("input", (e) => {
      validatePhone(e.target.value, true);
      checkFormValidity();
    });

    phoneInput.addEventListener("blur", () => {
      validatePhone(phoneInput.value, true);
      checkFormValidity();
    });

    btnNext.disabled = true;
  }

  function updateButtons(mode) {
    if (mode === "hidden") {
      btnBack.style.opacity = "0";
      btnBack.style.pointerEvents = "none";
      btnNext.style.display = "none";
    } else if (mode === "form") {
      btnBack.style.opacity = "0";
      btnBack.style.pointerEvents = "none";
      btnNext.style.display = "inline-flex";
      btnNext.textContent = "Отримати розрахунок";

      btnNext.disabled = true;
      btnNext.onclick = handleSubmit;
    } else {
      btnNext.style.display = "inline-flex";
      btnNext.textContent = "Далі";
      btnNext.onclick = goNext;

      if (currentStepIndex > 0) {
        btnBack.style.opacity = "1";
        btnBack.style.pointerEvents = "auto";
      } else {
        btnBack.style.opacity = "0";
        btnBack.style.pointerEvents = "none";
      }
    }
  }

  function handleSelection(step) {
    const inputs = modalBody.querySelectorAll("input:checked");
    if (step.type === "multiple") {
      userAnswers[step.id] = Array.from(inputs).map((i) => i.value);
    } else {
      userAnswers[step.id] = inputs[0] ? inputs[0].value : null;
    }
    validateStep(step);
  }

  function validateStep(step) {
    const answer = userAnswers[step.id];
    let isValid = false;
    if (step.type === "multiple") {
      isValid = answer && answer.length > 0;
    } else {
      isValid = answer !== null && answer !== undefined;
    }
    btnNext.disabled = !isValid;
  }

  function goNext() {
    if (isNavigating) return;

    if (currentStepIndex < quizSteps.length - 1) {
      isNavigating = true;
      currentStepIndex++;
      renderStep(currentStepIndex);

      setTimeout(() => {
        isNavigating = false;
      }, 400);
    }
  }

  function goBack() {
    if (isNavigating) return;

    if (currentStepIndex > 0) {
      isNavigating = true;
      currentStepIndex--;
      renderStep(currentStepIndex);

      setTimeout(() => {
        isNavigating = false;
      }, 400);
    }
  }

  function handleSubmit() {
    const nameInput = document.getElementById("calc-name");
    const phoneInput = document.getElementById("calc-phone");

    const name = nameInput.value.trim();
    const phone = phoneInput.value.replace(/\D/g, "");
    const messenger = document.querySelector(
      'input[name="messenger"]:checked'
    ).value;

    if (name.length < 2 || phone.length < 10) {
      return;
    }

    const finalData = {
      ...userAnswers,
      contact: {
        name: name,
        phone: phoneInput.value,
        messenger: messenger,
      },
    };

    console.log("Quiz Result:", finalData);

    btnNext.textContent = "Відправляємо...";
    btnNext.disabled = true;

    setTimeout(() => {
      renderSuccessState(name, messenger);
    }, 1500);
  }

  function renderSuccessState(name, messenger) {
    btnNext.style.display = "none";
    btnBack.style.display = "none";

    const stepInfoEl = document.querySelector(".calc-modal__step-info");
    const progressTrack = document.querySelector(".calc-modal__progress-track");
    if (stepInfoEl) stepInfoEl.style.opacity = "0";
    if (progressTrack) progressTrack.style.opacity = "0";

    const messengerLabel = messenger === "telegram" ? "Telegram" : "Viber";

    modalBody.innerHTML = `
            <div class="calc-success">
                <div class="success-icon-glass">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                
                <h3 class="calc-success__title">Дякуємо, ${name}!</h3>
                
                <p class="calc-success__desc">
                    Вашу заявку прийнято. Ми вже готуємо розрахунок і надішлемо його у <b>${messengerLabel}</b> протягом 15 хвилин.
                </p>
                
                <button class="pw-btn pw-btn--primary pw-btn--md" id="success-close-btn" style="width: 100%; max-width: 320px;">
                    Чудово, чекаю!
                </button>
            </div>
        `;

    const successBtn = document.getElementById("success-close-btn");
    successBtn.addEventListener("click", () => {
      closeModal();

      setTimeout(() => {
        btnNext.textContent = "Далі";
        btnNext.disabled = false;
        btnNext.style.display = "inline-flex";
      }, 500);
    });
  }

  triggers.forEach((t) =>
    t.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    })
  );

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  modal
    .querySelector(".calc-modal__window")
    .addEventListener("click", (e) => e.stopPropagation());

  btnNext.addEventListener("click", goNext);
  btnBack.addEventListener("click", goBack);
});
