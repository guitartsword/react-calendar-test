import React, {useState} from 'react';
import { MS_IN_AN_HOUR, MS_IN_A_DAY } from '../utils/dateUtils';
import { Process } from './types';


export interface CellData {
    yearDay: number;
    referenceDate: Date;
    _id: string;
}

interface Props {
    processes: Process[]
    yearCalendar: number;
    forProduct: string;
    // cellDays: CellData[];
    onRangeSelect: (startDay: number, endDay: number) => void
    onRangeRemove: (id: string) => void
}

export default function (props: Props) {
    const getDaysInYear = (year:number) => {
        const firstDayOfThisYear = new Date(year,0,1).getTime();
        const firstDayOfNextYear = new Date(year+1,0,1).getTime();
        return (firstDayOfNextYear - firstDayOfThisYear) / MS_IN_A_DAY;
    }
    const generateCells = (year: number, product: string):CellData[] => {
        const daysInYear = getDaysInYear(year);
        return Array(daysInYear).fill(undefined).map((val, idx) => {
            const yearDay = idx + 1;
            const noonDateTime = new Date(Date.UTC(2020, 0, yearDay, 4));
            return {
                _id: product,
                referenceDate: noonDateTime,
                yearDay,
            }
        })
    }
    const yearCells = generateCells(props.yearCalendar, props.forProduct);
    const [status, setStatus] = useState('NONE');
    const [startDay, setStartDay] = useState(-1);
    const [hoverDay, setHoverDay] = useState(-1);
    const [selectingDays, setSelectingDays] = useState<CellData[]>([]);
    const getClasses = (product: CellData) => {
        const classList = ['cell-height'];
        const isInRange = props.processes.find((selected) => {
            return product._id === selected.rent_item
            && product.referenceDate >= selected.startDate
            && product.referenceDate <= selected.endDate;
        });
        const getDayWithTimeZone = (timezone: number, date: Date) => {
            return  new Date(date.getTime() + timezone * MS_IN_AN_HOUR).getUTCDay();
        }
        const day = getDayWithTimeZone(8, product.referenceDate)
        const isHoliday = day === 0 || day === 6;

        if (isHoliday) {
            classList.push('holiday');
        }
        if (isInRange) {
            classList.push('book-day');
        }
        if (selectingDays.find((selected) => selected.yearDay === product.yearDay)) {
            classList.push('selecting-days');
        }
        return classList.join(' ')
    }
    const getRange = (day1: number, day2: number) => {
        if (day1 < day2) {
            return yearCells.slice(day1 - 1, day2);
        } else {
            return yearCells.slice(day2 - 1, day1);
        }
    }
    const startSelecting = (product: CellData) => {
        if (status === 'NONE') {
            setStatus('SELECTING')
            setStartDay(product.yearDay);
            setSelectingDays(getRange(product.yearDay, product.yearDay));
        }
    }
    const tableDays = yearCells.map((x) => <td className={getClasses(x)} key={x.yearDay}
        onMouseEnter={
            () => {
                if (status === 'SELECTING') {
                    const range = getRange(startDay, x.yearDay);
                    setSelectingDays(range);
                    setHoverDay(x.yearDay);
                }
            }
        }
        onClick={
            (ev) => {
                if (status === 'SELECTING') {
                    if (startDay < x.yearDay) {
                        props.onRangeSelect(startDay, x.yearDay);
                    } else {
                        props.onRangeSelect(x.yearDay, startDay);
                    }
                    setSelectingDays([]);
                    setHoverDay(-1);
                    setStartDay(-1);
                    setStatus('NONE');
                } else {
                    startSelecting(x);
                }
            }
        }
        onContextMenu={
            (ev) => {
                ev.preventDefault();
                const range = props.processes.find((selected) => {
                    return x._id === selected.rent_item
                    && x.referenceDate >= selected.startDate
                    && x.referenceDate <= selected.endDate;
                });
                if (range) {
                    props.onRangeRemove(range._id);
                }
            }
        }
    >
        {x.yearDay === hoverDay ? selectingDays.length : ''}
    </td>);
    return <tr>
        {tableDays}
    </tr>
}