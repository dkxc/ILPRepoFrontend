export type SessionBase = {
  id: number;
  title: string;
  category: string;
};

export type Session = SessionBase & {
  date: Date;
};

export type ApiSession = SessionBase & {
  date: string;
};
