"""Compatibility shim: the API now lives in server/app.py (that is the folder Render deploys, rootDir: server).

`uvicorn backend.main:app` still works and runs the exact same app. Do not add logic here.
"""
from server.app import app  # noqa: F401
