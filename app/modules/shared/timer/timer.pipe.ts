import { Pipe, PipeTransform } from '@angular/core'
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | timer:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({ name: 'timer' })
export class TimerPipe implements PipeTransform {
    transform(length: number): string {
        const s: number = length / 1000000

        const minutes: string = String(Math.floor(s / 60))
        let seconds: string = String(Math.floor(s % 60))

        if ((s % 60) < 10) seconds = `0${seconds}`
        return `${minutes}:${seconds}`
    }
}
