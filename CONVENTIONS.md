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

- Use lowercase and snake_case for files and folders to ensure cross-platform compatibility.

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
- **Naming Conventions**:
    - Variables/functions: `camelCase` in JS/TS, `snake_case` in Python.
    - Types/Classes/Modules: `PascalCase` in all languages.

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
