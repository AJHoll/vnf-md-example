import { IOperation } from "./IOperation";

export interface IOperations {
  selectData: IOperation; // выборка данных из базы
  refreshData?: IOperation; // обновление данных по строке
  insertRecord?: IOperation; // создание новой записи в базе
  updateRecord?: IOperation; // обновление данных в базе
  deleteRecord?: IOperation; // удаление данных из базы
  getRecordForCreate?: IOperation; // получение объекта перед созданием новой строки
  userOperations?: {
    [key: string]: IOperation;
  }; // другие пользовательские объекты, если потребуется
}
