# Contribution Guidelines

A simple guideline if you are unfamiliar on how to fork and do a Pull Request.

## Fork and Clone

First, fork the repository from https://github.com/Nagavignesh1729/Inventory-Warehouse-Management-System. This will create a copy of the repo under your own GitHub account.

Then, clone your fork locally:

`git clone https://github.com/<your-username>/Inventory-Warehouse-Management-System.git`
`cd Inventory-Warehouse-Management-System`

## Setup Upstream Remote

Add the original repo as the upstream remote to pull updates later:

`git remote add upstream https://github.com/Nagavignesh1729/Inventory-Warehouse-Management-System.git`

## Working on New Features

When working on something new, always create a branch instead of editing main directly (a good practice):

`
git checkout frontend      # or backend
git pull --rebase upstream frontend
git checkout -b feature/<short-description>
`

Example:

`git checkout -b feature/inventory-ui`

## Commit and Push Changes

Make your changes, stage them, and commit with a clear message:

`git add .`
`git commit -m "Added inventory UI module"`

Push your branch to your fork:

`git push origin feature/<short-description>`

## Creating a Pull Request

Open GitHub, go to your fork, and click **Compare \& Pull Request**. Make sure the target branch is `frontend` or `backend` (or any branch you are working on) and not `main` of the upstream repo. Write a clear PR description explaining your changes.

## Sync Fork Before New Work

Before starting new work, update your local main branch:

```
git fetch upstream
git checkout frontend        # or backend
git pull --rebase upstream frontend
git push origin frontend
```

## Branch Policy
- main → stable
- dev → integration branch
- backend → backend team development
- frontend → frontend team development

### Workflow
1. Backend team raises PR → backend
2. Frontend team raises PR → frontend
3. Tech lead merges backend & frontend → dev
4. After testing, dev → main

## Suggestions to Follow

- Never commit directly to `main` (another good practice).
- One feature or bugfix = one PR (keep PRs small and focused).
- Use clear commit messages, e.g. "Fix: Fixed Mukundhan's meetings".
- Sync with upstream regularly before starting new work (to avoid working on outdated repo). 
- All merges will go through PR review. I will approve or request changes before merging (we will think about peer review later).
