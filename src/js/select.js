export const select = (onSelectHandler) => {
  const selects = document.querySelectorAll('div[data-el="select"]');

  if (!selects) return;

  const isDropdownOpened = (dropdown) =>
    dropdown.classList.contains("select__dropdown--active");

  const toggleOpenedDropdown = (dropdown, arrow) => {
    if (!dropdown) return;

    const opened = isDropdownOpened(dropdown);

    if (opened) {
      closeDropdown(dropdown);
      rotateArrow(arrow, "down");
    } else {
      openDropdown(dropdown);
      rotateArrow(arrow, "up");
    }
  };

  const check = (checkbox) => {
    if (!checkbox) return;

    document.querySelectorAll('[data-el="select-checkbox"]').forEach((el) => {
      uncheck(el);
    });

    return checkbox.classList.add("select__checkbox--active");
  };

  const uncheck = (checkbox) => {
    if (!checkbox) return;

    return checkbox.classList.remove("select__checkbox--active");
  };

  const openDropdown = (dropdown) => {
    if (!dropdown) return;

    return dropdown.classList.add("select__dropdown--active");
  };

  const closeDropdown = (dropdown) => {
    if (!dropdown) return;

    return dropdown.classList.remove("select__dropdown--active");
  };

  const rotateArrow = (arrow, type) => {
    if (!arrow || !type) return;

    if (type === "up") {
      return arrow.classList.add("select__input-icon--active");
    } else if (type === "down") {
      return arrow.classList.remove("select__input-icon--active");
    }
  };

  const selectElement = (select, input, el) => {
    if (!select || !input || !el) return;

    const inputValue = input.querySelector("p");
    const elValue = el.querySelector("p");
    const checkbox = el.querySelector('[data-el="select-checkbox"]');
    const value = elValue.innerText;
    const name = input.dataset.name;

    select.dataset.value = value;
    inputValue.innerText = value;

    if (onSelectHandler) {
      onSelectHandler(value, name);
    }

    check(checkbox);
  };

  const clickSelectItem = (select, input, dropdown) => {
    if (!select || !input || !dropdown) return;

    const items = dropdown.querySelectorAll('[data-el="dropdown-item"]');

    const arrow = input.querySelector('[data-el="arrow"]');

    items.forEach((item) => {
      item.addEventListener("click", () => {
        selectElement(select, input, item);
        closeDropdown(dropdown);
        rotateArrow(arrow, "down");
      });
    });
  };

  const clickSelectInput = (select) => {
    const dropdown = select.querySelector('div[data-el="dropdown"]');
    const input = select.querySelector('div[data-el="input"]');
    const arrow = input.querySelector('[data-el="arrow"]');

    input.addEventListener("click", () => {
      toggleOpenedDropdown(dropdown, arrow);
      clickSelectItem(select, input, dropdown);
    });
  };

  selects.forEach((select) => {
    clickSelectInput(select);
  });
};
