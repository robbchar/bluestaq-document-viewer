import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { fileIdsExist, getFileById, getFiles } from './app/services/files';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

app.get('/api/data', (_, res) => {
  res.json(getFiles());
});

app.get('/api/data/:legalFileRecordId', (req, res) => {
  const fileRecord = getFileById(req.params.legalFileRecordId);
  if (!fileRecord) {
    res.status(404).json({ error: 'File not found' });
  } else {
    res.json(fileRecord);
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
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
