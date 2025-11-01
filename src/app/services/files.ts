import { join } from 'path';
import { existsSync } from 'node:fs';
import files from './files.json';
import { File } from '../types';

export const getFiles = (): File[] => {
  return files as File[];
};

export const getFileById = (id: string) => {
  return files.find((file) => file.legalFileRecordId === id);
};

export const fileIdsExist = (ids: string[]) => {
  return ids.every((id) => getFileById(id) !== undefined);
};

export const getFilePathByLegalFileRecordId = (
  legalFileRecordId: string,
  cwd: string = process.cwd(),
): string => {
  const path = join(cwd, 'src/assets/files', legalFileRecordId + '.pdf');
  if (existsSync(path)) {
    return path;
  }
  throw new Error(`File not found: ${path}`);
};
