// src/components/templates/shared/Countdown.tsx
"use client";

import { useEffect, useState } from 'react';
import { AddToCalendar, AddToCalendarProps } from './AddToCalendar';
import { CalendarEvent } from '@/lib/calendar';

type CountdownProps = {
  targetDate: string;
  className?: string;
  itemClassName?: string;
  numberClassName?: string;
  labelClassName?: string;
  showAddToCalendar?: boolean;
  event?: CalendarEvent;
  calendarProps?: Partial<AddToCalendarProps>;
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
  labelClassName,
  showAddToCalendar = false,
  event,
  calendarProps
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

  const calendarEvent: CalendarEvent = event || {
    title: 'Evento Especial',
    startDate: targetDate,
  };

  return (
    <div className="flex flex-col items-center">
      <div className={className || "flex justify-center gap-4 md:gap-8"}>
        <div className={itemClassName || "text-center"}>
          <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
            {addLeadingZero(timeLeft.days)}
          </span>
          <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Días</span>
        </div>
        <div className={itemClassName || "text-center"}>
          <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
            {addLeadingZero(timeLeft.hours)}
          </span>
          <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Horas</span>
        </div>
        <div className={itemClassName || "text-center"}>
          <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
            {addLeadingZero(timeLeft.minutes)}
          </span>
          <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Minutos</span>
        </div>
        <div className={itemClassName || "text-center"}>
          <span className={numberClassName || "text-4xl md:text-6xl font-bold"}>
            {addLeadingZero(timeLeft.seconds)}
          </span>
          <span className={labelClassName || "block text-xs md:text-sm uppercase"}>Segundos</span>
        </div>
      </div>

      {showAddToCalendar && (
        <div className="mt-6 flex justify-center">
          <AddToCalendar 
            event={calendarEvent} 
            variant="glass"
            {...calendarProps}
          />
        </div>
      )}
    </div>
  );
}
