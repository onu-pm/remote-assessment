export const LEAVE_TYPE_MAP = {
  Vacation: "paid_time_off",
};

export const STATUS_MAP = {
  Approved: "approved",
};

export function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

export function buildTimeoffDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  const days = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    days.push({ date: dateStr, hours: isWeekend(d) ? 0 : 8 });
  }
  return days;
}

export function convertPersonioToRemote(sample, employmentId) {
  return {
    employment_id: employmentId,
    start_date: sample.start_date,
    end_date: sample.end_date,
    timeoff_days: buildTimeoffDays(sample.start_date, sample.end_date),
    timeoff_type: LEAVE_TYPE_MAP[sample.leave_type] || sample.leave_type,
    timezone: "UTC",
    status: STATUS_MAP[sample.status] || sample.status,
  };
}
