import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RowSchedule, { CellData } from './RowSchedule';
import userEvent from '@testing-library/user-event';

describe('2020 Calendar Rent Item Row', () => {
  let onRangeRemove = jest.fn();
  let onRangeSelect = jest.fn();
  beforeEach(() => {
    onRangeRemove = jest.fn();
    onRangeSelect = jest.fn();
    render(<table>
      <tbody>
        <RowSchedule
          yearCalendar={2020}
          forProduct="itm1"
          onRangeRemove={onRangeRemove}
          onRangeSelect={onRangeSelect}
          selectedDays={[{
            _id: 'range1',
            startDate: new Date(Date.UTC(2020,0,9,4)),
            endDate: new Date(Date.UTC(2020,0,10,4)),
            rent_item: 'itm1',
          }]}
        />
      </tbody>
    </table>)
  });
  test('trigger range select correctly', () => {
    expect(screen.getByRole('row')).toBeInTheDocument();
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(366);
    userEvent.click(cells[0]);
    userEvent.click(cells[4]);
    expect(onRangeSelect).toHaveBeenLastCalledWith(1, 5);
    userEvent.click(cells[7]);
    userEvent.click(cells[2]);
    expect(onRangeSelect).toHaveBeenLastCalledWith(3, 8);
  });
  test('shows classes on hover', () => {
    const cells = screen.getAllByRole('cell');
    userEvent.click(cells[5]);
    userEvent.hover(cells[7]);
    cells.forEach( (cell, idx) => {
      if (idx >=5 && idx <=7) {
        expect(cell).toHaveClass('selecting-days');
      } else {
        expect(cell).not.toHaveClass('selecting-days');
      }
    });
  });
  test('should show selected classes when receiving ranges', () => {
    const cells = screen.getAllByRole('cell');
    cells.forEach( (cell, idx) => {
      if (idx >= 8 && idx <=9) {
        expect(cell).toHaveClass('book-day');
      } else {
        expect(cell).not.toHaveClass('book-day');
      }
    });
    fireEvent.contextMenu(cells[8]);
    expect(onRangeRemove).toHaveBeenLastCalledWith('range1');
    expect(onRangeSelect).not.toHaveBeenCalled();
  })
  test('should show day count', () => {
    const cells = screen.getAllByRole('cell');
    userEvent.click(cells[5]);
    userEvent.hover(cells[7]);
    expect(cells[7]).toHaveTextContent('3');
    userEvent.hover(cells[0]);
    expect(cells[0]).toHaveTextContent('6');
    expect(cells[7]).toHaveTextContent('');
  });
})