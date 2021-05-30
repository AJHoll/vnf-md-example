import { IFilter } from '../interfaces';

export default class Filter implements IFilter {
  name: string;
  query: string;
  bindingParams: any;

  constructor(filter: IFilter | undefined, bindingParams?: any) {
    this.name = filter?.name || '';
    this.query = filter?.query || '';
    this.bindingParams = bindingParams || {};
  }
}
