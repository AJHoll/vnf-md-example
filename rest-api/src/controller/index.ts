/*
  author: Porozov A.
  date: 16.10.2020
  purpose: Контроллер для работы с pg-promise
*/
import { setConnection } from './functions/setConnection';
import { query } from './functions/query';
import { closeConnection } from './functions/closeConnection';

export { setConnection, query, closeConnection };
