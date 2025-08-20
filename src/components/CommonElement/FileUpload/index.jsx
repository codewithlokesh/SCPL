import React, { useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaUpload, FaTimes, FaEye } from 'react-icons/fa';
import './index.css';

const FileUpload = ({ 
  name, 
  value, 
  onChange, 
  onBlur, 
  isInvalid, 
  error, 
  label = "Upload File",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  placeholder = "Choose file",
  fileType = "image" // New prop to handle different file types
}) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type based on fileType prop
    let allowedTypes = [];
    if (fileType === "image") {
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    } else if (fileType === "document") {
      allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    } else if (fileType === "any") {
      allowedTypes = accept === "image/*" 
        ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        : accept.split(',').map(type => type.trim());
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`Please select a valid ${fileType === "image" ? "image" : "document"} file type`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Update form value
    onChange({
      target: {
        name: name,
        value: file
      }
    });
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onChange({
      target: {
        name: name,
        value: null
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <Form.Label>{label}</Form.Label>
      
      <div className="file-upload-simple">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        {!value ? (
          <div className="upload-input-wrapper">
            <Form.Control
              type="text"
              placeholder={placeholder}
              readOnly
              isInvalid={isInvalid}
            />
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={openFileDialog}
              className="upload-btn"
            >
              <FaUpload /> Browse
            </Button>
          </div>
        ) : (
          <div className="file-selected-wrapper">
            <div className="file-info-simple">
              <span className="file-name-simple">{value.name}</span>
              <span className="file-size-simple">({(value.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <div className="file-actions-simple">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={openFileDialog}
                title="Change file"
              >
                <FaEye />
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={clearFile}
                title="Remove file"
              >
                <FaTimes />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  );
};

export default FileUpload; 