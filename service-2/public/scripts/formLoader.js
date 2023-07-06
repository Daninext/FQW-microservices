window.addEventListener('load', (event) => download());

let curPage = 1;
let searching = false;
function download() {
  fetch('/forms/page/' + curPage).then((response) => processing(response));
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

function searchForms() {
  const status = document.getElementById('status-radio').checked;
  const theme = document.getElementById('theme-radio').checked;
  const group = document.getElementById('group-radio').checked;
  const fullName = document.getElementById('full-name-radio').checked;
  const date = document.getElementById('date-radio').checked;

  let type = '';
  let req = document.getElementById('search-input').value;
  if (status) type = 'status';
  else if (theme) type = 'theme';
  else if (group) type = 'group';
  else if (fullName) type = 'fullName';
  else if (date) {
    type = 'date';
    req = document.getElementById('date-input').value;
  }

  if (req === '') return;
  if (!searching) {
    curPage = 1;
    searching = true;
  }

  fetch('/forms/by/' + type + '/' + req + '/page/' + curPage).then((response) =>
    processing(response),
  );
}

function getNewPage(direction) {
  curPage += direction;

  if (!searching) download();
  else searchForms();

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
      data.innerText = temp.ans[i].fullName;
      line.appendChild(data);

      data = document.createElement('td');
      data.innerText = temp.ans[i].group;
      line.appendChild(data);

      data = document.createElement('td');
      data.innerText = temp.ans[i].theme;
      line.appendChild(data);

      data = document.createElement('td');
      data.innerText = temp.ans[i].status;
      line.appendChild(data);

      data = document.createElement('td');
      for (let j = 0; j < temp.ans[i].stages.length; ++j) {
        let but = document.createElement('button');
        but.innerText = temp.ans[i].stages[j];
        but.setAttribute('type', 'button');
        but.setAttribute('onclick', 'changeStatus(' + i + ',' + j + ')');
        data.appendChild(but);
      }

      line.appendChild(data);

      body.appendChild(line);
    }
    processedJson = json;
  });
}

function changeStatus(i, j) {
  const form = processedJson.ans[i];

  let xhr = new XMLHttpRequest();
  xhr.open(
    'PUT',
    '/change/' + form.id + '/new-status/' + form.stages[j],
    false,
  );
  xhr.send();
}
