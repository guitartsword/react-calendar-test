import React, {useState} from 'react';

export default function (props) {
    const [status, setStatus] = useState('NONE');
    const [startDay, setStartDay] = useState();
    const [selectingDays, setSelectingDays] = useState([]);
    const getClasses = (product) => {
        const classList = ['cell-height'];
        const isInRange = props.selectedDays.find((selected) => {
            return product._id === selected.rent_item
            && product.referenceDate >= selected.startDate
            && product.referenceDate <= selected.endDate;
        });
        if (isInRange) {
            classList.push('book-day');
        }
        if (selectingDays.find((selected) => selected.yearDay === product.yearDay)) {
            classList.push('selecting-days');
        }
        return classList.join(' ')
    }
    const getRange = (startDay, endDay) => {
        return props.productsDays.slice(startDay - 1, endDay);
    }
    const tableDays = props.productsDays.map((x) => <td className={getClasses(x)} key={x.yearDay}
        onDoubleClickCapture={
            () => {
                if (status === 'NONE') {
                    setStatus('SELECTING')
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
            (ev) => {
                if (status === 'SELECTING') {
                    props.onRangeSelect(startDay, x.yearDay);
                    setSelectingDays([]);
                }
                setStatus('NONE');
            }
        }
        onContextMenu={
            (ev) => {
                ev.preventDefault();
                const range = props.selectedDays.find((selected) => {
                    return x._id === selected.rent_item
                    && x.referenceDate >= selected.startDate
                    && x.referenceDate <= selected.endDate;
                });
                if (range) {
                    console.log(range);
                    props.onRangeRemove(range._id);
                }
            }
        }
    ></td>);
    return <tr>
        {tableDays}
    </tr>
}