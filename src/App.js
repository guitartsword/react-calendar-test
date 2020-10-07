import React, { useState } from 'react';
import RowSchedule from './RowSchedule'
import api from './mock_api.json'
import './App.scss';

const dayNames = [
  'So.',
  'Mo.',
  'Di.',
  'Mi.',
  'Do.',
  'Fr.',
  'Sa.',
];
const monthNames = [
  'Jan.', 'Feb.', 'Mär.',
  'Apr.', 'Mai.', 'Jun.',
  'Jul.', 'Aug.', 'Sep.',
  'Okt.', 'Nov.', 'Dez.',
]

const getYearDays = (year = 2020) => {
  const calculatedYear = year - 1900;
  const days = [];
  for (let yearDay = 1, day = new Date(year, 0, yearDay); day.getYear() === calculatedYear; yearDay++, day = new Date(year, 0, yearDay)) {
    days.push({
      dayName: dayNames[day.getDay()],
      month: monthNames[day.getMonth()],
      day: day.getDate(),
    })

  }
  return days;
}

function App() {
  const dayList = getYearDays().map(l => {
    return <th key={`${l.month}-${l.day}-${l.dayName}`}>
      <div>{l.month}</div>
      <div>{l.day}</div>
      <div>{l.dayName}</div>
    </th>
  });
  const generateCells = (count, product) => {
    return Array(count).fill().map((x, idx) => {
      return {
        _id: `${product}_${idx}`,
        yearDay: idx + 1,
      }
    });
  };


  
  const [selectedRange, setSelectedRanges] = useState([]);
  const leftHeader = api.rent_item.map((product) => <div className="cell-height">
    <p className="overflow-ellipses pt-1" title={product.name} key={product._id}>
      {product.name}
    </p>
  </div>);
  const rows = api.rent_item.map(product => <RowSchedule
    productsDays={generateCells(dayList.length, product.name)}
    onRangeSelect={(newRange) => {
      const rangeId = newRange.map((x) => x._id).join('');
      setSelectedRanges([...selectedRange, {
        rangeId,
        range: newRange.map(x => {
          return {
            rangeId,
            ...x,
          }
        })
      }]);
    }}
    selectedDays={selectedRange.flat()}
    onRangeRemove={(rangeId) => {
      setSelectedRanges(selectedRange.filter((range) => {
        return range.rangeId !== rangeId;
      }));
    }}
  />)


  return (
    <section className="container">
      <h1 className="title">Kalendar Test</h1>

      <div className="columns is-gapless is-mobile">
        <div className="column is-3">
          <div className="products">
            <div className="heading-height"></div>
            {leftHeader}
          </div>
        </div>
        <div className="column is-9">
          <div className="table-container">
            <table className="table is-striped is-bordered calendar-7-hill">
              <thead>
                <tr className="heading-height">
                  {dayList}
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <pre>
        {JSON.stringify(selectedRange, null, 2)}
      </pre>
    </section>
  );
}

export default App;
