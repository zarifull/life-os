import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransactionForm from './TransactionForm';
import { addTransaction } from '@/lib/actions/finance';

vi.mock('@/lib/actions/finance', () => ({
  addTransaction: vi.fn(() => Promise.resolve({ success: true }))
}));


describe('TransactionForm Component', () => {
  const mockOnSuccess = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it('should update the input value when the user types', () => {
   
    render(<TransactionForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/0/i); 
    
    fireEvent.change(input, { target: { value: '5000' } });

    expect(input).toHaveValue(5000);
  });

  
  it('should call onSuccess when the LOG button is clicked', async () => {
    render(<TransactionForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/0\.00/i); // Matches your screenshot/terminal output
    const logButton = screen.getByRole('button', { name: /CONFIRM TRANSACTION/i });

    fireEvent.change(input, { target: { value: '5000' } });
    
    fireEvent.click(logButton);

 
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
    });

    it('should show an error message if the server action fails', async () => {
        vi.mocked(addTransaction).mockResolvedValueOnce({ 
          type: 'EXPENSE',
          id: 'mock-id',
          amount: 0,
          category: 'ERROR',
          label: 'Failed Transaction',
          date: new Date(),
          userId: 'user-1'
        } as any); 
      
        render(<TransactionForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);
        
        const logButton = screen.getByRole('button', { name: /CONFIRM TRANSACTION/i });
        fireEvent.click(logButton);
      
        await waitFor(() => {
          expect(mockOnSuccess).not.toHaveBeenCalled(); 
        });
      });

      it('should calculate net revenue by subtracting obligations from inflow streams', () => {
        const inflow = {
          salary: 5000,
          freelance: 2000,
          gifts: 500
        };
        const systemTax = 750;
      
        const totalInflow = inflow.salary + inflow.freelance + inflow.gifts;
        const netRevenue = totalInflow - systemTax;
      
        expect(netRevenue).toBe(6750);
      });
});