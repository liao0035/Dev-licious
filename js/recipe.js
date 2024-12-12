import { getData } from "./fetch.js";

// define the URL
async function fetchRecipe(id) {
  if (!id) {
    throw new Error("recipe ID not found");
  }
  const url = `https://dummyjson.com/recipes/${id}`;
  return await getData(url);
}

// fetch the data from URL
async function loadingRecipe() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const data = await fetchRecipe(id);
    // console.log(data);
    renderRecipe(data);
  } catch (err) {
    console.error("error loading recipes", err);
  }
}

// create HTML for single recipe
function renderRecipe(data) {
  const df = document.createDocumentFragment();
  const template = document.querySelector("#singleRecipe__template");
  const container = document.querySelector(".single-recipe>.container");
  // console.log(template);

  const clone = template.content.cloneNode(true);
  // console.log(clone);

  clone.querySelector(".single-recipe__img img").src = data.image;
  clone.querySelector(".single-recipe__img img").alt = data.name;
  clone.querySelector(".single-recipe__title").textContent = data.name;

  clone
    .querySelector(".single-recipe__tags")
    .append(document.createTextNode(data.tags.join(" . ")));

  clone.querySelector(
    ".single-recipe__description"
  ).textContent = `Cuisine: ${data.cuisine} | Calories per serving ${data.caloriesPerServing}`;

  clone
    .querySelector(".single-recipe__serving")
    .append(document.createTextNode(` Servings: ${data.servings}`));

  clone
    .querySelector(".single-recipe__time")
    .append(
      document.createTextNode(
        `Prep: ${data.prepTimeMinutes} mins | Cook: ${data.cookTimeMinutes} mins`
      )
    );

  clone
    .querySelector(".single-recipe__difficulty")
    .append(document.createTextNode(`Difficulty: ${data.difficulty}`));

  clone
    .querySelector(".single-recipe__rate")
    .append(
      document.createTextNode(
        `Rating: ${data.rating} (${data.reviewCount} reviews)`
      )
    );
  // select "single-recipe__ingredients > ul"
  const ingredientsList = clone.querySelector(".single-recipe__ingredients ul");
  // loop into ingredients and generate li
  data.ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientsList.append(li);
  });
  // select "single-recipe__instructions > ul"
  const instructions = clone.querySelector(".single-recipe__instructions ul");
  // loop into instructions and generate li
  data.instructions.forEach((instruction) => {
    const li = document.createElement("li");
    li.textContent = instruction;
    instructions.append(li);
  });

  df.append(clone);
  container.append(df);
}

// -----create HTML for card-group-------

// define the URL
async function fetchRecipes() {
  const params = new URLSearchParams({
    limit: 3,
    sortBy: "rating",
    order: "desc",
  });
  const url = `https://dummyjson.com/recipes?${params.toString()}`;
  return await getData(url);
}

// fetch the data from URL
async function loadRecipes() {
  try {
    const data = await fetchRecipes();
    const recipes = data.recipes;
    console.log("this is recipes from loadRecipes", recipes);
    renderRecipes(recipes);
  } catch (err) {
    console.error("error loading recipes:", err);
  }
}

// Create HTML
function renderRecipes(recipes) {
  const df = document.createDocumentFragment();
  const template = document.querySelector("#card-group__template");
  const ul = document.querySelector(".card-group__list");

  // Loop through recipes and display them
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
}

loadingRecipe();
loadRecipes();
