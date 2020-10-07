import React, {useState} from 'react';

export default function (props) {
    const [status, setStatus] = useState('NONE');
    const [startDay, setStartDay] = useState();
    const [selectingDays, setSelectingDays] = useState([]);
    const [hoverDay, setHoverDay] = useState(-1);
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
    const getRange = (day1, day2) => {
        if (day1 < day2) {
            return props.productsDays.slice(day1 - 1, day2);
        } else {
            return props.productsDays.slice(day2 - 1, day1);
        }
    }
    const startSelecting = (product) => {
        if (status === 'NONE') {
            setStatus('SELECTING')
            setStartDay(product.yearDay);
            setSelectingDays(getRange(product.yearDay, product.yearDay));
        }
    }
    const tableDays = props.productsDays.map((x) => <td className={getClasses(x)} key={x.yearDay}
        // onDoubleClick={() => startSelecting(x)}
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
                    setHoverDay(-1)
                    setStatus('NONE');
                } else {
                    startSelecting(x);
                }
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