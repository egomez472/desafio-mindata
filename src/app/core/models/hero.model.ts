export class HeroModel {
  constructor(
    public name: string,
    public alias: string,
    public powers: string[],
    public team: string,
    public img: string
  ) {}
}

export interface Hero {
  id?: number | string;
  name: string;
  alias: string;
  powers: string[];
  team: string;
  img?: string;
}
