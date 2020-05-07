'use strict';
// переменные и константы
const PARTNERS='./db/partners.json';
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

const createCardRestaurant = (element) => {
  const { 
    image, 
    kitchen, 
    name, 
    price, 
    stars, 
    products, 
    time_of_delivery : timeOfDelivery
  } =element;
  const card = `
          <a class="card card-restaurant" data-products="${products}">
          <img src="${image}" alt="image" class="card-image"/>
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
        </a>
`;
   cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = (element) => {
  const { 
    id, 
    name, 
    description, 
    price, 
    image, 
  } = element;
  const card=document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
              <img src="${image}" alt="image" class="card-image"/>
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                  <div class="ingredients">${description}
                  </div>
                </div>
                <div class="card-buttons">
                  <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price-bold">${price} ₽</strong>
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
    console.log(restaurant);
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    cardsMenu.textContent='';
    const restaurantInfo=document.getElementById('restaurant-info');
    restaurantInfo.innerHTML=`
          <h2 class="section-title restaurant-title">${restaurant.querySelector('.card-title').textContent}</h2>
          <div class="card-info">
            <div class="rating">
            ${restaurant.querySelector('.rating').textContent}
            </div>
            <div class="price">${restaurant.querySelector('.price').textContent}</div>
            <div class="category">${restaurant.querySelector('.category').textContent}</div>
          </div>
    `;
    getData(`./db/${restaurant.dataset.products}`).then((response) => {
      response.forEach(element => {
        createCardGood(element);
      });
    });
  }
};
// запрос для получения базы данных
const getData = async function(url)
{
  const response=await fetch(url);
  if (!response.ok)
  {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }
  return await response.json();
};

const init = () =>
{
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
  // выводим партнёров на страницу
  getData(PARTNERS).then((response) => {
    response.forEach(element => {
      createCardRestaurant(element);
    });
  });
}

init();