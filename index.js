import { countries } from './flags.js'

'use strict'

window.onload = init;

function init() {
  const form = document.querySelector('.needs-validation')
  const inputName = document.querySelectorAll('.inputName')
  const inputEmail = document.querySelector('.inputEmail')
  const inputCode = document.querySelector('#floatingSelect')
  const inputPhone = document.querySelector('.inputPhone')

  fetch("https://ipinfo.io/json?token=c54ae77dc28792").then(
    (response) => response.json()
  ).then(
    (jsonResponse) => setList(jsonResponse.country)
  ).catch(function () {
    console.log("Something went wrong, maybe turn off ADBlocker");
  });

  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }
    form.classList.add('was-validated')
  }, false)

  Array.from(inputName).forEach(elem => {
    elem.addEventListener('input', () => {
      if (form.classList.contains('was-validated')) {
        checkFirstLastNames(elem.parentNode.lastElementChild, elem.value)
      }
    })
  })

  const checkFirstLastNames = (elem, data) => {
    if (data.length < 2) {
      setFeedbak(elem, 'Input required at least 2 letters')
    } else if (!data.match(/^[A-Za-zА-Яа-я]{2,35}$/gm)) {
      setFeedbak(elem, 'Input required only letters. No numbers and symbols')
    } else {
      elem.style.display = 'none'
    }
  }

  inputEmail.addEventListener('input', () => {
    if (form.classList.contains('was-validated')) {
      const elem = inputEmail.parentNode.lastElementChild
      const data = inputEmail.value
      if (data !== data.toLowerCase()) {
        setFeedbak(elem, 'Sorry, lower case only')
      } else if (!data.match(/@/gm)) {
        setFeedbak(elem, 'Email address must contain @')
      } else if (!data.match(/@[a-z0-9.-]+\.[a-z]{2,4}$/gm)) {
        setFeedbak(elem, 'Correct mail address must contain "." after @')
      } else {
        elem.style.display = 'none'
      }
    }
  })

  inputCode.addEventListener('change', () => {
    const codeFlag = inputCode.options[inputCode.selectedIndex].text.substring(1, 4)
    if (codeFlag) {
      countries.forEach(e => e.number == codeFlag && setFlag(e.country.toLowerCase()))
    }
  }
  )

  inputPhone.addEventListener('input', () => {
    if (!inputPhone.value[inputPhone.value.length - 1].match(/^[0-9]+/g)) {
      inputPhone.value = inputPhone.value.substring(0, inputPhone.value.length - 1);
    }
    if (!form.classList.contains('was-validated')) return
    if (!inputPhone.value.match(/^[0-9]{10,12}/g)) {
      setFeedbak(inputPhone.parentNode.lastElementChild, 'Phone format allows 12-14 numbers')
    } else {
      inputPhone.parentNode.lastElementChild.style.display = 'none'
    }
  }
  )

  const setList = userCountry => {
    console.log(userCountry)
    countries.forEach(e => {
      inputCode.innerHTML += `<option value=${e.country} ${e.country === userCountry && 'selected'}>+${e.number}</option>`
      if (e.country === userCountry) {
        setFlag(e.country.toLowerCase())
      }
    })
  }

  const setFlag = countryCode => {
    inputPhone.style.backgroundImage = `url(https://flagcdn.com/16x12/${countryCode}.png)`
  }

  const setFeedbak = (elem, message) => {
    elem.style.display = 'block'
    elem.innerHTML = message;
  }
}