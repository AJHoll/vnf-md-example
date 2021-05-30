import { ICallbackMessage, IOperation, IRequest } from '../interfaces';
import { v4 } from 'uuid';
import { Filter } from '.';

class Request implements IRequest {
  name: string;
  operation: IOperation;
  useTransaction: boolean;
  bindingParams: any;

  _pre?: (request: Request) => void;
  _post?: (request: Request, payload: ICallbackMessage) => ICallbackMessage;

  constructor(
    operation?: IOperation,
    useTransaction?: boolean,
    bindingParams?: Object,
  ) {
    this.name = v4();
    if (operation)
      this.operation = {
        query: operation?.query,
        bindingParams: operation?.bindingParams,
      };
    else this.operation = { query: '', bindingParams: {} };

    this.bindingParams = { ...this.operation.bindingParams };
    if (bindingParams) {
      this.bindingParams = {
        ...this.bindingParams,
        ...bindingParams,
      };
    }
    this.useTransaction = useTransaction || false;
  }

  Pre(pre: (request: Request) => void) {
    this._pre = (request) => pre(request);
    return this;
  }

  Post(
    post: (request: Request, payload: ICallbackMessage) => ICallbackMessage,
  ) {
    this._post = post;
    return this;
  }

  useFilter(filter: Filter[] | Filter) {
    if (!filter) return this;

    let filters: Filter[] = [];
    if ((filter as Filter[]).length > 1) {
      filters = filter as Filter[];
    } else {
      filters = [filter as Filter];
    }

    for (let flt of filters) {
      if (flt.bindingParams[flt.name] !== (undefined && null)) {
        this.operation.query = this.operation.query.replace(
          `/*filter:${flt.name}*/`,
          flt.query,
        );

        this.bindingParams = { ...this.bindingParams, ...flt.bindingParams };
      }
    }
    return this;
  }
}

export { Request };
