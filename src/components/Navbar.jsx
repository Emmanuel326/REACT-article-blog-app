import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import useFetchCategories from "../hooks/useFetchCategory";
import "../styles/navbar.css";

const CATEGORY_LIMIT = 5; // used for grouping categories on desktop

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch categories
  const { data: categories = [], isLoading } = useFetchCategories();

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  }, []);

  // Toggle mobile menu (hamburger)
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // Toggle desktop "More" dropdown
  const toggleMoreDropdown = useCallback(() => setMoreOpen((prev) => !prev), []);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission (for both desktop and mobile)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (isMobile) {
        setMobileSearchOpen(false);
      }
    }
  };

  return (
    <nav className={`navbar ${darkMode ? "navbar-dark" : "navbar-light"}`}>
      <div className="navbar-brand">
        {/* Left: Logo */}
        <Link to="/" className="navbar-item logo" onClick={() => setMenuOpen(false)}>
          💰 Fynance guide
        </Link>

        {/* For mobile: display mobile search form when toggled */}
        {isMobile && mobileSearchOpen && (
          <form className="mobile-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="mobile-search-submit" aria-label="Search">
              <FaSearch />
            </button>
            <button
              type="button"
              className="mobile-search-close"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
            >
              <FaTimes />
            </button>
          </form>
        )}

        {/* For mobile: if search form is not open, display search icon and dark mode toggle */}
        {isMobile && !mobileSearchOpen && (
          <div className="navbar-extra">
            <button
              className="search-button"
              aria-label="Open search"
              onClick={() => setMobileSearchOpen(true)}
            >
              <FaSearch />
            </button>
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        )}

        {/* Hamburger (only on mobile) */}
        {isMobile && (
          <button
            className={`navbar-burger ${menuOpen ? "is-active" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>

      {isMobile ? (
        // Mobile: Dropdown shows ONLY category links
        <div className={`navbar-menu ${menuOpen ? "is-active" : ""}`}>
          {!isLoading &&
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="navbar-item"
                onClick={toggleMenu}
              >
                {cat.name}
              </Link>
            ))}
        </div>
      ) : (
        // Desktop: Full menu with Home, categories, About, Contact, search input, dark mode toggle
        <div className="navbar-menu">
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Home
            </Link>
            {!isLoading &&
              categories.slice(0, CATEGORY_LIMIT).map((cat) => (
                <Link key={cat.id} to={`/category/${cat.id}`} className="navbar-item">
                  {cat.name}
                </Link>
              ))}
            {!isLoading && categories.length > CATEGORY_LIMIT && (
              <div className="navbar-item has-dropdown" ref={dropdownRef}>
                <button
                  className="dropdown-toggle"
                  aria-label="More categories"
                  onClick={toggleMoreDropdown}
                >
                  More ▼
                </button>
                <div className={`dropdown-menu ${moreOpen ? "show" : ""}`}>
                  {categories.slice(CATEGORY_LIMIT).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="dropdown-item"
                      onClick={() => setMoreOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link to="/about" className="navbar-item">
              About
            </Link>
            <Link to="/contact" className="navbar-item">
              Contact
            </Link>
          </div>
          <form className="navbar-end" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-icon" aria-label="Search">
                <FaSearch />
              </button>
            </div>
          </form>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
