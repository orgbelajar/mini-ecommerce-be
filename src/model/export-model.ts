export type ExportOrderRequest = {
  cartId: string;
  targetEmail: string;
};

export type ExportOrderMessage = {
  cartId: string;
  targetEmail: string;
  userId: string;
  username: string;
  requestedAt: string;
};
