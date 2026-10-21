import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TowerOfHanoi from '../TowerOfHanoi';

describe('TowerOfHanoi Component', () => {
  it('renders tower pegs, stat cards, and control buttons', () => {
    render(<TowerOfHanoi />);

    // Peg labels
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Auxiliary')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();

    // Stats (using exact string match to avoid substring collision)
    expect(screen.getByText('Current Moves')).toBeInTheDocument();
    expect(screen.getByText('Minimum Moves')).toBeInTheDocument();
    expect(screen.getByText('Number of Disks')).toBeInTheDocument();

    // Action buttons
    expect(screen.getByRole('button', { name: /Solve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });
});
