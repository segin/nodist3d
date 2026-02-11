#!/bin/bash
branches=$(git branch -r | grep -v '\->' | grep 'origin/' | grep -v 'origin/main' | sed 's|origin/||')
for branch in $branches; do
  echo "----------------------------------------"
  echo "Merging $branch..."
  git merge "origin/$branch" --no-edit
  if [ $? -ne 0 ]; then
    echo "Conflict in $branch. Attempting to resolve with -Xours for binary/config and manual for others if needed, but for now just stopping."
    # git merge --abort
    exit 1
  fi
done
