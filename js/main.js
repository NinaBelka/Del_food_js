'use strict';

// slider
let swiper = new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'coverflow',
});

// Получение элементов
const cartButton = document.querySelector('#cart-button'),
  modal = document.querySelector('.modal'),
  close = document.querySelector('.close'),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu'),
  restaurantTitle = document.querySelector('.restaurant-title'),
  restaurantRating = document.querySelector('.rating'),
  restaurantPrice = document.querySelector('.price'),
  restaurantCategory = document.querySelector('.category'),
  inputSearch = document.querySelector('.input-search'),
  modalBody = document.querySelector('.modal-body'),
  modalPrice = document.querySelector('.modal-pricetag'),
  buttonClearCart = document.querySelector('.clear-cart');

// сохранение логина авторизации
let login = localStorage.getItem('gloDelivery');

// валидация логина авторизации
function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

// сохранение товаров в корзине
const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if (localStorage.getItem(`gloDelivery_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
    cart.push(...data);
  }
}

// запрос данных из базы
const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибка ${response.status}!`)
  }
  return response.json();
};

// открытие модального окна
function toggleModal() {
  modal.classList.toggle('is-open');
}

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
    cart.length = 0;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

// при отсутствии авторизации
function notAuthorized() {

  function logIn(event) {
    event.preventDefault();

    if (validName(loginInput.value)) {
      login = loginInput.value;

      localStorage.setItem('gloDelivery', login);

      toggleModalAuth();
      downloadCart();
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

// создание карточки ресторана
function createCardRestaurant({ image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery }) {
  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
    <img src="${image}" alt="image"
      class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

// создание карточки товара
function createCardGood({ description, image, name, price, id }) {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src=${image} alt=${name}  class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
		</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

// открытие карточки ресторана
function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      // swiper.destroy(false, true);
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      const { name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

// Добавление товаров в корзину
function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({ id, title, cost, count: 1 });
    }

    saveCart();
  }
}

// рендер товаров в корзине
function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
  saveCart();
}

// реализация счетчика товаров в корзине
function changeCount(event) {
  const target = event.target;
  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) {
      food.count++;
    }
    renderCart();
  }
}

function init() {

  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant)
  });

  buttonAuth.addEventListener('click', clearForm);

  cartButton.addEventListener('click', function () {
    renderCart()
    toggleModal();
  });

  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
    toggleModal();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener('click', toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    // swiper.init();
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  inputSearch.addEventListener('keypress', event => {

    if (event.charCode === 13) {
      const value = event.target.value.trim();
      if (!value) {
        event.target.style.backgroundColor = 'red';
        event.target.value = '';
        setTimeout(function () {
          event.target.style.backgroundColor = '';
        }, 1500);
        return;
      }

      getData('./db/partners.json')
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = '';

          linksProduct.forEach(function (link) {
            getData(`./db/${link}`)
              .then(function (data) {

                const resultSearch = data.filter(function (item) {
                  const name = item.name.toLowerCase();
                  return name.includes(value.toLowerCase());
                });

                containerPromo.classList.add('hide');
                // swiper.destroy(false, true);
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                restaurantTitle.textContent = 'Результат поиска';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = '';
                restaurantCategory.textContent = 'Разная кухня';

                resultSearch.forEach(createCardGood);
              })
          });
        });
    }
  });

  checkAuth();
}
init();