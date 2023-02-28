import Category from 'src/app/models/Category';

export const categories: Category[] = [
  {
    name: 'Airtime & Subscription',
    icon: '📱',
    isExpense: true,
  },
  {
    name: 'Cinema',
    icon: '🎬',
    isExpense: true,
  },
  { name: 'Food', icon: '🥘', isExpense: true },
  { name: 'Fuel', icon: '⛽️', isExpense: true },
  { name: 'Gift', icon: '🎁', isExpense: true },
  {
    name: 'Income & Earnings',
    icon: '💰',
    isExpense: false,
  },
  { name: 'Medicare', icon: '💉', isExpense: true },
  { name: 'School', icon: '🎓', isExpense: true },
  { name: 'Shopping', icon: '🛒', isExpense: true },
  {
    name: 'Utility bills',
    icon: '📜',
    isExpense: true,
  },
];
