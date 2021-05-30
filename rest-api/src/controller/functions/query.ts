/*
  author: Porozov A.
  date: 04.12.2020
  purpose: Функция получения данных из pg
*/

import anyGlobal from '../global';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { ICallbackMessage, ICallbackMessageStatus } from '../interfaces';
import { Request } from '../classes';

const chainingQuery = (bindingParams: any, prevPayload: any) => {
  const regexp = /\$\((.*)\)/;
  const bindings = bindingParams;
  const parentPayload = prevPayload;
  for (let key in bindings) {
    if (bindings[key]) {
      if (bindings[key].toString().match(regexp)) {
        const synKey = bindings[key].toString().match(regexp)[1];
        bindings[key] = [];
        if (parentPayload.length > 1) {
          for (let data of parentPayload) {
            bindings[key] = [...bindings[key], data[synKey]];
          }
        } else {
          bindings[key] = parentPayload[0][synKey];
        }
      }
    }
  }
  return bindings;
};

const query = async (req: Request[]): Promise<ICallbackMessage> => {
  const conn: IDatabase<{}, IClient> = anyGlobal.uniParams.pool.mainConnection;
  try {
    let data: any = [];
    if (req[0].useTransaction) {
      data = await conn.tx(async (trans) => {
        let subData: any = [];
        for (let request of req) {
          request.bindingParams = chainingQuery(request.bindingParams, subData);
          const unitData = await trans.any(
            request.operation.query,
            request.bindingParams,
          );
          subData = [...subData, ...unitData];
        }
        return subData;
      });
    } else {
      for (let request of req) {
        request.bindingParams = chainingQuery(request.bindingParams, data);
        const unitData: any = await conn.any(
          request.operation.query,
          request.bindingParams,
        );
        data = [...data, ...unitData];
      }
    }
    return { status: ICallbackMessageStatus.Done, data: data };
  } catch (err) {
    return { status: ICallbackMessageStatus.QueryError, error: err };
  }
};

export { query };
