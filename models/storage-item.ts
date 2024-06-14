export type StorageItem = {
  Name: string;
  Type: number;
  Size: number;
  UpdatedAt: Date;
  ItemsCount: number;
  IsDirectory: boolean;
  AbsolutePath: string;
  Shared: string[];
};
