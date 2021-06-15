export const program = () => {
  const tabs = document.querySelectorAll('[data-el="tab"]');
  const panes = document.querySelectorAll('[data-el="pane"]');

  const hover = (pane, tab) => {
    if (!pane || !tab) return;

    pane.classList.add("programs-pane--hovered");
    tab.classList.add("programs-tabs__tab--hovered");
  };

  const unhover = (pane, tab) => {
    if (!pane || !tab) return;

    pane.classList.remove("programs-pane--hovered");
    tab.classList.remove("programs-tabs__tab--hovered");
  };

  const select = (pane, tab) => {
    if (!pane || !tab) return;

    pane.classList.add("programs-pane--active");
    tab.classList.add("programs-tabs__tab--active");
  };

  const unselect = (pane, tab) => {
    if (!pane || !tab) return;

    pane.classList.remove("programs-pane--active");
    tab.classList.remove("programs-tabs__tab--active");
  };

  tabs.forEach((tab) => {
    const tabID = tab.dataset.key;
    const pane = document.querySelector(`[data-tab="${tabID}"]`);

    tab.addEventListener("click", () => {
      document.querySelectorAll('[data-el="tab"]').forEach((el) => {
        const pane = document.querySelector(`[data-tab="${el.dataset.key}"]`);

        unselect(pane, el);
      });
      select(pane, tab);
    });

    tab.addEventListener("mousemove", () => {
      hover(pane, tab);
    });

    tab.addEventListener("mouseout", () => {
      unhover(pane, tab);
    });
  });
};
