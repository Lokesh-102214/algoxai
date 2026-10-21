import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SortingVisualizer from '../SortingVisualizer';

describe('SortingVisualizer Component', () => {
  it('renders sorting visualizer controls and action buttons', () => {
    render(<SortingVisualizer />);

    // Check presence of control labels
    expect(screen.getByText('Algorithm')).toBeInTheDocument();
    expect(screen.getByText(/Array Size/i)).toBeInTheDocument();
    expect(screen.getByText(/Speed/i)).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByRole('button', { name: /Start Sort/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate/i })).toBeInTheDocument();

    // Check exact legend text
    expect(screen.getByText('Unsorted')).toBeInTheDocument();
    expect(screen.getByText('Comparing')).toBeInTheDocument();
    expect(screen.getByText('Sorted')).toBeInTheDocument();
  });
});
