import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../services/api";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import BlogCard from "../components/BlogCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);

  const { data: blogsData, isLoading, error } = useQuery(["blogs"], fetchBlogs);

  // Synchronize search input with URL query
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  if (isLoading)
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered">Loading...</p>
        </div>
      </section>
    );

  if (error)
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered has-text-danger">Error fetching blogs</p>
        </div>
      </section>
    );

  // Extract the array of blogs from the response
  const blogsArray = Array.isArray(blogsData) ? blogsData : blogsData?.results || [];

  // Configure Fuse options for fuzzy searching across multiple fields
  const fuseOptions = {
    keys: ["title", "excerpt", "content", "category.name", "tags.name"],
    threshold: 0.3, // adjust threshold as needed
  };

  // Create a Fuse instance and perform search
  const fuse = new Fuse(blogsArray, fuseOptions);
  const fuseResults = searchQuery
    ? fuse.search(searchQuery)
    : blogsArray.map((blog) => ({ item: blog }));
  const filteredBlogs = fuseResults.map((result) => result.item);

  return (
    <section className="section">
      <div className="container">
        {/* Search form */}
        <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <h1 className="title">Search Results for "{queryParam}"</h1>
        {filteredBlogs.length > 0 ? (
          <div className="blog-cards-container">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} article={blog} />
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
