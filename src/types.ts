export interface User {
  name: string;
  username: string;
  email: string;
}

export interface Account {
  seed: string;
  email: string;
  name: string;
}

export interface Plan {
  id: number;
  email: string;
  name: string;
  date: Date;
  principal: number;
  base: number;
  interest: number;
}

export interface Invoice {
  id: number;
  pid: number;
  email: string;
  due: Date;
  amnt_due: number;
  total: number;
  fulfilled: number;
}

export interface Payment {
  id: number;
  pid: number;
  email: string;
  date: Date;
  origin: string;
  destination: string;
  amount: number;
}