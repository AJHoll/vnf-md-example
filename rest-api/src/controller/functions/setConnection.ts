/*
  author: Porozov A.
  date: 18.11.2020
  purpose: Функция открытия и сохранения подключения
*/
import pgPromise, { IDatabase, IMain } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import anyGlobal from '../global';
import { ICallbackMessage, ICallbackMessageStatus } from '../interfaces';

const pgp: IMain<{}, IClient> = pgPromise();

export interface IPgConnectionPool {
  pgPromise: IMain<{}, IClient>;
  mainConnection: IDatabase<{}, IClient>;
}

const setConnection = async (payload: any): Promise<ICallbackMessage> => {
  // Создаем подключение и проверяем его
  let nickname: string | undefined;
  let password: string | undefined;
  let pool: IPgConnectionPool | undefined;
  // забираем конфиги из общего объекта конфигурации подключений
  const dbConfig: any = anyGlobal.uniParams.avilableDatabases.find(
    (item: any) => item.name === payload.database,
  );

  if (!payload.external) {
    password = payload.password;
  }
  nickname = payload.nickname;

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
      host: dbConfig.host,
      port: dbConfig.port,
      user: nickname,
      password: password,
      database: dbConfig.database,
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
