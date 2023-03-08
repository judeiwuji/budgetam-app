import Transaction from './Transaction';

export default class Category {
  public id?: string;
  public name!: string;
  public icon!: string;
  public isExpense = true;
  public key?: any;
  public transactions?: Transaction[];
}
