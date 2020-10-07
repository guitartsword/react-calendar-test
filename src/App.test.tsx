import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';


describe('calendar', () => {
  beforeEach(() => {
    render(
      <App />
    );
  })
  test('renders calendar table', () => {
    const table = screen.getByRole('table');
    const tableRows = screen.getAllByRole('row');
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(table.scrollLeft).toBe(0);
    expect(tableRows).toHaveLength(5);
    tableRows.forEach(row => expect(row.children).toHaveLength(columnHeaders.length))
  });
  test('scroll position should be save on local storage', () => {
    const tableContainer = screen.getByRole('table').parentElement;
    expect(tableContainer).toBeTruthy();
    if (!tableContainer) {
      throw new Error('Impossible');
    }
    expect(localStorage).toHaveLength(0);
    const scrollAmount = 300;
    fireEvent.scroll(tableContainer, {
      target: {scrollLeft: scrollAmount}
    });
    expect(localStorage.getItem('calendar.2020')).toBe(scrollAmount.toString());
  })
});