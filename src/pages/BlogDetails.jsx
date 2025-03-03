import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogById } from "../services/api";
import "../styles/BlogDetails.css"; // Import custom CSS file

const BlogDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(
    ["article", id],
    () => fetchBlogById(id),
    { enabled: !!id }
  );

  console.log("Fetched Article:", data);

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered">Loading article...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered has-text-danger">
            Error loading blog: {error.message}
          </p>
        </div>
      </section>
    );
  }

  const article = data || {};

  if (!article.title) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered">
            Article not found. It may have been deleted or does not exist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section blog-details">
      <div className="container">
        <h1 className="title">{article.title}</h1>
        <figure className="image">
          <img
            src={article.image || "/default-image.jpg"}
            alt={article.title || "Blog Image"}
            onError={(e) => (e.target.src = "/default-image.jpg")}
          />
        </figure>
        <div className="content">
          <p>{article.content || "No content available for this article."}</p>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
