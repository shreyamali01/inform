import React, { useEffect, useState } from "react";
import Card from "./Card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import jsPDF from "jspdf";

const Newsapp = () => {
  const [showHero, setShowHero] = useState(true);
  const [state, setState] = useState("light-mode");
  const [showNotes, setShowNotes] = useState(false);
  const [isHeroSliding, setIsHeroSliding] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [search, setSearch] = useState("");
  const [newsData, setNewsData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("newest");
  const [selectedSources, setSelectedSources] = useState([]);
  const [availableSources, setAvailableSources] = useState(new Set());
  const API_KEY = "b7a747dccc8c45ad819019506cb4a368";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !isHeroSliding) {
        setIsHeroSliding(true);
        setTimeout(() => setShowHero(false), 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHeroSliding]);

  const toggleMode = () => {
    setState((prev) => (prev === "light-mode" ? "dark-mode" : "light-mode"));
  };

  useEffect(() => {
    document.body.className = state;
  }, [state]);

  const getData = async () => {
    try {
      const searchTerm = search.trim() || "india";
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${API_KEY}`
      );
      const jsonData = await response.json();

      const sources = new Set(
        jsonData.articles.map((article) => article.source.name)
      );
      setAvailableSources(sources);

      let filtered = jsonData.articles;

      filtered = filtered.sort((a, b) =>
        dateFilter === "newest"
          ? new Date(b.publishedAt) - new Date(a.publishedAt)
          : new Date(a.publishedAt) - new Date(b.publishedAt)
      );

      if (selectedSources.length > 0) {
        filtered = filtered.filter((article) =>
          selectedSources.includes(article.source.name)
        );
      }

      setNewsData(filtered.slice(0, 10));
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [search, dateFilter, selectedSources]);

  const handleSourceChange = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  useEffect(() => {
    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem("userNotes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      setNotes([...notes, { ...newNote, id: Date.now(), date: new Date() }]);
      setNewNote({ title: "", content: "" });
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(22);
    doc.text("My Notes", 20, 15);
    doc.setFontSize(12);

    notes.forEach((note, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`Note ${index + 1}: ${note.title}`, 20, yPos);
      doc.setFont("helvetica", "normal");

      const contentLines = doc.splitTextToSize(note.content, 170);
      contentLines.forEach((line) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos + 10);
        yPos += 10;
      });

      yPos += 20;
      if (index < notes.length - 1) doc.line(20, yPos, 190, yPos);
      yPos += 10;
    });

    doc.save(`notes-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className={state}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a
            className="text-white navbar-brand"
            href="#"
            onClick={() => window.location.reload()}
          >
            informed
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="mb-2 navbar-nav me-auto mb-lg-0">
              <li className="nav-item">
                <a
                  className="text-white nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNotes(true);
                  }}
                >
                  Notes
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="text-white nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </a>
                <ul className="dropdown-menu bg-dark">
                  {["sports", "politics", "entertainment", "health"].map(
                    (category) => (
                      <li key={category}>
                        <button
                          className="text-white dropdown-item"
                          onClick={() => {
                            setSearch(category);
                            setShowNotes(false);
                            getData();
                          }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              <form
                className="d-flex me-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  getData();
                }}
              >
                <input
                  className="text-white form-control me-3 bg-dark border-light"
                  type="search"
                  placeholder="Search News"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>

              <div className="gap-3 d-flex align-items-center">
                <div
                  className="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="text-white fas fa-filter fs-5"></i>
                </div>

                <div className="icon" onClick={toggleMode}>
                  {state === "light-mode" ? (
                    <i className="text-white fa-solid fa-moon fs-5"></i>
                  ) : (
                    <i className="text-white fa-solid fa-sun fs-5"></i>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className={`filter-panel ${showFilters ? "open" : ""}`}>
        <div className="filter-header">
          <h5>Filters</h5>
          <button
            className="btn btn-close"
            onClick={() => setShowFilters(false)}
          ></button>
        </div>
        <div className="filter-content">
          <div className="mb-3">
            <h6>Sort by Date</h6>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="dateFilter"
                  id="newest"
                  checked={dateFilter === "newest"}
                  onChange={() => setDateFilter("newest")}
                />
                <label className="form-check-label" htmlFor="newest">
                  Newest First
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="dateFilter"
                  id="oldest"
                  checked={dateFilter === "oldest"}
                  onChange={() => setDateFilter("oldest")}
                />
                <label className="form-check-label" htmlFor="oldest">
                  Oldest First
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h6>Filter by Source</h6>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {Array.from(availableSources).map((source) => (
                <div key={source} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={source}
                    checked={selectedSources.includes(source)}
                    onChange={() => handleSourceChange(source)}
                  />
                  <label className="form-check-label" htmlFor={source}>
                    {source}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setSelectedSources([]);
                setDateFilter("newest");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      {showNotes ? (
        <div className="container mt-4 notes-container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <h3>My Notes</h3>
                <button
                  className="btn btn-success"
                  onClick={exportToPDF}
                  disabled={notes.length === 0}
                >
                  <i className="fas fa-file-pdf me-2"></i>Export All as PDF
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className={`form-control mb-2 ${
                    state === "dark-mode" ? "bg-dark text-white" : ""
                  }`}
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
                <textarea
                  className={`form-control ${
                    state === "dark-mode" ? "bg-dark text-white" : ""
                  }`}
                  placeholder="Write your note here..."
                  rows="5"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                ></textarea>
                <button
                  className={`btn ${
                    state === "dark-mode" ? "dark-mode" : "light-mode"
                  } add-note-btn`}
                  onClick={handleAddNote}
                >
                  Add Note
                </button>
              </div>

              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`card mb-3 ${
                    state === "dark-mode" ? "bg-dark text-white" : ""
                  }`}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{note.title}</h5>
                      <small className="text-muted">
                        {new Date(note.date).toLocaleString()}
                      </small>
                    </div>
                    <pre
                      className="card-text"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {note.content}
                    </pre>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : showHero ? (
        <div
          className={`hero-section ${state} d-flex flex-column justify-content-center align-items-center ${
            isHeroSliding ? "slide-up" : ""
          }`}
          style={{ minHeight: "100vh" }}
        >
          <div
            className="text-center"
            style={{
              maxWidth: "80%",
              margin: "0 auto",
              transform: "translateY(-10%)",
            }}
          >
            <h1 className="mb-2 display-1 fade-in">informed</h1>
            <h2
              className="h3 fade-in"
              style={{ color: state === "light-mode" ? "#1976d2" : "#0d47a1" }}
            >
              SMARTER NEWS. BETTER DECISIONS
            </h2>
          </div>

          <div className="mt-5 scroll-indicator">
            <i className="fas fa-chevron-down fa-2x bounce"></i>
          </div>
        </div>
      ) : (
        <div className={`news-container ${showFilters ? "filter-open" : ""}`}>
          {newsData ? (
            <Card data={newsData} state={state} showFilters={showFilters} />
          ) : (
            <p className="loading-text">Loading news...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Newsapp;
