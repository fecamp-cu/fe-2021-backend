import { PaymentType } from '../enums/shop';

export type OmiseSource = {
  object: 'source';
  id: string;
  livemode: boolean;
  location: string;
  amount: number;
  barcode: string;
  bank: string;
  card: PaymentCard;
  created_at: string;
  currency: string;
  email: string;
  flow: string;
  installment_term: number;
  name: string;
  mobile_number: string;
  phone_number: string;
  scannable_code: ScannableCode;
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

export type PaymentCard = {
  object: 'card';
  id: string;
  livemode: boolean;
  location: string;
  deleted: boolean;
  street1: string;
  street2: string;
  city: string;
  state: string;
  phone_number: string;
  postal_code: string;
  country: string;
  financing: 'credit';
  bank: string;
  brand: string;
  fingerprint: string;
  first_digits: string;
  last_digits: string;
  name: string;
  expiration_month: number;
  expiration_year: number;
  security_code_check: boolean;
  created_at: Date;
};

export type OmiseCharge = {
  object: 'charge';
  id: string;
  location: string;
  amount: number;
  net: number;
  fee: number;
  fee_vat: number;
  interest: number;
  interest_vat: number;
  funding_amount: number;
  refunded_amount: number;
  transaction_fees: TransactionFee;
  platform_fee: PlatformFee;
  currency: string;
  funding_currency: string;
  ip: string;
  refunds: Refund;
  link: string;
  description: string;
  metadata: object;
  card: PaymentCard;
  source: OmiseSource;
  schedule: string;
  customer: string;
  dispute: string;
  transaction: string;
  failure_code: string;
  failure_message: string;
  status: string;
  authorize_uri: string;
  return_uri: string;
  created_at: Date;
  paid_at: Date;
  expires_at: Date;
  expired_at: Date;
  reversed_at: Date;
  zero_interest_installments: boolean;
  branch: object;
  authorized: boolean;
  capturable: boolean;
  capture: boolean;
  disputable: boolean;
  livemode: boolean;
  refundable: boolean;
  reversed: boolean;
  reversible: boolean;
  voided: boolean;
  paid: boolean;
  expired: boolean;
};

export type TransactionFee = {
  fee_flat: string;
  fee_rate: string;
  vat_rate: string;
};

export type PlatformFee = {
  fixed: string;
  amount: string;
  percentage: string;
};

export type Refund = {
  object: string;
  data: [];
  limit: number;
  offset: number;
  total: number;
  location: string;
  order: string;
  from: string;
  to: string;
};

export type ScannableCode = {
  object: string;
  type: string;
  image: Image;
};

export type Image = {
  object: string;
  livemode: boolean;
  id: string;
  deleted: boolean;
  filename: string;
  location: string;
  download_uri: string;
  created_at: Date;
};

export type Basket = {
  price: number;
  productId: number;
  quantity: number;
};

export type ChargeRequest = {
  amount: number;
  currency: 'THB';
  return_uri?: string;
  source?: string;
  card?: string;
};

export type SourceRequest = {
  amount: number;
  currency: 'THB' | 'USD';
  type?: PaymentType;
  bank?: string;
  barcode?: string;
  email?: string;
  installmentTerm?: number;
  mobileNumber?: string;
  name?: string;
  platformType?: string;
  storeId?: string;
  storeName?: string;
  terminalId?: string;
  zeroInterestInstallments?: boolean;
};
