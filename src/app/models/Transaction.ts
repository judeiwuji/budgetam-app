import Category from './Category';

export default class Transaction {
  public id!: string;
  public categoryId!: string;
  public amount!: number;
  public note!: string;
  public date!: string;
  public category!: Category;
}

export class EditedTransaction {
  constructor(
    public oldTransaction: Transaction,
    public newTransaction: Transaction
  ) {}
}
