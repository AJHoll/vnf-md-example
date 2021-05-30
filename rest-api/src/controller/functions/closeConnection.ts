/*
  author: Porozov A.
  date: 18.11.2020
  purpose: Функция получения пунктов меню пользователя
*/

import anyGlobal from '../global';
import { IPgConnectionPool } from './setConnection';

const closeConnection = () => {
  const pool: IPgConnectionPool = anyGlobal.uniParams.pool;
  try {
    if (pool) {
      pool.pgPromise.end();
    }
  } catch (err) {
    console.error(err);
    try {
      pool.pgPromise.end();
    } catch (err) {
      console.error(err);
    }
  } finally {
    anyGlobal.uniParams.pool = { pgPromise: null, mainConnection: null };
  }
};
export { closeConnection };
