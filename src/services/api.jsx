import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'https://api.fynanceguide.site/api/';

console.log("API Base URL:", API_URL); // Log API base URL

// Utility function to handle API requests
const fetchData = async (endpoint, params = {}) => {
  try {
    const url = `${API_URL}${endpoint}/`;
    console.log(`Fetching: ${url} with params:`, params); // Log request details

    const response = await axios.get(url, { params });

    console.log(`Response from ${endpoint}:`, response.status, response.data); // Log response
    if (!response.data) {
      throw new Error("Invalid data structure received");
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error?.response?.status, error?.message); // Log errors
    return { error: `Failed to fetch ${endpoint}. Please try again later.` };
  }
};

// Fetch all blogs (supports pagination & category filtering)
export const fetchBlogs = async ({ page = 1, limit = 10, categoryId = null } = {}) => {
  const endpoint = categoryId ? `categories/${categoryId}/articles` : "articles";
  const params = { page, limit };
  console.log("Fetching blogs with params:", params);
  const result = await fetchData(endpoint, params);
  console.log("Blogs fetch result:", result);
  return result;
};

// Fetch a single blog by ID
export const fetchBlogById = async (id) => {
  console.log(`Fetching blog by ID: ${id}`);
  const result = await fetchData(`articles/${id}`);
  console.log(`Blog ${id} fetch result:`, result);
  return result;
};

// Fetch all categories
export const fetchCategories = async () => {
  console.log("Fetching categories...");
  const result = await fetchData("categories");
  console.log("Categories fetch result:", result);
  return result;
};

// Fetch all articles (non-paginated, for admin usage)
export const fetchAllArticles = async () => {
  try {
    const url = `${API_URL}articles/`;
    console.log(`Fetching all articles from: ${url}`);
    
    const response = await axios.get(url, { params: { limit: 1000 } });
    
    console.log("All articles fetch response:", response.status, response.data);
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching all articles:", error?.response?.status, error?.message);
    return [];
  }
};

// Create an article (POST request)
export const createArticle = async (articleData) => {
  try {
    const url = `${API_URL}articles/`;
    console.log("Creating article at:", url, "with data:", articleData);

    const response = await axios.post(url, articleData);
    
    console.log("Article created successfully:", response.status, response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating article:", error?.response?.status, error?.message);
    throw new Error("Failed to create article. Please try again later.");
  }
};
