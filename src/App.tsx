import React, { useCallback, useState } from 'react';
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
  const days = [];
  for (let yearDay = 1, day = new Date(year, 0, yearDay); day.getFullYear() === year; yearDay++, day = new Date(year, 0, yearDay)) {
    days.push({
      dayName: dayNames[day.getDay()],
      month: monthNames[day.getMonth()],
      day: day.getDate(),
    })

  }
  return days;
}

function App() {
  const [selectedRange, setSelectedRanges] = useState(api.process.map(x => ({
    ...x,
    startDate: new Date(x.startDate),
    endDate: new Date(x.endDate),
  })));
  const setScroll = useCallback(node => {
    if (node !== null) {
      node.scrollLeft = localStorage.getItem('calendar.2020') || 0;
    }
  }, [])
  const dayList = getYearDays().map(l => {
    return <th key={`${l.month}-${l.day}-${l.dayName}`}>
      <div>{l.month}</div>
      <div>{l.day}</div>
      <div>{l.dayName}</div>
    </th>
  });
  const leftHeader = api.rent_item.map((product) => <div className="cell-height" key={product._id}>
    <p className="overflow-ellipses pt-1" title={product.name}>
      {product.name}
    </p>
  </div>);
  const rows = api.rent_item.map(product => <RowSchedule
    key={product._id}
    forProduct={product._id}
    yearCalendar={2020}
    onRangeSelect={(startDay: number, endDay: number) => {
      const startDate = new Date(Date.UTC(2020, 0, startDay, 4));
      const endDate = new Date(Date.UTC(2020, 0, endDay, 4));
      const rangeId = `${product._id}_${startDate.toISOString()}_${endDate.toISOString()}`;
      setSelectedRanges([...selectedRange, {
        _id: rangeId,
        startDate,
        endDate,
        rent_item: product._id
      }]);
    }}
    selectedDays={selectedRange.flat()}
    onRangeRemove={(rangeId: string) => {
      setSelectedRanges(selectedRange.filter((range) => {
        return range._id !== rangeId;
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
          <div 
            className="table-container" 
            onScroll={( ev: React.ChangeEvent & React.UIEvent<HTMLDivElement> ) => {
              localStorage.setItem('calendar.2020', ev.target.scrollLeft.toString());
            }}
            ref={setScroll}
          >
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
