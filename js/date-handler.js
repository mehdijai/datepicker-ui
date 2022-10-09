function getAllDaysInMonth(year, month) {
  const date = new Date(year, month, 1);

  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function adjustCalendar(year, month) {
  let dates = getAllDaysInMonth(year, month);
  const firstDate = dates[0];
  const firstDay = firstDate.getDay();

  if (firstDay != 1) {
    // todo: get days from the previous month
    const previousMonth = getPreviousMonth(firstDate);
    const previousMonthDates = getAllDaysInMonth(
      previousMonth.getFullYear(),
      previousMonth.getMonth(),
    );
    const unionStart = firstDay != 0 ? firstDay - 1 : 6;
    const unionDays = previousMonthDates.splice(previousMonthDates.length - unionStart, unionStart);
    dates = [...unionDays, ...dates];
  }

  const lastDay = dates[dates.length - 1].getDay();
  if (lastDay != 7) {
    // todo: get days from the next month
    const nextMonth = getNextMonth(firstDate);
    const nextMonthDates = getAllDaysInMonth(nextMonth.getFullYear(), nextMonth.getMonth());
    const unionStart = 7 - lastDay;
    const unionDays = nextMonthDates.splice(0, unionStart);
    dates = [...dates, ...unionDays];
  }

  return dates;
}

function getNextYear(date) {
  return new Date(date.getFullYear() + 1, date.getMonth(), 1);
}
function getNextMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}
function getPreviousYear(date) {
  return new Date(date.getFullYear() - 1, date.getMonth(), 1);
}
function getPreviousMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}
function getDateParts(date) {
  const dateArr = date.split("/");
  return {
    day: dateArr[1],
    month: dateArr[0],
    year: dateArr[2],
  };
}
