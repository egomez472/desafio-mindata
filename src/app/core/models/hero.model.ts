export class HeroModel {
  constructor(
    public id: number,
    public name: string,
    public alias: string,
    public powers: string[],
    public team: string,
    public img: string
  ) {}
}
