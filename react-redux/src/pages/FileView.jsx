import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, deleteFile, reset } from "../features/files/filesSlice";

const FileView = () => {
  const dispatch = useDispatch();

  const { files, isLoading, isError, message } = useSelector(
    (state) => state.files,
  );

  useEffect(() => {
    dispatch(getFiles());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await dispatch(deleteFile(fileId)).unwrap();
        alert("File deleted successfully");
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading files...</div>;
  }

  if (isError) {
    return <div style={styles.error}>Error: {message}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Files</h1>
        <p style={styles.subtitle}>
          {files.length} file{files.length !== 1 ? "s" : ""} uploaded
        </p>
      </div>

      {files.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No files uploaded yet</p>
          <a href="/upload" style={styles.uploadLink}>
            Upload your first file
          </a>
        </div>
      ) : (
        <div style={styles.grid}>
          {files.map((file) => (
            <div key={file._id} style={styles.card}>
              {/* File Preview */}
              <div style={styles.preview}>
                {file.fileType?.startsWith("image/") ? (
                  <img
                    src={file.fileUrl}
                    alt={file.originalName}
                    style={styles.previewImage}
                  />
                ) : (
                  <div style={styles.fileIcon}>
                    📄
                    <p style={styles.fileExt}>
                      {file.originalName?.split(".").pop()?.toUpperCase()}
                    </p>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div style={styles.info}>
                <h3 style={styles.fileName}>{file.originalName}</h3>
                <p style={styles.fileSize}>{formatFileSize(file.fileSize)}</p>
                <p style={styles.fileDate}>
                  {formatDate(file.createdAt || file.crtDt)}
                </p>
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.viewButton}
                >
                  View
                </a>
                <a
                  href={file.fileUrl}
                  download={file.originalName}
                  style={styles.downloadButton}
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(file._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#666",
    fontSize: "1rem",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    fontSize: "1.2rem",
  },
  error: {
    textAlign: "center",
    padding: "2rem",
    color: "#ff4d4f",
    fontSize: "1.1rem",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  emptyText: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "1rem",
  },
  uploadLink: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1890ff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  preview: {
    width: "100%",
    height: "200px",
    backgroundColor: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fileIcon: {
    fontSize: "4rem",
    textAlign: "center",
  },
  fileExt: {
    fontSize: "1rem",
    color: "#666",
    marginTop: "0.5rem",
  },
  info: {
    padding: "1rem",
  },
  fileName: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fileSize: {
    fontSize: "0.875rem",
    color: "#666",
    marginBottom: "0.25rem",
  },
  fileDate: {
    fontSize: "0.875rem",
    color: "#999",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
    padding: "1rem",
    borderTop: "1px solid #f0f0f0",
  },
  viewButton: {
    flex: 1,
    padding: "0.5rem",
    textAlign: "center",
    backgroundColor: "#1890ff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.875rem",
  },
  downloadButton: {
    flex: 1,
    padding: "0.5rem",
    textAlign: "center",
    backgroundColor: "#52c41a",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.875rem",
  },
  deleteButton: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
};

export default FileView;
