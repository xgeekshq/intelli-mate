import { Document } from "mongoose";

export interface Room extends Document {
  readonly name: string;
  readonly private: boolean;
  readonly owner: string;
  readonly members: string[];
}
