import { getData } from "./fetch.js";

const cacheName = "dummy";

(() => {
  fetchRecipe();
  filterListener();
})();

async function fetchRecipe() {
  let url = new URL(location.href);
  let params = url.searchParams;
  let result = [];

  if (params.has("search")) {
    let search = params.get("search");

    // get the data from cache
    try {
      const cache = await caches.open(cacheName);
      const cacheRequest = new Request(
        `https://dummyjson.com/recipes/search?q=${search}`
      );
      const cacheResponse = await cache.match(cacheRequest);
      if (cacheResponse) {
        const cacheData = await cacheResponse.json();
        result = cacheData.recipes;
        // console.log("result from cache", result);
      } else {
        // get the data from API endpoint
        const url = `https://dummyjson.com/recipes/search?q=${search}`;
        let response = await getData(url);
        result = response.recipes;
        // console.log("result from api", result);

        // save the result into cache
        await cache.put(cacheRequest, new Response(JSON.stringify(response)));
      }
      // set the value to those input
      document.querySelector("#search").value = search;
      document.querySelector("#filter-input").value = search;
    } catch (err) {
      console.error(err);
    }
  } else {
    const url = `https://dummyjson.com/recipes/`;
    let response = await getData(url);
    // to convert object into array
    result = response.recipes;
    console.log(result);
  }

  if (params.has("mealType")) {
    let type = params.get("mealType");
    console.log(type);
    console.log("this is from mealtype", result);
    result = filterResults(result, type);
  }

  if (params.has("sortBy")) {
    let sort = params.get("sortBy");
    console.log(sort);
    console.log("this is the result from sortby", result);
    result = sortResults(result, sort);
  }

  let page = 0;

  if (params.has("page")) {
    page = parseInt(params.get("page"));
  }

  renderRecipes(result.slice(0, 3), page);
}
// filter meal type
function filterResults(result, type) {
  if (type === "All") {
    return result;
  }
  return result.filter((recipe) => recipe.mealType.includes(type));
}
// filer sortBy
function sortResults(result, sort) {
  switch (sort) {
    case "topRate":
      return result.toSorted((a, b) => b.rating - a.rating);
    case "name":
      return result.toSorted((a, b) => a.name.localeCompare(b.name));
    default:
      return result;
  }
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
    clone.querySelector(".card__img").alt = recipe.name;
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

// event listener
function filterListener() {
  const mealTypeSelect = document.getElementById("mealType");
  const sortBySelect = document.getElementById("sortBy");

  // meal type event listener
  mealTypeSelect.addEventListener("change", () => {
    document.getElementById("filter-form").submit();
  });

  // sort by event listener
  sortBySelect.addEventListener("change", () => {
    document.getElementById("filter-form").submit();
  });
}
