import React, { useState } from 'react';
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
        yearDay: idx+1,
        active: false,
      }
    });
  };
  const [status, setStatus] = useState('NONE');
  const [productsDays, setProductDays] = useState(generateCells(dayList.length, 'MyP1'));
  const [selectingDays, setSelectingDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDay, setStartDay] = useState();
  const setProducts = (product) => {
    product.active = !product.active;
    setProductDays([...productsDays]);
  }
  const getRange = (startDay, endDay) => {
    console.log(startDay, endDay);
    return productsDays.slice(startDay-1, endDay);
  }
  const getClasses = (product) => {
    const classList = [];
    if (selectedDays.find((selected) => selected._id === product._id)) {
      classList.push('book-day');
    }
    if (selectingDays.find((selected) => selected._id === product._id)) {
      classList.push('selecting-days');
    }
    return classList.join(' ')
  }
  return (
    <section className="container">
      <h1 className="title">Kalendar Test</h1>
      <div className="table-container">
        <table className="table is-striped is-bordered calendar-7-hill">
          <thead>
            <tr>
              {dayList}
            </tr>
          </thead>
          <tbody>
            <tr>
              {productsDays.map((x) => <td className={getClasses(x)} key={x._id}
                onDoubleClickCapture={
                  () => {
                    console.log('db clck')
                    if (status === 'NONE') {
                      setStatus('SELECTING')
                      setProducts(x)
                      setStartDay(x.yearDay);
                    }
                  }
                }
                onMouseEnter={
                  () => {
                    if (status === 'SELECTING') {
                      setSelectingDays(getRange(startDay, x.yearDay));
                    }
                  }
                }
                onClick={
                  () => {
                    console.log('click')
                    if (status === 'SELECTING') {
                      setSelectedDays(getRange(startDay, x.yearDay));
                      setSelectingDays([]);
                    }
                    setStatus('NONE');
                  }
                }
              ></td>)}
            </tr>
            <tr>
              {generateCells(dayList.length, 'MyX').map((x) => <td key={x._id}>{x._id}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <pre>
        {
          JSON.stringify({
            startDay,
          }, null, 2)
        }
      </pre>
      <pre>
        {JSON.stringify(selectedDays, null, 2)}
      </pre>
    </section>
  );
}

export default App;
