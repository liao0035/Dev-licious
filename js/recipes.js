import { getData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", () => {
  searchInput();
});

const BASE_URL = "https://dummyjson.com/recipes";

// Build URL
function buildURL(base, params) {
  const url = new URL(base);
  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });
  return url.toString();
}

// Initial 6 recipes
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

// Search URL setting
async function searchRecipes(query) {
  if (!query) return;
  let url = new URL(location.href);
  url.pathname = "/search";
  url.searchParams.set("q", query);
  url.searchParams.set("sortBy", "rating");
  url.searchParams.set("order", "desc");
  /*   const url = buildURL(BASE_URL + "/search", {
    q: query,
    sortBy: "rating",
    order: "desc",
    limit: "3",
  }); */

  const data = await getData(url.toString());
  console.log(data);
  renderRecipes(data.recipes);
}

searchInput();

// search event listener
function searchInput() {
  const search = document.getElementById("search");
  search.addEventListener("keydown", (ev) => {
    // ev.preventDefault();
    if (ev.key === "Enter") {
      const query = search.value.trim();
      searchRecipes(query);
    }
  });
}

loadRecipes();
