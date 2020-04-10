const cartButton=document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close=document.querySelector('.close');
const cancel=document.querySelector('#cancel-button');

cartButton.addEventListener('click', () => {
    modal.classList.add('is-open');
});
close.addEventListener('click', () => {
    modal.classList.remove('is-open');
});
cancel.addEventListener('click', () => {
    modal.classList.remove('is-open');
});


new WOW().init();