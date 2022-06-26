import { getIssueDetails } from "./jira.js";
import { getActiveTabURL, getPRInfo } from "./utils.js";

const addNewIssue = (issues, issue) => {
  const hostname = localStorage.getItem('atlassian-host');
  const issueLink = `${hostname}/browse/${issue.key}`;
  const newIssueElement = document.createElement("div");
  newIssueElement.id = "issue-" + issue.key;
  newIssueElement.className = "issue";
  newIssueElement.setAttribute("key", issue.key);
  const { summary, description, watches, comment } = issue.fields;
  newIssueElement.innerHTML += `
  <div class="h-min w-full">
    <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
      <div class="p-3">
        <h2 class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">${issue.key}</h2>
        <h1 class="title-font text-lg font-medium text-gray-900 mb-3">${summary || "No summary"}</h1>
        <p class="leading-relaxed mb-3">${description || "No description"}</p>
        <div class="flex items-center flex-wrap ">
          <a href=${issueLink} target="_blank" class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">View Issue
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <span class="text-gray-600 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-300">
            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>${watches.watchCount}
          </span>
          <span class="text-gray-600 inline-flex items-center leading-none text-sm">
            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
            </svg>${comment.total}
          </span>
        </div>
      </div>
    </div>
  </div>`
  issues.appendChild(newIssueElement);
};

const viewIssues = (issues = []) => {
  const container = document.getElementsByClassName("container")[0];
  if (issues.length > 0) {
    getIssueDetails(issues).then(data => {
      container.innerHTML = `
      <div class="p-3">
        <div class="text-lg font-semibold">Issues for this pull request</div>
        <div id="issues"></div>
      </div>
      `;
      const issuesElement = document.getElementById("issues");
      issuesElement.innerHTML = "";
      data.issues.forEach(issue => {
        addNewIssue(issuesElement, issue);
      });
    }).catch(() => {
      container.innerHTML = 
      `<div id="error" class="p-6">
        <p class="text-sm flex text-center justify-center">Unable to fetch issue details.<br>Please try again later or reset your credentials.</p>
      </div>`;
      const resetBtnContainer = document.createElement("div");
      const resetBtn = document.createElement("button");
      resetBtn.className = "inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";
      resetBtn.innerHTML += "Reset";
      resetBtn.onclick = function () {
        localStorage.removeItem('username');
        localStorage.removeItem('atlassian-host');
        localStorage.removeItem('atlassian-token');
        document.location.reload();
      }
      resetBtnContainer.className = "flex space-x-2 justify-center p-3";
      resetBtnContainer.appendChild(resetBtn);
      const errorElement = document.getElementById("error");
      errorElement.appendChild(resetBtnContainer);
    });
  } else {
    issuesElement.innerHTML = '<i class="row">No issues to show</i>';
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const { prNum } = getPRInfo(activeTab.url);

  if (activeTab.url.includes("github.com") && prNum) {
    chrome.storage.sync.get([prNum], (data) => {
      const issues = data[prNum] ? JSON.parse(data[prNum]) : [];
      document.getElementById("authenticate-btn").onclick = function () {
        localStorage.setItem('username', document.getElementById("username").value);
        localStorage.setItem('atlassian-host', document.getElementById("hostname").value);
        localStorage.setItem('atlassian-token', document.getElementById("token").value);
        viewIssues(issues);
      };

      // Get local storage for Altassian host name and API token
      // If have, we call viewIssues
      const username = localStorage.getItem('username');
      const hostname = localStorage.getItem('atlassian-host');
      const apiToken = localStorage.getItem('atlassian-token');
      if (username && hostname && apiToken) {
        viewIssues(issues);
      }
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a GitHub Pull Request page.</div>';
  }
});

