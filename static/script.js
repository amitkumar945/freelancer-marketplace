document.addEventListener('DOMContentLoaded', fetchProjects);
const form = document.getElementById('project-form');

async function fetchProjects() {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    const list = document.getElementById('project-list');
    list.innerHTML = '';

    projects.forEach(p => {
        const skillsArr = p.skills.split(',');
        list.innerHTML += `
            <div class="project-card">
                <h3>${p.title}</h3>
                <p class="budget">₹${p.budget}</p>
                <p><small>📅 Deadline: ${p.deadline}</small></p>
                <div class="skills-tags">
                    ${skillsArr.map(s => `<span class="tag">${s.trim()}</span>`).join('')}
                </div>
                <p>${p.description}</p>
                <div class="actions">
                    <button class="btn-edit" onclick="editMode('${p._id}', '${p.title}', '${p.budget}', '${p.deadline}', '${p.skills}', \`${p.description}\`)">Edit</button>
                    <button class="btn-del" onclick="deleteProject('${p._id}')">Delete</button>
                </div>
            </div>`;
    });
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const data = {
        title: document.getElementById('title').value,
        budget: document.getElementById('budget').value,
        deadline: document.getElementById('deadline').value,
        skills: document.getElementById('skills').value,
        description: document.getElementById('description').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/projects/${id}` : '/api/projects';

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    resetForm();
    fetchProjects();
};

function editMode(id, title, budget, deadline, skills, desc) {
    document.getElementById('project-id').value = id;
    document.getElementById('title').value = title;
    document.getElementById('budget').value = budget;
    document.getElementById('deadline').value = deadline;
    document.getElementById('skills').value = skills;
    document.getElementById('description').value = desc;

    document.getElementById('form-title').innerText = "Edit Project";
    document.getElementById('submit-btn').innerText = "Update Listing";
    document.getElementById('cancel-btn').classList.remove('hidden');
}

function resetForm() {
    form.reset();
    document.getElementById('project-id').value = '';
    document.getElementById('form-title').innerText = "Post a New Project";
    document.getElementById('submit-btn').innerText = "Post Project";
    document.getElementById('cancel-btn').classList.add('hidden');
}

async function deleteProject(id) {
    if(confirm("Remove this project?")) {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        fetchProjects();
    }
}