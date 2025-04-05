document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const exercises = {
  gym: ["Bench Press", "Deadlift", "Squats", "Pull-Ups", "Leg Press", "Bicep Curls", "Tricep Dips"],
  yoga: ["Sun Salutation", "Warrior Pose", "Tree Pose", "Downward Dog", "Child's Pose"],
  dance: ["Zumba", "Hip-Hop", "Salsa", "Ballet", "Bollywood Dance"]
};

let scheduleData = JSON.parse(localStorage.getItem('workoutSchedule')) || [];

function renderSchedule() {
  const scheduleTable = document.getElementById('scheduleTable');
  if (scheduleData.length > 0) {
    scheduleTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Exercise</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${scheduleData.map((item, index) => `
            <tr>
              <td>${item.day}</td>
              <td>${item.time}</td>
              <td>${item.exercise}</td>
              <td><button onclick="removeExercise(${index})" class="cta-button">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    scheduleTable.innerHTML = `<p>No exercises added yet. Add exercises to create your schedule.</p>`;
  }
}

document.getElementById('exerciseType').addEventListener('change', function () {
  const exerciseType = this.value;
  const exerciseSelect = document.getElementById('exercise');

  exerciseSelect.innerHTML = '<option value="">-- Select Exercise --</option>';

  if (exerciseType && exercises[exerciseType]) {
    exercises[exerciseType].forEach(exercise => {
      const option = document.createElement('option');
      option.value = exercise;
      option.textContent = exercise;
      exerciseSelect.appendChild(option);
    });
    exerciseSelect.disabled = false;
  } else {
    exerciseSelect.disabled = true;
  }
});

document.getElementById('scheduleForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const exerciseType = document.getElementById('exerciseType').value;
  const exercise = document.getElementById('exercise').value;
  const day = document.getElementById('day').value;
  const time = document.getElementById('time').value;

  scheduleData.push({ exerciseType, exercise, day, time });

  localStorage.setItem('workoutSchedule', JSON.stringify(scheduleData));

  renderSchedule();

  document.getElementById('scheduleForm').reset();
  document.getElementById('exercise').disabled = true;
});

function removeExercise(index) {
  scheduleData.splice(index, 1);
  localStorage.setItem('workoutSchedule', JSON.stringify(scheduleData));
  renderSchedule();
}

renderSchedule();
