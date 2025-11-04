// types.ts

export type ColorKey =
  | "blue"
  | "emerald"
  | "indigo"
  | "pink"
  | "amber"
  | "red"
  | "orange";

export type CurriculumEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: ColorKey;
  instructor: string;
  description: string;
};

export type Holiday = {
  day: number;
  month: number;
  year: number;
};
