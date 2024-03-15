import flask
import flask_cors

import hashlib
import yaml
import os

with open('config.yml', 'r') as fin:
    try:
        config = yaml.safe_load(fin)
    except:
        print('There is a typo in `config.yml`.')
        exit(1)

key = config['key']
auto_commit = config['auto_commit']
auto_push = config['auto_push']

app = flask.Flask(__name__)
flask_cors.CORS(app)

@app.route('/', methods=['GET', 'POST'])
def main():
    if flask.request.method == 'POST':
        token = flask.request.args['token']
        name = flask.request.args['name']
        data = flask.request.get_data(as_text=True)

        if not test_auth(token, key):
            return {}, 403

        try:
            with open('./saves/' + name + '.json', 'w+') as fout:
                fout.write(data)
        except FileNotFoundError:
            return {}, 500
        
        if auto_push or auto_commit:
            os.system('git add saves')
            os.system('git commit -m \"Automated commit.\"')
        if auto_push:
            os.system('git push')
        # print("Committing thing now.")
    elif flask.request.method == 'GET':
        token = flask.request.args['token']
        name = flask.request.args['name']

        if not test_auth(token, key):
            return {}, 403
        
        try:
            with open('./saves/' + name + '.json', 'r') as fin:
                return fin.read()
        except FileNotFoundError:
            return {}, 500
    return {}, 200

def test_auth(token, expected):
    return hashlib.sha256(token.encode('utf-8')).hexdigest() == hashlib.sha256(expected.encode('utf-8')).hexdigest()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
