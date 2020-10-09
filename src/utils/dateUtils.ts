export const MS_IN_AN_HOUR = 1000*60*60;
export const MS_IN_A_DAY = MS_IN_AN_HOUR*24;

export const getDaysCount = (date1:Date, date2:Date) => {
  return Math.abs(date1.getTime() - date2.getTime())/MS_IN_A_DAY
}