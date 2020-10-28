'use strict';

// интенсив по css
const cartButton = document.querySelector('#cart-button'),
  modal = document.querySelector('.modal'),
  close = document.querySelector('.close');

cartButton.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);

function toggleModal() {
  modal.classList.toggle('is-open');
}

// интенсив по js

// Получение элементов
const buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');

// авторизация
function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else {
    enableScroll();
  }
}

// очистка формы
function clearForm() {
  loginInput.style.borderColor = '';
  logInForm.reset();
}

// при авторизации
function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

// при отсутствии авторизации
function notAuthorized() {

  function logIn(event) {
    event.preventDefault();

    if (loginInput.value.trim()) {
      login = loginInput.value;

      localStorage.setItem('gloDelivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      checkAuth();
    } else {
      loginInput.style.borderColor = '#FF0000';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', event => {
    if (event.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  });
}

// проверка наличия авторизации
function checkAuth() {

  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

buttonAuth.addEventListener('click', clearForm);

checkAuth();