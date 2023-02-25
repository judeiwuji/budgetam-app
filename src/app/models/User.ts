export default class User {
  public id!: string;
  public email = 'guest@budgetam.com';
  public avatar?: string;
  public password?: string;

  constructor(public username: string) {}
}
