const API = 'http://localhost:3000/api';

async function getComplaints() {
    const res = await fetch(`${API}/complaints`);
    return await res.json();
}

async function submitComplaintAPI(complaint) {
    const res = await fetch(`${API}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaint)
    });
    return await res.json();
}

async function respondComplaint(id, response, responseTime) {
    const res = await fetch(`${API}/complaints/${id}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response, responseTime })
    });
    return await res.json();
}

async function dismissComplaint(id) {
    const res = await fetch(`${API}/complaints/${id}/dismiss`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
}

async function leaveFeedbackAPI(id, feedback) {
    const res = await fetch(`${API}/complaints/${id}/feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
    });
    return await res.json();
}

async function clearAllComplaints() {
    const res = await fetch(`${API}/complaints`, {
        method: 'DELETE'
    });
    return await res.json();
}