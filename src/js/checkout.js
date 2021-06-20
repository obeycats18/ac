import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { select } from "./select";
import { tags } from "./tags";

import { Calendar } from "./Calendar/Calendar";

gsap.registerPlugin(ScrollToPlugin);

export const checkout = () => {
  const form = document.querySelector("#js-checkout-form");
  const inputs = Array.from(form.querySelectorAll("input"));

  const calendar = new Calendar({
    onSelect: ({ date }) => {
      onSelectHandler(date, "date");
    },
  });

  const onSelectHandler = (value, name) => {
    if (!value || !name) return;

    inputs.forEach((input) => {
      if (input.getAttribute("name") === name) {
        input.setAttribute("value", value);
      }
    });

    onFormChange();
  };

  const onFormChange = () => {
    const filledInputs = inputs.filter((input) => input.getAttribute("value"));

    if (filledInputs.length === inputs.length) {
      gsap.to(window, { duration: 1, scrollTo: "#js-section-program" });
    }
  };

  select(onSelectHandler);
  tags(onSelectHandler);
};
