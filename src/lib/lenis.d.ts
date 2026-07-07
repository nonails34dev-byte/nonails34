export default class Lenis {
  constructor(options?: any);
  destroy(): void;
  raf(time: number): void;
  on(event: string, callback: Function): void;
  scrollTo(target: any, options?: any): void;
}
