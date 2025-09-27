export interface FinancialRecord {
  month: number;
  amount: string;
  record_id: number;
}

export interface UserFinance {
  username: string;
  year: number;
  records: FinancialRecord[];
}
