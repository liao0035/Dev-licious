document.addEventListener("DOMContentLoaded", () => {
  toTop();
  hamburger();
  pageSpecific();
});

// hamburger
function hamburger() {
  const toggles = document.querySelectorAll(".toggle");

  function handleToggle(toggle) {
    const target_id = toggle.dataset.target;

    const target = document.getElementById(target_id);
    const click_to_close = document.querySelector(
      `[data-toggle="${target_id}"]`
    );

    function open() {
      toggle.classList.add("open");
      target.classList.add("open");
      click_to_close.classList.add("open");
    }

    function close() {
      toggle.classList.remove("open");
      target.classList.remove("open");
      click_to_close.classList.remove("open");
    }

    function updateState() {
      if (toggle.classList.contains("open")) {
        close();
      } else {
        open();
      }
    }

    toggle.addEventListener("click", updateState);
    click_to_close.addEventListener("click", close);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      }
    });
  }

  toggles.forEach((toggle) => handleToggle(toggle));
}
// to top
function toTop() {
  const to_top = document.querySelector(".to-top");

  function handleToTop() {
    if (window.scrollY > 50) {
      to_top.classList.add("visible");
    } else {
      to_top.classList.remove("visible");
    }
  }

  to_top && handleToTop();

  to_top && window.addEventListener("scroll", handleToTop);
}

// import page
async function pageSpecific() {
  let id = document.body.id;
  switch (id) {
    case "home":
      await import("./index.js");
      break;
    case "recipes":
      await import("./recipes.js");
      break;
    case "recipe":
      await import("./recipe.js");
      break;
    case "blog":
      await import("./blog.js");
      break;
    default:
  }
}
/* 
Submission Feedback
Overall Feedback
Marking the version that was committed at 9:50pm

The Devlicious link in the header from the recipes or recipe page goes to the wrong url.

From the recipe page if you click on the Devlicious link in the footer it opens the home page in a new tab.

Good CSP meta tags

Good css and js links

The function for building a recipe card is a common thing across all the pages. This could be made a single function inside the fetch.js or another common js file.

In recipes.js the url for lines 24 and 33 are the same. You could make this into a single variable at the top of the function.

When reading the value of the page param from the querystring, make sure you check for a maximum value based on the size of the results array.

For the next and previous links, you should style them as disabled for the first and last page. Don't just change the pointer CSS property. Visually change them too.

The previous and next links do not need a click listener. They are anchor tags. They will reload the page automatically. You just have to set their href values.

Inside your changePage function that gets called with the onClick function you have this line:

window.location.search = params.toString();
This line will reload the page. 
So, line 108 never runs. There is no reason to call fetchRecipe(). when the page reloads it will be called.
What you should be doing inside the setPagination function is creating a URL object, setting its searchParams, and then assigning the URL as the href value of each anchor tag. 
After that, when the user clicks the anchor tag, the browser takes care of the reloading of the page.
The dropdown lists still need the value from the querystring selected to show the user what they chose.
For the sortby dropdown you need an option that has nothing selected for when the page loads and there is no sort preference... OR pick a default one, select it, and use it to sort the recipes.
Good work. 
Have a good break.
Try to find time to practice your JS and read the mad9014 course notes.

*/
