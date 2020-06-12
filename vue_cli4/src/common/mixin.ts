/*
 * @Date         : 2020-05-18 18:07:52
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 18:15:55
 * @FilePath     : \src\common\mixin.ts
 */

class Time {
  date: Date | [Date, Date];
  constructor(date: Date | [Date, Date]) {
    this.date = date;
  }

  private getString(date: Date): string {
    const Y = date.getFullYear();
    const M = date.getMonth() + 1;
    const D = date.getDate();
    return `${Y}-${M < 10 ? "0" + M.toString() : M}-${
      D < 10 ? "0" + D.toString() : D
    }`;
  }

  public get() {
    if (Array.isArray(this.date)) {
      const start = this.getString(this.date[0]);
      const end = this.getString(this.date[1]);
      return `${start}~${end}`;
    }
    return this.getString(this.date);
  }
}

export default Time;
