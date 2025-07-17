export interface Coupon {
  id: number;
  name: string;
  status: 'VALID' | 'INVALID';
  code: string;
  percentage: number;
  startTime: Date;
  expirationTime: Date;
  minValue: number;
}
