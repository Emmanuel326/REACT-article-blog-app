import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/BlogCard.css"; // Custom CSS

const BlogCard = ({ article }) => {
  if (!article) {
    return (
      <div className="notification warning">
        No article data available
      </div>
    );
  }

  // Extract the image URL or set a default
  const imageUrl = article.image?.trim() ? article.image : "/default-blog.jpg";

  // Format the date
  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown Date";

  return (
    <Link to={`/articles/${article.id}`} className="blog-card">
      <div className="blog-card-image">
        <figure className="image-container">
          <img
            src={imageUrl}
            alt={article.title || "Blog Image"}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/default-blog.jpg"; // Fallback image
            }}
          />
        </figure>
      </div>
      <div className="blog-card-content">
        <p className="title">{article.title}</p>
        <div className="content">
          {article.excerpt || "No excerpt available"}
          <br />
          <small>📅 {formattedDate}</small>
        </div>
      </div>
      <footer className="blog-card-footer">
        <span className="footer-item">Read More →</span>
      </footer>
    </Link>
  );
};

BlogCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    image: PropTypes.string, // Full URL
    created_at: PropTypes.string,
  }).isRequired,
};

export default BlogCard;
