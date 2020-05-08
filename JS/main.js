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
// const cart=[];
const cart = JSON.parse(localStorage.getItem('DeliveryCart')) || [];
console.log(cart);
const modalBody=document.querySelector('.modal-body');
const buttonClearCart=document.querySelector('.clear-cart');

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
  const logOut = () => {
    login = null;
    buttonAuth.style.display = '';
    userName.style.display ='';
    buttonOut.style.display ='';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('DeliveryLogin');
    cartButton.style.display='';
    chechAuth();
  };
  buttonOut.addEventListener('click', logOut);
  buttonOut.style.display ='flex';
  cartButton.style.display='flex';
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
                  <button class="button button-primary button-add-cart" id=${id}>
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price card-price-bold">${price} ₽</strong>
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

const addToCart = (event) => {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id=buttonAddToCart.id;
    const food = cart.find( (item) => {
      return item.id === id
    });
    if (food)
    {
      food.count += 1;
    }
    else
    {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
    localStorage.setItem('DeliveryCart', JSON.stringify(cart));
  }
};

const renderCart = () => {
  modalBody.textContent='';
  cart.forEach( (item) => {
  const itemCart = `
      <div class="food-row">
      <span class="food-name">${item.title}</span>
      <strong class="food-price">${item.cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${item.id}>-</button>
        <span class="counter">${item.count}</span>
        <button class="counter-button counter-plus" data-id=${item.id}>+</button>
      </div>
      </div>
  `;
  modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce( (result, item) => {
    return result + (parseFloat(item.cost))*item.count;
  }, 0);
  const modalPricetag=document.querySelector('.modal-pricetag');
  modalPricetag.textContent=totalPrice+" ₽";
};

const changeCount = (event) => {
  const target=event.target;
  if (target.classList.contains('counter-button'))
  {
    const food = cart.find( (item) => {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus'))
    {
      food.count--;
      if (food.count === 0)
        cart.splice(cart.indexOf(food), 1);
    }  
    if (target.classList.contains('counter-plus'))
      food.count++;
      renderCart();
  }
  localStorage.setItem('DeliveryCart', JSON.stringify(cart));
};

const init = () =>
{
    // обработчики событий
  cartButton.addEventListener("click", () => {
    toggleModal();
    renderCart();
  });

  close.addEventListener("click", toggleModal);
  cardsMenu.addEventListener('click', addToCart);
  cardsRestaurants.addEventListener('click', () => {
    login ? openGoods(event) : toogleModalAuth(); // Домашка 2
  });
  modalBody.addEventListener('click', changeCount);
  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
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