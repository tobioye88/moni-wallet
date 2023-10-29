export interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface VerifyPaymentResponse {
  id: number;
  domain: string;
  amount: number;
  currency: string;
  due_date: string;
  has_invoice: boolean;
  invoice_number: number;
  description: string;
  pdf_url: any;
  line_items: LineItem[];
  tax: Tax[];
  request_code: string;
  status: string;
  paid: boolean;
  paid_at: any;
  metadata: any;
  notifications: any[];
  offline_reference: string;
  customer: Customer;
  created_at: string;
  integration: Integration;
  pending_amount: number;
}

export interface LineItem {
  name: string;
  amount: number;
}

export interface Tax {
  name: string;
  amount: number;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: any;
  metadata: Metadata;
  risk_action: string;
  international_format_phone: any;
}

export interface Metadata {
  calling_code: string;
}

export interface Integration {
  key: string;
  name: string;
  logo: string;
  allowed_currencies: string[];
}
