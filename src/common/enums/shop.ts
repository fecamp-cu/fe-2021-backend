export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'successful',
}

export enum PaymentMessage {
  RECEIPT = 'Thank you for your FE Shop puchase!',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  INTERNET_BANKING = 'internet_banking',
  PROMPT_PAY = 'promptpay',
}

export enum Bank {
  SCB = 'scb',
  BAY = 'bay',
  BBL = 'bbl',
  KTB = 'ktb',
}

export type PaymentInternetBanking =
  | 'internet_banking_scb'
  | 'internet_banking_bay'
  | 'internet_banking_bbl'
  | 'internet_banking_ktb';

export type PaymentType = 'credit_card' | 'internet_banking' | 'promptpay' | PaymentInternetBanking;
