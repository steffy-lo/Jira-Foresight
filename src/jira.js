const API_URL = 'http://localhost:3000/.netlify/functions/server';

export async function getIssueDetails(issueKeys) {
    const username = localStorage.getItem('username');
    const hostname = localStorage.getItem('atlassian-host');
    const apiToken = localStorage.getItem('atlassian-token');
    
    const response = await fetch(`${API_URL}/issues`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username,
            hostname: hostname,
            apiToken: apiToken,
            issueKeys: issueKeys
        })
    });

    return response.json();
}