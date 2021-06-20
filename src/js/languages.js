export const languages = () => {
  const containerEl = document.querySelector('[data-el="languages-container"]');
  const valueEl = document.querySelector('[data-el="languages-input-value"]');
  const itemsEl = document.querySelectorAll('[data-el="languages-item"]');
  const inputEl = document.querySelector('[data-el="languages-input"]');

  const setValue = (value) => {
    if (!value) {
      return;
    }

    valueEl.innerText = value;
  };

  const open = () => {
    containerEl.classList.add("languages--opened");
  };

  const close = () => {
    containerEl.classList.remove("languages--opened");
  };

  const select = (target) => {
    const value = target.dataset.value;

    if (!value) {
      return;
    }

    setValue(value);
    close();
  };

  inputEl.addEventListener("click", () => {
    open();
  });

  itemsEl.forEach((item) => {
    item.addEventListener("click", () => {
      select(item);
    });
  });
};
