export default class Session {
  public id!: number;
  public userId?: string;

  constructor(public token: string, public isGuest: boolean) {}
}
