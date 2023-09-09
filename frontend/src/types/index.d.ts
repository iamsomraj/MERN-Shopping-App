export interface IDataBaseRecords {
  __v: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct extends IDataBaseRecords {
  price: number;
  qtyInStock: number;
  isAvailable: boolean;
  name: string;
  image: string;
  user: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}
