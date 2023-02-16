export default class User {
  public email!: string;
  public avatar?: string;

  constructor(public username: string) {}
}
