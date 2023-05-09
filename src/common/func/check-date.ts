import { isBefore } from 'date-fns';

export const parseStringToDate = (data: Date) => {
  if (data) return new Date(data);
};
export const checkDate = (startTime: Date, endTime: Date) => {
  if (isBefore(parseStringToDate(endTime), parseStringToDate(startTime)))
    return false;
  return true;
};

export const checkTimeTakesPlaceWithNow = (timeCheck: Date) => {
  const now = new Date();
  if (isBefore(parseStringToDate(timeCheck), now)) return false;
  return true;
};
