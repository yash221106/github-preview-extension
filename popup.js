document.getElementById("previewBtn").addEventListener("click", async () => {
  document.getElementById("status").textContent = "Detecting repository...";

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: detectRepo,
  });
});

function detectRepo() {
  const url = window.location.href;
  if (url.includes("github.com") && url.split("/").length >= 5) {
    const repoPath = url.split("github.com/")[1].split("/").slice(0, 2).join("/");
    alert(`Detected repo: ${repoPath}`);
  } else {
    alert("Not a valid GitHub repo page!");
  }
}
