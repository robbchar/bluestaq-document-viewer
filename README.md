# Document Viewer

## Setup

- Clone the Repo from `https://github.com/robbchar/bluestaq-document-viewer`.
- Run `yarn install` from the root directory.
- Run `yarn dev` to spin up both the client and the server.

## Assumptions

- the link between the document is the type
  - only one `"changesOnly": false` doc is sent per type

## Future Things

- migrate to a full on error handling service (possibly toasts or the like)
- integrate a design system (buttons, checkboxes, etc...)
- find a smaller pdf viewer, thats the largest hit to the bundle size
