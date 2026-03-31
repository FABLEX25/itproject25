document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimation();
  initFaq();
  initContactForm();
});

function initRevealAnimation() {
  const elements = document.querySelectorAll(`
    .hero__content,
    .section-title,
    .section-line,
    .card,
    .featured-card,
    .review-card,
    .cta__content,
    .footer__top,
    .footer__bottom,
    .contact-item,
    .work-card,
    .form-card,
    .faq-card,
    .stat-card,
    .skill-card,
    .experience-card,
    .about-story__card,
    .about-story__visual,
    .about-story__content,
    .project-card,
    .gallery-item,
    .details-card,
    .features-card
  `);

  if (!elements.length) return;

  elements.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${index * 0.03}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function initFaq() {
  const faqCards = document.querySelectorAll(".faq-card");
  if (!faqCards.length) return;

  faqCards.forEach((card) => {
    card.addEventListener("click", () => {
      const isActive = card.classList.contains("active");

      faqCards.forEach((item) => item.classList.remove("active"));

      if (!isActive) {
        card.classList.add("active");
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  faqCards.forEach((card) => observer.observe(card));
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");
  const popupClose = document.getElementById("popupClose");
  const popupBtn = document.getElementById("popupBtn");
  const popupOverlay = document.getElementById("popupOverlay");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const submitButton = form.querySelector(".form-btn");

  const BOT_TOKEN = "8291964944:AAF_YvvZBSPYsMtcZ9qSc7v683rj4Td-h2A";
  const CHAT_ID = "823695160";

  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;

    let error = input.parentElement.querySelector(".form-error");
    if (!error) {
      error = document.createElement("div");
      error.className = "form-error";
      input.parentElement.appendChild(error);
    }

    input.addEventListener("input", () => clearError(input));
  });

  popupClose?.addEventListener("click", closePopup);
  popupBtn?.addEventListener("click", closePopup);
  popupOverlay?.addEventListener("click", closePopup);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    clearError(nameInput);
    clearError(emailInput);
    clearError(subjectInput);
    clearError(messageInput);

    if (name.length < 2) {
      showError(nameInput, "Введите имя не короче 2 символов");
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(emailInput, "Введите корректный email");
      isValid = false;
    }

    if (subject.length < 3) {
      showError(subjectInput, "Введите тему не короче 3 символов");
      isValid = false;
    }

    if (message.length < 10) {
      showError(messageInput, "Введите сообщение не короче 10 символов");
      isValid = false;
    }

    if (!isValid) return;

    submitButton.classList.add("is-loading");
    submitButton.textContent = "Отправка...";

    const text =
      "📩 Новая заявка с сайта\n\n" +
      `👤 Имя: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📝 Тема: ${subject}\n` +
      `💬 Сообщение: ${message}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text
        })
      });

      const result = await response.json();

      if (result.ok) {
        form.reset();
        openPopup("Спасибо!", "Ваше сообщение успешно отправлено в Telegram.");
      } else {
        openPopup("Ошибка", result.description || "Ошибка Telegram");
        console.error(result);
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      openPopup("Ошибка", "Не удалось отправить сообщение. Проверь подключение или настройки бота.");
    } finally {
      submitButton.classList.remove("is-loading");
      submitButton.textContent = "Отправить сообщение";
    }
  });

  function showError(input, message) {
    input.classList.add("input-error");
    const error = input.parentElement.querySelector(".form-error");
    if (error) error.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("input-error");
    const error = input.parentElement.querySelector(".form-error");
    if (error) error.textContent = "";
  }

  function openPopup(title, text) {
    if (!popup) return;
    popupTitle.textContent = title;
    popupText.textContent = text;
    popup.classList.add("active");
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove("active");
  }
}

const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}