import { getData } from "./fetch.js";

const BASE_URL = "https://dummyjson.com/recipes";
const cacheName = "dummy";

let currentPage = 1;
const recipesPerPage = 3;

// Build URL
function buildURL(base, params) {
  const url = new URL(base);
  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });
  return url.toString();
}

// Initial 6 recipes URL
async function loadRecipes() {
  const url = buildURL(BASE_URL, {
    sortBy: "rating",
    order: "desc",
    limit: 6,
  });

  // console.log(url);
  const data = await getData(url);
  // console.log(data.recipes);
  renderRecipes(data.recipes);
}

// Create HTML
function renderRecipes(recipes) {
  const df = document.createDocumentFragment();
  const ul = document.querySelector(".card-group__list");
  const template = document.querySelector("#card-group__template");

  // Clear existing recipes
  ul.innerHTML = "";

  // Loop through the recipes array and populate cards
  recipes.forEach((recipe) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".card__img").src = recipe.image;
    clone.querySelector(".card__title").textContent = recipe.name;

    const rating = clone.querySelector(".card__rating");
    rating.querySelector("i").textContent = "star";
    rating.append(document.createTextNode(recipe.rating));

    const mealType = clone.querySelector(".card__meal-type");
    mealType.querySelector("i").textContent = "restaurant";
    mealType.append(document.createTextNode(recipe.mealType.join(" . ")));

    const tag = clone.querySelector(".card__tag");
    tag.querySelector("i").textContent = "tag";
    tag.append(document.createTextNode(recipe.tags.join(" . ")));

    clone.querySelector(".card__btn").href = `recipe.html?id=${recipe.id}`;

    df.append(clone);
  });

  // Append the populated DocumentFragment to the <ul>
  ul.append(df);
}

// Search recipes with cache
async function searchRecipes(query) {
  if (!query) return;

  // Try to get data from cache first
  const cachedData = await retrieveCache(query);

  if (cachedData) {
    // If data is found in the cache, render it
    console.log("Rendering recipes from cache...");
    renderRecipes(cachedData.recipes.slice(0, 3));
  } else {
    // If no data in cache, fetch from the network
    const url = buildURL(BASE_URL + "/search", {
      q: query,
      sortBy: "rating",
      order: "desc",
    });

    // Show the new URL in the URL bar
    const params = new URLSearchParams(window.location.search);
    params.set("q", query);
    window.history.pushState({}, "", `?${params.toString()}`);

    try {
      const data = await getData(url);
      console.log("Fetched data from API:", data);

      if (data) {
        renderRecipes(data.recipes.slice(0, 3));

        // Save the fetched data to cache
        saveToCache(query, data);
      }
    } catch (err) {
      console.log("searchRecipes API call failed:", err);
    }
  }
}

// search event listener
function searchInput() {
  const search = document.getElementById("search");
  search.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      const query = search.value.trim();
      if (query) {
        console.log("search for:", query);

        // reset the first page when starting a new search
        currentPage = 1;

        searchRecipes(query);
      } else {
        console.log("search is empty");
      }
    }
  });
}

// Save search result in cache
async function saveToCache(query, result) {
  try {
    const cache = await caches.open(cacheName);
    const searchURL = buildURL(BASE_URL + "/search", {
      q: query,
      // limit: 3,
    });
    const response = new Response(JSON.stringify(result));
    // Save response in cache
    await cache.put(searchURL, response);
  } catch (err) {
    console.error("Error saving to cache:", err);
  }
}

// Retrieve search results from cache
async function retrieveCache(query) {
  try {
    const cache = await caches.open(cacheName);
    const searchURL = buildURL(BASE_URL + "/search", {
      q: query,
    });
    const cachedResponse = await cache.match(searchURL);
    if (cachedResponse) {
      const data = await cachedResponse.json();
      return data;
    }
  } catch (err) {
    console.error("Error retrieving from cache:", err);
  }
  return null;
}

// sort by name or rating
async function sort(sortBy = "name", order = "asc") {
  const url = buildURL(BASE_URL, {
    sortBy: sortBy,
    order: order,
    // limit: "3",
  });
  console.log("this is sort url", url);
  try {
    const data = await getData(url);
    if (data) {
      renderRecipes(data.recipes.slice(0, 3));
      console.log(data);

      const params = new URLSearchParams(window.location.search);
      params.set("sortBy", sortBy);
      params.set("order", order);
      window.history.pushState({}, "", `?${params.toString()}`);
    }
  } catch (err) {
    console.error("sort error:", err);
  }
}

// meal-type
async function meal(mealType = "All") {
  const url =
    mealType === "All"
      ? BASE_URL
      : `https://dummyjson.com/recipes/meal-type/${mealType.toLowerCase()}`;
  try {
    const data = await getData(url);
    if (data) {
      renderRecipes(data.recipes.slice(0, 3));
      console.log(data);

      const params = new URLSearchParams(window.location.search);
      params.set("mealType", mealType);
      window.history.pushState({}, "", `?${params.toString()}`);
    }
  } catch (err) {
    console.error("meal type:", err);
  }
}

// event listener sorting & meal-type
function filterListener() {
  const mealTypeSelect = document.getElementById("mealType");
  const sortBySelect = document.getElementById("sortBy");

  mealTypeSelect.addEventListener("change", (ev) => {
    const mealType = ev.target.value;
    meal(mealType);
  });

  sortBySelect.addEventListener("change", (ev) => {
    const sortBy = ev.target.value;
    if (sortBy === "topRate") {
      sort("rating", "desc");
    } else if (sortBy === "name") {
      sort("name", "asc");
    }
  });
}

loadRecipes();
filterListener();
searchInput();
