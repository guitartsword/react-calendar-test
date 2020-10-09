import React, { useCallback, useEffect, useState } from 'react';
import { getDaysCount } from '../utils/dateUtils';
import RowSchedule from './RowSchedule';
import { Process, RentItem } from './types';

const YEAR = 2020;

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

const getYearDays = (year = YEAR) => {
  const days = [];
  for (let yearDay = 1, day = new Date(year, 0, yearDay); day.getFullYear() === year; yearDay++, day = new Date(year, 0, yearDay)) {
    days.push({
      dayName: dayNames[day.getDay()],
      month: monthNames[day.getMonth()],
      day: day.getDate(),
      holiday: day.getDay() === 0 || day.getDay() === 6,
    });
  }
  return days;
}

export default function () {
  const setScroll = useCallback(node => {
    if (node !== null) {
      node.scrollLeft = localStorage.getItem(`calendar.${YEAR}`) || 0;
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

  const leftHeader = rentItem.map((product, idx) => {
    return {
      processes:processes.filter(p => p.rent_item === product._id).map((p) => {
        const style:React.StyleHTMLAttributes<HTMLDivElement>['style'] = {
          top: 112 + idx*50,
          left: 25 + getDaysCount(new Date(Date.UTC(YEAR, 0, 1, 4)), p.startDate)*50,
          width: 50 * getDaysCount(p.startDate, p.endDate),
        }
        return <div key={p._id} data-testid="process" className="process" style={style}></div>
      }),
      products: <div className="cell-height" key={product._id}>
        <p className="overflow-ellipses pt-1" title={product.name}>
          {product.name}
        </p>
      </div>
    }
  });
   const dayList = getYearDays().map(l => {
    return <th key={`${l.month}-${l.day}-${l.dayName}`} className={l.holiday ? 'holiday' : ''}>
      <div>{l.month}</div>
      <div>{l.day}</div>
      <div>{l.dayName}</div>
    </th>
  });
  const rows = rentItem.map(product => <RowSchedule
    key={product._id}
    forProduct={product._id}
    yearCalendar={YEAR}
    onRangeSelect={(startDay: number, endDay: number) => {
      const startDate = new Date(Date.UTC(YEAR, 0, startDay, 4));
      const endDate = new Date(Date.UTC(YEAR, 0, endDay, 4));
      const rangeId = `${product._id}_${startDate.toISOString()}_${endDate.toISOString()}`;
      setProcesses([...processes, {
        _id: rangeId,
        startDate,
        endDate,
        rent_item: product._id
      }]);
    }}
    processes={processes}
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
        {leftHeader.map(x => x.products)}
      </div>
    </div>
    <div className="column is-9">
      <div
        className="table-container relative"
        onScroll={(ev: React.ChangeEvent & React.UIEvent<HTMLDivElement>) => {
          localStorage.setItem(`calendar.${YEAR}`, ev.target.scrollLeft.toString());
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
        {leftHeader.map(x => x.processes)}
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