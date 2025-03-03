import LatestBlogs from "../components/LatestBlogs";
import "../styles/home.css"; // Custom styles for additional enhancements

const Home = () => {
  return (
    <>
      {/* Hero Header using Bulma */}
      <section className="hero is-primary is-medium">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-1">Welcome to Our Blog</h1>
            <h2 className="subtitle is-4">
              Discover the latest insights, trends, and updates.
            </h2>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="section">
        <div className="container">
          <h2 className="title is-3 has-text-centered featured-title">
            Featured Blogs
          </h2>
          <LatestBlogs />
        </div>
      </section>
    </>
  );
};

export default Home;
