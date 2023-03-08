import Category from './Category';

export default class TransactionCategory {
  constructor(
    public category: Category,
    public amount: number,
    public count: number
  ) {}
}
