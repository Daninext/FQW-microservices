window.addEventListener('load', (event) => start());

function start() {
  if (!document.location.pathname.includes('/auth')) {
    if (!document.cookie.match(/sFrontToken=(.+?)(;|$)/)) {
      greetingBuild(undefined);
      return;
    }

    let frontTokenFromRequestHeader = document.cookie.match(
      /sFrontToken=(.+?)(;|$)/,
    )[1];

    let frontTokenDecoded = JSON.parse(
      decodeURIComponent(escape(atob(frontTokenFromRequestHeader))),
    );
    greetingBuild(frontTokenDecoded.up.username);
  }
}

function greetingBuild(name) {
  if (name) {
    document.getElementsByClassName('greeting')[0].innerText = 'Hello, ' + name;
    document
      .getElementById('logout-button')
      .setAttribute('style', 'display: inline-block');
  }
}

function logout() {
  document.cookie = 'code=';
  window.location.href = '/auth/logout';
}

supertokens.init({
  appInfo: {
    apiDomain: 'http://localhost:201',
    apiBasePath: '/auth',
    appName: 'service-1',
  },
  recipeList: [supertokensSession.init(), supertokensEmailPassword.init()],
});

async function signUpClicked() {
  let email = document.getElementById('sign-up-email-input').value;
  let password = document.getElementById('sign-up-password-input').value;
  try {
    let response = await supertokensEmailPassword.signUp({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    });
    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          window.alert(formField.error);
        } else if (formField.id === 'password') {
          window.alert(formField.error);
        }
      });
    } else {
      create();
      compare();
      window.location.href = '/forms';
    }
  } catch (err) {
    if (err.isSuperTokensGeneralError === true) {
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}

async function signInClicked() {
  let email = document.getElementById('sign-in-email-input').value;
  let password = document.getElementById('sign-in-password-input').value;
  try {
    let response = await supertokensEmailPassword.signIn({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    });

    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          window.alert(formField.error);
        }
      });
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      window.alert('Email password combination is incorrect.');
    } else {
      compare();
      window.location.href = '/forms';
    }
  } catch (err) {
    if (err.isSuperTokensGeneralError === true) {
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}

function create() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({
    username: document.getElementById('sing-up-username-input').value,
  });

  xhr.open('POST', '/user/create', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}

function compare() {
  let xhr = new XMLHttpRequest();

  let json = JSON.stringify({});

  xhr.open('POST', '/auth/compare', false);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
}
