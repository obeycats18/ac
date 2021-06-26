import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export const checkout = () => {
  const activeProgram = document.querySelector(".programs-tabs__tab--active");

  if (!activeProgram) {
    return;
  }

  const formValues = JSON.parse(window.localStorage.getItem("form"));

  if (!formValues) {
    return gsap.to(window, { duration: 1, scrollTo: "#js-section-checkout" });
  }

  window.localStorage.setItem(
    "form",
    JSON.stringify({ ...formValues, program: activeProgram.dataset.value })
  );

  window.open("checkout.html");
};

export const buttons = () => {
  const scrollButtons = document.querySelectorAll('[data-behavior="scroll"]');
  const checkoutButtons = document.querySelectorAll(
    '[data-behavior="checkout"]'
  );

  checkoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      checkout();
    });
  });

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      gsap.to(window, { duration: 1, scrollTo: "#js-section-checkout" });
    });
  });
};
