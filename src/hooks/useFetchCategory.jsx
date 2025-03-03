import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/api";

const useFetchCategories = () => {
  console.log(`📌 useFetchCategories() called`);

  return useQuery(
    ["categories"],
    async () => {
      console.log(`🔄 Fetching categories...`);
      const data = await fetchCategories();
      console.log(`✅ Categories fetched:`, data);
      return data;
    },
    {
      select: (data) => {
        console.log(`📊 Processing category data:`, data);
        // Check if data is already an array. If not, check for a "results" property.
        if (Array.isArray(data)) {
          return data;
        } else if (data && Array.isArray(data.results)) {
          return data.results;
        }
        // Otherwise, return an empty array to prevent .map from failing.
        return [];
      },
      onError: (error) => console.error(`❌ Error in useFetchCategories:`, error),
    }
  );
};

export default useFetchCategories;
