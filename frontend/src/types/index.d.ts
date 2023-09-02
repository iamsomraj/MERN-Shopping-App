export interface IDBRecords {
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct extends IDBRecords {
  price: number;
  qtyInStock: number;
  isAvailable: boolean;
  name: string;
  image: string;
  user: string;
}
