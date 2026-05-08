tasks = []
next_task_id = 1

def add_task(title):
    global next_task_id
    task = {'id': next_task_id, 'title': title, 'completed': False}
    tasks.append(task)
    next_task_id += 1
    return task

def list_tasks():
    return tasks

def remove_task(task_id):
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]

def toggle_task(task_id):
    for t in tasks:
        if t['id'] == task_id:
            t['completed'] = not t['completed']
            return t
    return None

from flask import Flask, request, jsonify, send_from_directory
app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(list_tasks())

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    task = add_task(data['title'])
    return jsonify(task), 201


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    remove_task(task_id)
    return '', 204

@app.route('/tasks/<int:task_id>/toggle', methods=['PATCH'])
def path_task(task_id):
    task = toggle_task(task_id)
    return jsonify(task) if task else ('',404)
if __name__ == '__main__':
        app.run(debug=True)
    