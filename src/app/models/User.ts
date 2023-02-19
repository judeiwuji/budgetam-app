export default class User {
  public id!: string;
  public email!: string;
  public avatar?: string;

  constructor(public username: string) {}
}
