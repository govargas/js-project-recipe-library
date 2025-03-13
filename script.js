document.addEventListener("DOMContentLoaded", function() {
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

  // Diet filter buttons
  const veganBtn = document.getElementById("vegan");
  const vegetarianBtn = document.getElementById("vegetarian");
  const glutenFreeBtn = document.getElementById("glutenfree");
  const dairyFreeBtn = document.getElementById("dairyfree");
  const meatBtn = document.getElementById("meat");
  const fishBtn = document.getElementById("fish");

  // --- Recipe Data ---
  const recipes = [
    {
      id: 1,
      title: "Vegan Lentil Soup",
      image: "./assets/chickpeas.webp",
      readyInMinutes: 30,
      servings: 4,
      sourceUrl: "https://example.com/vegan-lentil-soup",
      diets: ["vegan"],
      cuisine: "Mediterranean",
      ingredients: [
        "red lentils",
        "carrots",
        "onion",
        "garlic",
        "tomato paste",
        "cumin",
        "paprika",
        "vegetable broth",
        "olive oil",
        "salt"
      ],
      pricePerServing: 2.5,
      popularity: 85
    },
    {
      id: 2,
      title: "Vegetarian Pesto Pasta",
      image: "./assets/codepenne.webp",
      readyInMinutes: 25,
      servings: 2,
      sourceUrl: "https://example.com/vegetarian-pesto-pasta",
      diets: ["vegetarian"],
      cuisine: "Italian",
      ingredients: [
        "pasta",
        "basil",
        "parmesan cheese",
        "garlic",
        "pine nuts",
        "olive oil",
        "salt",
        "black pepper"
      ],
      pricePerServing: 3.0,
      popularity: 92
    },
    {
      id: 3,
      title: "Gluten-Free Chicken Stir-Fry",
      image: "./assets/tacos.webp",
      readyInMinutes: 20,
      servings: 3,
      sourceUrl: "https://example.com/gluten-free-chicken-stir-fry",
      diets: ["gluten-free"],
      cuisine: "Asian",
      ingredients: [
        "chicken breast",
        "broccoli",
        "bell pepper",
        "carrot",
        "soy sauce (gluten-free)",
        "ginger",
        "garlic",
        "sesame oil",
        "cornstarch",
        "green onion",
        "sesame seeds",
        "rice"
      ],
      pricePerServing: 4.0,
      popularity: 78
    },
    {
      id: 4,
      title: "Dairy-Free Tacos",
      image: "./assets/kanba_sushi.webp",
      readyInMinutes: 15,
      servings: 2,
      sourceUrl: "https://example.com/dairy-free-tacos",
      diets: ["dairy-free"],
      cuisine: "Mexican",
      ingredients: [
        "corn tortillas",
        "ground beef",
        "taco seasoning",
        "lettuce",
        "tomato",
        "avocado"
      ],
      pricePerServing: 2.8,
      popularity: 88
    },
    {
      id: 5,
      title: "Middle Eastern Hummus",
      image: "./assets/chickpeas.webp",
      readyInMinutes: 10,
      servings: 4,
      sourceUrl: "https://example.com/middle-eastern-hummus",
      diets: ["vegan", "gluten-free"],
      cuisine: "Middle Eastern",
      ingredients: [
        "chickpeas",
        "tahini",
        "garlic",
        "lemon juice",
        "olive oil"
      ],
      pricePerServing: 1.5,
      popularity: 95
    },
    {
      id: 6,
      title: "Quick Avocado Toast",
      image: "./assets/chickpeas.webp",
      readyInMinutes: 5,
      servings: 1,
      sourceUrl: "https://example.com/quick-avocado-toast",
      diets: ["vegan"],
      cuisine: "Mediterranean",
      ingredients: [
        "bread",
        "avocado",
        "lemon juice",
        "salt"
      ],
      pricePerServing: 2.0,
      popularity: 90
    },
    {
      id: 7,
      title: "Beef Stew",
      image: "./assets/chickpeas.webp",
      readyInMinutes: 90,
      servings: 5,
      sourceUrl: "https://example.com/beef-stew",
      diets: [],
      cuisine: "European",
      ingredients: [
        "beef chunks",
        "potatoes",
        "carrots",
        "onion",
        "garlic",
        "tomato paste",
        "beef broth",
        "red wine",
        "bay leaves",
        "thyme",
        "salt",
        "black pepper",
        "butter",
        "flour",
        "celery",
        "mushrooms"
      ],
      pricePerServing: 5.5,
      popularity: 80
    }
  ];

  // Start with all recipes displayed
  let currentRecipes = recipes;

  // --- Existing Event Listeners for Menu & Dropdowns ---

  // Toggle hamburger menu (mobile)
  menuIcon.addEventListener("click", function() {
    navLinks.classList.toggle("active");
    menuIcon.classList.toggle("open");
  });

  // Toggle dropdown menus and rotate arrow icons
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", function(e) {
      e.preventDefault();
      const dropdownMenu = this.parentElement.querySelector(".dropdown-menu");
      dropdownMenu.classList.toggle("active");
      const arrow = this.querySelector(".arrow-icon");
      if (arrow) arrow.classList.toggle("active");
    });
  });

  // Multi-select for filter dropdowns
  filterDropdowns.forEach(dropdown => {
    dropdown.querySelectorAll(".dropdown-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        this.classList.toggle("selected");
        // Update displayed recipes after filter change
        currentRecipes = filterRecipes();
        renderRecipes(currentRecipes);
      });
    });
  });

  // Single-select for sort-by dropdown
  if (sortDropdown) {
    const sortButtons = sortDropdown.querySelectorAll(".dropdown-btn");
    sortButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        sortButtons.forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        // Sort the current recipes based on the sort option
        currentRecipes = sortRecipes(currentRecipes, this.textContent.trim());
        renderRecipes(currentRecipes);
      });
    });
  }

  // Surprise me button: selects a random recipe and renders it
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", function() {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      renderRecipes([randomRecipe]);
    });
  }

  // --- Functions ---

  // Render recipes in the DOM
  function renderRecipes(recipesArray) {
    recipesContainer.innerHTML = "";
    if (recipesArray.length === 0) {
      recipesContainer.innerHTML = "<p>Ooops, we couldn’t find something here. Maybe soon!</p>";
      return;
    }
    recipesArray.forEach(recipe => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
      recipeCard.innerHTML = `
        ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title} Image">` : ""}
        <h2>${recipe.title}</h2>
        <p>Ready in ${recipe.readyInMinutes} minutes | Servings: ${recipe.servings}</p>
        <div class="divider"></div>
        <div class="cuisine-time">
          <div class="cuisine-time-row">
            <h3>Cuisine:</h3>
            <p>${recipe.cuisine}</p>
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
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
          </ul>
        </div>
        <button class="view-recipe-btn" onclick="window.open('${recipe.sourceUrl}', '_blank')">View Recipe</button>
      `;
      recipesContainer.appendChild(recipeCard);
    });
  }

  // Filter recipes based on selected filters
  function filterRecipes() {
    // Get selected filters from each dropdown
    const selectedDiets = Array.from(document.querySelectorAll("#dropdown-diets .dropdown-btn.selected")).map(btn => btn.textContent.trim().toLowerCase());
    const selectedCuisine = Array.from(document.querySelectorAll("#dropdown-cuisine .dropdown-btn.selected")).map(btn => btn.textContent.trim().toLowerCase());
    const selectedCookingTime = Array.from(document.querySelectorAll("#dropdown-cooking-time .dropdown-btn.selected")).map(btn => btn.textContent.trim().toLowerCase());
    const selectedIngredients = Array.from(document.querySelectorAll("#dropdown-ingredients .dropdown-btn.selected")).map(btn => btn.textContent.trim().toLowerCase());

    return recipes.filter(recipe => {
      let dietMatch = true;
      let cuisineMatch = true;
      let cookingTimeMatch = true;
      let ingredientsMatch = true;

      // Diet filtering: if any diet filter is selected, recipe must match at least one.
      if (selectedDiets.length > 0) {
        const recipeDiets = recipe.diets.map(d => d.toLowerCase());
        dietMatch = selectedDiets.some(filterDiet => recipeDiets.includes(filterDiet));
      }

      // Cuisine filtering
      if (selectedCuisine.length > 0) {
        cuisineMatch = selectedCuisine.includes(recipe.cuisine.toLowerCase());
      }

      // Cooking time filtering
      if (selectedCookingTime.length > 0) {
        cookingTimeMatch = selectedCookingTime.some(timeFilter => {
          if (timeFilter.includes("under 15")) return recipe.readyInMinutes < 15;
          if (timeFilter.includes("15-30")) return recipe.readyInMinutes >= 15 && recipe.readyInMinutes <= 30;
          if (timeFilter.includes("30-60")) return recipe.readyInMinutes > 30 && recipe.readyInMinutes <= 60;
          if (timeFilter.includes("over 60")) return recipe.readyInMinutes > 60;
          return true;
        });
      }

      // Ingredients filtering
      if (selectedIngredients.length > 0) {
        ingredientsMatch = selectedIngredients.some(ingFilter => {
          if (ingFilter.includes("under 5")) return recipe.ingredients.length < 5;
          if (ingFilter.includes("6-10")) return recipe.ingredients.length >= 5 && recipe.ingredients.length <= 10;
          if (ingFilter.includes("11-15")) return recipe.ingredients.length > 10 && recipe.ingredients.length <= 15;
          if (ingFilter.includes("over 16")) return recipe.ingredients.length > 15;
          return true;
        });
      }

      return dietMatch && cuisineMatch && cookingTimeMatch && ingredientsMatch;
    });
  }

  // Sort recipes based on the sort type (button text)
  function sortRecipes(recipesArray, sortType) {
    const sorted = [...recipesArray];
    if (sortType.toLowerCase().includes("cooking time (ascending)")) {
      sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    } else if (sortType.toLowerCase().includes("cooking time (descending)")) {
      sorted.sort((a, b) => b.readyInMinutes - a.readyInMinutes);
    } else if (sortType.toLowerCase().includes("ingredients (ascending)")) {
      sorted.sort((a, b) => a.ingredients.length - b.ingredients.length);
    } else if (sortType.toLowerCase().includes("ingredients (descending)")) {
      sorted.sort((a, b) => b.ingredients.length - a.ingredients.length);
    }
    return sorted;
  }

  // Initial render of all recipes
  renderRecipes(recipes);
});