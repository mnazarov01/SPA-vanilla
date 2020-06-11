
const $success = document.querySelector('#success');
const $wrapperSuccess = document.querySelector('#success_wrapper');

const $error = document.querySelector('#error');
const $wrapperError = document.querySelector('#error_wrapper');

document.querySelector('#error_close').addEventListener('click', () => {
  $wrapperError.classList.remove('active');
});

export {
  $success, $wrapperSuccess, $error, $wrapperError,
};
