document.addEventListener("DOMContentLoaded", async function() {
  // --- DOM Selectors ---
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");
  const filterDropdowns = document.querySelectorAll(
    "#dropdown-diets, #dropdown-cuisine, #dropdown-cooking-time, #dropdown-ingredients"
  );
  const sortDropdown = document.getElementById("dropdown-sort");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const recipesContainer = document.querySelector(".recipes");

  // Diet filter buttons (only these four now)
  const veganBtn = document.getElementById("vegan");
  const vegetarianBtn = document.getElementById("vegetarian");
  const glutenFreeBtn = document.getElementById("glutenfree");
  const dairyFreeBtn = document.getElementById("dairyfree");

  // Global variables to store recipes:
  // allRecipes holds the full dataset from the API.
  // currentRecipes holds the currently displayed (filtered) recipes.
  let allRecipes = [];
  let currentRecipes = [];

  // --- Loading State ---
  recipesContainer.innerHTML = "<p>Loading recipes...</p>";

  // --- Fetching Recipes from Spoonacular API ---
  async function fetchRecipes() {
    const BASE_URL = "https://api.spoonacular.com/recipes/random";
    const API_KEY = "38995979effa4b9ba9ef9e5e014aa6c0";
    const URL = `${BASE_URL}?apiKey=${API_KEY}&number=100`;

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }
      const data = await response.json();
      let fetchedRecipes = data.recipes.filter(recipe => {
        return recipe.cuisines && recipe.cuisines.length > 0 && recipe.image && recipe.title;
      });
      localStorage.setItem("recipes", JSON.stringify(fetchedRecipes));
      return fetchedRecipes;
    } catch (error) {
      console.error("Fetch error:", error.message);
      throw error;
    }
  }

  // --- Initial Data Load ---
  try {
    const fetchedRecipes = await fetchRecipes();
    allRecipes = fetchedRecipes;
    currentRecipes = fetchedRecipes;
    renderRecipes(currentRecipes);
  } catch (error) {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      allRecipes = JSON.parse(storedRecipes);
      currentRecipes = allRecipes;
      renderRecipes(currentRecipes);
      recipesContainer.innerHTML +=
        "<p>We've reached the API quota; displaying cached recipes.</p>";
    } else {
      recipesContainer.innerHTML =
        "<p>Ooops, we couldn’t fetch recipes. Please try again later.</p>";
    }
  }

  // --- Event Listeners for Menu & Dropdowns ---
  menuIcon.addEventListener("click", function() {
    navLinks.classList.toggle("active");
    menuIcon.classList.toggle("open");
  });

  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", function(e) {
      e.preventDefault();
      const dropdownMenu = this.parentElement.querySelector(".dropdown-menu");
      dropdownMenu.classList.toggle("active");
      const arrow = this.querySelector(".arrow-icon");
      if (arrow) arrow.classList.toggle("active");
    });
  });

  filterDropdowns.forEach(dropdown => {
    dropdown.querySelectorAll(".dropdown-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        this.classList.toggle("selected");
        currentRecipes = filterRecipes();
        renderRecipes(currentRecipes);
      });
    });
  });

  if (sortDropdown) {
    const sortButtons = sortDropdown.querySelectorAll(".dropdown-btn");
    sortButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        sortButtons.forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        currentRecipes = sortRecipes(currentRecipes, this.textContent.trim());
        renderRecipes(currentRecipes);
      });
    });
  }

  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", function() {
      const randomRecipe =
        currentRecipes[Math.floor(Math.random() * currentRecipes.length)];
      renderRecipes([randomRecipe]);
    });
  }

  // --- Rendering Function ---
  function renderRecipes(recipesArray) {
    recipesContainer.innerHTML = "";
    if (recipesArray.length === 0) {
      recipesContainer.innerHTML =
        "<p>Ooops, we couldn’t find something here. Try reloading the page!</p>";
      return;
    }
    recipesArray.forEach(recipe => {
      const ingredientsHTML = recipe.extendedIngredients
        ? recipe.extendedIngredients.map(ing => `<li>${ing.name}</li>`).join("")
        : "";
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
      recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title} Image">
        <h2>${recipe.title}</h2>
        <p>Ready in ${recipe.readyInMinutes} minutes | Servings: ${recipe.servings}</p>
        <div class="divider"></div>
        <div class="cuisine-time">
          <div class="cuisine-time-row">
            <h3>Cuisine:</h3>
            <p>${
              recipe.cuisines && recipe.cuisines.length
                ? recipe.cuisines.join(", ")
                : "Unknown"
            }</p>
          </div>
          <div class="cuisine-time-row">
            <h3>Time:</h3>
            <p>${recipe.readyInMinutes} minutes</p>
          </div>
        </div>
        <div class="divider"></div>
        <h3>Ingredients</h3>
        <div class="ingredients-list">
          <ul class="ingredients">
            ${ingredientsHTML}
          </ul>
        </div>
        <button class="view-recipe-btn" onclick="window.open('${
          recipe.sourceUrl
        }', '_blank')">View Recipe</button>
      `;
      recipesContainer.appendChild(recipeCard);
    });
  }

  // --- Filtering Function ---
  function filterRecipes() {
    const selectedDiets = Array.from(
      document.querySelectorAll("#dropdown-diets .dropdown-btn.selected")
    ).map(btn => btn.textContent.trim().toLowerCase());
    const selectedCuisine = Array.from(
      document.querySelectorAll("#dropdown-cuisine .dropdown-btn.selected")
    ).map(btn => btn.textContent.trim().toLowerCase());
    const selectedCookingTime = Array.from(
      document.querySelectorAll("#dropdown-cooking-time .dropdown-btn.selected")
    ).map(btn => btn.textContent.trim().toLowerCase());
    const selectedIngredients = Array.from(
      document.querySelectorAll("#dropdown-ingredients .dropdown-btn.selected")
    ).map(btn => btn.textContent.trim().toLowerCase());

    if (
      selectedDiets.length === 0 &&
      selectedCuisine.length === 0 &&
      selectedCookingTime.length === 0 &&
      selectedIngredients.length === 0
    ) {
      return allRecipes;
    }

    return allRecipes.filter(recipe => {
      let dietMatch = true;
      let cuisineMatch = true;
      let cookingTimeMatch = true;
      let ingredientsMatch = true;

      if (selectedDiets.length > 0) {
        selectedDiets.forEach(diet => {
          if (diet === "vegan" && !recipe.vegan) dietMatch = false;
          if (diet === "vegetarian" && !recipe.vegetarian) dietMatch = false;
          if (diet === "gluten-free" && !recipe.glutenFree) dietMatch = false;
          if (diet === "dairy-free" && !recipe.dairyFree) dietMatch = false;
        });
      }

      if (selectedCuisine.length > 0) {
        cuisineMatch = selectedCuisine.some(c =>
          recipe.cuisines.map(v => v.toLowerCase()).includes(c)
        );
      }

      if (selectedCookingTime.length > 0) {
        cookingTimeMatch = selectedCookingTime.some(timeFilter => {
          if (timeFilter.includes("under 15")) return recipe.readyInMinutes < 15;
          if (timeFilter.includes("15-30"))
            return recipe.readyInMinutes >= 15 && recipe.readyInMinutes <= 30;
          if (timeFilter.includes("30-60"))
            return recipe.readyInMinutes > 30 && recipe.readyInMinutes <= 60;
          if (timeFilter.includes("over 60")) return recipe.readyInMinutes > 60;
          return true;
        });
      }

      if (selectedIngredients.length > 0 && recipe.extendedIngredients) {
        ingredientsMatch = selectedIngredients.some(ingFilter => {
          if (ingFilter.includes("under 5"))
            return recipe.extendedIngredients.length < 5;
          if (ingFilter.includes("6-10"))
            return (
              recipe.extendedIngredients.length >= 5 &&
              recipe.extendedIngredients.length <= 10
            );
          if (ingFilter.includes("11-15"))
            return (
              recipe.extendedIngredients.length > 10 &&
              recipe.extendedIngredients.length <= 15
            );
          if (ingFilter.includes("over 16"))
            return recipe.extendedIngredients.length > 15;
          return true;
        });
      }

      return dietMatch && cuisineMatch && cookingTimeMatch && ingredientsMatch;
    });
  }

  // --- Sorting Function ---
  function sortRecipes(recipesArray, sortType) {
    const sorted = [...recipesArray];
    if (sortType.toLowerCase().includes("cooking time (ascending)")) {
      sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    } else if (sortType.toLowerCase().includes("cooking time (descending)")) {
      sorted.sort((a, b) => b.readyInMinutes - a.readyInMinutes);
    } else if (sortType.toLowerCase().includes("ingredients (ascending)")) {
      sorted.sort(
        (a, b) => a.extendedIngredients.length - b.extendedIngredients.length
      );
    } else if (sortType.toLowerCase().includes("ingredients (descending)")) {
      sorted.sort(
        (a, b) => b.extendedIngredients.length - a.extendedIngredients.length
      );
    }
    return sorted;
  }

  // --- Infinite Scrolling / Pagination ---
  let isFetching = false;

  window.addEventListener("scroll", async function() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !isFetching
    ) {
      isFetching = true;
      try {
        const newRecipes = await fetchRecipes();
        allRecipes = allRecipes.concat(newRecipes);
        currentRecipes = filterRecipes();
        renderRecipes(currentRecipes);
      } catch (error) {
        console.error("Error fetching more recipes:", error.message);
      } finally {
        isFetching = false;
      }
    }
  });
});