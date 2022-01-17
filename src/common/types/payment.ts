export type OmiseSource = {
  object: string;
  id: string;
  livemode: boolean;
  location: string;
  amount: number;
  barcode: string;
  bank: string;
  created_at: string;
  currency: string;
  email: string;
  flow: string;
  installment_term: number;
  name: string;
  mobile_number: string;
  phone_number: string;
  scannable_code: object;
  references: object;
  store_id: string;
  store_name: string;
  terminal_id: string;
  type: string;
  zero_interest_installments: boolean;
  charge_status: string;
  receipt_amount: number;
  discounts: [];
};

export type Basket = {
  productId: number;
  quantity: number;
};
