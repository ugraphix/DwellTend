import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'dwelltend-mvp-state'

const today = new Date()

const membersBySize = {
  1: ['You'],
  2: ['You', 'Alex'],
  3: ['You', 'Alex', 'Jordan'],
  4: ['You', 'Alex', 'Jordan', 'Sam'],
  5: ['You', 'Alex', 'Jordan', 'Sam', 'Taylor'],
}

const categoryMeta = {
  Daily: {
    description: 'Light-touch resets that keep clutter and grime from stacking.',
    tone: 'low effort',
  },
  Weekly: {
    description: 'Routine cleaning tasks that keep shared spaces feeling cared for.',
    tone: 'steady rhythm',
  },
  Monthly: {
    description: 'A monthly pass for surfaces and systems that are easy to forget.',
    tone: 'deeper pass',
  },
  'Deep Cleaning': {
    description: 'Granular tasks for trim, tracks, vents, and other commonly missed details.',
    tone: 'high impact',
  },
  'Home Maintenance': {
    description: 'Recurring upkeep for filters, vents, seals, and household systems.',
    tone: 'preventive care',
  },
}

const categoryOrder = ['Daily', 'Weekly', 'Monthly', 'Deep Cleaning', 'Home Maintenance']

const templateLibrary = [
  {
    title: 'Reset kitchen counters',
    category: 'Daily',
    frequency: 'daily',
    duration: 10,
    room: 'Kitchen',
    difficulty: 'Easy',
    subtasks: ['Put away loose items', 'Wipe counters', 'Spot-clean backsplash'],
  },
  {
    title: 'Tidy living room surfaces',
    category: 'Daily',
    frequency: 'daily',
    duration: 12,
    room: 'Living Room',
    difficulty: 'Easy',
    subtasks: ['Fold throws', 'Clear side tables', 'Quick dust visible surfaces'],
  },
  {
    title: 'Vacuum high-traffic floors',
    category: 'Weekly',
    frequency: 'weekly',
    duration: 20,
    room: 'Whole Home',
    difficulty: 'Medium',
    subtasks: ['Entry', 'Hallways', 'Living area'],
  },
  {
    title: 'Clean bathroom mirrors and fixtures',
    category: 'Weekly',
    frequency: 'weekly',
    duration: 18,
    room: 'Bathrooms',
    difficulty: 'Medium',
    subtasks: ['Mirror', 'Sink', 'Faucet handles', 'Counter'],
  },
  {
    title: 'Wash bedding and pillowcases',
    category: 'Weekly',
    frequency: 'weekly',
    duration: 30,
    room: 'Bedrooms',
    difficulty: 'Medium',
    subtasks: ['Sheets', 'Pillowcases', 'Remake beds'],
  },
  {
    title: 'Dust baseboards and trim',
    category: 'Monthly',
    frequency: 'monthly',
    duration: 35,
    room: 'Whole Home',
    difficulty: 'Medium',
    subtasks: ['Baseboards', 'Door trim', 'Window trim'],
  },
  {
    title: 'Wipe doors, handles, and hinge edges',
    category: 'Monthly',
    frequency: 'monthly',
    duration: 25,
    room: 'Whole Home',
    difficulty: 'Medium',
    subtasks: ['Door faces', 'Handles', 'Top edges', 'Hinge side'],
  },
  {
    title: 'Detail switches, outlets, and vents',
    category: 'Deep Cleaning',
    frequency: 'monthly',
    duration: 28,
    room: 'Whole Home',
    difficulty: 'Medium',
    subtasks: ['Light switches', 'Outlet covers', 'Supply vents', 'Return grilles'],
  },
  {
    title: 'Clean appliance fronts and seals',
    category: 'Deep Cleaning',
    frequency: 'monthly',
    duration: 24,
    room: 'Kitchen',
    difficulty: 'Medium',
    subtasks: ['Fridge gasket', 'Dishwasher seal', 'Microwave touch points'],
  },
  {
    title: 'Clean behind small furniture edges',
    category: 'Deep Cleaning',
    frequency: 'monthly',
    duration: 30,
    room: 'Bedrooms',
    difficulty: 'Medium',
    subtasks: ['Nightstands', 'Under bed edge', 'Chair legs', 'Corners'],
  },
  {
    title: 'Replace kitchen sponge',
    category: 'Home Maintenance',
    frequency: 'custom',
    customDays: 14,
    duration: 5,
    room: 'Kitchen',
    difficulty: 'Easy',
    subtasks: ['Discard old sponge', 'Set fresh sponge'],
  },
  {
    title: 'Replace mop head',
    category: 'Home Maintenance',
    frequency: 'monthly',
    duration: 8,
    room: 'Laundry',
    difficulty: 'Easy',
    subtasks: ['Remove old pad', 'Install replacement'],
  },
  {
    title: 'Replace HVAC filter',
    category: 'Home Maintenance',
    frequency: 'custom',
    customDays: 60,
    duration: 10,
    room: 'Utility',
    difficulty: 'Easy',
    subtasks: ['Check filter size', 'Install new filter', 'Log replacement date'],
  },
  {
    title: 'Clean dryer lint trap and vent check',
    category: 'Home Maintenance',
    frequency: 'monthly',
    duration: 15,
    room: 'Laundry',
    difficulty: 'Medium',
    subtasks: ['Deep clean lint trap', 'Inspect vent hose', 'Clear surrounding dust'],
  },
  {
    title: 'Vacuum sofa crevices',
    category: 'Weekly',
    frequency: 'weekly',
    duration: 15,
    room: 'Living Room',
    difficulty: 'Easy',
    subtasks: ['Seat gaps', 'Under cushions', 'Arm seams'],
  },
  {
    title: 'Refresh pet zones',
    category: 'Daily',
    frequency: 'daily',
    duration: 10,
    room: 'Pet Areas',
    difficulty: 'Easy',
    petsOnly: true,
    subtasks: ['Tidy feeding area', 'Sweep around bowls', 'Shake out mat'],
  },
  {
    title: 'Vacuum upholstery for pet hair',
    category: 'Weekly',
    frequency: 'weekly',
    duration: 16,
    room: 'Living Room',
    difficulty: 'Medium',
    petsOnly: true,
    subtasks: ['Sofa arms', 'Cushions', 'Pet bed surface'],
  },
  {
    title: 'Entryway floor and mat reset',
    category: 'Weekly',
    frequency: 'weekly',
    duration: 12,
    room: 'Entry',
    difficulty: 'Easy',
    houseOnly: true,
    subtasks: ['Shake mat', 'Sweep entry', 'Wipe inside door'],
  },
]

const starterInventory = [
  { id: 'inv-1', name: 'All-purpose cleaner', quantity: '1 bottle', low: false },
  { id: 'inv-2', name: 'Microfiber cloths', quantity: '8', low: false },
  { id: 'inv-3', name: 'Dish sponges', quantity: '2', low: true },
  { id: 'inv-4', name: 'HVAC filters', quantity: '1', low: true },
]

const starterShopping = [
  { id: 'shop-1', name: 'Mop head refill', checked: false },
  { id: 'shop-2', name: 'Laundry detergent', checked: false },
]

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function startOfToday() {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

function daysFromNow(days) {
  const date = startOfToday()
  date.setDate(date.getDate() + days)
  return isoDate(date)
}

function advanceDate(date, template) {
  const next = new Date(date)

  if (template.frequency === 'daily') {
    next.setDate(next.getDate() + 1)
  } else if (template.frequency === 'weekly') {
    next.setDate(next.getDate() + 7)
  } else if (template.frequency === 'monthly') {
    next.setMonth(next.getMonth() + 1)
  } else {
    next.setDate(next.getDate() + (template.customDays || 14))
  }

  return isoDate(next)
}

function deriveEnabledTemplates(profile) {
  return templateLibrary.filter((template) => {
    if (template.petsOnly && !profile.hasPets) {
      return false
    }

    if (template.houseOnly && profile.homeType !== 'House') {
      return false
    }

    return true
  })
}

function assignMember(index, members) {
  return members[index % members.length]
}

function defaultTemplateTitles(profile) {
  return deriveEnabledTemplates(profile).map((template) => template.title)
}

function buildTaskFromTemplate(template, profile, index) {
  const members = membersBySize[profile.householdSize]
  const offsets = {
    daily: 0,
    weekly: 2,
    monthly: 5,
    custom: 1,
  }

  return {
    id: `task-${index + 1}`,
    templateTitle: template.title,
    title: template.title,
    category: template.category,
    frequency: template.frequency,
    customDays: template.customDays || null,
    assignedTo: assignMember(index, members),
    dueDate: daysFromNow(offsets[template.frequency] ?? 3),
    duration: template.duration,
    difficulty: template.difficulty,
    room: template.room,
    subtasks: template.subtasks.map((label, subtaskIndex) => ({
      id: `${index + 1}-${subtaskIndex + 1}`,
      label,
      done: false,
    })),
    status: 'open',
    history: [],
  }
}

function sortTasks(tasks) {
  return [...tasks].sort((left, right) => {
    const categoryDelta =
      categoryOrder.indexOf(left.category) - categoryOrder.indexOf(right.category)

    if (categoryDelta !== 0) {
      return categoryDelta
    }

    return left.title.localeCompare(right.title)
  })
}

function buildTasks(profile, selectedTemplates = defaultTemplateTitles(profile)) {
  return selectedTemplates
    .map((title, index) => {
      const template = templateLibrary.find((item) => item.title === title)
      return template ? buildTaskFromTemplate(template, profile, index) : null
    })
    .filter(Boolean)
}

function syncTasksWithTemplates(profile, selectedTemplates, existingTasks) {
  const allowedMembers = membersBySize[profile.householdSize]
  const selectedSet = new Set(selectedTemplates)
  const existingByTemplate = new Map(
    existingTasks
      .filter((task) => selectedSet.has(task.templateTitle))
      .map((task) => [
        task.templateTitle,
        allowedMembers.includes(task.assignedTo)
          ? task
          : {
              ...task,
              assignedTo: allowedMembers[0],
            },
      ]),
  )

  const syncedTasks = selectedTemplates
    .map((title, index) => {
      if (existingByTemplate.has(title)) {
        return existingByTemplate.get(title)
      }

      const template = templateLibrary.find((item) => item.title === title)
      return template ? buildTaskFromTemplate(template, profile, index + existingTasks.length) : null
    })
    .filter(Boolean)

  return sortTasks(syncedTasks)
}

function normalizeState(rawState) {
  const base = buildInitialState()
  const onboarding = rawState.onboarding || base.onboarding
  const selectedTemplates =
    rawState.selectedTemplates ||
    rawState.tasks?.map((task) => task.templateTitle || task.title) ||
    defaultTemplateTitles(onboarding)

  return {
    ...base,
    ...rawState,
    onboarding,
    household: rawState.household || {
      name: onboarding.householdName,
      members: membersBySize[onboarding.householdSize],
    },
    selectedTemplates,
    tasks: syncTasksWithTemplates(onboarding, selectedTemplates, rawState.tasks || base.tasks),
  }
}

function buildInitialState() {
  const onboarding = {
    householdName: 'The Marlowe Home',
    householdSize: 2,
    homeType: 'Apartment',
    hasPets: true,
    completed: true,
  }

  return {
    onboarding,
    household: {
      name: onboarding.householdName,
      members: membersBySize[onboarding.householdSize],
    },
    selectedTemplates: defaultTemplateTitles(onboarding),
    tasks: buildTasks(onboarding),
    inventory: starterInventory,
    shoppingList: starterShopping,
    reminders: {
      dueSoon: true,
      overdue: true,
    },
  }
}

function hydrateState() {
  const fallback = buildInitialState()
  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return fallback
  }

  try {
    return normalizeState(JSON.parse(stored))
  } catch {
    return fallback
  }
}

function taskStatus(task) {
  if (task.status === 'done') {
    return 'done'
  }

  return task.dueDate < daysFromNow(0) ? 'overdue' : task.status
}

function completionRate(tasks) {
  const completed = tasks.reduce((count, task) => count + task.history.filter((item) => item.action === 'completed').length, 0)
  const total = completed + tasks.filter((task) => task.status !== 'open').length

  if (!total) {
    return 0
  }

  return Math.round((completed / total) * 100)
}

function App() {
  const [state, setState] = useState(() => hydrateState())
  const [activeTab, setActiveTab] = useState('Tasks')
  const [taskFilter, setTaskFilter] = useState('all')
  const [inventoryDraft, setInventoryDraft] = useState({ name: '', quantity: '' })
  const [shoppingDraft, setShoppingDraft] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const visibleTasks = useMemo(() => {
    return state.tasks.filter((task) => {
      if (taskFilter === 'mine') {
        return task.assignedTo === state.household.members[0]
      }

      if (taskFilter === 'overdue') {
        return taskStatus(task) === 'overdue'
      }

      return true
    })
  }, [state.household.members, state.tasks, taskFilter])

  const weekDays = useMemo(() => {
    const base = startOfToday()

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base)
      date.setDate(base.getDate() + index)

      return {
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
        date: isoDate(date),
      }
    })
  }, [])

  const categoryCounts = useMemo(() => {
    return state.tasks.reduce((accumulator, task) => {
      accumulator[task.category] = (accumulator[task.category] || 0) + 1
      return accumulator
    }, {})
  }, [state.tasks])

  const householdLoad = useMemo(() => {
    return state.household.members.map((member) => ({
      member,
      count: state.tasks.filter((task) => task.assignedTo === member && task.status === 'open').length,
    }))
  }, [state.household.members, state.tasks])

  const availableTemplates = useMemo(
    () => deriveEnabledTemplates(state.onboarding),
    [state.onboarding],
  )

  const templatesByCategory = useMemo(() => {
    return categoryOrder.map((category) => ({
      category,
      items: availableTemplates.filter((template) => template.category === category),
    }))
  }, [availableTemplates])

  const launchHousehold = () => {
    const household = {
      name: state.onboarding.householdName,
      members: membersBySize[state.onboarding.householdSize],
    }

    setState((current) => ({
      ...current,
      onboarding: {
        ...current.onboarding,
        completed: true,
      },
      household,
      selectedTemplates: defaultTemplateTitles(current.onboarding),
      tasks: buildTasks(current.onboarding),
    }))
  }

  const updateTask = (taskId, updater) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? updater(task) : task)),
    }))
  }

  const completeTask = (taskId) => {
    updateTask(taskId, (task) => {
      const completedAt = new Date()
      return {
        ...task,
        dueDate: advanceDate(completedAt, task),
        status: 'open',
        subtasks: task.subtasks.map((subtask) => ({ ...subtask, done: false })),
        history: [
          { action: 'completed', date: completedAt.toISOString() },
          ...task.history,
        ].slice(0, 4),
      }
    })
  }

  const skipTask = (taskId) => {
    updateTask(taskId, (task) => ({
      ...task,
      dueDate: advanceDate(new Date(task.dueDate), task),
      history: [{ action: 'skipped', date: new Date().toISOString() }, ...task.history].slice(0, 4),
    }))
  }

  const snoozeTask = (taskId) => {
    updateTask(taskId, (task) => {
      const next = new Date(task.dueDate)
      next.setDate(next.getDate() + 1)

      return {
        ...task,
        dueDate: isoDate(next),
        history: [{ action: 'snoozed', date: new Date().toISOString() }, ...task.history].slice(0, 4),
      }
    })
  }

  const toggleSubtask = (taskId, subtaskId) => {
    updateTask(taskId, (task) => ({
      ...task,
      subtasks: task.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask,
      ),
    }))
  }

  const assignTask = (taskId, member) => {
    updateTask(taskId, (task) => ({ ...task, assignedTo: member }))
  }

  const toggleScheduledTemplate = (templateTitle) => {
    setState((current) => {
      const isSelected = current.selectedTemplates.includes(templateTitle)
      const selectedTemplates = isSelected
        ? current.selectedTemplates.filter((title) => title !== templateTitle)
        : [...current.selectedTemplates, templateTitle]

      return {
        ...current,
        selectedTemplates,
        tasks: syncTasksWithTemplates(current.onboarding, selectedTemplates, current.tasks),
      }
    })
  }

  const restoreDefaultSchedule = () => {
    setState((current) => {
      const selectedTemplates = defaultTemplateTitles(current.onboarding)

      return {
        ...current,
        selectedTemplates,
        tasks: syncTasksWithTemplates(current.onboarding, selectedTemplates, current.tasks),
      }
    })
  }

  const addInventoryItem = (event) => {
    event.preventDefault()

    if (!inventoryDraft.name.trim() || !inventoryDraft.quantity.trim()) {
      return
    }

    setState((current) => ({
      ...current,
      inventory: [
        ...current.inventory,
        {
          id: `inv-${Date.now()}`,
          name: inventoryDraft.name.trim(),
          quantity: inventoryDraft.quantity.trim(),
          low: false,
        },
      ],
    }))

    setInventoryDraft({ name: '', quantity: '' })
  }

  const toggleLow = (itemId) => {
    setState((current) => ({
      ...current,
      inventory: current.inventory.map((item) =>
        item.id === itemId ? { ...item, low: !item.low } : item,
      ),
    }))
  }

  const addShoppingItem = (event) => {
    event.preventDefault()

    if (!shoppingDraft.trim()) {
      return
    }

    setState((current) => ({
      ...current,
      shoppingList: [
        ...current.shoppingList,
        {
          id: `shop-${Date.now()}`,
          name: shoppingDraft.trim(),
          checked: false,
        },
      ],
    }))

    setShoppingDraft('')
  }

  const toggleShoppingItem = (itemId) => {
    setState((current) => ({
      ...current,
      shoppingList: current.shoppingList.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    }))
  }

  const removeShoppingItem = (itemId) => {
    setState((current) => ({
      ...current,
      shoppingList: current.shoppingList.filter((item) => item.id !== itemId),
    }))
  }

  const updateOnboarding = (field, value) => {
    setState((current) => ({
      ...current,
      onboarding: {
        ...current.onboarding,
        [field]: value,
      },
    }))
  }

  const resetDemo = () => {
    setState(buildInitialState())
    setActiveTab('Tasks')
    setTaskFilter('all')
  }

  const totalOpen = state.tasks.filter((task) => task.status === 'open').length
  const overdueCount = state.tasks.filter((task) => taskStatus(task) === 'overdue').length
  const lowStockCount = state.inventory.filter((item) => item.low).length

  if (!state.onboarding.completed) {
    const previewTemplates = deriveEnabledTemplates(state.onboarding)

    return (
      <div className="app-shell onboarding-shell">
        <section className="hero-panel">
          <div className="hero-brand">
            <img className="hero-logo" src="/brand/logo-stacked.png" alt="DwellTend" />
            <img className="hero-icon" src="/brand/app-icon-sage.png" alt="" aria-hidden="true" />
          </div>
          <h1>Shared home care without the mental pileup.</h1>
          <p className="hero-copy">
            Start with a ready-made system for cleaning, maintenance, and supplies.
            The schedule is preloaded with detailed tasks so your home never starts from a blank slate.
          </p>
          <div className="hero-metrics">
            <article>
              <strong>{previewTemplates.length}</strong>
              <span>ready-to-run templates</span>
            </article>
            <article>
              <strong>5</strong>
              <span>core MVP categories</span>
            </article>
            <article>
              <strong>1 tap</strong>
              <span>to launch your household</span>
            </article>
          </div>
        </section>

        <section className="panel onboarding-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">Simple onboarding</span>
              <h2>Shape the default plan</h2>
            </div>
            <p>We only ask what changes the starter schedule.</p>
          </div>

          <div className="form-grid">
            <label>
              Household name
              <input
                value={state.onboarding.householdName}
                onChange={(event) => updateOnboarding('householdName', event.target.value)}
              />
            </label>

            <label>
              Household size
              <select
                value={state.onboarding.householdSize}
                onChange={(event) => updateOnboarding('householdSize', Number(event.target.value))}
              >
                {[1, 2, 3, 4, 5].map((size) => (
                  <option key={size} value={size}>
                    {size} member{size > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Home type
              <select
                value={state.onboarding.homeType}
                onChange={(event) => updateOnboarding('homeType', event.target.value)}
              >
                <option>Apartment</option>
                <option>House</option>
              </select>
            </label>

            <label>
              Pets
              <select
                value={state.onboarding.hasPets ? 'yes' : 'no'}
                onChange={(event) => updateOnboarding('hasPets', event.target.value === 'yes')}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>

          <div className="template-preview">
            <div className="panel-header compact">
              <div>
                <span className="section-label">Starter schedule</span>
                <h3>Included immediately</h3>
              </div>
            </div>

            <div className="template-chips">
              {previewTemplates.slice(0, 10).map((template) => (
                <span key={template.title} className="chip">
                  {template.title}
                </span>
              ))}
            </div>
          </div>

          <button className="primary-button" type="button" onClick={launchHousehold}>
            Launch DwellTend MVP
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand-block">
          <img className="brand-logo" src="/brand/logo-stacked.png" alt="DwellTend" />
          <div className="household-badge">
            <span className="eyebrow">Current household</span>
            <h1>{state.household.name}</h1>
          </div>
          <p className="muted">
            A warm minimal household system for cleaning, maintenance, and shared accountability.
          </p>
        </div>

        <div className="summary-stack">
          <article className="stat-card">
            <span>Open tasks</span>
            <strong>{totalOpen}</strong>
          </article>
          <article className="stat-card">
            <span>Overdue</span>
            <strong>{overdueCount}</strong>
          </article>
          <article className="stat-card">
            <span>Low stock</span>
            <strong>{lowStockCount}</strong>
          </article>
        </div>

        <nav className="tab-list" aria-label="Primary navigation">
          {['Tasks', 'Scheduler', 'Calendar', 'Inventory', 'Settings'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={tab === activeTab ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className="panel">
          <div className="panel-header compact">
            <div>
              <span className="section-label">Household</span>
              <h3>Current load</h3>
            </div>
          </div>

          <div className="member-list">
            {householdLoad.map((member) => (
              <div key={member.member} className="member-row">
                <span>{member.member}</span>
                <strong>{member.count} open</strong>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <main className="content">
        <section className="top-strip panel">
          <div className="panel-header">
            <div className="dashboard-heading">
              <img className="dashboard-icon" src="/brand/app-icon-light.png" alt="" aria-hidden="true" />
              <div className="dashboard-title-block">
                <img className="dashboard-logo" src="/brand/logo-horizontal.png" alt="DwellTend" />
                <span className="section-label">MVP dashboard</span>
                <h2>Preloaded home care, ready on day one</h2>
              </div>
            </div>
            <p>
              Today: {formatLongDate(new Date())}. Completion rate: {completionRate(state.tasks)}%.
            </p>
          </div>

          <div className="category-grid">
            {Object.entries(categoryMeta).map(([category, meta]) => (
              <article key={category} className="category-card">
                <div className="category-header">
                  <h3>{category}</h3>
                  <span>{categoryCounts[category] || 0}</span>
                </div>
                <p>{meta.description}</p>
                <small>{meta.tone}</small>
              </article>
            ))}
          </div>
        </section>

        {activeTab === 'Tasks' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="section-label">Tasks</span>
                <h2>Daily, weekly, monthly, and maintenance work</h2>
              </div>
              <div className="tasks-toolbar">
                <div className="segmented-control">
                  {[
                    { key: 'all', label: 'All tasks' },
                    { key: 'mine', label: 'Assigned to me' },
                    { key: 'overdue', label: 'Overdue' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      className={taskFilter === filter.key ? 'segment active' : 'segment'}
                      onClick={() => setTaskFilter(filter.key)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setActiveTab('Scheduler')}
                >
                  Open scheduler
                </button>
              </div>
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => (
                <article key={task.id} className="task-card">
                  <div className="task-main">
                    <div>
                      <div className="task-meta">
                        <span>{task.category}</span>
                        <span>{task.room}</span>
                        <span>{task.duration} min</span>
                      </div>
                      <h3>{task.title}</h3>
                      <p>
                        Due {formatDate(task.dueDate)}. {task.difficulty} effort.
                      </p>
                    </div>

                    <div className="task-status-group">
                      <span className={`status-pill ${taskStatus(task)}`}>{taskStatus(task)}</span>
                      <select
                        value={task.assignedTo}
                        onChange={(event) => assignTask(task.id, event.target.value)}
                      >
                        {state.household.members.map((member) => (
                          <option key={member}>{member}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="subtask-list">
                    {task.subtasks.map((subtask) => (
                      <label key={subtask.id} className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={subtask.done}
                          onChange={() => toggleSubtask(task.id, subtask.id)}
                        />
                        <span>{subtask.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="task-actions">
                    <button type="button" className="primary-button" onClick={() => completeTask(task.id)}>
                      Complete
                    </button>
                    <button type="button" className="secondary-button" onClick={() => snoozeTask(task.id)}>
                      Snooze 1 day
                    </button>
                    <button type="button" className="secondary-button" onClick={() => skipTask(task.id)}>
                      Skip cycle
                    </button>
                  </div>

                  {task.history.length > 0 && (
                    <div className="history-row">
                      {task.history.map((entry) => (
                        <span key={`${task.id}-${entry.date}`}>
                          {entry.action} {formatDate(entry.date)}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Scheduler' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="section-label">Scheduler</span>
                <h2>Choose which recurring tasks stay in the plan</h2>
              </div>
              <div className="tasks-toolbar">
                <p>{state.selectedTemplates.length} templates currently scheduled.</p>
                <button type="button" className="secondary-button" onClick={restoreDefaultSchedule}>
                  Restore defaults
                </button>
              </div>
            </div>

            <div className="scheduler-intro">
              <div className="scheduler-summary-card">
                <strong>How it works</strong>
                <p>
                  Turn templates on to add them to your live task list. Turn them off to remove
                  them from Tasks and Calendar.
                </p>
              </div>
              <div className="scheduler-summary-card">
                <strong>Household fit</strong>
                <p>
                  The scheduler is already filtered for your {state.onboarding.homeType.toLowerCase()}
                  {state.onboarding.hasPets ? ' with pets.' : '.'}
                </p>
              </div>
            </div>

            <div className="scheduler-grid">
              {templatesByCategory.map(({ category, items }) => (
                <section key={category} className="scheduler-category">
                  <div className="scheduler-category-header">
                    <div>
                      <span className="section-label">{category}</span>
                      <h3>{items.length} templates available</h3>
                    </div>
                    <strong>
                      {
                        items.filter((template) => state.selectedTemplates.includes(template.title))
                          .length
                      }{' '}
                      active
                    </strong>
                  </div>

                  <div className="scheduler-template-list">
                    {items.map((template) => {
                      const isActive = state.selectedTemplates.includes(template.title)

                      return (
                        <article
                          key={template.title}
                          className={isActive ? 'scheduler-card active' : 'scheduler-card'}
                        >
                          <div className="scheduler-card-top">
                            <div>
                              <h3>{template.title}</h3>
                              <p>
                                {template.room} · {template.duration} min · {template.difficulty}
                              </p>
                            </div>
                            <button
                              type="button"
                              className={isActive ? 'primary-button' : 'secondary-button'}
                              onClick={() => toggleScheduledTemplate(template.title)}
                            >
                              {isActive ? 'Remove from plan' : 'Add to plan'}
                            </button>
                          </div>

                          <div className="task-meta">
                            <span>{template.category}</span>
                            <span>
                              {template.frequency === 'custom'
                                ? `Every ${template.customDays} days`
                                : template.frequency}
                            </span>
                          </div>

                          <div className="subtask-list">
                            {template.subtasks.map((subtask) => (
                              <div key={`${template.title}-${subtask}`} className="scheduler-subtask">
                                {subtask}
                              </div>
                            ))}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Calendar' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="section-label">Calendar</span>
                <h2>Week view with due tasks</h2>
              </div>
              <p>Recurring work resurfaces automatically when a cycle is completed.</p>
            </div>

            <div className="week-grid">
              {weekDays.map((day) => (
                <article key={day.date} className="day-card">
                  <header>
                    <span>{day.label}</span>
                    <strong>{formatDate(day.date)}</strong>
                  </header>

                  <div className="day-tasks">
                    {state.tasks
                      .filter((task) => task.dueDate === day.date)
                      .map((task) => (
                        <div key={task.id} className="day-task">
                          <span>{task.title}</span>
                          <small>{task.assignedTo}</small>
                        </div>
                      ))}
                    {state.tasks.every((task) => task.dueDate !== day.date) && (
                      <p className="empty-copy">No tasks due.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Inventory' && (
          <section className="inventory-layout">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="section-label">Inventory</span>
                  <h2>Shared household supplies</h2>
                </div>
                <p>Manual tracking for MVP, with low-stock visibility built in.</p>
              </div>

              <form className="inline-form" onSubmit={addInventoryItem}>
                <input
                  placeholder="Item name"
                  value={inventoryDraft.name}
                  onChange={(event) => setInventoryDraft((current) => ({ ...current, name: event.target.value }))}
                />
                <input
                  placeholder="Quantity"
                  value={inventoryDraft.quantity}
                  onChange={(event) =>
                    setInventoryDraft((current) => ({ ...current, quantity: event.target.value }))
                  }
                />
                <button className="primary-button" type="submit">
                  Add item
                </button>
              </form>

              <div className="inventory-list">
                {state.inventory.map((item) => (
                  <article key={item.id} className="inventory-card">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.quantity}</p>
                    </div>
                    <button
                      type="button"
                      className={item.low ? 'secondary-button warning' : 'secondary-button'}
                      onClick={() => toggleLow(item.id)}
                    >
                      {item.low ? 'Marked low' : 'Mark low'}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="section-label">Shopping list</span>
                  <h2>Shared refill list</h2>
                </div>
                <p>Manual add and check-off behavior, matching the MVP scope.</p>
              </div>

              <form className="inline-form" onSubmit={addShoppingItem}>
                <input
                  placeholder="Add list item"
                  value={shoppingDraft}
                  onChange={(event) => setShoppingDraft(event.target.value)}
                />
                <button className="primary-button" type="submit">
                  Add
                </button>
              </form>

              <div className="shopping-list">
                {state.shoppingList.map((item) => (
                  <label key={item.id} className="shopping-row">
                    <div>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleShoppingItem(item.id)}
                      />
                      <span className={item.checked ? 'checked' : ''}>{item.name}</span>
                    </div>
                    <button type="button" className="text-button" onClick={() => removeShoppingItem(item.id)}>
                      Remove
                    </button>
                  </label>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeTab === 'Settings' && (
          <section className="settings-layout">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="section-label">Settings</span>
                  <h2>Household preferences</h2>
                </div>
                <p>Minimal controls, no roles complexity, and reminders separated cleanly from tasks.</p>
              </div>

              <div className="settings-group">
                <div className="member-list">
                  {state.household.members.map((member) => (
                    <div key={member} className="member-row">
                      <span>{member}</span>
                      <strong>Member</strong>
                    </div>
                  ))}
                </div>

                <label className="toggle-row">
                  <span>Due today reminders</span>
                  <input
                    type="checkbox"
                    checked={state.reminders.dueSoon}
                    onChange={() =>
                      setState((current) => ({
                        ...current,
                        reminders: {
                          ...current.reminders,
                          dueSoon: !current.reminders.dueSoon,
                        },
                      }))
                    }
                  />
                </label>

                <label className="toggle-row">
                  <span>Overdue reminders</span>
                  <input
                    type="checkbox"
                    checked={state.reminders.overdue}
                    onChange={() =>
                      setState((current) => ({
                        ...current,
                        reminders: {
                          ...current.reminders,
                          overdue: !current.reminders.overdue,
                        },
                      }))
                    }
                  />
                </label>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="section-label">Demo controls</span>
                  <h2>Reset the seeded household</h2>
                </div>
                <p>Useful while iterating on the onboarding and starter task experience.</p>
              </div>

              <button type="button" className="secondary-button" onClick={resetDemo}>
                Reset demo
              </button>
            </section>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
