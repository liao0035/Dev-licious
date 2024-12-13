import { getData } from "./fetch.js";

const BASE_URL = "https://dummyjson.com/recipes";
const cacheName = "dummy";
const itemPerPage = 3;

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

    const cuisine = clone.querySelector(".card__cuisine");
    cuisine.querySelector("i").textContent = "flag_2";
    cuisine.append(document.createTextNode(recipe.cuisine));

    const difficulty = clone.querySelector(".card__meal-type");
    difficulty.querySelector("i").textContent = "restaurant";
    difficulty.append(document.createTextNode(recipe.mealType.join(" . ")));

    const tag = clone.querySelector(".card__tag");
    tag.querySelector("i").textContent = "tag";
    tag.append(document.createTextNode(recipe.tags.join(" . ")));

    clone.querySelector(".card__btn").href = `recipe.html?id=${recipe.id}`;

    df.append(clone);
  });

  // Append the populated DocumentFragment to the <ul>
  ul.append(df);
}

// Search URL setting (3 recipes)
/* async function searchRecipes(query) {
  if (!query) return;
  const url = buildURL(BASE_URL + "/search", {
    q: query,
    sortBy: "rating",
    order: "desc",
    // limit: itemPerPage,
    // skip: 0,
  });
  console.log(url);
  // show the new URL on the URL bar ******
  const params = new URLSearchParams(window.location.search);
  params.set("q", query);
  window.history.pushState({}, "", `?${params.toString()}`);

  try {
    const data = await getData(url);
    console.log(data);
    if (data) {
      renderRecipes(data.recipes);
    }
  } catch (err) {
    console.log("searchRecipes url setting fail:", err);
  }
} */

// search event listener
function searchInput() {
  const search = document.getElementById("search");
  search.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      const query = search.value.trim();
      if (query) {
        console.log("search for:", query);
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
      sortBy: "rating",
      order: "desc",
      limit: itemPerPage,
    });

    const response = new Response(JSON.stringify(result));
    await cache.put(searchURL, response); // Save response in cache
    console.log(`Saved search results to cache for query: ${query}`);
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
      sortBy: "rating",
      order: "desc",
      limit: itemPerPage,
    });

    const cachedResponse = await cache.match(searchURL);
    if (cachedResponse) {
      const data = await cachedResponse.json();
      console.log(`Loaded search results from cache for query: ${query}`);
      return data;
    } else {
      console.log(`No cached data found for query: ${query}`);
    }
  } catch (err) {
    console.error("Error retrieving from cache:", err);
  }
  return null;
}

// Search recipes with cache and fallback to network
async function searchRecipes(query) {
  if (!query) return;

  // Try to get data from cache first
  const cachedData = await retrieveCache(query);

  if (cachedData) {
    // If data is found in the cache, render it
    console.log("Rendering recipes from cache...");
    renderRecipes(cachedData.recipes);
  } else {
    // If no data in cache, fetch from the network
    const url = buildURL(BASE_URL + "/search", {
      q: query,
      sortBy: "rating",
      order: "desc",
    });

    console.log(`Fetching from network: ${url}`);

    // Show the new URL in the URL bar
    const params = new URLSearchParams(window.location.search);
    params.set("q", query);
    window.history.pushState({}, "", `?${params.toString()}`);

    try {
      const data = await getData(url);
      console.log("Fetched data from API:", data);

      if (data) {
        renderRecipes(data.recipes);
        // Save the fetched data to cache
        saveToCache(query, data);
      }
    } catch (err) {
      console.log("searchRecipes API call failed:", err);
    }
  }
}

loadRecipes();
searchInput();
