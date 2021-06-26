import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { select } from "./select";
import { tags } from "./tags";

import { Calendar } from "./Calendar/Calendar";

gsap.registerPlugin(ScrollToPlugin);

export const checkout = () => {
  const form = document.querySelector("#js-checkout-form");
  const inputs = Array.from(form.querySelectorAll("input"));

  new Calendar({
    onSelect: ({ date }) => {
      const opened = document.querySelector(".select__dropdown--active");

      if (opened) {
        opened.classList.remove("select__dropdown--active");
      }

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
      saveToStorage(filledInputs);

      gsap.to(window, { duration: 1, scrollTo: "#js-section-program" });
    }
  };

  const saveToStorage = (inputs) => {
    if (!inputs) {
      return;
    }

    const values = inputs.reduce((acc, input) => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value");

      acc[name] = value;

      return acc;
    }, {});

    window.localStorage.setItem("form", JSON.stringify(values));
  };

  select(onSelectHandler);
  tags(onSelectHandler);
};
