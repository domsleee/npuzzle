import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(milliseconds: number | null, ...args: unknown[]): string {
    if (milliseconds == null) return '';
    const dur = Duration.fromObject({milliseconds});
    return dur.toFormat('mm:ss') + '.' + this.getTenths(dur);
  }

  private getTenths(dur: Duration) {
    return (1000 + (dur.milliseconds % 1000)).toString().slice(-3, -1);
  }
}
