const currentMonth = document.getElementById("dp-current-month");
const currentYear = document.getElementById("dp-current-year");
const mjDatepicker = document.getElementById("mj-datepicker");

const maxDate = mjDatepicker.dataset.maxDate;
const minDate = mjDatepicker.dataset.minDate;

const days = {};
const daysProxy = new Proxy(days, {
  set: function (target, key, value) {
    target[key] = value;
    let date = value;
    currentMonth.innerText = date.toLocaleString("fr", { month: "long" });
    currentYear.innerText = date.getFullYear();
    let days = adjustCalendar(date.getFullYear(), date.getMonth());

    const week1 = days.splice(0, 7);
    const week2 = days.splice(0, 7);
    const week3 = days.splice(0, 7);
    const week4 = days.splice(0, 7);
    const week5 = days.splice(0, 7);
    const week6 = days.splice(0, 7);

    const monthWeeks = [week1, week2, week3, week4, week5, week6];
    days = monthWeeks.flatMap((week) => {
      return week;
    });

    document.querySelectorAll(".dp-hide").forEach((element) => {
      element.classList.remove("dp-hide");
    });

    document.querySelectorAll(".dp-selected").forEach((element) => {
      element.classList.remove("dp-selected");
    });
    document.querySelectorAll(".dp-today").forEach((element) => {
      element.classList.remove("dp-today");
    });
    document.querySelectorAll(".dp-out-of-month").forEach((element) => {
      element.classList.remove("dp-out-of-month");
    });

    const outOfMonthDays = days.filter((day) => {
      return day.getMonth() != date.getMonth();
    });

    const dpDates = document.getElementById("dp-dates");
    const dpWeeks = dpDates.children;

    let weekCount = getWeekCount(monthWeeks);

    if (dpWeeks.length - weekCount != 0) {
      for (let dpWeekIndex = dpWeeks.length - 1; dpWeekIndex <= weekCount; dpWeekIndex++) {
        dpWeeks[dpWeekIndex].classList.add("dp-hide");
      }
    }

    for (let weekIndex = 0; weekIndex < weekCount; weekIndex++) {
      const dpWeek = dpWeeks[weekIndex];
      const dpDays = dpWeek.children;

      for (let dayIndex = 0; dayIndex < dpDays.length; dayIndex++) {
        const dpDay = dpDays[dayIndex];
        if (
          monthWeeks[weekIndex][dayIndex].toLocaleDateString("utc") ==
          new Date().toLocaleDateString("utc")
        ) {
          dpDay.classList.add("dp-today");
        }
        if (outOfMonthDays.includes(monthWeeks[weekIndex][dayIndex])) {
          dpDay.classList.add("dp-out-of-month");
        }
        dpDay.innerText = monthWeeks[weekIndex][dayIndex].getDate();
      }
    }

    const dpDayElement = document.querySelectorAll(".dp-day");
    dpDayElement.forEach((element) => {
      element.addEventListener("click", (e) => {
        const day = e.target;
        let indexes = getIndexes(element, dpDates);
        const selectedDay = monthWeeks[indexes.weekIndex][indexes.dayIndex];

        let newCords = null;

        if (outOfMonthDays.includes(selectedDay)) {
          if (selectedDay.getMonth() < date.getMonth()) {
            date = getPreviousMonth(date);
            daysProxy.date = date;
            newCords = getNewCords(date, selectedDay);
          } else {
            date = getNextMonth(date);
            daysProxy.date = date;
            newCords = getNewCords(date, selectedDay);
          }

          selectNewDay(dpDates, newCords);
        } else {
          dpDayElement.forEach((day) => day.classList.remove("dp-selected"));
          day.classList.add("dp-selected");
        }
        selectedDateProxy.value = selectedDay;
      });
    });
    return true;
  },
});

const selectedDate = {};
const selectedDateProxy = new Proxy(selectedDate, {
  set: function (target, key, value) {
    target[key] = value;
    const datePicker = document.getElementById("dp-datepicker-input");
    datePicker.value = selectedDate.value;
  },
});

let date = new Date();

daysProxy.date = date;

const dpContent = document.getElementById("dp-content");
const closeWrapper = document.getElementById("dp-close-wrapper");
const dpTrigger = document.getElementById("dp-trigger");
const cancelButton = document.getElementById("dp-cancel-date");
const applyButton = document.getElementById("dp-apply-date");

mjDatepicker.classList.remove("dp-closed");

applyButton.addEventListener("click", () => {
  dpContent.innerText = selectedDate.value.toLocaleDateString();
  mjDatepicker.classList.add("dp-closed");
});

dpTrigger.addEventListener("click", () => {
  mjDatepicker.classList.remove("dp-closed");
});
closeWrapper.addEventListener("click", () => {
  mjDatepicker.classList.add("dp-closed");
});
cancelButton.addEventListener("click", () => {
  mjDatepicker.classList.remove("dp-closed");
});

const previousYear = document.getElementById("dp-previous-year");
const previousMonth = document.getElementById("dp-previous-month");
const nextMonth = document.getElementById("dp-next-month");
const nextYear = document.getElementById("dp-next-year");

previousYear.addEventListener("click", () => {
  date = getPreviousYear(date);
  daysProxy.date = date;
});

previousMonth.addEventListener("click", () => {
  date = getPreviousMonth(date);
  //   currentMonth.innerText = date.toLocaleString("fr", { month: "long" });
  //   currentYear.innerText = date.getFullYear();
  daysProxy.date = date;
});

nextMonth.addEventListener("click", () => {
  date = getNextMonth(date);
  //   currentMonth.innerText = date.toLocaleString("fr", { month: "long" });
  //   currentYear.innerText = date.getFullYear();
  daysProxy.date = date;
});

nextYear.addEventListener("click", () => {
  date = getNextYear(date);
  //   currentMonth.innerText = date.toLocaleString("fr", { month: "long" });
  //   currentYear.innerText = date.getFullYear();
  daysProxy.date = date;
});

function getIndexes(element, dpDates) {
  const weekParent = element.parentNode;
  const weekNodes = Array.prototype.slice.call(weekParent.children);
  const dayIndex = weekNodes.indexOf(element);

  const monthNodes = Array.prototype.slice.call(dpDates.children);
  const weekIndex = monthNodes.indexOf(weekParent);

  return {
    dayIndex,
    weekIndex,
  };
}

function getNewCords(date, selectedDay) {
  let newCords = null;
  let newMonth = adjustCalendar(date.getFullYear(), date.getMonth());
  const week1 = newMonth.splice(0, 7);
  const week2 = newMonth.splice(0, 7);
  const week3 = newMonth.splice(0, 7);
  const week4 = newMonth.splice(0, 7);
  const week5 = newMonth.splice(0, 7);
  const week6 = newMonth.splice(0, 7);
  newMonth = [week1, week2, week3, week4, week5, week6];
  const weekCount = getWeekCount(newMonth);
  for (let i = 0; i < weekCount; i++) {
    const week = newMonth[i];
    for (let j = 0; j < week.length - 1; j++) {
      const day = week[j];
      if (day.toLocaleDateString() == selectedDay.toLocaleDateString()) {
        newCords = {
          dayIndex: j,
          weekIndex: i,
        };
        break;
      }
    }
  }
  return newCords;
}

function selectNewDay(dpDates, coords) {
  const weeks = dpDates.children;
  const days = weeks[coords.weekIndex].children;
  days[coords.dayIndex].classList.add("dp-selected");
}

function getWeekCount(monthWeeks) {
  let weekCount = 0;

  monthWeeks.forEach((week) => {
    if (week.length > 0) {
      weekCount++;
    }
  });

  return weekCount;
}