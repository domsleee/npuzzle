export class SquareModel {
  readonly digit: number;
  r: number;
  c: number;

  constructor(digit: number) {
    this.digit = digit;
    this.r = 0;
    this.c = 0;
  }
}