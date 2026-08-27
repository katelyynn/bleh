# simple tool to convert a markdown file with new-lines
# into a one-line string with \n replacements
import json
import os
import sys
from collections import OrderedDict


def parse_markdown(md_file):
    with open(md_file, encoding="utf-8") as f:
        lines = f.read().splitlines()
    title = None
    mtype = None
    bio = ""
    # front matter
    if lines and lines[0].strip() == "---":
        end = None
        for i, l in enumerate(lines[1:], start=1):
            if l.strip() == "---":
                end = i
                break
        if end is not None:
            for m in lines[1:end]:
                if m.lower().startswith("title:"):
                    title = m.split(":", 1)[1].strip()
                if m.lower().startswith("type:"):
                    mtype = m.split(":", 1)[1].strip()
            body = lines[end + 1 :]
        else:
            body = lines
    else:
        body = lines
    if not mtype:
        mtype = "major"
    for raw in body:
        stripped = raw.lstrip()
        if stripped.startswith("- "):
            indent = len(raw) - len(stripped)
            if indent > 0:
                bio += "\n    - " + stripped[2:]
            else:
                bio += "\n- " + stripped[2:]
        else:
            bio += "\n" + raw
    if bio.startswith("\n"):
        bio = bio[1:]
    return bio, title, mtype


def main():
    if len(sys.argv) != 2:
        print("usage: py convert.py update_file.md")
        return
    md_file = sys.argv[1]
    version = os.path.splitext(os.path.basename(md_file))[0]
    bio, title, mtype = parse_markdown(md_file)
    with open("changelog.tson", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=OrderedDict)
    entry = {"type": mtype, "force": False, "bio": bio}
    if title:
        entry["name"] = title
    new_data = OrderedDict()
    for key in ("updated", "latest"):
        if key in data:
            new_data[key] = data[key]
    new_data[version] = entry
    for k, v in data.items():
        if k not in new_data:
            new_data[k] = v
    with open("changelog.tson", "w", encoding="utf-8") as f:
        json.dump(new_data, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    main()
