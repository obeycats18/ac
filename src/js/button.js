import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export const buttons = () => {
  const scrollButtons = document.querySelectorAll('[data-behavior="scroll"]');

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      gsap.to(window, { duration: 1, scrollTo: "#js-section-checkout" });
    });
  });
};
