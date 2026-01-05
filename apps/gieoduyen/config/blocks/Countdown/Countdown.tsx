"use client";

import { PuckComponent } from "@measured/puck";
import { getClassNameFactory } from "@measured/puck/lib";
import { useEffect, useState } from "react";
import { Section } from "../../components/Section";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Countdown", styles);

export type CountdownProps = {
  title: string;
  targetDate: string;
  padding: string;
};

const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const Countdown: PuckComponent<CountdownProps> = ({
  title,
  targetDate,
  padding,
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Section
      className={getClassName()}
      style={{ paddingTop: padding, paddingBottom: padding }}
    >
      <div className={getClassName("inner")}>
        <h2 className={getClassName("title")}>{title}</h2>
        <div className={getClassName("timer")}>
          <div className={getClassName("timerItem")}>
            <div className={getClassName("timerValue")}>
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <div className={getClassName("timerLabel")}>Ngày</div>
          </div>
          <div className={getClassName("timerItem")}>
            <div className={getClassName("timerValue")}>
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <div className={getClassName("timerLabel")}>Giờ</div>
          </div>
          <div className={getClassName("timerItem")}>
            <div className={getClassName("timerValue")}>
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <div className={getClassName("timerLabel")}>Phút</div>
          </div>
          <div className={getClassName("timerItem")}>
            <div className={getClassName("timerValue")}>
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <div className={getClassName("timerLabel")}>Giây</div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Countdown;

