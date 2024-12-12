/*
export async function getData({
  limit = 6,
  skip = 0,
  sortBy = "",
  order = "asc",
  searchQuery = "",
  id = "",
} = {}) {
  let url;
  if (id) {
    // https://dummyjson.com/recipes/1
    url = `https://dummyjson.com/recipes/${id}`;
  } else if (searchQuery && isMealType(searchQuery)) {
    // if it is a meal-type (breakfast, dinner,etc.)
    // https://dummyjson.com/recipes/meal-type/Dinner
    url = `https://dummyjson.com/recipes/meal-type/${encodeURIComponent(
      searchQuery
    )}`;
  } else if (searchQuery) {
    // search query
    // https://dummyjson.com/recipes/search?q=Margherita
    url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(
      searchQuery
    )}`;
  } else if (sortBy) {
    // sorting query: sortBy= rating or sortBy=name
    //  sortBy='name'
    // https://dummyjson.com/recipes?sortBy=name&order=asc
    // sortBy='rating'
    // https://dummyjson.com/recipes?sortBy=rating&order=desc
    const params = { limit, skip, sortBy, order };
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([key, value]) => value !== "")
    );
    url = `https://dummyjson.com/recipes?${queryString.toString()}`;
    console.log("this is for sortby", url);
  } else {
    /* 
1. Converts the filtered array into a URL query string (using URLSearchParams()).
2. Converts the params object to an array of key-value pairs (using Object.entries()).
3. Filters OUT any key-value pairs where the value is an empty string (using filter()).
*/
// default URL
// https://dummyjson.com/recipes?limit=6&skip=0
/* const params = { limit, skip };
const queryString = new URLSearchParams(
  Object.entries(params).filter(([key, value]) => value !== "")
); */

/*  
.toString() converts the URLSearchParams object to a string
*/

/* 
    url = `https://dummyjson.com/recipes?${queryString.toString()}`;
  }
  console.log(url);
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.error("Error:", err));
}
function isMealType(query) {
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];
  return mealTypes.includes(query);
}
 */

export async function getData(url) {
  // console.log("Fetching from URL:", url);
  // Debugging to see the URL being requested
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ERROR: ${response.status}`);
    }
    return await response.json(); // Return the JSON data
  } catch (err) {
    console.error("Error:", err); // Log any errors
  }
}
