import { Algorithm } from "./algorithms";
export type TimeBasedPassword = {
  Id: string;
  Email: string;
  Website: string;
  Code: string;
  Secret: number;
  Type: string;
  Validity: number;
  Algorithm: string;
  CreatedAt: Date;
  UpdatedAt?: Date;
};
