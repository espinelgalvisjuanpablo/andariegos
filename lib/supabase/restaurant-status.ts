import type {
  RestaurantSchedule,
  RestaurantSettings,
  SpecialClosure,
} from "./restaurant";

export type RestaurantStatus = {
  isOpen: boolean;
  status: "open" | "closed";
  reason:
    | "schedule"
    | "special_closure"
    | "special_closure_not_started";
  dayName: string;
  dateLabel: string;
  timeLabel: string;
  openingTime: string | null;
  closingTime: string | null;
  closureReason: string | null;
  closureMessage: string | null;
  specialClosureEndsAt: string | null;
};

const dayKeys: Array<keyof RestaurantSchedule> = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const dayNames: Record<
  keyof RestaurantSchedule,
  string
> = {
  monday: "LUNES",
  tuesday: "MARTES",
  wednesday: "MIÉRCOLES",
  thursday: "JUEVES",
  friday: "VIERNES",
  saturday: "SÁBADO",
  sunday: "DOMINGO",
};

function getBogotaDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "America/Bogota",
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  const parts = formatter.formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    weekday: get("weekday"),
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

function getTimeInMinutes(
  hour: number,
  minute: number
) {
  return hour * 60 + minute;
}

function getScheduleDay(
  weekday: string
): keyof RestaurantSchedule {
  const map: Record<
    string,
    keyof RestaurantSchedule
  > = {
    Sunday: "sunday",
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
  };

  return map[weekday];
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTimeLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getClosureReasonLabel(
  reason: SpecialClosure["reason"]
) {
  switch (reason) {
    case "temporary":
      return "CIERRE TEMPORAL";

    case "private_event":
      return "EVENTO PRIVADO";

    case "admin_decision":
      return "DECISIÓN DEL ADMINISTRADOR";

    case "other":
      return "OTRO";

    default:
      return null;
  }
}

export function getRestaurantStatus(
  settings: RestaurantSettings,
  now: Date = new Date()
): RestaurantStatus {
  const parts = getBogotaDateParts(now);

  const dayKey = getScheduleDay(parts.weekday);

  const schedule = settings.schedule[dayKey];

  const specialClosure =
    settings.special_closure;

  const nowInMinutes = getTimeInMinutes(
    parts.hour,
    parts.minute
  );

  const dateLabel = formatDateLabel(now);
  const timeLabel = formatTimeLabel(now);

  /*
   * ---------------------------------------------------------
   * CIERRE ESPECIAL
   * ---------------------------------------------------------
   */

  if (specialClosure.active) {
    const startsAt = specialClosure.starts_at
      ? new Date(specialClosure.starts_at)
      : null;

    const endsAt = specialClosure.ends_at
      ? new Date(specialClosure.ends_at)
      : null;

    if (
      startsAt &&
      endsAt &&
      now < startsAt
    ) {
      return {
        isOpen: true,
        status: "open",
        reason: "special_closure_not_started",
        dayName: dayNames[dayKey],
        dateLabel,
        timeLabel,
        openingTime: schedule?.open ?? null,
        closingTime: schedule?.close ?? null,
        closureReason:
          getClosureReasonLabel(
            specialClosure.reason
          ),
        closureMessage:
          specialClosure.message,
        specialClosureEndsAt:
          specialClosure.ends_at,
      };
    }

    if (
      startsAt &&
      endsAt &&
      now >= startsAt &&
      now < endsAt
    ) {
      return {
        isOpen: false,
        status: "closed",
        reason: "special_closure",
        dayName: dayNames[dayKey],
        dateLabel,
        timeLabel,
        openingTime: schedule?.open ?? null,
        closingTime: schedule?.close ?? null,
        closureReason:
          getClosureReasonLabel(
            specialClosure.reason
          ),
        closureMessage:
          specialClosure.message,
        specialClosureEndsAt:
          specialClosure.ends_at,
      };
    }
  }

  /*
   * ---------------------------------------------------------
   * DÍA SIN HORARIO
   * ---------------------------------------------------------
   */

  if (!schedule) {
    return {
      isOpen: false,
      status: "closed",
      reason: "schedule",
      dayName: dayNames[dayKey],
      dateLabel,
      timeLabel,
      openingTime: null,
      closingTime: null,
      closureReason: null,
      closureMessage: null,
      specialClosureEndsAt: null,
    };
  }

  /*
   * ---------------------------------------------------------
   * HORARIO NORMAL
   * ---------------------------------------------------------
   */

  const [openHour, openMinute] =
    schedule.open.split(":").map(Number);

  const [closeHour, closeMinute] =
    schedule.close.split(":").map(Number);

  const openingMinutes =
    getTimeInMinutes(
      openHour,
      openMinute
    );

  const closingMinutes =
    getTimeInMinutes(
      closeHour,
      closeMinute
    );

  const isWithinSchedule =
    nowInMinutes >= openingMinutes &&
    nowInMinutes < closingMinutes;

  return {
    isOpen: isWithinSchedule,
    status: isWithinSchedule
      ? "open"
      : "closed",
    reason: "schedule",
    dayName: dayNames[dayKey],
    dateLabel,
    timeLabel,
    openingTime: schedule.open,
    closingTime: schedule.close,
    closureReason: null,
    closureMessage: null,
    specialClosureEndsAt: null,
  };
}