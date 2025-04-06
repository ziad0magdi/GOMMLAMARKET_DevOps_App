import React, { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PDFViewer = ({ pdfPath, isOpen, onClose }) => {
  if (!pdfPath) return null;

  const pdfUrl = `http://localhost:8080${pdfPath}`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="PDF Viewer"
      style={{
        content: {
          width: "80%",
          height: "80%",
          margin: "auto",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <button
        onClick={onClose}
        style={{ float: "right", fontSize: "16px", cursor: "pointer" }}
      >
        ❌
      </button>
      <iframe src={pdfUrl} width="100%" height="100%" title="PDF Viewer" />
    </Modal>
  );
};

export default PDFViewer;
