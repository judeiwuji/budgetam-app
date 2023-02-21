export default class User {
  public id!: string;
  public email = 'guest@budgetam.com';
  public avatar?: string;

  constructor(public username: string) {}
}
