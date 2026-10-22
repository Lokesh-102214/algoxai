import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PathfindingVisualizer from '../PathfindingVisualizer';

describe('PathfindingVisualizer Component', () => {
  it('renders pathfinding controls, buttons, and legend', () => {
    render(<PathfindingVisualizer />);

    // Check control elements
    expect(screen.getByText('Algorithm')).toBeInTheDocument();
    expect(screen.getByText(/Delay:/i)).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByRole('button', { name: /Find Path/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Path/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Walls/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share Link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Trace/i })).toBeInTheDocument();

    // Check legend items
    expect(screen.getByText('Start Node')).toBeInTheDocument();
    expect(screen.getByText('Target Node')).toBeInTheDocument();
    expect(screen.getByText(/Wall \/ Obstacle/i)).toBeInTheDocument();
    expect(screen.getByText('Shortest Path')).toBeInTheDocument();
  });
});
