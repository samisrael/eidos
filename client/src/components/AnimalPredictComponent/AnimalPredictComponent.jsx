import React, { useState, useRef } from "react";
import "../AnimalPredictComponent/AnimalPredictComponent.css";

export default function AnimalPredictionComponent({
  apiUrl = "http://localhost:8000/predict/image",
  allowedTypes = "image/*",
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  function resetState(keepPreview = false) {
    setFile(null);
    if (!keepPreview) setPreviewUrl(null);
    setResult(null);
    setError(null);
    setLoading(false);
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {}
      abortRef.current = null;
    }
  }

  function handleFileChange(e) {
    resetState(true);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleUpload(e) {
    e?.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("No file selected.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: form,
        signal: controller.signal,
      });

      if (!res.ok) {
        let textErr = await res.text();
        try {
          const json = JSON.parse(textErr);
          textErr = json.detail || JSON.stringify(json);
        } catch {}
        throw new Error(textErr || `HTTP ${res.status}`);
      }

      const json = await res.json();

      const normalized = {
        pred_class: json.pred_class ?? json.class ?? null,
        label: json.label ?? json.predicted_label ?? null,
        confidence:
          typeof json.confidence === "number" ? json.confidence : null,
        raw: json,
      };

      setResult(normalized);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Upload canceled.");
      } else {
        setError(err.message || "Upload failed.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleCancel() {
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
  }

  return (
    <div className="animal-container">
      <form onSubmit={handleUpload}>
        <label className="upload-label">Upload an image</label>

        <input
          type="file"
          accept={allowedTypes}
          onChange={handleFileChange}
          className="file-input"
        />

        {previewUrl && (
          <div className="preview-wrapper">
            <img src={previewUrl} alt="preview" className="preview-img" />
          </div>
        )}

        <div className="btn-row">
          <button
            type="submit"
            disabled={loading || !file}
            className="btn primary"
          >
            {loading ? "Classifying..." : "Upload & Classify"}
          </button>

          <button
            type="button"
            onClick={() => {
              resetState(false);
              setPreviewUrl(null);
            }}
            className="btn secondary"
          >
            Clear
          </button>

          {loading && (
            <button type="button" onClick={handleCancel} className="btn cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="result-box">
        {error && <div className="error-text">{error}</div>}

        {result && !error && (
          <div className="result-card">
            <div className="result-label">
              {result.label.charAt(0).toUpperCase() + result.label.slice(1)}
            </div>
            {/* <div className="result-line">
              Class index: <strong>{result.pred_class}</strong>
            </div> */}
            <div className="result-line">
              Confidence:{" "}
              <strong>
                {result.confidence == null
                  ? "N/A"
                  : `${(Number(result.confidence) * 100).toFixed(2)}%`}
              </strong>
            </div>

            <details className="raw-details">
              <summary>Raw response</summary>
              <pre className="raw-json">
                {JSON.stringify(result.raw, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
