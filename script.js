document.addEventListener("DOMContentLoaded", () => {
  const faqCards = document.querySelectorAll(".faq-card");

  // раскрытие/закрытие
  faqCards.forEach((card) => {
    card.addEventListener("click", () => {
      const isActive = card.classList.contains("active");

      faqCards.forEach((item) => item.classList.remove("active"));

      if (!isActive) {
        card.classList.add("active");
      }
    });
  });

  // анимация появления при скролле
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 120);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  faqCards.forEach((card) => observer.observe(card));
});

