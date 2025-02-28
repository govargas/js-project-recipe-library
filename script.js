document.addEventListener("DOMContentLoaded", function() {
  // --- DOM Selectors ---
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");
  const filterDropdowns = document.querySelectorAll(
    "#dropdown-diets, #dropdown-cuisine, #dropdown-cooking-time, #dropdown-ingredients"
  );
  const sortDropdown = document.getElementById("dropdown-sort");
  
  // Diet filter buttons
  const veganBtn = document.getElementById("vegan");
  const vegetarianBtn = document.getElementById("vegetarian");
  const glutenFreeBtn = document.getElementById("glutenfree");
  const dairyFreeBtn = document.getElementById("dairyfree");
  const meatBtn = document.getElementById("meat");
  const fishBtn = document.getElementById("fish");
  
  // Message box for displaying messages on Recipe Card 1
  const messageBox = document.getElementById("answers");

  // --- Event Listeners ---

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

  // Multi-select for filter dropdowns (Diets, Cuisine, Cooking time, -/+ Ingredients)
  filterDropdowns.forEach(dropdown => {
    dropdown.querySelectorAll(".dropdown-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        this.classList.toggle("selected");
        // Can add filtering logic here later if needed.
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
      });
    });
  }

  // --- Diet Filter Message Listeners ---
  veganBtn.addEventListener("click", () => {
    messageBox.innerHTML += "<p>You are Vegan. So am I.</p>";
  });
  
  vegetarianBtn.addEventListener("click", () => {
    messageBox.innerHTML += "<p>Vegetarian is nice.</p>";
  });
  
  glutenFreeBtn.addEventListener("click", () => {
    messageBox.innerHTML += "<p>Gluten Morgen! #FREEGLUTEN</p>";
  });
  
  dairyFreeBtn.addEventListener("click", () => {
    messageBox.innerHTML += "<p>Everyday is a Dairyfree day #FREEDAIRY</p>";
  });
  
  meatBtn.addEventListener("click", () => {
    messageBox.innerHTML += "<p> Did we meet at a Meat Loaf concert</p>";
  });
  
  fishBtn.addEventListener("click", () => {
    messageBox.innerHTML += "<p>Fish are tasty too!</p>";
  });
});