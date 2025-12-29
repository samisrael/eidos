import React, { useEffect, useRef, useState } from "react";
import "./BasePredictComponent.css";
import SpeciesDescriptionComponent from "../SpeciesDescriptionComponent/SpeciesDescriptionComponent";

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
    // 1️⃣ Call model API (FastAPI)
    const modelRes = await fetch(apiUrl, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    if (!modelRes.ok) {
      throw new Error("Model prediction failed");
    }

    const modelJson = await modelRes.json();
    const species = modelJson.label;

    // 2️⃣ Call Node backend (Wikipedia enrichment)
    const wikiRes = await fetch(
      "http://localhost:7001/api/v1/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species }),
      }
    );

    if (!wikiRes.ok) {
      throw new Error("Failed to fetch species info");
    }

    const wikiJson = await wikiRes.json();

    // 3️⃣ Merge result
    setResult({
      label: species,
      confidence: modelJson.confidence,
      description: wikiJson.description,
      wikipediaUrl: wikiJson.wikipediaUrl,
    });
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
      {result.label}
    </div>

    {typeof result.confidence === "number" && (
      <>
        <div className="confidence-row">
          <span className="confidence-title">Prediction Strength</span>
          <span>{(result.confidence * 100).toFixed(1)}%</span>
        </div>

        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
      </>
    )}

    <SpeciesDescriptionComponent
      species={result.label}
      description={result.description}
      wikipediaUrl={result.wikipediaUrl}
    />
  </div>
)}

    </div>
  );
};

export default BasePredictComponent;
