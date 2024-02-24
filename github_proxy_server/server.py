from flask import Flask

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

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def main():
    if flask.request.method == 'POST':
        token = flask.request.args['token']
        name = flask.request.args['name']
        data = flask.request.get_data(as_text=True)

        if hashlib.sha256(token) != key:
            return {}, 401

        with open(name + '.json', 'w+') as fout:
            try:
                fout.write(data)
            except:
                return {}, 500
        
        os.system('git add .')
        os.system('git commit -m \"Automated commit.\"')
        os.system('git push')
    elif flask.request.method == 'GET':
        token = request.args['token']
        name = request.args['name']

        if hashlib.sha256(token) != key:
            return {}, 401
        
        with open(name + '.json', 'r') as fin:
            try:
                return fin.read()
            except:
                return {}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
