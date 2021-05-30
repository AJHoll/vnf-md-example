import { IFilter } from ".";

export interface IOperation {
  query: string;
  bindingParams: any;
  filters?: {
    [key: string]: IFilter;
  };
}
