// prev
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
function toggleModal() {
  modal.classList.toggle("is-open");
}
// day 1
// переменные и константы
const buttonAuth = document.querySelector('.button-auth'); // кнопка авторизации
const modalAuth = document.querySelector('.modal-auth'); // окно авторизации
const closeAuth = document.querySelector('.close-auth'); // окно закрытия окна авторизации
const logInForm = document.getElementById('logInForm'); // форма авторизации
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
let login=localStorage.getItem('DeliveryLogin');

// функции
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
chechAuth();