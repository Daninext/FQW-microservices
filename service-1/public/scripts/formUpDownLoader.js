window.addEventListener('load', (event) => download(1));

let change = false;
let savedId = -1;
function upload() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    id: savedId,
    fullName: document.getElementById('full-name-input').value,
    group: document.getElementById('group-input').value,
    theme: document.getElementById('theme-input').value,
    companyName: document.getElementById('company-name-input').value,
    consultant: document.getElementById('consultant-input').checked,
  });

  if (!change) xhr.open('POST', '/forms/post', false);
  else xhr.open('PUT', '/forms/change', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}

function download(page) {
  fetch('/forms/page/' + page.toString()).then((response) =>
    processing(response),
  );
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

function getNewPage(direction) {
  download(curPage + direction);
  document.getElementById('cur-page').innerText = (
    curPage + direction
  ).toString();
}

let curPage = 1;
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
    curPage = temp.page;
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
      let but = document.createElement('button');
      but.innerText = 'Изменить';
      but.setAttribute('type', 'button');
      but.setAttribute('onclick', 'prepare(' + i + ')');
      data.appendChild(but);
      line.appendChild(data);

      data = document.createElement('td');
      data.innerText = temp.ans[i].comment;
      line.appendChild(data);

      body.appendChild(line);
    }
    processedJson = json;
  });
}

function prepare(i) {
  const form = processedJson.ans[i];

  document.getElementById('full-name-input').value = form.fullName;
  document.getElementById('group-input').value = form.group;
  document.getElementById('theme-input').value = form.theme;
  document.getElementById('company-name-input').value = form.companyName;
  document.getElementById('consultant-input').checked = Boolean(
    form.consultant,
  );
  document.getElementById('id-label').innerText = 'ID: ' + form.id;

  savedId = Number(form.id);
  change = true;
}

function cancel() {
  document.getElementById('full-name-input').value = '';
  document.getElementById('group-input').value = '';
  document.getElementById('theme-input').value = '';
  document.getElementById('company-name-input').value = '';
  document.getElementById('consultant-input').checked = false;
  document.getElementById('id-label').innerText = 'ID:';

  savedId = -1;
  change = false;
}
