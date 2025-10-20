# Quick Start: Deploy to Render

This guide will get your RCU App deployed to Render in minutes.

## 🚀 One-Click Deploy Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Connect to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account (if not already connected)
4. Select your `rcu_app` repository
5. Click **"Apply"**

### Step 3: Wait for Deployment

Render will automatically:
- ✅ Create PostgreSQL database
- ✅ Deploy backend API
- ✅ Build and deploy frontend
- ✅ Configure all environment variables
- ✅ Set up HTTPS for all services

**Deployment time**: ~5-10 minutes

### Step 4: Access Your App

After deployment completes, you'll see three services:

1. **rcu-app-frontend** (Static Site)
   - URL: `https://rcu-app-frontend.onrender.com`
   - This is your main application

2. **rcu-app-api** (Web Service)
   - URL: `https://rcu-app-api.onrender.com`
   - API documentation: `/docs`
   - Health check: `/health`

3. **rcu-app-db** (PostgreSQL)
   - Automatically connected to backend

## 🔧 What Was Deployed?

### Files Added/Modified:
- ✅ `render.yaml` - Main deployment configuration
- ✅ `config.py` - Backend environment configuration
- ✅ `build.sh` - Backend build script
- ✅ `frontend/my-react-app/render-build.sh` - Frontend build script
- ✅ `frontend/my-react-app/src/config.ts` - Frontend API configuration
- ✅ Updated `main.py`, `models.py` - Production-ready settings
- ✅ Updated all frontend services - Use environment variables
- ✅ Added `psycopg2-binary` to `requirements.txt` - PostgreSQL support

### Configuration Highlights:

**Backend (FastAPI)**
- Automatic database connection
- Auto-generated secure JWT secret
- Production CORS settings
- Health check endpoint
- PostgreSQL support

**Frontend (React + Vite)**
- Environment-based API URL
- SPA routing support
- Security headers
- Automatic HTTPS

**Database (PostgreSQL)**
- Free tier (256 MB)
- Automatic backups
- Secure connection
- Auto-initialized tables

## 📋 Post-Deployment Checklist

- [ ] Visit frontend URL and test login/signup
- [ ] Check API docs at `/docs`
- [ ] Verify health check at `/health`
- [ ] Test all features (food entries, user management)
- [ ] Check Render dashboard for logs

## 🔍 Troubleshooting

### Frontend can't connect to backend
**Solution**: Check the VITE_API_URL in Render dashboard
```
Dashboard → rcu-app-frontend → Environment → VITE_API_URL
```

### Database connection errors
**Solution**: Verify database is running
```
Dashboard → rcu-app-db → Status should be "Available"
```

### CORS errors
**Solution**: Check FRONTEND_URL in backend environment
```
Dashboard → rcu-app-api → Environment → FRONTEND_URL
```

### Build failures
**Solution**: Check build logs
```
Dashboard → Service → Events → Click on failed deployment
```

## ⚙️ Service Management

### View Logs
```bash
# Install Render CLI (optional)
npm install -g render-cli

# View logs
render logs -s rcu-app-api
render logs -s rcu-app-frontend
```

### Manual Redeploy
1. Go to Render Dashboard
2. Select service
3. Click "Manual Deploy" → "Deploy latest commit"

### Environment Variables
1. Go to Render Dashboard
2. Select service
3. Click "Environment"
4. Add/Edit variables
5. Save (triggers auto-redeploy)

## 🎯 What's Next?

### Custom Domain
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as shown

### Upgrade Plans
Free tier limitations:
- Backend spins down after 15 min inactivity
- 750 hours/month compute time
- 256 MB database storage

Upgrade in Settings → Plan

### Add Features
- [ ] Email verification
- [ ] Password reset
- [ ] File uploads
- [ ] Real-time notifications
- [ ] Analytics

## 📚 Full Documentation

See `DEPLOYMENT.md` for comprehensive deployment guide.

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Support**: support@render.com

---

**That's it!** Your app should now be live at your Render URLs. 🎉

