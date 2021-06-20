export const program = () => {
  const PANE_CLASS_HOVERED = "program-pane--hovered";
  const TAB_CLASS_HOVERED = "programs-pane--hovered";

  const PANE_CLASS_ACTIVE = "program-pane--active";
  const TAB_CLASS_ACTIVE = "programs-tabs__tab--active";

  const tabs = document.querySelectorAll('[data-el="tab"]');

  const hover = (panes, tab) => {
    if (!panes || !tab) return;

    panes.forEach((pane) => pane.classList.add(PANE_CLASS_HOVERED));
    tab.classList.add(TAB_CLASS_HOVERED);
  };

  const unhover = (panes, tab) => {
    if (!panes || !tab) return;

    panes.forEach((pane) => pane.classList.remove(PANE_CLASS_HOVERED));
    tab.classList.remove(TAB_CLASS_HOVERED);
  };

  const select = (panes, tab) => {
    if (!panes || !tab) return;

    panes.forEach((pane) => pane.classList.add(PANE_CLASS_ACTIVE));
    tab.classList.add(TAB_CLASS_ACTIVE);
  };

  const unselect = (panes, tab) => {
    if (!panes || !tab) return;

    panes.forEach((pane) => pane.classList.remove(PANE_CLASS_ACTIVE));
    tab.classList.remove(TAB_CLASS_ACTIVE);
  };

  tabs.forEach((tab) => {
    const tabID = tab.dataset.key;
    const panes = document.querySelectorAll(`[data-tab="${tabID}"]`);

    tab.addEventListener("click", () => {
      document.querySelectorAll('[data-el="tab"]').forEach((el) => {
        const panes = document.querySelectorAll(
          `[data-tab="${el.dataset.key}"]`
        );

        unselect(panes, el);
      });
      select(panes, tab);
    });

    tab.addEventListener("mousemove", () => {
      hover(panes, tab);
    });

    tab.addEventListener("mouseout", () => {
      unhover(panes, tab);
    });
  });
};
