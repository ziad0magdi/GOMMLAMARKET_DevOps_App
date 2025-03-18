// import React from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // Correct way to set worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

// const MyPdfViewer = ({ pdfPath }) => {
//   console.log(`http://localhost:8080${pdfPath}`);

//   return (
//     <div>
//       <Document file={`http://localhost:8080${pdfPath}`}>
//         <Page pageNumber={1} />
//       </Document>
//     </div>
//   );
// };

// export default MyPdfViewer;
