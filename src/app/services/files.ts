import { join } from 'path';
import files from './files.json';

export const getFiles = () => {
  return files;
};

export const getFileById = (id: string) => {
  return files.find((file) => file.legalFileRecordId === id);
};

export const fileIdsExist = (ids: string[]) => {
  return ids.every((id) => getFileById(id) !== undefined);
};

export const getFilePathByLegalFileRecordId = (legalFileRecordId: string) => {
  return join(import.meta.dirname, '../files', legalFileRecordId);
};
