# Deployment Files Reference

Quick reference for all deployment-related files in the project.

## 📋 Quick Access

| File | Purpose | When to Use |
|------|---------|-------------|
| `RENDER_QUICKSTART.md` | 5-minute deployment guide | **Start here for deployment** |
| `DEPLOYMENT.md` | Comprehensive guide | Deep dive into architecture |
| `DEPLOYMENT_SUMMARY.md` | All changes explained | Understand what was changed |
| `DEPLOYMENT_FILES.md` | This file | Quick file reference |

## 📁 File Tree

```
rcu_app/
│
├── 🚀 Deployment Configuration
│   ├── render.yaml                        # Render blueprint (MAIN CONFIG)
│   ├── build.sh                           # Backend build script
│   ├── config.py                          # Backend configuration
│   ├── .env.example                       # Environment template
│   └── .gitignore                         # Git ignore rules
│
├── 📚 Documentation
│   ├── RENDER_QUICKSTART.md               # Quick start (READ THIS FIRST)
│   ├── DEPLOYMENT.md                      # Full deployment guide
│   ├── DEPLOYMENT_SUMMARY.md              # Changes summary
│   ├── DEPLOYMENT_FILES.md                # This file
│   └── README                             # Updated with deployment info
│
├── 🐍 Backend (Modified)
│   ├── main.py                            # ✏️ Updated: CORS, health check
│   ├── models.py                          # ✏️ Updated: PostgreSQL support
│   └── requirements.txt                   # ✏️ Updated: Added psycopg2
│
├── ⚛️ Frontend (Modified)
│   └── my-react-app/
│       ├── render-build.sh                # Frontend build script
│       ├── .gitignore                     # ✏️ Updated: Added .env
│       └── src/
│           ├── config.ts                  # API configuration
│           └── services/
│               ├── authService.ts         # ✏️ Updated: Use config
│               ├── foodService.ts         # ✏️ Updated: Use config
│               └── adminService.ts        # ✏️ Updated: Use config
│
└── 🗄️ Database
    ├── *.db (local, gitignored)
    └── PostgreSQL (Render-managed)
```

## 📄 File Descriptions

### Core Deployment Files

#### `render.yaml` ⭐ MOST IMPORTANT
```yaml
Purpose: Defines all services and their configuration
Location: Root directory
Used by: Render.com platform
Contains:
  - Backend API service definition
  - Frontend static site definition
  - PostgreSQL database definition
  - Environment variables
  - Service connections
```

#### `config.py`
```python
Purpose: Backend configuration management
Location: Root directory
Used by: main.py, routers
Features:
  - Environment detection
  - Dynamic CORS origins
  - Database URL handling
  - JWT settings
```

#### `build.sh`
```bash
Purpose: Backend build script
Location: Root directory
Executable: Yes (chmod +x)
Actions:
  - Install Python dependencies
  - (Optional) Run migrations
```

#### `frontend/my-react-app/render-build.sh`
```bash
Purpose: Frontend build script
Location: frontend/my-react-app/
Executable: Yes (chmod +x)
Actions:
  - Install npm dependencies
  - Create .env.production
  - Build React app
```

#### `frontend/my-react-app/src/config.ts`
```typescript
Purpose: Frontend configuration
Location: frontend/my-react-app/src/
Exports:
  - apiUrl (from VITE_API_URL)
```

### Documentation Files

#### `RENDER_QUICKSTART.md` ⭐ START HERE
- **Audience**: Developers deploying for the first time
- **Content**: Step-by-step deployment instructions
- **Time**: 5 minutes to deploy

#### `DEPLOYMENT.md`
- **Audience**: Developers wanting detailed information
- **Content**: Architecture, troubleshooting, scaling
- **Time**: 15 minutes to read

#### `DEPLOYMENT_SUMMARY.md`
- **Audience**: Developers reviewing changes
- **Content**: All modifications and rationale
- **Time**: 10 minutes to review

#### `.env.example`
- **Audience**: Developers setting up locally
- **Content**: All environment variables with descriptions
- **Time**: 2 minutes to configure

## 🔄 Modified Files Summary

### Backend Changes

**`main.py`**
```python
# What changed:
+ from config import settings
+ app = FastAPI(title="RCU App API", ...)
+ allow_origins=settings.allowed_origins  # Was hardcoded
+ @app.get("/")                           # New endpoint
+ @app.get("/health")                     # New endpoint
```

**`models.py`**
```python
# What changed:
+ import os
+ DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
+ if DATABASE_URL.startswith("postgres://"):
+     DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
+ engine_kwargs = {...} if DATABASE_URL.startswith("sqlite") else {}
+ engine = create_engine(DATABASE_URL, **engine_kwargs)
```

**`requirements.txt`**
```txt
# What changed:
+ psycopg2-binary==2.9.9  # For PostgreSQL
```

### Frontend Changes

**`src/config.ts`** (NEW)
```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
};
```

**`src/services/*.ts`**
```typescript
// What changed in all service files:
+ import { config } from '../config';
- const API_BASE_URL = 'http://localhost:8000';
+ const API_BASE_URL = config.apiUrl;
```

## 🎯 Usage Scenarios

### Scenario 1: First Time Deployment
```
1. Read: RENDER_QUICKSTART.md
2. Push code to GitHub
3. Connect to Render
4. Apply blueprint
5. Done! ✅
```

### Scenario 2: Understanding Architecture
```
1. Read: DEPLOYMENT.md
2. Review: render.yaml
3. Check: DEPLOYMENT_SUMMARY.md
4. Understand the full system
```

### Scenario 3: Local Development
```
1. Copy: .env.example → .env
2. Edit environment variables
3. Run: uvicorn main:app --reload
4. Run: cd frontend/my-react-app && npm run dev
```

### Scenario 4: Troubleshooting
```
1. Check: DEPLOYMENT.md → Troubleshooting section
2. Review: Render dashboard logs
3. Verify: Environment variables
4. Test: Health endpoints
```

### Scenario 5: Modifying Configuration
```
1. Edit: render.yaml
2. Commit and push
3. Render auto-deploys changes
4. Verify in Render dashboard
```

## 🔑 Key Environment Variables

### Backend (Set by Render automatically)
```bash
DATABASE_URL                  # From PostgreSQL service
SECRET_KEY                    # Auto-generated
FRONTEND_URL                  # From frontend service
ENVIRONMENT=production        # Static
```

### Frontend (Set by Render automatically)
```bash
VITE_API_URL                  # From backend service
```

### Local Development (Set manually in .env)
```bash
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-local-secret
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] All files present and committed
- [ ] Build scripts are executable
- [ ] Environment variables configured
- [ ] No sensitive data in code
- [ ] .gitignore updated
- [ ] Documentation complete

## 🚨 Important Notes

1. **Never commit .env files** - Use .env.example instead
2. **Never commit *.db files** - Already gitignored
3. **Always test locally first** - Before deploying
4. **Check Render logs** - For deployment issues
5. **Use health endpoint** - To verify backend

## 📞 Support Resources

| Resource | Link/Location |
|----------|---------------|
| Render Docs | https://render.com/docs |
| FastAPI Docs | https://fastapi.tiangolo.com |
| React Docs | https://react.dev |
| Project Issues | GitHub repository issues |

## 🎓 Learning Path

1. **Beginner**: Start with `RENDER_QUICKSTART.md`
2. **Intermediate**: Read `DEPLOYMENT.md`
3. **Advanced**: Review `DEPLOYMENT_SUMMARY.md`
4. **Expert**: Modify `render.yaml` for custom needs

---

**Quick Deploy**: `RENDER_QUICKSTART.md` → Push to GitHub → Connect Render → Deploy ✅

