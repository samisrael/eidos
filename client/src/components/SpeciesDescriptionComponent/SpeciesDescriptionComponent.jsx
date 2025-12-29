import React from "react";
import "./SpeciesDescriptionComponent.css";

const SpeciesDescriptionComponent = ({
  species,
  description,
  wikipediaUrl,
}) => {
  if (!description && !wikipediaUrl) return null;

  return (
    <div className="species-card">
      <h3 className="species-title">About {species}</h3>

      {description && (
        <p className="species-text">{description}</p>
      )}

      {wikipediaUrl && (
        <a
          href={wikipediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="species-link"
        >
          Read more on Wikipedia
        </a>
      )}
    </div>
  );
};

export default SpeciesDescriptionComponent;
