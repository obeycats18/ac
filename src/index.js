import "./styles/index.scss";

import { faq } from "./js/faq";
import { program } from "./js/programs";
import { buttons } from "./js/button";
import { checkout } from "./js/checkout";
import { languages } from "./js/languages";
import { back } from "./js/back";

import { Form } from "./js/Checkout/form";

const isMain = document.body.getAttribute("id") === "main";
const isCheckout = document.body.getAttribute("id") === "checkout";

if (isMain) {
  faq();
  program();
  buttons();
  checkout();
  languages();
} else if (isCheckout) {
  new Form();
  back();
}
