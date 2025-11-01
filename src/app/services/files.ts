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
  // const possiblePaths = [
  //   // Production: assets should be copied to server dist/assets
  //   join(cwd, '../assets/files', legalFileRecordId + '.pdf'),
  //   // Development: assets in src directory
  //   join(cwd, '../../assets/files', legalFileRecordId + '.pdf'),
  //   // Fallback: try from cwd
  //   join(cwd, 'src/assets/files', legalFileRecordId + '.pdf'),
  // ];

  const path = join(cwd, 'src/assets/files', legalFileRecordId + '.pdf');
  // Return the first path that exists, or the production path as default
  // for (const path of possiblePaths) {
  if (existsSync(path)) {
    return path;
  }
  throw new Error(`File not found: ${path}`);
  // }

  // Default to production path
  // return possiblePaths[0];
};
