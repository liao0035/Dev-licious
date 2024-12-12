import { getData } from "./fetch.js";

/* const initializeFilters = () => {
  // DOM Elements
  const typeSelect = document.querySelector("#type");
  const sortSelect = document.querySelector("#sort");
  const searchInput = document.querySelector("#search");
  const ul = document.querySelector(".card-group__list");
  const template = document.querySelector("#card-group__template");

  // Function to fetch and display recipes
  const loadRecipes = async (filterOptions = {}) => {
    const {
      type = "",
      sortBy = "rating",
      order = "desc",
      // limit = 6,
      // skip = 0,
      searchQuery = "",
    } = filterOptions;

    const limit = searchQuery ? 3 : 6;
    const skip = 0;

    try {
      let url = "https://dummyjson.com/recipes"; // Default URL

      if (searchQuery) {
        // search query
        // https://dummyjson.com/recipes/search?q=Margherita
        url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(
          searchQuery
        )}`;
      } else if (type && type !== "All") {
        // If meal type filter is applied, modify the URL accordingly
        url = `https://dummyjson.com/recipes/meal-type/${encodeURIComponent(
          type
        )}`;
      }

      // Build query parameters for sorting, limiting, and pagination
      const params = new URLSearchParams({
        limit,
        skip,
        sortBy,
        order,
      });

      // Append query parameters to the URL
      if (!searchQuery) {
        url += `?${params.toString()}`;
      }
      console.log(url);
      const data = await getData(url);
      const recipes = data.recipes;

      // Clear existing recipes
      ul.innerHTML = "";

      // Render recipes
      const df = document.createDocumentFragment();
      recipes.forEach((recipe) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card__img").src = recipe.image;
        clone.querySelector(".card__title").textContent = recipe.name;
        clone.querySelector(".card__meal-type").textContent = recipe.mealType;
        clone.querySelector(".card__meal-difficulty").textContent =
          recipe.difficulty;
        clone.querySelector(".card__btn").href = `recipe.html?id=${recipe.id}`;
        df.append(clone);
      });

      ul.append(df);
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };
  const getCurrentFilters = () => {
    const type = typeSelect.value;
    const sortBy = sortSelect.value === "topRate" ? "rating" : "name";
    const order = sortBy === "name" ? "asc" : "desc";
    const searchQuery = searchInput.value.trim();
    return { type, sortBy, order, searchQuery };
  };

  // Event Listeners for selecting meal type and sorting
  typeSelect.addEventListener("change", () => {
    const filters = getCurrentFilters();
    loadRecipes(filters);
  });

  sortSelect.addEventListener("change", () => {
    const filters = getCurrentFilters();
    loadRecipes(filters);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const filters = getCurrentFilters();
      loadRecipes(filters);
    }
  });

  // Initial Load
  loadRecipes();
}; */

// Initialize Filters
// initializeFilters();

const initializeFilters = () => {
  // DOM Elements
  const typeSelect = document.querySelector("#type");
  const sortSelect = document.querySelector("#sort");
  const searchInput = document.querySelector("#search");
  const ul = document.querySelector(".card-group__list");
  const template = document.querySelector("#card-group__template");

  // Function to fetch and display recipes
  // this is the default params setting
  const loadRecipes = async (filterOptions = {}) => {
    const {
      type = "",
      sortBy = "rating",
      order = "desc",
      searchQuery = "",
    } = filterOptions;

    try {
      // Set up base URL and parameters
      let baseUrl = "https://dummyjson.com/recipes";
      const limit = searchQuery ? 3 : 6;

      // Build the URL based on filters
      if (searchQuery) {
        // https://dummyjson.com/recipes/search?q=Margherita
        baseUrl = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (type && type !== "All") {
        // https://dummyjson.com/recipes/meal-type/Dinner
        baseUrl = `${baseUrl}/meal-type/${encodeURIComponent(type)}`;
      }

      // Build query parameters
      const params = new URLSearchParams({
        limit,
        skip: 0,
        sortBy,
        order,
      });

      // Construct final URL
      const url = searchQuery ? baseUrl : `${baseUrl}?${params.toString()}`;
      console.log("Fetching from URL:", url);

      // Fetch data
      const data = await getData(url);
      const recipes = data.recipes;

      // Clear existing recipes
      ul.innerHTML = "";

      // Render recipes
      const df = document.createDocumentFragment();
      recipes.forEach((recipe) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".card__img").src = recipe.image;
        clone.querySelector(".card__title").textContent = recipe.name;

        const cuisine = clone.querySelector(".card__cuisine");
        cuisine.querySelector("i").textContent = "flag_2";
        cuisine.append((document.textContent = recipe.cuisine));

        const difficulty = clone.querySelector(".card__meal-type");
        difficulty.querySelector("i").textContent = "restaurant";
        difficulty.append((document.textContent = recipe.mealType.join(" . ")));

        const tag = clone.querySelector(".card__tag");
        tag.querySelector("i").textContent = "tag";
        tag.append((document.textContent = recipe.tags.join(" . ")));

        clone.querySelector(".card__btn").href = `recipe.html?id=${recipe.id}`;
        df.append(clone);
      });

      ul.append(df);
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  // Helper function to get current filter values
  const getCurrentFilters = () => {
    const type = typeSelect.value;
    const sortBy = sortSelect.value === "topRate" ? "rating" : "name";
    const order = sortBy === "name" ? "asc" : "desc";
    const searchQuery = searchInput.value.trim();
    return { type, sortBy, order, searchQuery };
  };

  // meal-type
  typeSelect.addEventListener("change", () => {
    const filters = getCurrentFilters();
    loadRecipes(filters);
  });
  // sort by: name or rate
  sortSelect.addEventListener("change", () => {
    const filters = getCurrentFilters();
    loadRecipes(filters);
  });

  // Handle search input with debouncing
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const filters = getCurrentFilters();
      loadRecipes(filters);
    }, 300);
  });

  // Handle Enter key for search
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const filters = getCurrentFilters();
      loadRecipes(filters);
    }
  });

  // Initial Load
  loadRecipes();
};

// Initialize Filters
initializeFilters();
