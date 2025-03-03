import axios from "axios";


const API_URL = 'https://django-backend-94gk.onrender.com/api/articles/';

// Utility function to handle API requests
const fetchData = async (endpoint, params = {}) => {
  try {
    const url = `${API_URL}/${endpoint}/`;
    const response = await axios.get(url, { params });
    if (!response.data) {
      throw new Error("Invalid data structure received");
    }
    return response.data;
  } catch (error) {
    return { error: `Failed to fetch ${endpoint}. Please try again later.` };
  }
};

// Fetch all blogs (supports pagination & category filtering)
export const fetchBlogs = async ({ page = 1, limit = 10, categoryId = null } = {}) => {
  const endpoint = categoryId ? `categories/${categoryId}/articles` : "articles";
  const params = { page, limit };
  const result = await fetchData(endpoint, params);
  return result;
};

// Fetch a single blog by ID
export const fetchBlogById = async (id) => {
  const result = await fetchData(`articles/${id}`);
  return result;
};

// Fetch all categories
export const fetchCategories = async () => {
  const result = await fetchData("categories");
  return result;
};

// Fetch all articles (non-paginated, for admin usage)
export const fetchAllArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles/`, { params: { limit: 1000 } });
    // Return data.results if present (paginated response), otherwise the data itself.
    return response.data.results || response.data;
  } catch (error) {
    return [];
  }
};

// Create an article (POST request)
export const createArticle = async (articleData) => {
  try {
    const url = `${API_URL}/articles/`;
    const response = await axios.post(url, articleData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create article. Please try again later.");
  }
};
