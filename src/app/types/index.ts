export type File = {
  legalFileRecordId: string;
  type: 'VENDOR AGREEMENT' | 'TERMS OF SERVICE';
  fileName: string;
  version: number;
  changesOnly: boolean;
};
