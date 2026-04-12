import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadFile, reset } from '../features/files/filesSlice';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.files
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await dispatch(uploadFile(formData)).unwrap();
      alert('File uploaded successfully!');
      navigate('/files');
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Upload File</h1>
        <p style={styles.subtitle}>Upload your files to the cloud</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Drag and Drop Area */}
          <div
            style={{
              ...styles.dropzone,
              ...(dragActive ? styles.dropzoneActive : {}),
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileChange}
              style={styles.fileInput}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={styles.dropzoneLabel}>
              {file ? (
                <div>
                  <p style={styles.fileName}>📄 {file.name}</p>
                  <p style={styles.fileSize}>
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p style={styles.dropzoneText}>
                    Drag and drop your file here
                  </p>
                  <p style={styles.dropzoneOr}>or</p>
                  <p style={styles.dropzoneButton}>Click to browse</p>
                </div>
              )}
            </label>
          </div>

          {/* Image Preview */}
          {preview && (
            <div style={styles.preview}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.buttons}>
            {file && (
              <button
                type="button"
                onClick={clearFile}
                style={styles.clearButton}
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={isLoading || !file}
            >
              {isLoading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>

        {isError && (
          <div style={styles.error}>
            ❌ {message}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  dropzone: {
    border: '2px dashed #d9d9d9',
    borderRadius: '8px',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  dropzoneActive: {
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  dropzoneLabel: {
    cursor: 'pointer',
    display: 'block',
  },
  dropzoneText: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  dropzoneOr: {
    color: '#999',
    margin: '1rem 0',
  },
  dropzoneButton: {
    color: '#1890ff',
    fontSize: '1rem',
    fontWeight: '500',
  },
  fileName: {
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  fileSize: {
    color: '#666',
  },
  fileInput: {
    display: 'none',
  },
  preview: {
    display: 'flex',
    justifyContent: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
    border: '1px solid #d9d9d9',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  clearButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#1890ff',
    color: 'white',
    cursor: 'pointer',
  },
  error: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff2f0',
    border: '1px solid #ffccc7',
    borderRadius: '4px',
    color: '#ff4d4f',
  },
};

export default FileUpload;