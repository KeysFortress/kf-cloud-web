export type Identity = {
  Id: string;
  Name: string;
  KeyType: string;
  KeySize: number;
  PublicKey: string;
  PrivateKey: number;
  CreatedAt: Date;
  UpdatedAt?: Date;
};
