export type Activity = {
  id: number;
  section: string;
  type: "upload" | "view" | "modify";
  time: Date;
};
