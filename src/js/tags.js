export const tags = (onSelectHandler) => {
  const tagsEl = document.querySelectorAll('[data-el="tag"]');
  const field = document.querySelector(".select__input-value");

  const unselect = (tag) => {
    if (!tag) return;

    return tag.classList.remove("tag--active");
  };

  const select = (tag) => {
    if (!tag) return;
    const name = tag.dataset.name;
    const value = tag.innerText;

    if (!field) {
      return;
    }

    field.innerText = value;

    tagsEl.forEach((t) => unselect(t));

    if (onSelectHandler) {
      onSelectHandler(value, name);

      const dropdownItems = document.querySelectorAll(
        '[data-el="dropdown-item"]'
      );
      const checkboxes = document.querySelectorAll(
        '[data-el="select-checkbox"]'
      );

      checkboxes.forEach((checkbox) =>
        checkbox.classList.remove("select__checkbox--active")
      );

      dropdownItems.forEach((item) => {
        const checkbox = item.querySelector('[data-el="select-checkbox"]');

        if (item.innerText.trim() === value) {
          checkbox.classList.add("select__checkbox--active");
        }
      });
    }

    return tag.classList.add("tag--active");
  };

  tagsEl.forEach((tag) => {
    tag.addEventListener("click", () => {
      select(tag);
    });
  });
};
