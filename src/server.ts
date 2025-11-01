import express from 'express';
import cors from 'cors';
import {
  fileIdsExist,
  getFileById,
  getFiles,
  getFilePathByLegalFileRecordId,
} from './app/services/files';
import { existsSync } from 'node:fs';

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());

app.get('/api/data', (_, res) => {
  res.json(getFiles());
});

app.get('/api/data/:legalFileRecordId', (req, res) => {
  const fileRecord = getFileById(req.params.legalFileRecordId);
  if (!fileRecord) {
    res.status(404).json({ error: 'File record not found' });
  } else {
    res.json(fileRecord);
  }
});

app.get('/api/data/file/path/:legalFileRecordId', (req, res) => {
  const filePath = getFilePathByLegalFileRecordId(req.params.legalFileRecordId);

  if (!existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
  } else {
    res.sendFile(filePath);
  }
});

app.get('/api/data/file/download/:legalFileRecordId', (req, res) => {
  const filePath = getFilePathByLegalFileRecordId(req.params.legalFileRecordId);
  if (!existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
  } else {
    res.download(filePath);
  }
});

app.post('/api/data/user-agreement/', (req, res) => {
  const legalFileRecordIds = req.body.legalFileRecordIds;
  if (fileIdsExist(legalFileRecordIds)) {
    res.status(200).send('Items processed successfully.');
  } else {
    res.status(400).send('No IDs provided');
  }
});

/**
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
const port = process.env['PORT'] || 4000;
app.listen(Number(port), (error?: Error) => {
  if (error) {
    throw error;
  }

  console.log(`Node Express server listening on http://localhost:${port}`);
});
