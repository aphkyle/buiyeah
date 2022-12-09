import pathlib
import re
import os
import shutil
import subprocess

dist = pathlib.Path("dist")
src = pathlib.Path("src")
dist.mkdir(exist_ok=True)

for file in dist.glob("*"):
    os.remove(file)

for filepath in src.glob("*"):
    if filepath.name == "nord.css": continue
    with open(filepath, encoding="utf8") as file:
        file_content = file.read()
    match filepath.suffix:
        case ".html":
            with open(dist / filepath.name, "w", encoding="utf8") as f:
                f.write(re.sub("\n *", "", file_content))
        case ".scss":
            pass
        case ".js":
            with open(dist / filepath.name, "w", encoding="utf8") as f:
                f.write(
                    subprocess.run(
                        ["uglifyjs", filepath],
                        shell=True,
                        capture_output=True,
                        encoding="utf-8",
                        text=True
                    ).stdout
                )
        case ".css":
            subprocess.run(
                ["cleancss", "-O2", filepath, '>', f"dist/{filepath.name}"],
                shell=True,
                capture_output=True,
                encoding="utf-8",
                text=True
            ).stdout
        case _:
            shutil.copy2(filepath, f"dist/{filepath.name}")
    print(f"✅ {filepath}")
