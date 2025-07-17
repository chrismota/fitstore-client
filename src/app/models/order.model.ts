export interface Order {
  id: string;
  totalValue: number;
  discountValue: number;
  totalWithDiscount: number;
  status: string;
  createdAt: Date;
  items: {
    id: number;
    productName: string;
    unityPrice: number;
    quantity: number;
    total: number;
    imagePath: string;
  }[];
}
