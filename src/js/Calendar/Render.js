export class Render {
  CALENDAR_CONTAINER_ELEMENT = '[data-el="calendar--days-list"]';

  CALENDAR_DAYS_LEFT = '[data-el="calendar--days-left"]';
  CALENDAR_DAYS_RIGHT = '[data-el="calendar--days-right"]';

  MONTH_LEFT_ELEMENT = '[data-el="calendar-left-month"]';
  MONTH_RIGHT_ELEMENT = '[data-el="calendar-right-month"]';

  /**
   * Left container for list of days
   * [data-el="calendar--days-left"]
   * */

  _leftEl;

  /**
   * Right container for list of days
   * [data-el="calendar--days-right"]
   * */

  _rightEl;

  /**
   * Left container for list of days
   * [data-el="calendar--days-left"]
   * */

  _leftContainerEl;

  /**
   * Right container for list of days
   * [data-el="calendar--days-right"]
   * */

  _rightContainerEl;

  /**
   * Calendar root element
   * #js-calendar
   * */

  _root;

  /**
   * Class for manipulating with dates
   * */

  _dates;

  /**
   * OnSelect callback
   * */

  _onSelect;

  constructor(dates, { root, onSelect }) {
    this._root = root;
    this._onSelect = onSelect;

    this._leftEl = this._root.querySelector(this.CALENDAR_DAYS_LEFT);
    this._rightEl = this._root.querySelector(this.CALENDAR_DAYS_RIGHT);

    this._leftContainerEl = this._leftEl.querySelector(
      this.CALENDAR_CONTAINER_ELEMENT
    );
    this._rightContainerEl = this._rightEl.querySelector(
      this.CALENDAR_CONTAINER_ELEMENT
    );

    this._dates = dates;
  }

  /**
   * Render current month to left, right container
   * */

  renderMonth() {
    const leftMonthEl = this._leftEl.querySelector(this.MONTH_LEFT_ELEMENT);
    const rightMonthEl = this._rightEl.querySelector(this.MONTH_RIGHT_ELEMENT);

    leftMonthEl.innerText = this._dates.toMothText(
      this._dates.getCurrent().left
    );
    rightMonthEl.innerText = this._dates.toMothText(
      this._dates.getCurrent().right
    );
  }

  /**
   * Render days to left, right container
   * */

  renderDays() {
    const template = ({ day, className, date }) =>
      `<div class="day ${className}" data-date="${date}" >${day}</div>`;

    const { left, right } = this._dates.getCurrentDays();

    this._leftContainerEl.innerHTML = left
      .map((day) =>
        template({
          day: this._dates.toDay(day),
          className: !this._dates.isDayInCurrentMonth(
            day,
            this._dates.getCurrent().left
          )
            ? "day--not-current"
            : "",
          date: day,
        })
      )
      .join("\n");

    this._rightContainerEl.innerHTML = right
      .map((day) =>
        template({
          day: this._dates.toDay(day),
          className: !this._dates.isDayInCurrentMonth(
            day,
            this._dates.getCurrent().right
          )
            ? "day--not-current"
            : "",
          date: day,
        })
      )
      .join("\n");
  }

  /**
   * Add '--range' classes to '.day' element
   * */

  renderRange() {
    const range = this._dates.getRange();

    const days = this._getDaysEl();

    days.forEach((day) => {
      const date = new Date(day.dataset.date);

      if (this._dates.isDateInInterval(date, range)) {
        day.classList.add("day--range");
      }
    });
  }

  /**
   * Remove '--start', '--end', '--range', classes from '.day' elements
   * */

  resetRange() {
    const days = this._getDaysEl();

    days.forEach((day) => {
      day.classList.remove("day--start");
      day.classList.remove("day--end");
      day.classList.remove("day--range");
    });
  }

  /**
   * Click on '.day' element - select start, end days. Render range to container
   * */

  selectRange(event) {
    const target = event.target;
    const day = target.classList.contains("day") && target;

    if (!day) {
      return;
    }

    const date = day.dataset.date;

    if (
      this._dates.getStart() &&
      this._dates.getEnd() &&
      this._dates.getRange()
    ) {
      this._dates.reset();
      this.resetRange();
    }

    if (!this._dates.getStart()) {
      try {
        this._dates.setStart(date);
        day.classList.add("day--start");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        this._dates.setEnd(date);
        day.classList.add("day--end");
      } catch (error) {
        console.error(error);
      }
    }

    if (this._dates.getStart() && this._dates.getEnd()) {
      this._dates.setRange(date);
      this.renderRange();

      if (this._onSelect) {
        this._onSelect({ date: this._dates.toRangeText() });
        const select = document.querySelector(".select-calendar");
        const valueEl = select.querySelector(".select__input-value");

        valueEl.innerText = this._dates.toRangeText();
      }
    }
  }

  /**
   * Create click listener on right, left container
   * */

  createDaySelectListener() {
    const handler = (event) => this.selectRange(event);

    this._leftContainerEl.addEventListener("click", handler);
    this._rightContainerEl.addEventListener("click", handler);
  }

  /**
   * Return array of '.day' elements from right, left container
   * */

  _getDaysEl() {
    const leftDays = Array.from(this._leftContainerEl.querySelectorAll(".day"));
    const rightDays = Array.from(
      this._rightContainerEl.querySelectorAll(".day")
    );

    const days = [...leftDays, ...rightDays];

    return days;
  }
}
