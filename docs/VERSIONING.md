# ML Studio - Versioning Strategy

## Versioning Standard

This project follows **Semantic Versioning (SemVer)**.

Format:

```
MAJOR.MINOR.PATCH
```

Example:

```
v1.0.0
```

Where:

- **MAJOR** → Breaking changes or major new release.
- **MINOR** → New features that are backward compatible.
- **PATCH** → Bug fixes, performance improvements, or security updates.

---

# Current Development

## Current Version

```
v0.9.0-beta
```

Status:

- Development Complete (Core Features)
- Testing in Progress
- Not Released to Production

### Completed Features

- ✅ User Authentication
- ✅ Email Verification
- ✅ Forgot Password
- ✅ Reset Password
- ✅ Upload Dataset
- ✅ Dataset Preview
- ✅ Data Preprocessing
- ✅ Model Training

### Remaining Feature

- ⏳ Data Visualization

---

# Release Plan

## v1.0.0

First Stable Release

Features:

- User Authentication
- Email Verification
- Password Reset
- Dataset Upload
- Dataset Preview
- Data Preprocessing
- Model Training
- Data Visualization

Status:

```
Planned
```

---

## v1.1.0

Planned Features

- Model Evaluation
- Feature Importance
- Download Trained Model
- Better Error Handling

---

## v1.2.0

Planned Features

- Hyperparameter Tuning
- Multiple Model Comparison
- Improved Preprocessing

---

## v2.0.0

Major Release

Planned Features

- Project Workspace
- Experiment Tracking
- Team Collaboration
- AutoML Workflow
- Dashboard Redesign

---

# Git Workflow

## Main Branch

```
main
```

Production-ready code only.

---

## Development Branch

```
develop
```

Testing/Staging environment.

---

## Feature Branches

Examples:

```
feature/email-verification
feature/reset-password
feature/data-visualization
feature/model-training
feature/dashboard-ui
```

Feature branches are created from **develop**.

After testing:

```
feature/*
        ↓
develop
        ↓
main
```

---

# Deployment Workflow

Local Development

```
Local
↓

Feature Branch
↓

Develop Branch
↓

Testing Environment
↓

Main Branch
↓

Production
```

---

# Environment Strategy

## Local

- React (localhost)
- FastAPI (localhost)
- Local PostgreSQL

---

## Testing

- Render Frontend Test
- Render Backend Test
- Neon Test Database

Branch:

```
develop
```

---

## Production

- Render Frontend
- Render Backend
- Neon Production Database

Branch:

```
main
```

---

# Release Checklist

Before releasing to Production:

- [ ] All features completed
- [ ] Email verification working
- [ ] Password reset working
- [ ] Upload working
- [ ] Preview working
- [ ] Preprocessing working
- [ ] Training working
- [ ] Data Visualization working
- [ ] Testing completed
- [ ] No critical bugs
- [ ] Merge develop into main
- [ ] Create Release Tag

---

# Release Tags

Examples

```
v0.9.0-beta
v1.0.0
v1.1.0
v1.2.0
v2.0.0
```

---

# Author

Hari Kanchu

Machine Learning Studio

Copyright © 2026