import json
import sys
from tqdm import tqdm
import panlex

words = [
    "hand",
    "elbow",
    "face",
    "distance",
    "touch",
    "wash",
    "cough",
    "home",
    "share",
    "community",
    "friend",
    "family",
    "no",
    "stay",
]

FETCH = sys.argv[-1] == "fetch"
if FETCH:
    trans_dict = {word: {"eng-000": word} for word in words}
    result_dict = {}

    for entry in panlex.query_all("/langvar", {"cache": False})["result"]:
        result_dict[entry["uid"]] = {
            "autoglossonym": entry["name_expr_txt"],
            "eng-000_name": [],
        }

    for entry in panlex.query_all(
        "/expr",
        {
            "trans_txt": list(result_dict.keys()),
            "uid": "eng-000",
            "include": ["trans_quality", "trans_txt"],
            "sort": "trans_quality asc",
            "cache": False,
        },
    )["result"]:
        result_dict[entry["trans_txt"]]["eng-000_name"].append(entry["txt"])

    for word in tqdm(words):
        result = panlex.query_all(
            "/expr",
            {
                "trans_uid": "eng-000",
                "trans_txt": word,
                "include": ["trans_quality", "uid"],
                "sort": "trans_quality desc",
                "cache": False,
            },
        )
        for entry in result["result"]:
            uid = entry["uid"]
            if uid in trans_dict[word]:
                continue
            trans_dict[word][uid] = entry["txt"]

    for word in trans_dict:
        for uid in trans_dict[word]:
            result_dict[uid][word] = trans_dict[word][uid]

    json.dump(result_dict, open("result.json", "w"))
else:
    result_dict = json.load(open("result.json"))

words_set = set(words)

result_dict = {
    uid: result_dict[uid]
    for uid in result_dict
    if words_set & set(result_dict[uid].keys())
}

header = "\t".join(["Name (eng)", "Name", "PanLex ID"] + words) + "\n"
entries = sorted(
    [
        (
            " / ".join(sorted(e.get("eng-000_name", [""]), key=len)),
            e.get("autoglossonym", ""),
            uid,
            *(e.get(word, "") for word in words),
        )
        for (uid, e) in result_dict.items()
    ],
    key=lambda x: (x[0] if x[0] else "\U0010FFFF", x[1]),
)


with open("TC_words.tsv", "w") as file:
    file.write(header)
    for entry in entries:
        file.write("\t".join(entry) + "\n")
