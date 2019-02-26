import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCounter'
})
export class FormatCounterPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    return value <= 99 ? value.toString() : '99+';
  }

}
