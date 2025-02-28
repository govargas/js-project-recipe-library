document.addEventListener("DOMContentLoaded", function() {
  // Toggle hamburger menu (mobile)
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");
  menuIcon.addEventListener("click", function() {
    navLinks.classList.toggle("active");
    menuIcon.classList.toggle("open");
  });

  // Toggle dropdown menus and rotate arrow icons
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", function(e) {
      e.preventDefault();
      // Find the dropdown menu inside this container and toggle its visibility
      const container = this.parentElement;
      const dropdownMenu = container.querySelector(".dropdown-menu");
      dropdownMenu.classList.toggle("active");

      // Rotate the arrow icon by toggling the "active" class
      const arrow = this.querySelector(".arrow-icon");
      if (arrow) {
        arrow.classList.toggle("active");
      }
    });
  });

  // For filter buttons (Diets, Cuisine, Cooking time, -/+ Ingredients)
  // We allow multi-select (each button toggles its own selected state)
  const filterDropdowns = document.querySelectorAll(
    "#dropdown-diets, #dropdown-cuisine, #dropdown-cooking-time, #dropdown-ingredients"
  );
  filterDropdowns.forEach(dropdown => {
    const buttons = dropdown.querySelectorAll(".dropdown-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", function() {
        // Toggle selected state (if already selected, unselect it; if not, select it)
        this.classList.toggle("selected");
        // After any selection change, update the recipe filtering
        filterRecipes();
      });
    });
  });

  // For sort-by buttons (single-select): only one can be selected
  const sortDropdown = document.getElementById("dropdown-sort");
  if (sortDropdown) {
    const sortButtons = sortDropdown.querySelectorAll(".dropdown-btn");
    sortButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        // Remove selected class from all sort buttons
        sortButtons.forEach(b => b.classList.remove("selected"));
        // Add selected class to the clicked sort button
        this.classList.add("selected");
        // (You can add sorting functionality here if needed)
      });
    });
  }

  // Function to collect selected filters and filter recipes accordingly
  function filterRecipes() {
    // Get selected diets (an array of button texts)
    const selectedDiets = Array.from(document.querySelectorAll("#dropdown-diets .dropdown-btn.selected")).map(btn => btn.textContent.trim().toLowerCase());
    // For this example, we only filter by diets using the keyword "chickpea"
    // (In a more complete implementation, you would also check the other filter categories)
    
    // Get all recipe cards
    const recipes = document.querySelectorAll(".recipe-card");

    recipes.forEach(recipe => {
      // Convert recipe text content to lower case for comparison
      const recipeText = recipe.innerText.toLowerCase();
      
      // If any diet filter is selected, show only recipes that include "chickpea"
      if (selectedDiets.length > 0) {
        if (recipeText.includes("chickpea")) {
          recipe.style.display = ""; // show recipe
        } else {
          recipe.style.display = "none"; // hide recipe
        }
      } else {
        // If no diet filter is selected, show all recipes
        recipe.style.display = "";
      }
    });
  }

  // Optionally, you can add a function to get all selected filters for further use
  function getSelectedFilters() {
    return {
      diets: Array.from(document.querySelectorAll("#dropdown-diets .dropdown-btn.selected")).map(btn => btn.textContent.trim()),
      cuisine: Array.from(document.querySelectorAll("#dropdown-cuisine .dropdown-btn.selected")).map(btn => btn.textContent.trim()),
      cookingTime: Array.from(document.querySelectorAll("#dropdown-cooking-time .dropdown-btn.selected")).map(btn => btn.textContent.trim()),
      ingredients: Array.from(document.querySelectorAll("#dropdown-ingredients .dropdown-btn.selected")).map(btn => btn.textContent.trim()),
      sortBy: document.querySelector("#dropdown-sort .dropdown-btn.selected") 
              ? document.querySelector("#dropdown-sort .dropdown-btn.selected").textContent.trim()
              : null
    };
  }

  // For debugging: log selected filters when a change occurs (optional)
  // You can remove this later if not needed.
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      console.log(getSelectedFilters());
    });
  });
});