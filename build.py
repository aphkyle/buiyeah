import os
import pathlib
import re
import shutil
import subprocess

os.mkdir("dist")

src = pathlib.Path("src")
for filepath in src.glob("*"):
    print(filepath)
    with open(filepath, encoding="utf8") as file:
        file_content = file.read()
    match filepath.suffix:
        case ".html":
            with open(f"dist/{filepath.name}", "w", encoding="utf8") as f:
                f.write(re.sub("\n *", "", file_content))
        case ".map", ".scss":
            pass
        case ".js":
            with open(f"dist/{filepath.name}", "w", encoding="utf8") as f:
                f.write(
                    subprocess.run(
                        ["uglifyjs", filepath], shell=True, capture_output=True
                    ).stdout.decode()
                )
        case "css":
            with open(f"dist/{filepath.name}", "w", encoding="utf8") as f:
                f.write(
                    subprocess.run(
                        ["cleancss", filepath], shell=True, capture_output=True
                    ).stdout.decode()
                )
        case _:
            shutil.copy2(filepath, f"dist/{filepath.name}")
