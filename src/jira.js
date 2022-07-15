const API_URL = "http://localhost:3000/.netlify/functions/server";

export async function getIssueDetails(issueKeys) {
  const data = await new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ["username", "atlassian-host", "atlassian-token"],
      async function (data) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(data);
      }
    );
  });

  const username = data["username"];
  const hostname = data["atlassian-host"];
  const apiToken = data["atlassian-token"];

  const response = await fetch(`${API_URL}/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      hostname: hostname,
      apiToken: apiToken,
      issueKeys: issueKeys,
    }),
  });

  return response.json();
}
