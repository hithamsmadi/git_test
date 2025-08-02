#!/usr/bin/env python3

"""Simple script that prints a greeting.

If the file 'hello_world.txt' contains text, that text is displayed.
Otherwise, a default greeting is printed.
"""

from pathlib import Path

FILE = Path("hello_world.txt")

def main():
    if FILE.exists():
        text = FILE.read_text().strip()
        if text:
            print(text)
            return
    print("Hello, world!")


if __name__ == "__main__":
    main()
