import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const dateFormat = (ts: number) => {
  return dayjs(ts * 1000).format("YYYY-MM-DD HH:mm:ss Z");
}

export const parseDateString = (s: string) =>  {
  const d = dayjs(s, "YYYY-MM-DD HH:mm:ss Z", true);
  if (!d.isValid()) {
    return null;
  }
  return d.unix();
}