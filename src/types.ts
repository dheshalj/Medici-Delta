export type exRate = {
  date: string;
  rate: number;
};

export type tabheader = 'pending' | 'active' | 'reject' | 'deactive';

export type flushreq = {
  id: string;
  parentId: string;
  amountInLKR: number;
  amountInUSD: number;
  lodgedDate: number;
  status: 'In progress' | 'Accepted' | 'Declined';
  changedDate: number | null,
  tobeflushedDate: number;
};

export type user = {
  nameOfUser: string;
  NIC: string;
  businessName: string;
  BRNumber: string;
  mobileNumber: string;
  domain: string;
  indicator: string;
  syndicate: string;
  $balance: number;
  රුbalance: number;
  type: 'client' | 'agent' | 'admin';
  reqs?: [flushreq];
  state: 'pending' | 'active' | 'reject' | 'deactive';
  parent: string | 'ND';
};

export type ErrorTypes_Login =
  | 'UserNotExist'
  | 'SyndMismatch'
  | 'Indicator'
  | 'Syndicate'
  | undefined;
export type ErrorTypes_Register =
  | 'Name'
  | 'NIC'
  | 'BName'
  | 'BRNo'
  | 'MobNo'
  | 'Domain'
  | 'Indicator'
  | 'Syndicate'
  | undefined;
export type ErrorTypes_Profile =
  | 'AccountNo'
  | 'BankName'
  | 'BankBranch'
  | 'SWIFTBICCode'
  | undefined;
