import {
  addMonths,
  addDays,
  subDays,
  subMonths,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDate,
  isEqual,
  format,
  differenceInCalendarDays,
  isWithinInterval,
  isBefore,
} from "date-fns";

import { uk } from "date-fns/locale";

import flat from "lodash.flatten";

export class Dates {
  /**
   * Current left month, right month
   * {left: Date, right: Date}
   *
   **/

  _current;

  /**
   * Range of selected dates
   * [Date]
   *  */
  _range;

  /**
   * Selected start date
   **/
  _start;

  /**
   * Selected end date
   **/
  _end;

  constructor() {
    this._current = new Proxy(
      { left: this.getDateByMonth(0), right: this.getDateByMonth(1) },
      {
        set: (object, props, value) => {
          object[props] = value;
          return true;
        },
      }
    );
  }

  /**
   * Return next month
   * */

  next() {
    this._current.left = addMonths(this._current.left, 1);
    this._current.right = addMonths(this._current.right, 1);
  }

  /**
   * Return prev month
   * */

  prev() {
    this._current.left = subMonths(this._current.left, 1);
    this._current.right = subMonths(this._current.right, 1);
  }

  /**
   * Return array of days number
   * */

  getCurrentDays() {
    return { left: this._getLeftDays(), right: this._getRightDays() };
  }

  /**
   * Return array of days in month. Date is day from month
   * */

  _getDaysInMonth(date) {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return eachDayOfInterval({ start, end });
  }

  /**
   * Return date when she from current month
   * */

  isDayInCurrentMonth(date, from) {
    const days = this._getDaysInMonth(from);

    return days.find((day) => isEqual(date, day));
  }

  /**
   * Return array of weeks in month
   * */

  _getWeeksInMonth(start, end) {
    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
  }

  /**
   * Return array of day for left month
   * */

  _getLeftDays() {
    const startMonth = this._current.left;
    const endMonth = addDays(this._current.right, 7);

    const weeks = this._getWeeksInMonth(startMonth, endMonth);

    return this._getDayOfWeeks(weeks);
  }

  /**
   * Return array of day for right month
   * */

  _getRightDays() {
    const startMonth = this._current.right;
    const endMonth = addDays(addMonths(this._current.right, 1), 7);

    const weeks = this._getWeeksInMonth(startMonth, endMonth);

    return this._getDayOfWeeks(weeks);
  }

  /**
   * Map array of weeks to array of days
   * */

  _getDayOfWeeks(interval) {
    const weeks = interval
      .map((start, index) => {
        if (index + 1 < interval.length) {
          return eachDayOfInterval({
            start,
            end: subDays(interval[index + 1 || index], 1),
          });
        }
      })
      .filter(Boolean);

    return flat(weeks);
  }

  /**
   * Set start date
   * */

  setStart(date) {
    if (typeof date !== "string") {
      throw new Error("Date must be string");
    }

    if (this._start) {
      return;
    }

    this._start = new Date(date);
  }

  /**
   * Set end date
   * */

  setEnd(date) {
    if (typeof date !== "string") {
      throw new Error("Date must be string");
    }

    if (!this._start) {
      return;
    }

    let d = new Date(date);

    if (isEqual(this._start, d)) {
      throw new Error("Start and end dates must be unique");
    }

    if (!this._isMoreOrEqualThenMin(this._start, d)) {
      throw new Error(
        "Range of start and end dates must be more or equal them 3"
      );
    }

    this._end = d;
  }

  /**
   * Set end date
   * */

  setRange() {
    if (!this._start && !this._end) {
      return;
    }

    this._range = this.getDaysInterval(this._start, this._end);
  }

  /**
   * Reset start, end, range
   * */

  reset() {
    if (!this._start && !this._end && !this._range) {
      return;
    }

    this._start = null;
    this._end = null;
    this._range = null;
  }

  /**
   * Return boolean if date in interval
   * */

  isDateInInterval(date, interval) {
    return isWithinInterval(date, {
      start: interval[0],
      end: interval[interval.length - 1],
    });
  }

  /**
   * Get start date
   * */

  getStart() {
    return this._start;
  }

  /**
   * Get end date
   * */

  getEnd() {
    return this._end;
  }

  /**
   * Get range from start to end dates
   * */

  getRange() {
    return this._range;
  }

  /**
   * Detect if range of start and date more or equal 3
   * */

  _isMoreOrEqualThenMin(start, end) {
    const MIN = 1;
    const diff = differenceInCalendarDays(end, start);

    return diff > MIN || diff < -MIN;
  }

  /**
   * Return array of days from start date to end date
   * */

  getDaysInterval(start, end) {
    if (isBefore(end, start)) {
      return eachDayOfInterval({
        start: addDays(end, 1),
        end: subDays(start, 1),
      });
    }

    return eachDayOfInterval({
      start: addDays(start, 1),
      end: subDays(end, 1),
    });
  }

  /**
   * Detect equal date
   * */

  isDateEqual(left, right) {
    return isEqual(left, right);
  }

  /**
   * Map object date to day number
   * */

  toDay(date) {
    return getDate(date);
  }

  /**
   * Format MMMM-YYYY
   * */

  toMothText(date) {
    const formatted = format(date, "LLLL yyyy", { locale: uk });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  /**
   * Return text range of start, end
   * */

  toRangeText() {
    const FORMAT = "dd.LL.yyyy";

    if (!this._start && !this._end) {
      return;
    }

    const formattedStart = format(this._start, FORMAT);
    const formattedEnd = format(this._end, FORMAT);

    return `${formattedStart} - ${formattedEnd}`;
  }

  /**
   * Return Date object by month number
   * */

  getDateByMonth(month) {
    return startOfMonth(addMonths(new Date(), month));
  }

  /**
   * Return {left: Date, right: Date}
   * */

  getCurrent() {
    return this._current;
  }

  /**
   * Return range of selected days
   * */

  getRange() {
    return this._range;
  }
}
