/*
  author: Porozov A.
  date: 16.10.2020
  purpose: модуль определения глобального объекта
*/

let anyGlobal = global as any; // для добавления нужно привести к типу, иначе typescript будет крыть матом

anyGlobal.uniParams = {
  pool: undefined,
  nickname: '',
};

export default anyGlobal; // экспортим для дальнейшего использования - повторной инициализации все равно не будет
