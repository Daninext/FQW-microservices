window.addEventListener('load', (event) => download());

let curPage = 1;
let searching = false;
function download() {
  fetch('/groups/page/' + curPage).then((response) => processing(response));
}

function stringify(value) {
  switch (typeof value) {
    case 'string':
    case 'object':
      return JSON.stringify(value);
    default:
      return String(value);
  }
}

function searchGroups() {
  let req = document.getElementById('search-input').value;

  if (req === '') return;
  if (!searching) {
    curPage = 1;
    searching = true;
  }

  fetch('/groups/by/' + req + '/page/' + curPage).then((response) =>
    processing(response),
  );
}

function getNewPage(direction) {
  curPage += direction;

  if (!searching) download();
  else searchGroups();

  document.getElementById('cur-page').innerText = curPage.toString();
}

function clearFilters() {
  searching = false;
  curPage = 1;
  download();
}

let processedJson = undefined;
function processing(request) {
  if (!request.ok) return;

  const body = document.getElementById('table-body');
  let chCount = body.childElementCount;
  for (let i = 0; i < chCount; ++i) {
    body.removeChild(body.children[0]);
  }

  request.json().then(async (json) => {
    let temp = JSON.parse(stringify(json).replaceAll('\n', ''));
    for (let i = 0; i < temp.ans.length; ++i) {
      let line = document.createElement('tr');

      let data = document.createElement('td');
      data.innerText = temp.ans[i].name;
      line.appendChild(data);

      body.appendChild(line);
    }
    processedJson = json;
  });
}
