async function fetchFoodData() {
  const response = await fetch('FOOD-DATA-GROUP1.csv');
  const data = await response.text();
  return data;
}

function parseCSV(csv) {
  const rows = csv.split('\n').slice(1);
  return rows.map(row => {
      const columns = row.split(',');
      return {
          food: columns[2],
          calories: parseFloat(columns[3]),
          fat: parseFloat(columns[4]),
          saturatedFats: parseFloat(columns[5]),
          monounsaturatedFats: parseFloat(columns[6]),
          polyunsaturatedFats: parseFloat(columns[7]),
          carbs: parseFloat(columns[8]),
          sugars: parseFloat(columns[9]),
          protein: parseFloat(columns[10]),
          dietaryFiber: parseFloat(columns[11]),
          cholesterol: parseFloat(columns[12]),
          sodium: parseFloat(columns[13]),
          water: parseFloat(columns[14]),
          vitaminA: parseFloat(columns[15]),
          vitaminB1: parseFloat(columns[16]),
          vitaminB11: parseFloat(columns[17]),
          vitaminB12: parseFloat(columns[18]),
          vitaminB2: parseFloat(columns[19]),
          vitaminB3: parseFloat(columns[20]),
          vitaminB5: parseFloat(columns[21]),
          vitaminB6: parseFloat(columns[22]),
          vitaminC: parseFloat(columns[23]),
          vitaminD: parseFloat(columns[24]),
          vitaminE: parseFloat(columns[25]),
          vitaminK: parseFloat(columns[26]),
          calcium: parseFloat(columns[27]),
          copper: parseFloat(columns[28]),
          iron: parseFloat(columns[29]),
          magnesium: parseFloat(columns[30]),
          manganese: parseFloat(columns[31]),
          phosphorus: parseFloat(columns[32]),
          potassium: parseFloat(columns[33]),
          selenium: parseFloat(columns[34]),
          zinc: parseFloat(columns[35]),
          nutritionDensity: parseFloat(columns[36])
      };
  }).filter(food => !isNaN(food.calories));
}

function populateFoodItems(foodData, searchQuery = '') {
  const foodItemsSelect = document.getElementById('foodItems');
  foodItemsSelect.innerHTML = '';
  const filteredFoods = foodData.filter(food =>
      food.food.toLowerCase().startsWith(searchQuery.toLowerCase())
  );
  filteredFoods.forEach(food => {
      const option = document.createElement('option');
      option.value = food.food;
      option.textContent = `${food.food} (${food.calories} kcal)`;
      foodItemsSelect.appendChild(option);
  });
}

function addFoodToDiet(foodData) {
  const selectedItems = Array.from(document.getElementById('foodItems').selectedOptions);
  const dietTableBody = document.querySelector('#dietTable tbody');
  const totalCalories = document.getElementById('totalCalories');
  const totalProtein = document.getElementById('totalProtein');
  const totalCarbs = document.getElementById('totalCarbs');
  const totalFat = document.getElementById('totalFat');

  selectedItems.forEach(item => {
      const food = foodData.find(f => f.food === item.value);
      if (food) {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${food.food}</td>
              <td>${food.calories}</td>
              <td>${food.protein}</td>
              <td>${food.carbs}</td>
              <td>${food.fat}</td>
              <td><button onclick="removeFood(this)" class="cta-button">Remove</button></td>
          `;
          dietTableBody.appendChild(row);

          totalCalories.textContent = (parseFloat(totalCalories.textContent) + food.calories).toFixed(2);
          totalProtein.textContent = (parseFloat(totalProtein.textContent) + food.protein).toFixed(2);
          totalCarbs.textContent = (parseFloat(totalCarbs.textContent) + food.carbs).toFixed(2);
          totalFat.textContent = (parseFloat(totalFat.textContent) + food.fat).toFixed(2);

          saveDietPlan();
      }
  });
}

function removeFood(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');
  const totalCalories = document.getElementById('totalCalories');
  const totalProtein = document.getElementById('totalProtein');
  const totalCarbs = document.getElementById('totalCarbs');
  const totalFat = document.getElementById('totalFat');

  totalCalories.textContent = (parseFloat(totalCalories.textContent) - parseFloat(cells[1].textContent)).toFixed(2);
  totalProtein.textContent = (parseFloat(totalProtein.textContent) - parseFloat(cells[2].textContent)).toFixed(2);
  totalCarbs.textContent = (parseFloat(totalCarbs.textContent) - parseFloat(cells[3].textContent)).toFixed(2);
  totalFat.textContent = (parseFloat(totalFat.textContent) - parseFloat(cells[4].textContent)).toFixed(2);

  row.remove();

  saveDietPlan();
}

function saveDietPlan() {
  const dietTableBody = document.querySelector('#dietTable tbody');
  const dietPlan = Array.from(dietTableBody.children).map(row => {
      const cells = row.querySelectorAll('td');
      return {
          food: cells[0].textContent,
          calories: parseFloat(cells[1].textContent),
          protein: parseFloat(cells[2].textContent),
          carbs: parseFloat(cells[3].textContent),
          fat: parseFloat(cells[4].textContent)
      };
  });

  localStorage.setItem('dietPlan', JSON.stringify(dietPlan));
}

function loadDietPlan() {
  const dietPlan = JSON.parse(localStorage.getItem('dietPlan')) || [];
  const dietTableBody = document.querySelector('#dietTable tbody');
  const totalCalories = document.getElementById('totalCalories');
  const totalProtein = document.getElementById('totalProtein');
  const totalCarbs = document.getElementById('totalCarbs');
  const totalFat = document.getElementById('totalFat');

  dietTableBody.innerHTML = '';

  dietPlan.forEach(food => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${food.food}</td>
          <td>${food.calories}</td>
          <td>${food.protein}</td>
          <td>${food.carbs}</td>
          <td>${food.fat}</td>
          <td><button onclick="removeFood(this)" class="cta-button">Remove</button></td>
      `;
      dietTableBody.appendChild(row);

      totalCalories.textContent = (parseFloat(totalCalories.textContent) + food.calories).toFixed(2);
      totalProtein.textContent = (parseFloat(totalProtein.textContent) + food.protein).toFixed(2);
      totalCarbs.textContent = (parseFloat(totalCarbs.textContent) + food.carbs).toFixed(2);
      totalFat.textContent = (parseFloat(totalFat.textContent) + food.fat).toFixed(2);
  });
}

async function initDietPlanner() {
  const csvData = await fetchFoodData();
  const foodData = parseCSV(csvData);

  populateFoodItems(foodData);

  loadDietPlan();

  const searchInput = document.getElementById('searchFood');
  searchInput.addEventListener('input', () => {
      const searchQuery = searchInput.value.trim();
      populateFoodItems(foodData, searchQuery);
  });

  document.getElementById('addFood').addEventListener('click', () => addFoodToDiet(foodData));
}

initDietPlanner();
