#!/usr/bin/env python3
"""
Linting script for the todo app.
Runs flake8 on Python files.
"""
import subprocess
import sys
import os

def run_flake8():
    """Run flake8 on Python files"""
    print("Running flake8 on Python files...")
    result = subprocess.run(
        ['flake8', 'app.py'],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("✓ Python linting passed!")
        return True
    else:
        print("✗ Python linting failed:")
        print(result.stdout)
        print(result.stderr)
        return False

def main():
    """Main linting function"""
    print("=" * 50)
    print("Running linters...")
    print("=" * 50)
    
    python_ok = run_flake8()
    
    print("\n" + "=" * 50)
    if python_ok:
        print("✓ All linting checks passed!")
        sys.exit(0)
    else:
        print("✗ Some linting checks failed!")
        sys.exit(1)

if __name__ == '__main__':
    main()

