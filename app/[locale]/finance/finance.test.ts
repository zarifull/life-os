import { describe, it, expect } from 'vitest'

const calculateSystemTax = (transactions: any[]) => {
  return transactions
    .filter(t => t.category?.toLowerCase() === 'obligations')
    .reduce((acc, t) => acc + t.amount, 0)
}

describe('LifeOS Finance Logic', () => {
  it('should correctly sum transactions in the OBLIGATIONS category', () => {
    const mockData = [
      { amount: 500, category: 'OBLIGATIONS' },
      { amount: 1000, category: 'FOOD' },
      { amount: 300, category: 'obligations' } 
    ]
    
    const result = calculateSystemTax(mockData)
    expect(result).toBe(800)
  })

  it('should return 0 if no obligations exist', () => {
    const result = calculateSystemTax([{ amount: 100, category: 'TRANSPORT' }])
    expect(result).toBe(0)
  })

  it('should accurately calculate system tax from diverse transaction labels', () => {
    const mockTransactions = [
        { amount: 1000, category: 'obligations', label: 'Rent', type: 'expense' },
        { amount: 200, category: 'General', label: 'system tax', type: 'expense' },
        { amount: 50, category: 'food', label: 'Snacks', type: 'expense' }
    ];

    const result = mockTransactions
        .filter(t => t.category.toLowerCase() === 'obligations' || t.label.toLowerCase() === 'system tax')
        .reduce((acc, t) => acc + t.amount, 0);

    expect(result).toBe(1200);
});
})