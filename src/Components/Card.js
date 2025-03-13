import React from "react";
import jsPDF from "jspdf";

const Card = ({ data, state, showFilters }) => {
  const downloadArticleAsPDF = async (title, url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      let articleText =
        tempDiv.querySelector("article")?.innerText ||
        tempDiv.querySelector("p")?.innerText ||
        "Could not extract article content.";

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text(title, 10, 10);

      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(articleText, 180);
      doc.text(splitText, 10, 20);

      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("Failed to download article. Some sites may block direct access.");
    }
  };

  return (
    <div
      className={`cardContainer ${state} ${showFilters ? "filter-open" : ""}`}
    >
      {data.map((curItem, index) => {
        if (!curItem.urlToImage) return null;

        return (
          <div className={`card ${state}`} key={index}>
            <img src={curItem.urlToImage} alt="news" />
            <div className={`content ${state}`}>
              <small
                className={`source-badge ${
                  state === "dark-mode" ? "text-info" : "text-secondary"
                }`}
              >
                {curItem.source.name}
              </small>
              <a
                className={`title ${state}`}
                onClick={() => window.open(curItem.url)}
              >
                {curItem.title}
              </a>
              <p className={state}>{curItem.description}</p>
              <div className="buttons">
                <button
                  className={`read-more ${state}`}
                  onClick={() => window.open(curItem.url)}
                >
                  Read More
                </button>
                <button
                  className={`download ${state}`}
                  onClick={() =>
                    downloadArticleAsPDF(curItem.title, curItem.url)
                  }
                >
                  Download Full Article
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
