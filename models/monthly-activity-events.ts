import { Action } from "rxjs/internal/scheduler/Action";
import { ActionEvent } from "./action-event";

export type MonthlyActivityEvents = {
  Uploads: ActionEvent[];
  Downloads: ActionEvent[];
};
