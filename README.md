# Todo App

A beautiful, modern todo application built with Python Flask and vanilla JavaScript.

## Features

- ✅ Create, edit, and delete tasks
- 📅 Optional due dates with overdue highlighting
- 🎯 Priority levels: Normal, Important, Urgent
- ✏️ Task descriptions
- ☑️ Mark tasks as completed
- 📱 Responsive design that works on all devices
- 💾 Local JSON file storage (no database needed)

## Installation

1. Create a virtual environment (recommended):
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
   - On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```
   - On Windows:
   ```bash
   venv\Scripts\activate
   ```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Make sure your virtual environment is activated (you should see `(venv)` in your terminal prompt)

2. Start the Flask server:
```bash
python app.py
```

3. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

**Note:** To deactivate the virtual environment when you're done, simply run:
```bash
deactivate
```

2. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## Usage

- Click "Add New Task" to create a new task
- Fill in the title (required), description (optional), due date (optional), and priority
- Click on a task's "Edit" button to modify it
- Check the checkbox to mark a task as completed
- Click "Delete" to remove a task
- Tasks are automatically sorted by completion status, priority, and due date

## Data Storage

Tasks are stored in `tasks.json` in the project root directory. This file is automatically created when you add your first task.

## Linting

This project uses linters to maintain code quality:

### Python Linting (flake8)

Run the Python linter:
```bash
python lint.py
```

Or run flake8 directly:
```bash
flake8 app.py
```

### JavaScript & CSS Linting (Optional)

To use JavaScript (ESLint) and CSS (stylelint) linters, you'll need Node.js installed:

1. Install Node.js from [nodejs.org](https://nodejs.org/)

2. Install npm dependencies:
```bash
npm install
```

3. Run the linters:
```bash
# Lint JavaScript only
npm run lint:js

# Lint CSS only
npm run lint:css

# Lint both JavaScript and CSS
npm run lint
```

## Requirements

- Python 3.7+
- Flask 3.0.0
- Modern web browser
- Node.js (optional, for JavaScript/CSS linting)

