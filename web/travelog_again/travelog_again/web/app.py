import base64
import hashlib
import imghdr
import json
import os
import re
import redis
import requests
import tempfile
from flask import Flask, abort, flash, g, redirect, render_template, request, session, send_file, url_for
try:
    from secret import SECRET_KEY, RECAPTCHA_KEY
except:
    SECRET_KEY = os.urandom(32)
    RECAPTCHA_KEY = None

PATH_POST_USER   = '/tmp/travelog/users/{user_id}'
PATH_IMAGE_USER  = '/tmp/travelog/uploads/{user_id}'
PATH_POST  = '/tmp/travelog/users/{user_id}/{post_id}'
PATH_IMAGE = '/tmp/travelog/uploads/{user_id}/{name}'

app = Flask(__name__, static_url_path='/')
app.secret_key = SECRET_KEY

@app.context_processor
def csp_nonce_init():
    g.csp_nonce = base64.b64encode(os.urandom(16)).decode()
    return dict(csp_nonce=g.csp_nonce)

@app.after_request
def csp_rule_apply(response):
    if 'csp_nonce' in g:
        policy = ''
        policy += "default-src 'none';"
        policy += f"script-src 'nonce-{g.csp_nonce}' 'unsafe-inline';"
        policy += f"style-src 'nonce-{g.csp_nonce}' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;"
        policy += "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/;";
        policy += "img-src 'self';"
        policy += "connect-src http: https:;"
        policy += "base-uri 'self'"
        response.headers["Content-Security-Policy"] = policy
    return response

@app.route('/')
def home():
    if 'user_id' in session:
        return redirect(url_for('post'))
    else:
        return redirect(url_for('login'))

@app.route('/post', methods=['GET', 'POST'])
def post():
    if 'user_id' not in session:
        return redirect(url_for('home'))

    if request.method == 'GET':
        return render_template('post.html')

    else:
        if 'title' not in request.form or 'contents' not in request.form:
            abort(400)

        user_id = session['user_id']
        title = request.form.get('title')
        contents = re.sub(r'\{\{\s*(.+?)\s*\}\}',
                          rf'/uploads/{user_id}/\1',
                          request.form.get('contents'))

        post_id = hashlib.md5(os.urandom(32)).hexdigest()

        with open(PATH_POST.format(user_id=user_id, post_id=post_id), 'w') as f:
            json.dump({
                'title': title,
                'contents': contents,
                'author': session['username'],
                'user_id': user_id,
                'post_id': post_id
            }, f)

        return redirect(url_for('show', user_id=user_id, post_id=post_id))

@app.route('/list')
def listup():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if not os.path.exists(PATH_POST_USER.format(user_id=session['user_id'])):
        abort(404)

    posts = []
    path_list = os.listdir(PATH_POST_USER.format(user_id=session['user_id']))
    for post_id in path_list:
        path = PATH_POST.format(user_id=session['user_id'], post_id=post_id)
        with open(path, 'r') as f:
            posts.append(json.load(f))
    
    return render_template('list.html', posts=posts)

@app.route('/post/<user_id>/<post_id>')
def show(user_id, post_id):
    user_id, post_id = user_id.lower(), post_id.lower()
    if re.fullmatch('[0-9a-f]{32}', user_id) is None \
       or re.fullmatch('[0-9a-f]{32}', post_id) is None:
        abort(404)

    post_path = PATH_POST.format(user_id=user_id, post_id=post_id)
    if not os.path.isfile(post_path):
        abort(404)

    with open(post_path, 'r') as f:
        post = json.load(f)

    url = url_for('show', user_id=user_id, post_id=post_id, _external=True)
    return render_template('show.html', post=post, url=url)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('home'))

    if request.method == 'GET':
        return render_template('login.html')

    else:
        if 'username' not in request.form or 'password' not in request.form:
            abort(400)

        session['username'] = request.form.get('username')
        session['user_id'] = hashlib.md5(os.urandom(32)).hexdigest()

        os.makedirs(PATH_POST_USER.format(user_id=session['user_id']))
        os.makedirs(PATH_IMAGE_USER.format(user_id=session['user_id']))

        return redirect(url_for('home'))

@app.route('/upload', methods=['POST'])
def upload():
    if 'user_id' not in session:
        abort(404)

    images = request.files.getlist('images[]')
    for f in images:
        with tempfile.NamedTemporaryFile() as t:
            f.save(t.name)
            f.seek(0)
            if imghdr.what(t.name) != 'jpeg':
                abort(400)

    for f in images:
        name = os.path.basename(f.filename)
        if name == '':
            abort(400)
        else:
            f.save(PATH_IMAGE.format(user_id=session['user_id'], name=name))

    return 'OK'

@app.route('/uploads/<user_id>/<name>')
def uploads(user_id, name):
    user_id = user_id.lower()
    if re.fullmatch('[0-9a-f]{32}', user_id) is None:
        abort(404)

    return send_file(PATH_IMAGE.format(user_id=user_id, name=name))

@app.route('/report', methods=['POST'])
def report():
    if RECAPTCHA_KEY:
        params = {
            'secret': RECAPTCHA_KEY,
            'response': request.form.get('g-recaptcha-response')
        }
        r = requests.get(
            "https://www.google.com/recaptcha/api/siteverify", params=params
        )
        if json.loads(r.text)['success'] == False:
            abort(400)

    url = request.form.get('url')
    if not re.fullmatch('\/post\/[0-9a-f]{32}/[0-9a-f]{32}', url):
        abort(400)

    connection = redis.Redis(host='redis', port=6379, db=0)
    connection.rpush('query', url)

    flash("Thank you for reporting it. We'll check it soon.", "success")
    return redirect(url)

if __name__ == '__main__':
    # For debug
    app.run(
        debug = True,
        host = '0.0.0.0',
        port = 8080,
        threaded = True
    )
