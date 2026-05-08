let tasks = [];
let nextId = 1;
let routines = [];
let newSteps = [];

function addTask() {
  const input = document.getElementById('task-input');
  const val = input.value.trim();
  if (!val) return;
  tasks.push({ id: nextId++, title: val, done: false });
  input.value = '';
  renderTasks();
}

document.getElementById('task-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTask();
});

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const counter = document.getElementById('task-counter');
  if (tasks.length === 0) {
    list.innerHTML = '<li style="color:#9aaa9c;font-size:13px;background:none;padding:0">nenhuma tarefa ainda</li>';
    counter.textContent = '';
    return;
  }
  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);
  const all = [...pending, ...done];
  list.innerHTML = all.map(t => `
    <li class="${t.done ? 'done' : ''}">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn-check ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})">✓</button>
        <span>${t.title}</span>
      </div>
      <button class="btn-del" onclick="deleteTask(${t.id})">✕</button>
    </li>
  `).join('');
  const d = done.length;
  counter.textContent = `${d} de ${tasks.length} concluída${tasks.length !== 1 ? 's' : ''}`;
}

function addRoutineStep() {
  const input = document.getElementById('routine-step');
  const val = input.value.trim();
  if (!val) return;
  newSteps.push({ id: Date.now(), title: val, done: false });
  input.value = '';
  renderNewSteps();
}

document.getElementById('routine-step').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addRoutineStep();
});

function renderNewSteps() {
  const preview = document.getElementById('new-steps-preview');
  preview.innerHTML = newSteps.map((s, i) => `
    <li>${i + 1}. ${s.title} <button onclick="removeNewStep(${s.id})" style="background:none;border:none;color:#bbb;cursor:pointer;font-size:12px">✕</button></li>
  `).join('');
}

function removeNewStep(id) {
  newSteps = newSteps.filter(s => s.id !== id);
  renderNewSteps();
}

function saveRoutine() {
  const nameInput = document.getElementById('routine-name');
  const name = nameInput.value.trim() || 'nova rotina';
  if (newSteps.length === 0) return;
  routines.push({ name, steps: [...newSteps] });
  newSteps = [];
  nameInput.value = '';
  document.getElementById('new-steps-preview').innerHTML = '';
  renderRoutines();
}

function toggleStep(ri, si) {
  routines[ri].steps[si].done = !routines[ri].steps[si].done;
  renderRoutines();
}

function deleteStep(ri, si) {
  routines[ri].steps.splice(si, 1);
  renderRoutines();
}

function deleteRoutine(ri) {
  routines.splice(ri, 1);
  renderRoutines();
}

function renderRoutines() {
  const list = document.getElementById('routine-list');
  list.innerHTML = routines.map((r, ri) => {
    const done = r.steps.filter(s => s.done).length;
    return `
      <div class="routine-card">
        <div class="routine-card-header">
          <span class="routine-card-name">${r.name}</span>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="routine-badge">${done}/${r.steps.length}</span>
            <button class="btn-del" onclick="deleteRoutine(${ri})">✕</button>
          </div>
        </div>
        ${r.steps.map((s, si) => `
          <div class="routine-step-item ${s.done ? 'done' : ''}">
            <span class="step-num">${si + 1}</span>
            <button class="btn-check ${s.done ? 'done' : ''}" onclick="toggleStep(${ri},${si})">✓</button>
            <span style="flex:1">${s.title}</span>
            <button class="btn-del" onclick="deleteStep(${ri},${si})">✕</button>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

renderTasks();
renderRoutines();