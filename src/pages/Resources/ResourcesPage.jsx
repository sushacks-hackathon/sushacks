import React, { useEffect, useState } from "react";
import "./ResourcesPage.css";
import Navbar from "../../components/Navbar";
import ResourceCard from "../../components/ResourceCard";

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch("/resources.json")
      .then((res) => res.json())
      .then((data) => {
        // Optional: Map category numbers to labels
        const categorized = data.map((item) => ({
          ...item,
          category: mapCategory(item.category),
        }));
        setResources(categorized);
      })
      .catch((err) => console.error("Error loading resources:", err));
  }, []);

  const mapCategory = (code) => {
    const categories = {
      "1": "General",
      "3": "Aptitude",
      "4": "Data Interpretation",
      "5": "Verbal Ability",
      "6": "Logical Reasoning",
      "7": "Verbal Reasoning",
    };
    return categories[code] || "Other";
  };

  return (
    <>
      <Navbar />
      <div className="resources-container">
        <h1 className="resources-title">Resources</h1>
        <p className="resources-subtitle">
          Access helpful resources and links for your professional journey.
        </p>
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              link={resource.link}
              category={resource.category}
              url={resource.url}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResourcesPage;
