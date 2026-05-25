const STORE = {
  inventory: "publiquity.inventory.v1",
  tasks: "publiquity.tasks.v1",
  activity: "publiquity.activity.v1"
};

const seedInventory = [
  {
    id: "inv-1001",
    sku: "PUB-EL-1001",
    title: "Premium Headphone & Audio Returns Bundle",
    category: "Electronics",
    condition: "Open box",
    quantity: 18,
    cost: 64,
    price: 149,
    location: "Aisle B / Bin 04",
    status: "Ready to publish",
    owner: "Maya",
    notes: "Good TikTok live bundle. Needs final thumbnail."
  },
  {
    id: "inv-1002",
    sku: "PUB-BULK-2201",
    title: "General Merchandise Pallet",
    category: "Bulk",
    condition: "Returns",
    quantity: 82,
    cost: 385,
    price: 695,
    location: "Pallet Row 2",
    status: "Needs photos",
    owner: "Chris",
    notes: "Manifest reviewed. Shoot wide pallet photo and three detail shots."
  },
  {
    id: "inv-1003",
    sku: "PUB-BEAUTY-1404",
    title: "Beauty Mystery Box: Viral Care Mix",
    category: "Beauty",
    condition: "Mixed",
    quantity: 36,
    cost: 22,
    price: 59,
    location: "Aisle D / Shelf 1",
    status: "Published",
    owner: "Sam",
    notes: "Bundle copy approved."
  }
];

const seedTasks = [
  {
    id: "task-1001",
    title: "Shoot product photos for PUB-BULK-2201",
    type: "Product photos",
    subject: "PUB-BULK-2201",
    owner: "Chris",
    priority: "High",
    status: "In progress",
    createdBy: "JP",
    updatedAt: new Date(Date.now() - 1000 * 60 * 34).toISOString()
  },
  {
    id: "task-1002",
    title: "Write TikTok listing copy for audio bundle",
    type: "Listing copy",
    subject: "PUB-EL-1001",
    owner: "Maya",
    priority: "Normal",
    status: "To do",
    createdBy: "JP",
    updatedAt: new Date(Date.now() - 1000 * 60 * 85).toISOString()
  },
  {
    id: "task-1003",
    title: "Pack first six beauty mystery boxes",
    type: "Packing",
    subject: "PUB-BEAUTY-1404",
    owner: "Sam",
    priority: "Normal",
    status: "Done",
    createdBy: "Maya",
    updatedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString()
  }
];

const seedActivity = [
  {
    id: "act-1001",
    actor: "Maya",
    action: "published",
    subject: "PUB-BEAUTY-1404",
    time: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: "act-1002",
    actor: "Chris",
    action: "started task",
    subject: "Shoot product photos for PUB-BULK-2201",
    time: new Date(Date.now() - 1000 * 60 * 34).toISOString()
  },
  {
    id: "act-1003",
    actor: "JP",
    action: "created task",
    subject: "Write TikTok listing copy for audio bundle",
    time: new Date(Date.now() - 1000 * 60 * 85).toISOString()
  }
];

const moneyOps = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeds() {
  if (!localStorage.getItem(STORE.inventory)) writeStore(STORE.inventory, seedInventory);
  if (!localStorage.getItem(STORE.tasks)) writeStore(STORE.tasks, seedTasks);
  if (!localStorage.getItem(STORE.activity)) writeStore(STORE.activity, seedActivity);
}

function getInventory() {
  return readStore(STORE.inventory, seedInventory);
}

function setInventory(items) {
  writeStore(STORE.inventory, items);
}

function getTasks() {
  return readStore(STORE.tasks, seedTasks);
}

function setTasks(items) {
  writeStore(STORE.tasks, items);
}

function getActivity() {
  return readStore(STORE.activity, seedActivity);
}

function recordActivity(actor, action, subject) {
  const activity = getActivity();
  activity.unshift({
    id: `act-${Date.now()}`,
    actor,
    action,
    subject,
    time: new Date().toISOString()
  });
  writeStore(STORE.activity, activity.slice(0, 60));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(status) {
  return String(status).toLowerCase().replaceAll(" ", "-");
}

function formatTime(iso) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(iso));
}

function renderActivity(targetId) {
  const target = document.querySelector(`#${targetId}`);
  if (!target) return;
  const activity = getActivity().slice(0, 12);
  target.innerHTML = activity
    .map(
      (item) => `
        <article class="activity-item">
          <div>
            <strong>${escapeHtml(item.actor)}</strong>
            <span>${escapeHtml(item.action)} ${escapeHtml(item.subject)}</span>
          </div>
          <time>${formatTime(item.time)}</time>
        </article>
      `
    )
    .join("");
}

function makeInventoryItem(formData) {
  const cost = Number(formData.get("cost")) || 0;
  const price = Number(formData.get("price")) || 0;
  return {
    id: `inv-${Date.now()}-${Math.round(Math.random() * 999)}`,
    sku: formData.get("sku") || `PUB-${Date.now()}`,
    title: formData.get("title") || "Untitled inventory item",
    category: formData.get("category") || "General",
    condition: formData.get("condition") || "Mixed",
    quantity: Number(formData.get("quantity")) || 1,
    cost,
    price,
    location: formData.get("location") || "Unassigned",
    status: formData.get("status") || "Needs photos",
    owner: formData.get("employee") || "JP",
    notes: formData.get("notes") || ""
  };
}

function renderAdmin() {
  const inventory = getInventory();
  const rows = document.querySelector("#inventoryRows");
  if (!rows) return;

  document.querySelector("#adminTotalSkus").textContent = inventory.length;
  document.querySelector("#adminReadyCount").textContent = inventory.filter((item) =>
    ["Ready to publish", "Published"].includes(item.status)
  ).length;
  document.querySelector("#adminNeedsWorkCount").textContent = inventory.filter((item) =>
    ["Needs photos", "Hold"].includes(item.status)
  ).length;

  rows.innerHTML = inventory
    .map(
      (item) => `
        <tr>
          <td><strong>${escapeHtml(item.sku)}</strong></td>
          <td>${escapeHtml(item.title)}<small>${escapeHtml(item.location)}</small></td>
          <td>${escapeHtml(item.category)}</td>
          <td>${item.quantity}</td>
          <td>${moneyOps.format(item.price)}</td>
          <td><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td>
          <td>${escapeHtml(item.owner)}</td>
          <td>
            <div class="row-actions">
              <button type="button" data-inventory-action="photos" data-id="${item.id}">Photos done</button>
              <button type="button" data-inventory-action="publish" data-id="${item.id}">Publish</button>
              <button type="button" data-inventory-action="remove" data-id="${item.id}">Remove</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  renderActivity("adminActivityList");
}

function parseCsv(text, employee) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((header) => header.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    return {
      id: `inv-${Date.now()}-${Math.round(Math.random() * 99999)}`,
      sku: row.sku || `PUB-${Date.now()}`,
      title: row.title || "Untitled inventory item",
      category: row.category || "General",
      condition: row.condition || "Mixed",
      quantity: Number(row.quantity) || 1,
      cost: Number(row.cost) || 0,
      price: Number(row.price) || 0,
      location: row.location || "Unassigned",
      status: row.status || "Needs photos",
      owner: employee,
      notes: row.notes || ""
    };
  });
}

function initAdmin() {
  renderAdmin();

  document.querySelector("#manualInventoryForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const item = makeInventoryItem(new FormData(form));
    setInventory([item, ...getInventory()]);
    recordActivity(item.owner, "uploaded inventory", item.sku);
    form.reset();
    renderAdmin();
  });

  document.querySelector("#importCsvBtn")?.addEventListener("click", () => {
    const employee = document.querySelector("#csvEmployee").value;
    const rows = parseCsv(document.querySelector("#csvInput").value, employee);
    if (!rows.length) return;
    setInventory([...rows, ...getInventory()]);
    recordActivity(employee, "imported CSV rows", `${rows.length} inventory items`);
    renderAdmin();
  });

  document.querySelector("#inventoryRows")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-inventory-action]");
    if (!button) return;
    const action = button.dataset.inventoryAction;
    const inventory = getInventory();
    const item = inventory.find((entry) => entry.id === button.dataset.id);
    if (!item) return;

    if (action === "remove") {
      setInventory(inventory.filter((entry) => entry.id !== item.id));
      recordActivity(item.owner, "removed inventory", item.sku);
    } else if (action === "photos") {
      item.status = "Ready to publish";
      setInventory(inventory);
      recordActivity(item.owner, "marked photos complete for", item.sku);
    } else if (action === "publish") {
      item.status = "Published";
      setInventory(inventory);
      recordActivity(item.owner, "published", item.sku);
    }

    renderAdmin();
  });

  document.querySelector("#resetDemoInventory")?.addEventListener("click", () => {
    setInventory(seedInventory);
    writeStore(STORE.activity, seedActivity);
    renderAdmin();
  });
}

function makeTask(formData) {
  return {
    id: `task-${Date.now()}-${Math.round(Math.random() * 999)}`,
    title: formData.get("title"),
    type: formData.get("type"),
    subject: formData.get("subject") || "General",
    owner: formData.get("owner"),
    priority: formData.get("priority"),
    status: "To do",
    createdBy: formData.get("createdBy"),
    updatedAt: new Date().toISOString()
  };
}

function renderTeamLoad(tasks) {
  const target = document.querySelector("#teamLoad");
  if (!target) return;
  const employees = ["JP", "Maya", "Chris", "Sam"];
  target.innerHTML = employees
    .map((name) => {
      const owned = tasks.filter((task) => task.owner === name);
      const active = owned.filter((task) => task.status !== "Done").length;
      return `
        <article>
          <strong>${name}</strong>
          <span>${active} active / ${owned.length} total</span>
        </article>
      `;
    })
    .join("");
}

function taskCard(task) {
  return `
    <article class="task-card">
      <div class="task-card-head">
        <span class="priority ${task.priority.toLowerCase()}">${escapeHtml(task.priority)}</span>
        <strong>${escapeHtml(task.owner)}</strong>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.type)} · ${escapeHtml(task.subject)}</p>
      <small>Updated ${formatTime(task.updatedAt)}</small>
      <div class="task-actions">
        <button type="button" data-task-action="todo" data-id="${task.id}">To do</button>
        <button type="button" data-task-action="progress" data-id="${task.id}">Start</button>
        <button type="button" data-task-action="done" data-id="${task.id}">Done</button>
      </div>
    </article>
  `;
}

function renderEmployee() {
  const filter = document.querySelector("#employeeFilter")?.value || "all";
  const tasks = getTasks();
  const visible = filter === "all" ? tasks : tasks.filter((task) => task.owner === filter);

  document.querySelector("#employeeOpenTasks").textContent = tasks.filter((task) => task.status === "To do").length;
  document.querySelector("#employeeProgressTasks").textContent = tasks.filter((task) => task.status === "In progress").length;
  document.querySelector("#employeeDoneTasks").textContent = tasks.filter((task) => task.status === "Done").length;

  document.querySelector("#todoTasks").innerHTML = visible.filter((task) => task.status === "To do").map(taskCard).join("");
  document.querySelector("#progressTasks").innerHTML = visible.filter((task) => task.status === "In progress").map(taskCard).join("");
  document.querySelector("#doneTasks").innerHTML = visible.filter((task) => task.status === "Done").map(taskCard).join("");

  renderTeamLoad(tasks);
  renderActivity("employeeActivityList");
}

function initEmployee() {
  renderEmployee();

  document.querySelector("#taskForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const task = makeTask(new FormData(form));
    setTasks([task, ...getTasks()]);
    recordActivity(task.createdBy, "created task", task.title);
    form.reset();
    renderEmployee();
  });

  document.querySelector("#employeeFilter")?.addEventListener("change", renderEmployee);

  document.querySelector(".task-board")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-task-action]");
    if (!button) return;
    const tasks = getTasks();
    const task = tasks.find((item) => item.id === button.dataset.id);
    if (!task) return;

    const nextStatus = {
      todo: "To do",
      progress: "In progress",
      done: "Done"
    }[button.dataset.taskAction];

    task.status = nextStatus;
    task.updatedAt = new Date().toISOString();
    setTasks(tasks);
    recordActivity(task.owner, `moved task to ${nextStatus}`, task.title);
    renderEmployee();
  });

  document.querySelector("#resetDemoTasks")?.addEventListener("click", () => {
    setTasks(seedTasks);
    writeStore(STORE.activity, seedActivity);
    renderEmployee();
  });
}

ensureSeeds();

if (document.body.dataset.opsPage === "admin") {
  initAdmin();
}

if (document.body.dataset.opsPage === "employee") {
  initEmployee();
}
