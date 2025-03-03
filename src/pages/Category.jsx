import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../services/api";
import BlogCard from "../components/BlogCard";
import "../styles/category.css"; 

const Category = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery(
    ["blogs", { category: id }],
    () => fetchBlogs({ categoryId: id }),
    {
      enabled: Boolean(id),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    }
  );

  if (!id) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered has-text-danger">
            Invalid category. Please select a valid category.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered">Loading blogs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered has-text-danger">
            Error fetching blogs: {error.message}
          </p>
        </div>
      </section>
    );
  }

  // Adjust here: If data is an array, use it directly; otherwise, try to use data.results.
  const blogs = Array.isArray(data) ? data : data?.results || [];

  return (
    <section className="section category">
      <div className="container">
        <h1 className="title is-4">Category: {id}</h1>
        {blogs.length > 0 ? (
          <div className="columns is-multiline">
            {blogs.map((blog) => (
              <div key={blog.id} className="column is-12-mobile is-6-tablet is-4-desktop">
                <BlogCard article={blog} />
              </div>
            ))}
          </div>
        ) : (
          <p className="no-blogs">No blogs found for this category.</p>
        )}
      </div>
    </section>
  );
};

export default Category;
