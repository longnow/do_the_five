import json

script_dict = {}
with open("scripts/scriptMetadata.txt") as file:
    for line in file.readlines():
        if not line.strip() or line.startswith("#"):
            continue
        else:
            splitline = line.split("; ")
            script_dict[splitline[0]] = "rtl" if splitline[6] == "YES" else "ltr"

json.dump(script_dict, open("script_data.json", "w"))