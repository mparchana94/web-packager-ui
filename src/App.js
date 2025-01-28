import React, { useState } from 'react';
const API_URL = "https://your-backend-api.onrender.com"; // Update this

const App = () => {
  const [webAppUrl, setWebAppUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    url: "",
    server: ""
  });
  const [touched, setTouched] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setWebAppUrl(value);
    setTouched(true);
    
    setErrors(prev => ({ ...prev, url: "" }));
    
    if (!value) {
      setErrors(prev => ({ ...prev, url: "URL is required" }));
    } else if (!validateUrl(value)) {
      setErrors(prev => ({ ...prev, url: "Please enter a valid URL (e.g., https://example.com)" }));
    }
  };

  const handleExport = async () => {
    setErrors({ url: "", server: "" });
    
    if (!webAppUrl) {
      setErrors(prev => ({ ...prev, url: "URL is required" }));
      return;
    }

    if (!validateUrl(webAppUrl)) {
      setErrors(prev => ({ ...prev, url: "Please enter a valid URL" }));
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(`${API_URL}/package`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webAppUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Export started: ${data.message}`);
      } else {
        setErrors(prev => ({ ...prev, server: data.message || "Server error occurred" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, server: "Failed to connect to backend. Please try again later." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <span className="icon">📦</span>
            Web App Packager
          </h1>
          <p className="card-description">
            Enter your web application URL to create a deployable package
          </p>
        </div>
        
        <div className="card-content">
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">🌐</span>
              <input
                type="url"
                placeholder="https://your-webapp.com"
                value={webAppUrl}
                onChange={handleUrlChange}
                onBlur={() => setTouched(true)}
                className={`url-input ${errors.url && touched ? 'error' : ''}`}
              />
            </div>
            {errors.url && touched && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{errors.url}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            disabled={loading || (errors.url && touched)}
            className="submit-button"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <span>Create Package</span>
            )}
          </button>

          {status && (
            <div className="status-message success">
              {status}
            </div>
          )}

          {errors.server && (
            <div className="status-message error">
              ⚠️ {errors.server}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          padding: 2rem;
        }

        .card-header {
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-description {
          color: #666;
          margin: 0;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
        }

        .url-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .url-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .url-input.error {
          border-color: #dc2626;
        }

        .url-input.error:focus {
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .submit-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .status-message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .status-message.success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .status-message.error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
      `}</style>
    </div>
  );
};

export default App;