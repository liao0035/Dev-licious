(() => {
  console.log("page/script loaded");

  init();
})();

async function init() {
  let url = new URL(location.href);

  let params = url.searchParams;
  // put the paramas into the form
  let results = [];

  if (params.has("keyword")) {
    //search for keyword

    let keyword = params.get("keyword");
    // check cache

    results = await getData(keyword);
  } else {
    //find all recipes

    results = getData();
  }

  //filter as needed

  if (params.has("mealType")) {
    let type = params.get("mealType");

    results = filterResults(results, type);
  }

  //sort as needed

  if (params.has("sortBy")) {
    let sort = params.get("sortBy");

    results = sortResults(results, sort);
  }

  //display and paginate

  let page = 0;

  if (params.has("page")) {
    page = parseInt(params.get("page"));
  }

  buildHTML(results, page);
}

function filterResults(results, type) {
  Array.filter();
}

function sortResults(results, sort) {
  Array.toSorted();
}

function buildHTML(results, page) {}
