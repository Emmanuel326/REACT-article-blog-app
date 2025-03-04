import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "./BlogCard";
import { fetchBlogs } from "../services/api"; // Import the API service function
import "../styles/latestBlogs.css"; // Custom CSS

const LatestBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1; // Get current page from URL

  // Use the fetchBlogs function from your API service
  const { data, isLoading, isError, error } = useQuery(
    ["blogs", page],
    () => fetchBlogs({ page }),
    { keepPreviousData: true } // Prevents flickering when switching pages
  );

  // Calculate total pages (assuming data.count holds the total number of articles)
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage }); // Update URL to trigger re-fetch
  };

  return (
    <section className="latest-blogs-section">
      <div className="container">
        <h2 className="section-title">Latest Blogs</h2>

        {isLoading && <p>Loading blogs...</p>}
        {isError && <p className="error-message">Error: {error.message}</p>}

        {!isLoading && !isError && data?.results?.length > 0 ? (
          <div className="blog-grid">
            {data.results.map((article) => (
              <div key={article.id} className="blog-card-container">
                <BlogCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <p>No blogs available.</p>
        )}

        {/* Pagination Controls */}
        <nav className="pagination">
          <button
            className="pagination-previous"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            ← Previous
          </button>

          <ul className="pagination-list">
            <li>
              <span className="pagination-link is-current">
                Page {page} of {totalPages}
              </span>
            </li>
          </ul>

          <button
            className="pagination-next"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next →
          </button>
        </nav>
      </div>
    </section>
  );
};

export default LatestBlogs;
