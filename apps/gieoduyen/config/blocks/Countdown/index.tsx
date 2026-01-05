import { ComponentConfig } from "@measured/puck";
import CountdownComponent, { CountdownProps } from "./Countdown";

export const Countdown: ComponentConfig<CountdownProps> = {
  fields: {
    title: {
      type: "text",
      label: "Title",
    },
    targetDate: {
      type: "text",
      label: "Target Date (YYYY-MM-DD HH:mm:ss)",
    },
    padding: {
      type: "select",
      label: "Padding",
      options: [
        { label: "64px", value: "64px" },
        { label: "96px", value: "96px" },
        { label: "128px", value: "128px" },
      ],
    },
  },
  defaultProps: {
    title: "Đếm ngược đến ngày cưới",
    targetDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    padding: "96px",
  },
  render: CountdownComponent,
};

export { type CountdownProps } from "./Countdown";
export default Countdown;
