export interface Payment {
  id: string;
  method: string;
  status: string;
  order: {
    id: string;
    totalValue: number;
    discountValue: number;
    totalWithDiscount: number;
  };
  coupons: {
    id: number;
    name: string;
    percentage: number;
  }[];
}
