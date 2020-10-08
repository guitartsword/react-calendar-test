import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
// import App from './App';
import processMock from '../public/api/process.json';
import rentItem from '../public/api/rent_item.json';
import BookingCalendar from './BookingCalendar/BookingCalendar';

const mockFetch:Partial<typeof fetch> = jest.fn((url) =>
  Promise.resolve({
    json: () => {
      switch(url) {
        case '/api/process':
        case '/api/process.json':
          return Promise.resolve(processMock)
        case '/api/rent_item':
        case '/api/rent_item.json':
          return Promise.resolve(rentItem)
        default: 
          throw new Error(`Unhandled request for: ${url}`);
      }
    },
  })
);
window.fetch = mockFetch as any;

describe('calendar', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <BookingCalendar />
      );
    });
  })
  test('renders calendar table', () => {
    const table = screen.getByRole('table');
    const tableRows = screen.getAllByRole('row');
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(table.scrollLeft).toBe(0);
    expect(tableRows).toHaveLength(5);
    tableRows.forEach(row => expect(row.children).toHaveLength(columnHeaders.length));
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