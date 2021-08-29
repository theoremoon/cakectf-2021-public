#!/usr/bin/env python
import os
import tempfile
import urllib.request

"""
Use https://transfer.sh/ if you don't have your own server.
"""
if __name__ == '__main__':
    try:
        url = input('URL: ').strip()
        assert url.startswith('http'), "URL must start with `http`"

        f = tempfile.NamedTemporaryFile(delete=True)
        urllib.request.urlretrieve(url, f.name)
        os.chmod(f.name, 0o555)
        f.file.close()
        os.system(f'./aldrya {f.name} ./sample.aldrya')

    except Exception as e:
        print(f'[-] {e}')
