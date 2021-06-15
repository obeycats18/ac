export const faq = () => {
  const faqList = document.querySelector('[data-el="faq-list"]');
  const faqItems = faqList.querySelectorAll('[data-el="faq-item"]');

  if (!faqList || !faqItems) return;

  const close = (target, hidden) => {
    if (!target || !hidden) return;
    target.classList.remove("faq-list__item--active");
    hidden.style.height = "0px";
  };

  const toggleActive = (target) => {
    if (!target) return;
    target.classList.toggle("faq-list__item--active");
  };

  const toggleVisible = (hidden) => {
    if (!hidden) return;
    const height = hidden.style.height;

    if (height === "0px" || !height || !height.length) {
      hidden.style.height = `${hidden.scrollHeight}px`;
    } else {
      hidden.style.height = "0px";
    }
  };

  const onClick = (target) => {
    if (!target) return;
    const hidden = target.querySelector('[data-el="faq-hidden"]');

    document.querySelectorAll('[data-el="faq-item"]').forEach((el) => {
      if (target !== el) {
        const hidden = el.querySelector('[data-el="faq-hidden"]');
        close(el, hidden);
      }
    });

    toggleVisible(hidden);
    toggleActive(target);
  };

  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      onClick(item);
    });
  });
};
