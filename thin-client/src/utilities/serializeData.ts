export interface ISerializeData {
  id: number | string;
  id_parent?: number | string;
  s_key?: number | string;
  s_parent_key?: number | string;
}

export type IMapFunction = (item: ISerializeData | any) => any;

const mapItem = (
  item: ISerializeData | any,
  mapFunction?: IMapFunction | undefined
): ISerializeData | any => {
  let serializedData: ISerializeData | any;
  serializedData = item;
  // по-умолчанию key и parent_key = id и id_parent
  serializedData.key = item.id;
  serializedData.parent_key = item.id_parent;

  if (serializedData.s_key) {
    serializedData.key = serializedData.s_key;
  }
  if (serializedData.s_parent_key) {
    serializedData.parent_key = serializedData.s_parent_key;
  }
  if (mapFunction) {
    serializedData = mapFunction(serializedData);
  }

  return { ...serializedData };
};

const serializeData = (
  data: ISerializeData[],
  mapFunction?: IMapFunction,
  parent_key?: number | string,
  childrenKeyName: string = "children"
): any[] => {
  let serializedData: ISerializeData[] = [];
  // если мы не в цикле рекурсии - то
  if (!parent_key) {
    serializedData = [...data].filter((item: ISerializeData) => {
      return !item.id_parent && !item.s_parent_key;
    });
  } else {
    serializedData = [...data].filter((item) => {
      return item.id_parent === parent_key || item.s_parent_key === parent_key;
    });
  }
  serializedData = serializedData.map((item: any) => {
    const serializedItem = mapItem(item, mapFunction);

    serializedItem[childrenKeyName] = serializeData(
      data,
      mapFunction,
      serializedItem.key
    );
    if (serializedItem[childrenKeyName].length === 0)
      serializedItem[childrenKeyName] = undefined;

    return { ...serializedItem };
  });
  return serializedData;
};

export default serializeData;
