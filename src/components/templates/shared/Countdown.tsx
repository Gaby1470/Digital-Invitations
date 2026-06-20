// src/components/templates/shared/Countdown.tsx
"use client";

import { useEffect, useState } from 'react';

type CountdownProps = {
  targetDate: string;
  className?: string;
  itemClassName?: string;
  numberClassName?: string;
  labelClassName?: string;
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

const initialTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function Countdown({ 
  targetDate, 
  className, 
  itemClassName,
  numberClassName,
  labelClassName
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calculateTimeLeft(targetDate));
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const addLeadingZero = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  if (!targetDate) {
    return null;
  }

  return (
    <div className={className || "flex justify-center gap-4 md:gap-8"}>
      <div className={itemClassName || "text-center"}>
        <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
          {addLeadingZero(timeLeft.days)}
        </span>
        <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Days</span>
      </div>
      <div className={itemClassName || "text-center"}>
        <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
          {addLeadingZero(timeLeft.hours)}
        </span>
        <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Hours</span>
      </div>
      <div className={itemClassName || "text-center"}>
        <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
          {addLeadingZero(timeLeft.minutes)}
        </span>
        <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Minutes</span>
      </div>
      <div className={itemClassName || "text-center"}>
        <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
          {addLeadingZero(timeLeft.seconds)}
        </span>
        <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Seconds</span>
      </div>
    </div>
  );
}
