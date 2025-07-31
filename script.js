let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let dishValue = document.querySelectorAll(".dishVal");
let showMeal = document.querySelector(".showMeal");
let mealModal = document.getElementById("mealModal");
let mealDetails = document.getElementById("mealDetails");
let closeModal = document.querySelector(".close");
let exploreMeals = document.getElementById("exploreMeals");

let allMeals = [];

// Fetch meal data from API
const getData = async (value, showAll = false) => {
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
        let jsonData = await response.json();

        if (!jsonData.meals) {
            showMeal.innerHTML = "<h1>Meal Not Found</h1>";
            return;
        }

        allMeals = jsonData.meals;
        displayMeals(showAll ? allMeals : allMeals.slice(0, 8)); // Show all if requested
    } catch (error) {
        showMeal.innerHTML = "<h1>Meal Not Found</h1>";
    }
};

// Display meals without "View All Foods" button
const displayMeals = (meals) => {
    showMeal.innerHTML = "";
    meals.forEach((data) => {
        let div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img src="${data.strMealThumb}" alt="">
            <p>${data.strMeal}</p>
            <button onclick="showMealDetails('${data.idMeal}')">View More</button>
        `;
        showMeal.appendChild(div);
    });
};

// Fix: Explore Meals button loads meals (Change "" to "a")
exploreMeals.addEventListener("click", (event) => {
    event.preventDefault();
    getData("a", true); // Fetch all meals (API requires at least one letter)
});

// Show meal details in a modal
const showMealDetails = async (mealId) => {
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        let jsonData = await response.json();
        let meal = jsonData.meals[0];

        mealDetails.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:50%">
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        `;

        mealModal.style.display = "block";
    } catch (error) {
        mealDetails.innerHTML = "<h2>Meal Details Not Found</h2>";
    }
};


document.getElementById("exploreMeals").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default jump behavior

    // Wait until meals are loaded, then scroll
    setTimeout(() => {
        document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
    }, 500); // Adjust delay if needed
});


// Hide modal when clicking the close button
closeModal.addEventListener("click", () => {
    mealModal.style.display = "none";
});

// Hide modal when clicking outside of it
window.onclick = (event) => {
    if (event.target === mealModal) {
        mealModal.style.display = "none";
    }
};
// Redirects to Home page fron about us page
//navbar hamburger
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

// Search functionality with scroll to "Explore Meals"
searchBtn.addEventListener("click", () => {
    let searchValue = searchInput.value.trim();
    if (searchValue === "") {
        alert("Please enter a search value");
    } else {
        getData(searchValue, true);

        // Scroll to Explore Meals section after fetching meals
        setTimeout(() => {
            document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
        }, 500); // Delay to ensure meals are loaded
    }
});


// Category selection event listeners
dishValue.forEach((dishData) => {
    dishData.addEventListener("click", () => {
        getData(dishData.value, true);
    });
});

// Initial fetch with no meals displayed
getData("a", false); // Fetches some meals initially
