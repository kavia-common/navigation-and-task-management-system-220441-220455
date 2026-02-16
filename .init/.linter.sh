#!/bin/bash
cd /home/kavia/workspace/code-generation/navigation-and-task-management-system-220441-220455/task_management_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

