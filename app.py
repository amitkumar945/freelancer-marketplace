from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB Setup
client = MongoClient('mongodb://localhost:27017/')
db = client['freelancer_db']
projects_col = db['projects']

@app.route('/')
def index():
    return render_template('index.html')

# Get all projects
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = list(projects_col.find())
    for p in projects:
        p['_id'] = str(p['_id'])
    return jsonify(projects)

# Add new project
@app.route('/api/projects', methods=['POST'])
def add_project():
    data = request.json
    projects_col.insert_one(data)
    return jsonify({"status": "Project Posted!"})

# Update project
@app.route('/api/projects/<id>', methods=['PUT'])
def update_project(id):
    data = request.json
    projects_col.update_one({'_id': ObjectId(id)}, {'$set': data})
    return jsonify({"status": "Updated!"})

# Delete project
@app.route('/api/projects/<id>', methods=['DELETE'])
def delete_project(id):
    projects_col.delete_one({'_id': ObjectId(id)})
    return jsonify({"status": "Deleted!"})

if __name__ == '__main__':
    app.run(debug=True)