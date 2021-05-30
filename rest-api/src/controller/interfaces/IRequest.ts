import { IOperation } from "./IOperation";

export interface IRequest {
  useTransaction: boolean;
  operation: IOperation;
}
