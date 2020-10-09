import React from 'react';
import * as testingLibrary from '@testing-library/react';
// import App from './App';
import processMock from '../../public/api/process.json';
import rentItem from '../../public/api/rent_item.json';
import BookingCalendar from './BookingCalendar';

const { act, fireEvent, render, screen } = testingLibrary;

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
  test('show saved range', () => {
    const tableRows = screen.getAllByRole('row');
    const item1range = testingLibrary.getAllByRole(tableRows[1], 'cell');
    const item4range = testingLibrary.getAllByRole(tableRows[4], 'cell');
    item1range.slice(0,5).forEach((cell) => {
      expect(cell).toHaveClass('book-day');
    });
    const octoberRange = item4range.filter((cell) => {
      return cell.classList.contains('book-day');
    });
    expect(octoberRange).toHaveLength(30);
  })
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
  });
  test('has holiday class on header and cells', () => {
    const cells = screen.getAllByRole('cell');
    const headers = screen.getAllByRole('columnheader');
    expect(cells).toHaveLength(366*4);
    expect(headers).toHaveLength(366);
    expect(headers[0]).not.toHaveClass('holiday');
    expect(headers[1]).not.toHaveClass('holiday');
    expect(headers[2]).not.toHaveClass('holiday');
    expect(headers[3]).toHaveClass('holiday');
    expect(cells[0]).not.toHaveClass('holiday');
    expect(cells[1]).not.toHaveClass('holiday');
    expect(cells[2]).not.toHaveClass('holiday');
    expect(cells[3]).toHaveClass('holiday');
  });
  test('show process as a bar on top of calendar', ()=> {
    const processes = screen.getAllByTestId('process');
    const style0 = processes[0].style;
    expect(parseInt(style0.top)).toBeGreaterThanOrEqual(100);
    expect(parseInt(style0.left)).toBe(25);
    expect(parseInt(style0.width)).toBe(200);
    expect(parseInt(processes[1].style.top)).toBeGreaterThanOrEqual(250);
    expect(processes[1].style.left).toBe('13725px');
    expect(processes[1].style.width).toBe('1450px');
  });
});