/*
  author: Porozov A.
  date: 18.11.2020
  purpose: Функция открытия и сохранения подключения
*/
import { IDatabase, IMain } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import anyGlobal from '../global';
import { ICallbackMessage, ICallbackMessageStatus } from '../interfaces';

export interface IPgConnectionPool {
  pgPromise: IMain<{}, IClient>;
  mainConnection: IDatabase<{}, IClient>;
}

const setConnection = async (payload: any): Promise<ICallbackMessage> => {
  const pgp: IMain<{}, IClient> = require('pg-promise')();
  // Создаем подключение и проверяем его
  let nickname: string | undefined;
  let password: string | undefined;
  let pool: IPgConnectionPool | undefined;

  if (!payload.external) {
    password = payload.password;
  }
  nickname = payload.user;
  pool = anyGlobal.uniParams.pool;

  if (pool) {
    // если в пуле есть соединение - закрываем его
    if (anyGlobal.uniParams.pool.pgPromise) {
      try {
        anyGlobal.uniParams.pool.pgPromise.end();
      } catch (err) {
        console.error(err);
        return { status: ICallbackMessageStatus.ConnectionError, error: err };
      }
    }
  }
  let db: IDatabase<{}, IClient>;
  try {
    db = pgp({
      host: payload.host,
      port: payload.port,
      user: nickname,
      password: password,
      database: payload.database,
    });
    // конфигурируем пул
    pool = {
      pgPromise: pgp,
      mainConnection: db,
    };
    // возвращаем пул в глобал
    anyGlobal.uniParams.pool = pool;
    try {
      let data = await db.any(`select '${nickname}' as sMessage;`);
      anyGlobal.uniParams.username = nickname;
      return { status: ICallbackMessageStatus.Done, data };
    } catch (err) {
      console.error(err);
      return { status: ICallbackMessageStatus.QueryError, error: err };
    }
  } catch (err) {
    console.error(err);
    return { status: ICallbackMessageStatus.ConnectionError, error: err };
  }
};
export { setConnection };
