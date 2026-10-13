import React from "react";
import "./ResourceCard.css";

const ResourceCard = ({ link, category, url }) => {
  return (
    <div className="resource-card">
      <h3 className="resource-title">{link}</h3>
      <p className="resource-category">Category: {category}</p>
      <a
        href={url}
        className="resource-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Resource <span className="arrow">↗</span>
      </a>
    </div>
  );
};

export default ResourceCard;
