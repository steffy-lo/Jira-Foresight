import { getIssueDetails } from "./jira.js";
import { addAttachmentsOnClickFunction, getActiveTabURL, getAttachmentsHTML, getPRInfo, getStatusPillClass } from "./utils.js";

const addNewIssue = (issues, issue) => {
  const data = await new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ["atlassian-host"],
      async function (data) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(data);
      }
    );
  });
  const hostname = data["atlassian-host"];
  const issueLink = `${hostname}/browse/${issue.key}`;
  const newIssueElement = document.createElement("div");
  newIssueElement.id = "issue-" + issue.key;
  newIssueElement.className = "issue";
  newIssueElement.setAttribute("key", issue.key);
  const { summary, description, watches, comment, status, issuetype, attachment, assignee, priority} = issue.fields;
  newIssueElement.innerHTML += `
  <div class="h-min w-full">
    <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
      <div class="p-3">
        <div class="flex justify-between mb-1">
          <div class="flex items-center">
            <h2 class="tracking-widest text-xs title-font font-medium text-gray-500" style="border:none !important">${issue.key}</h2>
            <span class="mx-2 px-2 ${getStatusPillClass(status.name)} text-sm font-medium rounded-full">
              ${status.name}
            </span>
          </div>
          <div class="flex items-center" title="Assignee">
            <img class="max-h-5 mr-2" src=${assignee.avatarUrls['48x48']} alt=avatar>
            <p class="m-0">${assignee.displayName}</p>
          </div> 
        </div>
        <div class="flex justify-between mb-3">
          <div class="flex items-start mb-3 w-5/6">
            <img class="mr-2 py-2" src=${issuetype.iconUrl} alt=type data-bs-toggle="tooltip" title="${issuetype.name}"/>
            <h1 class="title-font text-lg font-medium text-gray-900 m-0" style="border:none !important">${summary || "No summary"}</h1>
          </div>
          <img class="max-h-5" src=${priority.iconUrl} alt=priority title=Priority>
        </div>
        <p class="leading-relaxed mb-3" style="white-space: pre-line">${description || "No description"}</p>
        ${getAttachmentsHTML(issue.key, attachment)}
        <div class="flex items-center flex-wrap">
          <a href=${issueLink} target="_blank" class="text-blue-600 inline-flex items-center md:mb-2 lg:mb-0">View Issue
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
    container.innerHTML = `
      <div class="p-3">
        <div class="text-center p-2">
          <svg role="status" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
        </div>
        <div class="text-lg text-center p-3 font-semibold">Fetching issues for this pull request...</div>
      </div>
      `;
    getIssueDetails(issues).then(res => {
      if (res) {
      container.innerHTML = `
      <div class="p-3">
        <div class="text-lg font-semibold">Issues for this pull request</div>
        <div id="img-modal" class="modal">
          <span class="close">&times;</span>
          <!-- Modal Content (The Image) -->
          <img class="modal-content" id="modal-img">
          <!-- Modal Caption (Image Name) -->
          <div id="caption"></div>
        </div>
        <div id="issues"></div>
      </div>
      `;
      const modal = document.getElementById("img-modal");
      const imgModalCloseBtn = document.getElementsByClassName("close")[0];
      imgModalCloseBtn.onclick = function() {
        modal.style.display = "none";
      }

      const issuesElement = document.getElementById("issues");
      issuesElement.innerHTML = "";
      res.issues.forEach(issue => {
        addNewIssue(issuesElement, issue);
        addAttachmentsOnClickFunction(issue);
      });
    }
    }).catch((err) => {
      console.log(err)
      container.innerHTML = 
      `<div id="error" class="p-6">
        <p class="text-sm flex text-center justify-center">Unable to fetch issue details.<br>Please try again later or reset your credentials.</p>
      </div>`;
      const resetBtnContainer = document.createElement("div");
      const resetBtn = document.createElement("button");
      resetBtn.className = "inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";
      resetBtn.innerHTML += "Reset";
      resetBtn.onclick = function () {
      chrome.storage.sync.remove(['username', 'atlassian-host', 'atlassian-token'], ()=>{
        document.location.reload();
      });
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
    chrome.storage.sync.get([prNum, 'username', 'atlassian-host', 'atlassian-token'], (chromeStorage) => {
      const issues = chromeStorage[prNum] ? JSON.parse(chromeStorage[prNum]) : [];
      document.getElementById("authenticate-btn").onclick = function () {
        chrome.storage.sync.set({
          'username': document.getElementById("username").value,
          'atlassian-host':document.getElementById("hostname").value,
          'atlassian-token':document.getElementById("token").value
        });
        viewIssues(issues);
        
      };
      const username = chromeStorage['username'];
      const hostname = chromeStorage['atlassian-host'];
      const apiToken = chromeStorage['atlassian-token'];
      if (username && hostname && apiToken) {
        viewIssues(issues);
      }
  });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a GitHub Pull Request page.</div>';
  }
});

export {addNewIssue, viewIssues}
