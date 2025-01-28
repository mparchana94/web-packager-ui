import { useState } from "react";

const API_URL = "https://your-backend-api.onrender.com"; // Update this

function App() {
  const [webAppUrl, setWebAppUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!webAppUrl) {
      setStatus("Please enter a valid URL");
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
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setStatus("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>React Web App Exporter</h1>
      <input
        type="text"
        placeholder="Enter Web App URL"
        value={webAppUrl}
        onChange={(e) => setWebAppUrl(e.target.value)}
      />
      <button onClick={handleExport} disabled={loading}>
        {loading ? "Processing..." : "Export"}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default App;
