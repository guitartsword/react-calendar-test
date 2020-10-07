import React, {useState} from 'react';

export default function (props) {
    const [status, setStatus] = useState('NONE');
    const [startDay, setStartDay] = useState();
    const [selectingDays, setSelectingDays] = useState([]);
    const getClasses = (product) => {
        const classList = ['cell-height'];
        if (props.selectedDays.map(x => x.range).flat().find((selected) => selected._id === product._id)) {
            classList.push('book-day');
        }
        if (selectingDays.find((selected) => selected._id === product._id)) {
            classList.push('selecting-days');
        }
        return classList.join(' ')
    }
    const getRange = (startDay, endDay) => {
        return props.productsDays.slice(startDay - 1, endDay);
    }
    const tableDays = props.productsDays.map((x) => <td className={getClasses(x)} key={x._id}
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
                    props.onRangeSelect(getRange(startDay, x.yearDay));
                    setSelectingDays([]);
                }
                setStatus('NONE');
            }
        }
        onContextMenu={
            (ev) => {
                ev.preventDefault();
                const range = props.selectedDays.find((selected) => selected.rangeId.includes(x._id));
                if (range) {
                    props.onRangeRemove(range.rangeId);
                }
            }
        }
    ></td>);
    return <tr>
        {tableDays}
    </tr>
}