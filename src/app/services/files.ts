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
  // In development: resolve from src directory
  // In production (after build): resolve from server dist directory
  // Try multiple paths to handle both dev and production scenarios
  const possiblePaths = [
    // Production: assets should be copied to server dist/assets
    join(cwd, '../assets/files', legalFileRecordId + '.pdf'),
    // Development: assets in src directory
    join(cwd, '../../assets/files', legalFileRecordId + '.pdf'),
    // Fallback: try from cwd
    join(cwd, 'src/assets/files', legalFileRecordId + '.pdf'),
  ];

  // Return the first path that exists, or the production path as default
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  // Default to production path
  return possiblePaths[0];
};
