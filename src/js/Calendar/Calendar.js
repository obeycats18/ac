import { Dates } from "./Dates";
import { Render } from "./Render";

export class Calendar {
  CALENDAR_ROOT_ELEMENT = "#js-calendar";

  /**
   * Instanse Dates class
   * */

  _dates;

  /**
   * Instanse Render class
   * */

  _render;

  /**
   * Root calendar element
   * `#js-calendar`
   * */

  _root;

  constructor(options = {}) {
    const { onSelect } = options;

    this._root = document.querySelector(this.CALENDAR_ROOT_ELEMENT);

    this._dates = new Dates();
    this._render = new Render(this._dates, { root: this._root, onSelect });

    this._render.renderDays();
    this._render.renderMonth();
    this._render.createDaySelectListener();

    this._createArrowListener();
  }

  /**
   * Create listener for left, right listener
   * */

  _createArrowListener() {
    const leftArrowEl = this._root.querySelector('[data-el="arrow-left"]');
    const rightArrowEl = this._root.querySelector('[data-el="arrow-right"]');

    leftArrowEl.addEventListener("click", () => {
      this._dates.prev();
      this._render.renderDays();
      this._render.renderMonth();
    });

    rightArrowEl.addEventListener("click", () => {
      this._dates.next();
      this._render.renderDays();
      this._render.renderMonth();
    });
  }
}
