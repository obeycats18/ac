export const tags = (onSelectHandler) => {
  const tagsEl = document.querySelectorAll('[data-el="tag"]');

  const unselect = (tag) => {
    if (!tag) return;

    return tag.classList.remove("tag--active");
  };

  const select = (tag) => {
    if (!tag) return;
    const name = tag.dataset.name;
    const value = tag.innerText;

    tagsEl.forEach((t) => unselect(t));

    if (onSelectHandler) {
      onSelectHandler(value, name);
    }

    return tag.classList.add("tag--active");
  };

  tagsEl.forEach((tag) => {
    tag.addEventListener("click", () => {
      select(tag);
    });
  });
};
