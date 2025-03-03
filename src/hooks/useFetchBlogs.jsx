import { useParams } from "react-router-dom";
import useFetchBlogs from "../hooks/useFetchBlogs";

const Category = () => {
  const { name } = useParams(); // Extract category name from URL
  console.log(`🔍 Extracted category name:`, name);

  // Provide a default category ID or handle the case where it's undefined
  const categoryId = name ? getCategoryIdByName(name) : 1;

  const { data: blogs, isLoading, error } = useFetchBlogs({ category: categoryId });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading blogs.</p>;

  return (
    <div>
      <h1>Category: {name}</h1>
      <ul>
        {blogs?.results?.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

// Simulated function to get category ID by name
const getCategoryIdByName = (name) => {
  const categories = { technology: 1, health: 2, business: 3 };
  return categories[name] || 1;
};

export default Category;
