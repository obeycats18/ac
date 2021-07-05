import { differenceInCalendarDays } from "date-fns";

export class Form {
  PREMIUM_PRICE = 1.2;
  BASE_PRICE = 0.8;

  _count;
  _price;

  _addBtnEl;
  _checkoutBtnEl;
  _formEl;
  _visitorsBlockEl;

  _priceBlockEl;

  constructor() {
    this._count = new Proxy(
      {
        number: parseInt(JSON.parse(window.localStorage.getItem("form")).count),
      },
      {
        set: (object, props, value) => {
          object[props] = value;
          this._render();
          return true;
        },
      }
    );

    document.addEventListener("DOMContentLoaded", () => {
      this._form = document.querySelector('[data-el="checkout-form]');
      this._visitorsBlockEl = document.querySelector('[data-el="visitors"]');
      this._addBtnEl = document.querySelector('[data-el="add-button"]');
      this._checkoutBtnEl = document.querySelector(
        '[data-el="checkout-button"]'
      );
      this._priceBlockEl = document.querySelector('[data-el="price-block"]');

      this._render();

      this._createInputListeners();
      this._createAddBtnListener();
      this._createCheckoutButtonListener();
    });
  }

  /**
   * Decrement this._count.number
   * */

  _remove(visitor) {
    if (!visitor || this._count.number <= 0) {
      return;
    }

    this._count.number = this._count.number - 1;
  }

  /**
   * Increment this._count.number
   * */

  _add() {
    if (this._count.number >= 4) {
      return;
    }

    this._count.number = this._count.number + 1;
  }

  _calculatePrice() {
    const form = JSON.parse(window.localStorage.getItem("form"));

    if (!form) {
      return;
    }

    const [start, end] = form.date.split("-");

    const diff = differenceInCalendarDays(
      this._toDate(end),
      this._toDate(start)
    );

    this._price = (
      this._count.number *
      (form.program === "Premium" ? this.PREMIUM_PRICE : this.BASE_PRICE) *
      diff
    ).toFixed(1);
  }

  _render() {
    if (this._count.number === 1) {
      this._renderOneVisitor();
    } else {
      this._renderVisitor();
    }

    this._renderPriceBlock();
  }

  /**
   * Set value in price block
   * */

  _renderPriceBlock() {
    const programEl = this._priceBlockEl.querySelector('[data-el="program"]');
    const countEl = this._priceBlockEl.querySelector('[data-el="count"]');
    const countryEl = this._priceBlockEl.querySelector('[data-el="country"]');
    const dateEl = this._priceBlockEl.querySelector('[data-el="date"]');
    const priceEl = this._priceBlockEl.querySelector('[data-el="price"]');

    if (!programEl || !countEl || !countryEl || !dateEl) {
      return;
    }

    const form = JSON.parse(window.localStorage.getItem("form"));

    if (!form) {
      return;
    }

    const { program, date, country } = form;

    this._calculatePrice();

    const [start, end] = date.split("-");

    programEl.innerText = `Програма: ${program}`;
    countEl.innerText = `Застрахованих: ${this._count.number}`;
    countryEl.innerText = `Країна вильоту: ${country}`;
    dateEl.innerHTML = `Період страхування: <br/> з ${start.trim()} по ${end.trim()}`;
    priceEl.innerText = `Вартість: ${this._price} €`;
  }

  /**
   * Create visitor HTML element from count number. Paste to visitorsBlockEl
   * */

  _renderVisitor() {
    if (!this._visitorsBlockEl) {
      return;
    }

    this._visitorsBlockEl.innerHTML = "";

    const _inputs = [
      { name: "fullname", placeholder: "Призвище та Ім’я латиницею*" },
      { name: "datePassport", placeholder: "Дата видачі паспорту*" },
      { name: "numberPassport", placeholder: "Номер паспорту*" },
      { name: "address", placeholder: "Адреса*" },
    ];

    for (let i = 1; i <= this._count.number; i++) {
      if (i === 1) {
        this._renderFirstVisitor();
      } else {
        const inputsEl = this._createInputs(_inputs, i);

        this._visitorsBlockEl.insertAdjacentHTML(
          "beforeend",
          `
                    <div class="visitors__item" data-el="visitor" data-id="${
                      i - 1
                    }">
                        <div class="visitors__item-top">
                            <h3
                              data-el="visitor-number"
                              class="
                                  content__headline--h3 content__headline--h3_main
                              "
                            >
                            </h3>
            
                            <svg class="visitors__item-remove" data-el="visitors-remove" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 9.5C10.9142 9.5 11.25 9.83579 11.25 10.25V16.75C11.25 17.1642 10.9142 17.5 10.5 17.5C10.0858 17.5 9.75 17.1642 9.75 16.75V10.25C9.75 9.83579 10.0858 9.5 10.5 9.5Z" fill="#E72D2B"/>
                                <path d="M14.25 10.25C14.25 9.83579 13.9142 9.5 13.5 9.5C13.0858 9.5 12.75 9.83579 12.75 10.25V16.75C12.75 17.1642 13.0858 17.5 13.5 17.5C13.9142 17.5 14.25 17.1642 14.25 16.75V10.25Z" fill="#E72D2B"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.37821 7C8.82298 5.28892 10.3621 4 12 4C13.6379 4 15.177 5.28892 15.6218 7H18.25C18.6642 7 19 7.33579 19 7.75C19 8.16421 18.6642 8.5 18.25 8.5H17V17.25C17 18.7688 15.7688 20 14.25 20H9.75C8.23122 20 7 18.7688 7 17.25V8.5H5.75C5.33579 8.5 5 8.16421 5 7.75C5 7.33579 5.33579 7 5.75 7H8.37821ZM9.95815 7C10.3461 6.10403 11.2119 5.5 12 5.5C12.7881 5.5 13.6539 6.10403 14.0418 7H9.95815ZM8.5 17.25V8.5H15.5V17.25C15.5 17.9404 14.9404 18.5 14.25 18.5H9.75C9.05964 18.5 8.5 17.9404 8.5 17.25Z" fill="#E72D2B"/>
                            </svg>
                        </div>
                        ${inputsEl}
                    </div>
                `
        );
      }
    }

    this._renderCountToText();
    this._createRemoveListener();
  }

  _renderOneVisitor() {
    if (!this._visitorsBlockEl) {
      return;
    }

    this._visitorsBlockEl.innerHTML = "";

    const _inputs = [
      { name: "fullname", placeholder: "Призвище та Ім’я латиницею*" },
      { name: "datePassport", placeholder: "Дата видачі паспорту*" },
      { name: "numberPassport", placeholder: "Номер паспорту*" },
      { name: "address", placeholder: "Адреса*" },
      { name: "phone", placeholder: "Контактний телефон*" },
      { name: "email", placeholder: "Email*" },
    ];

    const inputsEl = this._createInputs(_inputs, 1);

    this._visitorsBlockEl.insertAdjacentHTML(
      "beforeend",
      `
            <div class="visitors__item" data-el="visitor" data-id="0">
                ${inputsEl}
            </div>
        `
    );
  }

  _renderFirstVisitor() {
    if (!this._visitorsBlockEl) {
      return;
    }

    this._visitorsBlockEl.innerHTML = "";

    const _inputs = [
      { name: "fullname", placeholder: "Призвище та Ім’я латиницею*" },
      { name: "datePassport", placeholder: "Дата видачі паспорту*" },
      { name: "numberPassport", placeholder: "Номер паспорту*" },
      { name: "address", placeholder: "Адреса*" },
      { name: "phone", placeholder: "Контактний телефон*" },
      { name: "email", placeholder: "Email*" },
    ];

    const inputsEl = this._createInputs(_inputs, 1);

    this._visitorsBlockEl.insertAdjacentHTML(
      "beforeend",
      `
                <div class="visitors__item" data-el="visitor" data-id="0">
                    <div class="visitors__item-top">
                        <h3
                          data-el="visitor-number"
                          class="
                              content__headline--h3 content__headline--h3_main
                          "
                        >
                        </h3>
                    </div>
                    ${inputsEl}
                </div>
            `
    );
  }

  /**
   * Create and return list of inputs element
   * */

  _createInputs(inputs, index) {
    if (!inputs) {
      return;
    }

    const template = ({ name, placeholder }) => `
        <div class="field">
            <input
                type="text"
                placeholder="${placeholder}"
                name="visitor-${index}.${name}"
                class="field__input"
            />
            <svg
                class="field--success__icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7 13L9.72727 16L17 8"
                    stroke="#464EFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>

            <span class="content__caption content__caption--accent error-text">Заповніть обов’язкове поле "${placeholder}"</span>
        </div>
    `;

    return inputs
      .map(({ name, placeholder }) => template({ name, placeholder }))
      .join("\n");
  }

  /**
   * Render count to text format
   * */

  _renderCountToText() {
    const visitors = document.querySelectorAll('[data-el="visitor"]');

    if (!visitors) {
      return;
    }

    visitors.forEach((visitor) => {
      const headline = visitor.querySelector('[data-el="visitor-number"]');
      const id = visitor.dataset.id;

      headline.innerText = `${this._countToText(id)} подорожуючий`;
    });
  }

  _isEmpty(value) {
    return !value.length;
  }

  _validateOne(input) {
    if (!input) return;

    const value = input.value;

    return !this._isEmpty(value);
  }

  _validateMany(inputs) {
    if (!inputs) return;

    return Array.from(inputs).filter((input) => !this._validateOne(input));
  }

  /**
   * Add button listener
   * */

  _createAddBtnListener() {
    if (!this._addBtnEl) {
      return;
    }

    this._addBtnEl.addEventListener("click", (event) => {
      event.preventDefault();
      this._add();
    });
  }

  /**
   * Remove button listener
   * */

  _createRemoveListener() {
    const removeBtns = document.querySelectorAll('[data-el="visitors-remove"]');

    if (!removeBtns) return;

    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const root = target.parentNode?.parentNode;

        this._remove(root);
      });
    });
  }

  /**
   * Create input listener for validate and set value
   * */

  _createInputListeners() {
    const fields = document.querySelectorAll(".field__input");

    if (!fields) {
      return;
    }

    fields.forEach((field) => {
      field.addEventListener("input", (event) => {
        const input = event.target;

        field.setAttribute("value", input.value);
        const isValid = this._validateOne(input);

        if (!isValid) {
          field.parentNode.classList.add("field--error");
        } else {
          field.parentNode.classList.remove("field--error");
          field.parentNode.classList.add("field--success");
        }
      });
    });
  }

  /**
   * Create listener for checkout button.
   * Prevent default behavior form and send request with Fetch API
   * */

  _createCheckoutButtonListener() {
    const checkoutButton = document.querySelector(
      '[data-el="checkout-button"]'
    );

    if (!checkoutButton) {
      return;
    }

    checkoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      const fields = document.querySelectorAll(".field__input");

      const notValidInputs = this._validateMany(fields);

      if (notValidInputs.length) {
        notValidInputs.forEach((input) => {
          input.parentNode.classList.add("field--error");
        });

        return;
      }

      const visitors = [];
      const { country, date, program } = JSON.parse(
        window.localStorage.getItem("form")
      );
      let payload = {};

      fields.forEach((field) => {
        const name = field.getAttribute("name");
        const value = field.getAttribute("value");

        visitors.push({ [name]: value });
      });

      /**
       * Data who you can send to server
       * */
      payload = {
        visitors,
        info: {
          count: this._count.number,
          country,
          date,
          program,
        },
      };

      // Send request to server here ...
    });
  }

  /**
   * Map count to text format
   * */

  _countToText(id) {
    const countStrings = ["Перший", "Другий", "Третій", "Четвертий"];

    return countStrings[id];
  }

  _toDate(date) {
    const d = new Date();
    const [day, month, year] = date.split(".");
    d.setMonth(month);
    d.setDate(day);
    d.setFullYear(year);

    return d;
  }
}
