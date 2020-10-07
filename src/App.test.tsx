import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


describe('calendar', () => {
  beforeEach(() => {
    render(<App />);
  })
  test('renders calendar table', () => {
    const table = screen.getByRole('table');
    const tableRows = screen.getAllByRole('row');
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(table.scrollLeft).toBe(0);
    expect(tableRows).toHaveLength(5);
    tableRows.forEach(row => expect(row.children).toHaveLength(columnHeaders.length))
  });
});