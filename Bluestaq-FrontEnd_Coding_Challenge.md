# Legal Document Agreement Component Challenge

## Background

You're tasked with creating a user-friendly web component that allows vendors in your web application to view and agree to legal documents. The component should handle multiple document types, including revisions that show only the changes.

## API Response Format

The server returns an array of legal document objects with the following structure:

```json
[
  {
    "legalFileRecordId": "3cc85ca4-c9ce-4923-b1da-5fed8ffe9898",
    "type": "VENDOR AGREEMENT",
    "fileName": "agreement1.pdf",
    "version": 2,
    "changesOnly": false
  },
  {
    "legalFileRecordId": "bcac09a7-1f14-4a96-ba8b-f64d25ecfb6c",
    "type": "VENDOR AGREEMENT",
    "fileName": "agreement1-changes.pdf",
    "version": 2,
    "changesOnly": true
  },
  {
    "legalFileRecordId": "4dea1234-5678-4a96-ba8b-f64d25abcdef",
    "type": "TERMS OF SERVICE",
    "fileName": "terms-of-service.pdf",
    "version": 1,
    "changesOnly": false
  }
]
```

## Requirements

Modern Web Component
Build a reusable component using a modern framework (Angular preferred, but React, Vue, etc. are acceptable).

### Document Organization

- Group documents by their \`type\`
- For each type, there will be either:
  - A single complete document (\`changesOnly: false\`)
  - OR a pair of documents: one complete (\`changesOnly: false\`) and one showing only changes from previous version (\`changesOnly: true\`)

### Document Display

- Display documents inline within your component
- When a type has both a complete document and a changes-only document, display the changes-only document by default
- Provide a way for users to open/download the complete document in these cases

### User Agreement Mechanism

- Create a checkbox for each document type (not for each file)
- The checkbox should indicate agreement to the complete document, even when displaying the changes-only version
- All checkboxes must be checked before submission is allowed
- Include appropriate validation and error messaging

### User Experience

- Design an intuitive, user-friendly interface with clear instructions
- Include loading states for document retrieval
- Add appropriate error handling for failed document loads

### Form Submission

- Upon submission, return an array of objects containing the IDs of agreed-upon documents

### Technical Notes

- All legal documents will be PDFs
- You will need to either create or mock a service that returns a PDF.
- Handle PDF display appropriately within your component (e.g., using embed/iframe or a PDF library)

## Evaluation Criteria

Functionality
Does it meet all requirements and correctly handle the document types?

Code Quality
Is the code well-structured, maintainable, and following best practices?

UI/UX Design
Is the interface intuitive, clean, and professional?

Technical Choices
Are the chosen libraries and implementation approaches appropriate?

Edge Cases
How does the solution handle errors, loading states, and validation?

## Submission

Please provide:

1. Source code in a GitHub repository (public or private with access granted)

2. A README file with:

- Setup instructions
- Any assumptions made
- Design decisions and tradeoffs
- Any additional features or improvements you'd make with more time

Good luck!
