import { State } from "./lib/DataContext";

export const sorter = (param: string) => {
  return (a: any, b: any) => a[param] - b[param];
};

export const stringifyEnum = (enumObj: any, value: any) => {
  const text: string = enumObj[value];
  return text.replace(/([A-Z])/g, " $1");
};

export enum ToArrayType {
  Values,
  Keys,
  Entries,
}

export const toArray = (
  object: object,
  type: ToArrayType = ToArrayType.Values
) => {
  switch (type) {
    case ToArrayType.Values:
      return Object.values(object);
    case ToArrayType.Keys:
      return Object.keys(object);
    case ToArrayType.Entries:
      return Object.entries(object);
  }
};

export const parseState = (item: object, Type: any, objectPath = "name") =>
  toObject(
    toArray(item).map((i) => Type.parse(i)),
    objectPath
  );

export const toObject = (array: any[], path: string = "name") => {
  let res: any = {};

  array.forEach((item) => {
    let parts = path.split(".");
    let obj = item;

    let part = parts.shift();
    while (!!part) {
      obj = obj[part];
      part = parts.shift();
    }

    res[obj] = item;
  });

  return res;
};

export const objectToType = (object: object, Type: any) => {
  return Type.parse(object);
};

export const deleteProperty = (
  object: Record<string, any>,
  property: string
): Record<string, any> => {
  let newObject = { ...object };
  delete newObject[property];
  return newObject;
};

export const getRandInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
