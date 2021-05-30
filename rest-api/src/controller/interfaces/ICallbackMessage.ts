import { ICallbackMessageStatus } from "./ICallbackMessageStatus";

export interface ICallbackMessage {
  status: ICallbackMessageStatus;
  error?: string;
  data?: any;
}
