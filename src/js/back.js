export const back = () => {
  const backBtn = document.querySelector('[data-el="back-button"]');

  if (!backBtn) {
    return;
  }

  backBtn.addEventListener("click", () => {
    window.location.replace("/");
  });
};
