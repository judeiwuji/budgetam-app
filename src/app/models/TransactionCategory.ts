import Category from './Category';
import Transaction from './Transaction';

export default class TransactionCategory {
  constructor(
    public category: Category,
    public amount: number,
    public count: number
  ) {}
}
