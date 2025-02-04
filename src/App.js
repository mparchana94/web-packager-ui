import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

const App = () => {
  const [webAppUrl, setWebAppUrl] = useState("");
  const [appName, setAppName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ url: "", appName: "", server: "" });
  const [touched, setTouched] = useState({ url: false, appName: false });

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "url") {
      setErrors((prev) => ({
        ...prev,
        url: !value
          ? "URL is required"
          : !validateUrl(value)
          ? "Please enter a valid URL (e.g., https://example.com)"
          : "",
      }));
    } else if (field === "appName") {
      setErrors((prev) => ({
        ...prev,
        appName: !value ? "App Name is required" : "",
      }));
    }
  };

  const handleExport = async () => {
    setErrors({ url: "", appName: "", server: "" });

    if (!webAppUrl || !validateUrl(webAppUrl)) {
      setErrors((prev) => ({ ...prev, url: "Please enter a valid URL" }));
      return;
    }

    if (!appName.trim()) {
      setErrors((prev) => ({ ...prev, appName: "App Name is required" }));
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await axios.post(`${API_URL}/convert`, {
        url: webAppUrl,
        appName: appName
      }, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response, 'ARRD')

      const data = await response.json();
      if (response.ok) {
        setStatus(`Export started: ${data.message}`);
      } else {
        setErrors((prev) => ({ ...prev, server: data.message || "Server error occurred" }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, server: "Failed to connect to backend. Please try again later." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <span className="icon">📦</span> Web App Packager
          </h1>
          <p className="card-description">
            Enter your web application URL and name to create a deployable package
          </p>
        </div>

        <div className="card-content">
          {/* App Name Input */}
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">📝</span>
              <input
                type="text"
                placeholder="Enter App Name"
                value={appName}
                onChange={handleInputChange(setAppName, "appName")}
                className={`input-field ${errors.appName && touched.appName ? "error" : ""}`}
              />
            </div>
            {errors.appName && touched.appName && (
              <div className="error-message">⚠️ {errors.appName}</div>
            )}
          </div>

          {/* Web App URL Input */}
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">🌐</span>
              <input
                type="url"
                placeholder="https://your-webapp.com"
                value={webAppUrl}
                onChange={handleInputChange(setWebAppUrl, "url")}
                className={`input-field ${errors.url && touched.url ? "error" : ""}`}
              />
            </div>
            {errors.url && touched.url && (
              <div className="error-message">⚠️ {errors.url}</div>
            )}
          </div>

          {/* Submit Button */}
          <button onClick={handleExport} disabled={loading} className="submit-button">
            {loading ? "Processing..." : "Create Package"}
          </button>

          {/* Status & Error Messages */}
          {status && <div className="status-message success">{status}</div>}
          {errors.server && <div className="status-message error">⚠️ {errors.server}</div>}
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
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-description {
          color: #666;
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

        .input-field {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .input-field.error {
          border-color: #dc2626;
        }

        .error-message {
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

        .submit-button:hover {
          background-color: #1d4ed8;
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
        }

        .status-message.error {
          background-color: #fee2e2;
          color: #991b1b;
        }
      `}</style>
    </div>
  );
};

export default App;
