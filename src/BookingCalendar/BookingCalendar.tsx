import React, { useCallback, useEffect, useState } from 'react';
import RowSchedule from '../RowSchedule';
import { Process, RentItem } from '../types';


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
    });
  }
  return days;
}

export default function () {
  const setScroll = useCallback(node => {
    if (node !== null) {
      node.scrollLeft = localStorage.getItem('calendar.2020') || 0;
    }
  }, []);

  const [processes, setProcesses] = useState<Process[]>([]);
  const [rentItem, setRentItem] = useState<RentItem[]>([]);
  useEffect(() => {
    fetch('/api/rent_item.json').then(r => r.json() as unknown as RentItem[]).then((p) => {setRentItem(p)});
    fetch('/api/process.json').then(r => r.json() as unknown as Process[]).then((p) => {setProcesses(p.map(p => ({
      ...p,
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
    })))});
  },[]);
  const leftHeader = rentItem.map((product) => <div className="cell-height" key={product._id}>
    <p className="overflow-ellipses pt-1" title={product.name}>
      {product.name}
    </p>
  </div>);
   const dayList = getYearDays().map(l => {
    return <th key={`${l.month}-${l.day}-${l.dayName}`}>
      <div>{l.month}</div>
      <div>{l.day}</div>
      <div>{l.dayName}</div>
    </th>
  });
  const rows = rentItem.map(product => <RowSchedule
    key={product._id}
    forProduct={product._id}
    yearCalendar={2020}
    onRangeSelect={(startDay: number, endDay: number) => {
      const startDate = new Date(Date.UTC(2020, 0, startDay, 4));
      const endDate = new Date(Date.UTC(2020, 0, endDay, 4));
      const rangeId = `${product._id}_${startDate.toISOString()}_${endDate.toISOString()}`;
      setProcesses([...processes, {
        _id: rangeId,
        startDate,
        endDate,
        rent_item: product._id
      }]);
    }}
    selectedDays={processes}
    onRangeRemove={(rangeId: string) => {
      setProcesses(processes.filter((range) => {
        return range._id !== rangeId;
      }));
    }}
  />)

  return <div className="columns is-gapless">
    <div className="column is-3">
      <div className="products">
        <div className="heading-height"></div>
        {leftHeader}
      </div>
    </div>
    <div className="column is-9">
      <div
        className="table-container"
        onScroll={(ev: React.ChangeEvent & React.UIEvent<HTMLDivElement>) => {
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
      <pre>
        PROCESSES:<br></br>
        {JSON.stringify(processes, null, 2)}
        <br></br>
        RENT_ITEM:<br></br>
        {JSON.stringify(rentItem, null, 2)}
      </pre>
    </div>
  </div>
}