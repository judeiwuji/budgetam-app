import { Subject } from 'rxjs';
import Transaction, { EditedTransaction } from '../models/Transaction';

export default class TransactionProvider {
  private static instance: TransactionProvider;
  private editTransactionSubject = new Subject<EditedTransaction>();
  private deleteTransactionSubject = new Subject<Transaction>();
  private createTransactionSubject = new Subject<Transaction>();

  private constructor() {}

  public static getInstance() {
    if (!TransactionProvider.instance) {
      TransactionProvider.instance = new TransactionProvider();
    }
    return TransactionProvider.instance;
  }

  public createTransaction(transaction: Transaction) {
    this.createTransactionSubject.next(transaction);
  }

  public onCreateTransaction(action: (transaction: Transaction) => void) {
    return this.createTransactionSubject.subscribe(action);
  }

  public editTransaction(edited: EditedTransaction) {
    this.editTransactionSubject.next(edited);
  }

  public onEditTransaction(action: (edited: EditedTransaction) => void) {
    return this.editTransactionSubject.subscribe(action);
  }

  public deleteTransaction(transaction: Transaction) {
    this.deleteTransactionSubject.next(transaction);
  }

  public onDeleteTransaction(action: (transaction: Transaction) => void) {
    return this.deleteTransactionSubject.subscribe(action);
  }
}
