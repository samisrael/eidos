import React, { useEffect, useRef, useState } from "react";
import "./BasePredictComponent.css";

const BasePredictComponent = ({
  apiUrl,
  accept,
  inputLabel,
  previewType = "image",
}) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);

    abortRef.current?.abort();
    abortRef.current = null;

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }

    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    reset();
    const selected = e.target.files?.[0];
    if (!selected) return;

    const url = URL.createObjectURL(selected);
    previewRef.current = url;

    setFile(selected);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: form,
        signal: controller.signal,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const json = await res.json();
      setResult(json);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Prediction failed");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="predict-container">
      <form onSubmit={handleSubmit}>
        <label className="upload-label">{inputLabel}</label>

        <input type="file" accept={accept} onChange={handleChange} />

        {previewUrl && previewType === "image" && (
          <img src={previewUrl} alt="preview" className="preview-img" />
        )}

        {previewUrl && previewType === "audio" && (
          <audio controls src={previewUrl} />
        )}

        <div className="btn-row">
          <button type="submit" disabled={!file || loading}>
            {loading ? "Processing..." : "Predict"}
          </button>

          <button type="button" onClick={reset}>
            Clear
          </button>
        </div>
      </form>

      {error && <div className="error-text">{error}</div>}

{result && (
  <div className="result-card">
    <div className="prediction-title">Prediction Result</div>

    <div className="prediction-value">
      {result.label ?? `Class ${result.class_index}`}
    </div>

    {typeof result.confidence === "number" && (
      <>
        <div className="confidence-row">
          <span className="confidence-title">Confidence</span>
          <span>{(result.confidence * 100).toFixed(2)}%</span>
        </div>

        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
      </>
    )}
  </div>
)}

    </div>
  );
};

export default BasePredictComponent;
