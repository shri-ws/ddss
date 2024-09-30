import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/images')
def get_images():
    folder = 'static/img/'
    images = [f'{folder}{img}' for img in os.listdir(folder) if img.endswith(('jpg', 'png', 'jpeg'))]
    return jsonify(images)

if __name__ == '__main__':
    app.run()
