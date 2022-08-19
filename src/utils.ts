import {exRate} from './types';

export class Format {
  static IndicatorFormat(t: string): string {
    var txt = t.replace(/ /g, '').replace(/[^0-9]/g, '');
    return (
      txt.substring(0, 4) +
      ' ' +
      txt.substring(4, 6) +
      ' ' +
      txt.substring(6, 8) +
      ' ' +
      txt.substring(8, 10) +
      ' ' +
      txt.substring(10, 12)
    ).trim();
  }

  static SyndicateFormat(t: string): string {
    var txt = t.replace(/ /g, '').replace(/[^0-9]/g, '');
    return (txt.substring(0, 3) + ' ' + txt.substring(3, 6)).trim();
  }

  static DomainFormat(t: string): string {
    return t.toLowerCase()
  }

  static MobileNumberFormat(t: string): string {
    var txt = t
      .substring(3)
      .replace(/ /g, '')
      .replace(/[^0-9]/g, '');
    return (
      '+94 ' +
      (
        txt.substring(0, 2) +
        ' ' +
        txt.substring(2, 5) +
        ' ' +
        txt.substring(5, 11)
      ).trim()
    );
  }

  static Amount(val: string, replacer: string, minima?: number): string {
    var parse = parseInt(val.replace(/[^0-9]/g, ''), 10);
    var num = minima ? Math.min(parse, minima) : parse;
    return !isNaN(num)
      ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, replacer)
      : '';
  }

  static AmountWithDeci(
    val: string,
    replacer: string,
    minima?: number,
  ): string {
    var parse = parseFloat(
      parseFloat(val.replace(/[^0-9\\.]+/g, '')).toFixed(2),
    );
    var num = minima ? Math.min(parse, minima) : parse;
    return !isNaN(num)
      ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, replacer)
      : '';
  }
}

export class Utils {
  static exRates: [exRate | never] = [] as never;
  static async getExRates(start_date: Date, end_date: Date): Promise<[exRate]> {
    const resp = await fetch(
      `https://api.exchangerate.host/timeseries?base=USD&symbols=LKR&start_date=${
        start_date.toISOString().split('T')[0]
      }&end_date=${end_date.toISOString().split('T')[0]}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    ).then(res => res.json());
    this.exRates = [] as never;
    Object.keys(resp.rates).forEach(key => {
      this.exRates.push({
        date: key,
        rate: resp.rates[key].LKR,
      });
    });
    return this.exRates;
  }

  static nth(d: number) {
    if (d > 3 && d < 21) {
      return `${d}th`;
    }
    switch (d % 10) {
      case 1:
        return `${d}st`;
      case 2:
        return `${d}nd`;
      case 3:
        return `${d}rd`;
      default:
        return `${d}th`;
    }
  }

  static async asyncForEach(
    _arr: any[],
    _cb: (el: any, i: number, arr: any[]) => void,
  ) {
    for (let i = 0; i < _arr.length; i++) {
      await _cb(_arr[i], i, _arr);
    }
  }
}
