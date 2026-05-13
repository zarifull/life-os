import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LifeDurationCounter from './LifeDurationCounter';

describe('LifeDurationCounter Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockDate = new Date(2026, 4, 13);
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('should calculate the correct duration from a birth date', () => {
    const birthDate = new Date(2000, 0, 1).toISOString(); 
    
    render(<LifeDurationCounter birthDate={birthDate} />);

    expect(screen.getByText('26')).toBeInTheDocument();
    
    expect(screen.getByText(/years/i)).toBeInTheDocument();
  });

  it('should update the counter every second', () => {
    const birthDate = new Date(2000, 0, 1).toISOString();
    render(<LifeDurationCounter birthDate={birthDate} />);

    const initialSeconds = screen.getByText(/:[0-9]{2}/i).textContent;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const updatedSeconds = screen.getByText(/:[0-9]{2}/i).textContent;
    
    expect(initialSeconds).not.toBe(updatedSeconds);
  });
});