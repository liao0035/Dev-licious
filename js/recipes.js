import { getData } from "./fetch.js";

const BASE_URL = "https://dummyjson.com/recipes";
const cacheName = "dummy";

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
    limit: "6",
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
async function searchRecipes(query) {
  if (!query) return;
  const url = buildURL(BASE_URL + "/search", {
    q: query,
    sortBy: "rating",
    order: "desc",
    limit: "3",
  });

  console.log(url);
  try {
    const data = await getData(url);
    console.log(data);
    if (data) {
      renderRecipes(data.recipes);
    }
  } catch (err) {
    console.log("searchRecipes url setting fail:", err);
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
        searchRecipes(query);
      } else {
        console.log("search is empty");
      }
    }
  });
}

loadRecipes();
searchInput();
