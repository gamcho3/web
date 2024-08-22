// 페이지 로드 후 실행
document.addEventListener("DOMContentLoaded", () => {
  loadCountries(); // 나라 목록 불러오기
  loadMainIngredients(); // 메인 재료 목록 불러오기
  loadRandomRecipes(); // 랜덤 음식 불러오기

  // 나라 선택 시 해당 나라의 음식 목록 불러오기
  document.getElementById("country-list").addEventListener("click", (e) => {
    //자식의 위치, 클릭한 요소를 반환
    console.log("child", e.target);
    // 이벤트가 달린 부모 위치 반환
    console.log("parent", e.currentTarget);
    if (e.target.tagName === "A") {
      loadRecipesByCountry(e.target.innerText);
    }
  });

  // 메인 재료 선택 시 해당 재료의 음식 목록 불러오기
  document.getElementById("ingredient-list").addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      loadRecipesByIngredient(e.target.innerText);
    }
  });

  // 검색 버튼 클릭 시 검색어와 일치하는 음식 불러오기
  document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    console.log(query);
    loadRecipesBySearch(query);
  });
});

// 나라 목록 불러오기
async function loadCountries() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await res.json();
  const countries = data.meals;

  const countryList = document.getElementById("country-list");
  countries.forEach((country) => {
    const countryLink = document.createElement("a");
    countryLink.href = "#";
    countryLink.innerText = country.strArea;
    countryList.appendChild(countryLink);
  });
}

// 메인 재료 목록 불러오기
async function loadMainIngredients() {
  const mainIngredients = ["Chicken", "Lamb", "Beef", "Pork"];
  const ingredientList = document.getElementById("ingredient-list");

  mainIngredients.forEach((ingredient) => {
    const ingredientLink = document.createElement("a");
    ingredientLink.href = "#";
    ingredientLink.innerText = ingredient;
    ingredientList.appendChild(ingredientLink);
  });
}

// 랜덤음식 불러오기
async function loadRandomRecipes() {
  const container = document.querySelector(".random-recipes");
  //skelton UI 만들기
  for (let i = 0; i <= 20; i++) {
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "skeleton";
    const img = document.createElement("img");
    img.src = "./IMG/loading_1.gif";
    recipeDiv.appendChild(img);
    container.appendChild(recipeDiv);
  }

  // fetch함수를 배열에 담기
  let fetchArray = [];
  for (let i = 0; i <= 20; i++) {
    fetchArray.push(
      fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    );
  }
  //Promise.all을 사용하여 20개의 음식을 한번에 요청하기
  const resArray = await Promise.all(fetchArray);
  // 응답을 배열로 변환
  const dataArray = await Promise.all(resArray.map((res) => res.json()));
  // 이전 내용 지우기
  container.innerHTML = "";
  dataArray.forEach((data) => {
    const meal = data.meals[0];

    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipe-item";

    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    img.addEventListener("click", () => displayRecipePage(meal));

    const name = document.createElement("p");
    name.innerText = meal.strMeal;

    recipeDiv.appendChild(img);
    recipeDiv.appendChild(name);
    container.appendChild(recipeDiv);
  });

  //   for (let i = 0; i <= 20; i++) {
  //     const res = await fetch(
  //       "https://www.themealdb.com/api/json/v1/1/random.php"
  //     );
  // const data = await res.json();
  // const meal = data.meals[0];

  // const recipeDiv = document.createElement("div");
  // recipeDiv.className = "recipe-item";

  // const img = document.createElement("img");
  // img.src = meal.strMealThumb;
  // img.alt = meal.strMeal;
  // img.addEventListener("click", () => displayRecipePage(meal));

  // const name = document.createElement("p");
  // name.innerText = meal.strMeal;

  // recipeDiv.appendChild(img);
  // recipeDiv.appendChild(name);
  // container.appendChild(recipeDiv);
  //   }
}

// 특정 나라의음식 불러오기
async function loadRecipesByCountry(country) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`
  );
  const data = await res.json();
  showRecipes(data.meals);
}

// 특정 재료의음식 불러오기
async function loadRecipesByIngredient(ingredient) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await res.json();
  showRecipes(data.meals);
}

// 검색어와 일치하는음식 불러오기
async function loadRecipesBySearch(query) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const data = await res.json();
  showRecipes(data.meals);
}

//음식 목록을 표시
function showRecipes(meals) {
  const container = document.querySelector(".random-recipes");
  container.innerHTML = ""; // 이전 내용 지우기

  meals.forEach((meal) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipe-item";

    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    img.addEventListener("click", () => {
      displayRecipePage(meal); // 이미지 클릭시, 새로운페이지에 세부내용 나오게한다.
    });

    const name = document.createElement("p");
    name.innerText = meal.strMeal;

    recipeDiv.appendChild(img);
    recipeDiv.appendChild(name);
    container.appendChild(recipeDiv);
  });
}
// 선택한음식의 세부 정보를 새로운 페이지에서 표시
// function showRecipeDetails(meal) {
//     const recipePage = window.open('recipe.html');
//     recipePage.onload = () => {
//         recipePage.displayRecipePage(meal);
//     };
// }
