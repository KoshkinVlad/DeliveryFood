'use strict';
// переменные и константы
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth'); // кнопка авторизации
const modalAuth = document.querySelector('.modal-auth'); // окно авторизации
const closeAuth = document.querySelector('.close-auth'); // окно закрытия окна авторизации
const logInForm = document.getElementById('logInForm'); // форма авторизации
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants=document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants=document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
let login = localStorage.getItem('DeliveryLogin');

// функции
const toggleModal = () => {
  modal.classList.toggle("is-open");
};

const toogleModalAuth = () => {
  modalAuth.classList.toggle('is-open'); // вкл/выкл видимость окна авторизации
  loginInput.style.border='';
};

const authorized = () =>{
  console.log('Авторизован');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display ='inline';
  buttonOut.style.display ='block';
  const logOut = () => {
    login = null;
    buttonAuth.style.display = '';
    userName.style.display ='';
    buttonOut.style.display ='';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('DeliveryLogin');
    chechAuth();
  };
  buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () =>{
  console.log('Не авторизован');
  loginInput.style.border='';
  const logIn = (event) => {
    event.preventDefault();
    login=loginInput.value;
    if (login !=='')
    {
      localStorage.setItem('DeliveryLogin', login);
      toogleModalAuth();
      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      chechAuth();
    }
    else
    {
      loginInput.style.border='3px solid red';
    }
  };
  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

const chechAuth = () => {
  login ? authorized() : notAuthorized();
};

const createCardRestaurant = () => {
  const card = `
          <a class="card card-restaurant">
          <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title">Пицца плюс</h3>
              <span class="card-tag tag">50 мин</span>
            </div>
            <div class="card-info">
              <div class="rating">
                4.5
              </div>
              <div class="price">От 900 ₽</div>
              <div class="category">Пицца</div>
            </div>
          </div>
        </a>
`;
   cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = () => {
  const card=document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
              <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title card-title-reg">Пицца Классика</h3>
                </div>
                <div class="card-info">
                  <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
                    грибы.
                  </div>
                </div>
                <div class="card-buttons">
                  <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price-bold">510 ₽</strong>
                </div>
              </div>
            </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

const openGoods = (event) => {
  const target = event.target;
  const restaurant=target.closest('.card-restaurant');
  if (restaurant)
  {
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    cardsMenu.textContent='';
    createCardGood();
  }
};

// обработчики событий
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', () => {
  login ? openGoods(event) : toogleModalAuth(); // Домашка 2
});
logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

// вызовы функций
chechAuth();
createCardRestaurant();