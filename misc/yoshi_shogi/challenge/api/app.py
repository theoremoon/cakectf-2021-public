import flask
import subprocess
import re

app = flask.Flask(__name__)

STARTPOS = 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL'
regex_pos = re.compile(r'([lnsgkrbp\+\d]+\/){8}[lnsgkrbp\+\d]+', re.IGNORECASE)
regex_koma = re.compile(r'[lnsgkrbp\d]+', re.IGNORECASE)

@app.route('/ponder')
def ponder():
    pos = flask.request.args.get('position', STARTPOS)
    hand = flask.request.args.get('hand', '-')
    mov = flask.request.args.get('move', 'w')
    if mov not in ['w', 'b']:
        flask.abort(400)
    if not regex_pos.fullmatch(pos):
        flask.abort(400)

    p = subprocess.Popen(['gpsusi'],
                         stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    load = f'position sfen {pos} {mov} {hand} 1\n'.encode()
    out, err = p.communicate(
        b'usi\nisready\n' + load + b'go byoyomi 100\nquit\n'
    )
    if err:
        flask.abort(500)

    bestmove = None
    for line in out.decode().split('\n'):
        if 'bestmove' in line:
            bestmove = line.split()[1]
            break
    return flask.jsonify({
        'bestmove': bestmove
    })

if __name__ == '__main__':
    app.run(
        debug=False,
        host='0.0.0.0',
        port=8080,
        threaded=True
    )
