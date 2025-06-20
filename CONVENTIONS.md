### Git Workflow

- **Branching**:
  - Do not commit directly to `main`.
  - Use `feature/<name>` for new features.
  - Use `fix/<description>` for bug fixes.
- **Synchronization**:
  - Regularly pull from `main` to minimize merge conflicts.
- **Commits**:
  - Commit only after completing logical units.
  - Use clear, descriptive commit messages.
- **Code Reviews**:
  - Push branches and request reviews before merging.

---

### Project Structure

```text
binthere-donethat/
├── .github/                # CI/CD workflows, issue & PR templates
├── docs/                   # Documentation
├── frontend/               # React application
├── backend/                # Node.js server
├── yolo/                   # YOLO module
├── game/                   # Unity project
├── scripts/                # Utility scripts
├── .gitignore
├── README.md
└── package.json            # Monorepo tooling
```

#### **File and Folder Naming**:

- **Code Files**: Follow language-specific conventions:
  - **React Components**: Use PascalCase (e.g., `HomePage.jsx`, `AuthModal.jsx`)
  - **JavaScript/Node.js modules**: Use camelCase (e.g., `authController.js`, `userService.js`)
  - **Python files**: Use snake_case (e.g., `main.py`, `utils.py`)
- **Asset Files**: Use lowercase with snake_case for cross-platform compatibility:
  - Images: `logo.png`, `hero_image.jpg`, `user_avatar.svg`
  - Static files: `style.css`, `config.json`
- **Folders**: Use lowercase with snake_case or kebab-case:
  - `components/`, `services/`, `utils/`
  - For multi-word folders: `user-profiles/` or `user_profiles/`

---

### General Code Standards

- **DRY & Modularity**:
  - Encapsulate repeated logic into functions, classes, or components.
- **Documentation & Comments**:
  - Document public APIs with docstrings/JSDoc.
  - Comment non-obvious logic.
- **Automated Formatting**:
  - JavaScript/TypeScript: Prettier + ESLint.
  - Python: Black + Flake8.
  - Unity C#: Use consistent formatting tools.
- **Code Naming Conventions**:
  - **JavaScript/TypeScript Variables & Functions**: `camelCase` (e.g., `getUserData`, `isLoggedIn`)
  - **JavaScript/TypeScript Classes & Components**: `PascalCase` (e.g., `UserService`, `HomePage`)
  - **JavaScript/TypeScript Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRIES`)
  - **Python Variables & Functions**: `snake_case` (e.g., `get_user_data`, `is_logged_in`)
  - **Python Classes**: `PascalCase` (e.g., `UserService`, `DataProcessor`)
  - **Python Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRIES`)

---

### React Frontend (`frontend/`)

```text
frontend/
└── src/
    ├── assets/           # Images, fonts, global styles
    ├── components/       # Reusable UI components
    ├── pages/            # Route-level components
    ├── hooks/            # Custom React hooks
    ├── contexts/         # React Context providers
    ├── services/         # API clients & business logic
    ├── utils/            # Helpers & constants
    ├── App.js
    └── index.js
```

- **File Naming**:
  - **React Components**: Use PascalCase for component files (e.g., `HomePage.jsx`, `AuthModal.jsx`, `UserMenu.jsx`)
  - **Hooks**: Use camelCase starting with 'use' (e.g., `useAuth.js`, `useLocalStorage.js`)
  - **Utilities**: Use camelCase (e.g., `apiClient.js`, `formatDate.js`)
  - **Services**: Use camelCase (e.g., `authService.js`, `apiService.js`)
- **Feature Grouping:**
  - Collocate related files to improve discoverability.
- **Testing**:
  - Use Jest + React Testing Library.
  - Place tests alongside code.

---

### Node.js Backend (`backend/`)

```text
backend/
└── src/
    ├── controllers/      # Express route handlers
    ├── services/         # Business logic
    ├── models/           # DB schemas
    ├── routes/           # Express routers
    ├── middlewares/      # Auth, error handling
    ├── utils/            # Utility functions
    ├── config/           # Environment & app settings
    ├── app.js            # Express app setup
    └── server.js         # Server entry point
```

- **File Naming**:
  - **Controllers**: Use camelCase (e.g., `authController.js`, `userController.js`)
  - **Services**: Use camelCase (e.g., `userService.js`, `emailService.js`)
  - **Models**: Use PascalCase (e.g., `User.js`, `Product.js`)
  - **Routes**: Use camelCase (e.g., `auth.js`, `users.js`)
  - **Middleware**: Use camelCase (e.g., `authMiddleware.js`, `errorHandler.js`)
  - **Utilities**: Use camelCase (e.g., `logger.js`, `validator.js`)
- **Separation of Concerns**:
  - Controllers invoke services; services handle domain logic.
- **Environment Variables**:
  - Store secrets in `.env`, load via `dotenv`.
  - Never commit credentials.
- **API Documentation**:
  - Use OpenAPI/SwaggerUi for endpoint specs.

---

### YOLO Module (`yolo/`)

```text
yolo/
├── requirements.txt        # Python dependencies
├── data/                   # Datasets: train/, val/, test/
├── models/                 # Model definitions
├── configs/                # YAML/JSON config files
├── train.py                # Training script
├── detect.py               # Inference script
├── utils.py                # Utility functions
├── tests/                  # Unit tests
└── README.md               # Module overview
```

- **Dependencies**:
  - Isolate using `venv` or `conda`.
- **Configuration**:
  - Centralize hyperparameters in config files loaded by `train.py`.
- **Testing**:
  - Use pytest for unit and integration tests.

---

### Unity Project (`game/`)

```text
game/
├── Assets/
│   ├── Art/
│   ├── Audio/
│   ├── Prefabs/
│   ├── Scenes/
│   └── Scripts/
├── ProjectSettings/
└── Packages/
```

- **Organization**:
  - Organize assets by type or feature as needed.
- **Naming**:
  - Use PascalCase for folders and assets under `Assets/`.
- **Version Control**:
  - Include only `Assets/`, `ProjectSettings/`, and `.meta` files.
  - Exclude `Library/`, `Temp/`.
