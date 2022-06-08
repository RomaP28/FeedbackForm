import { countries } from './flags.js'

'use strict'

window.onload = init;

function init() {
  const form = document.querySelector('.needs-validation')
  const inputName = document.querySelectorAll('.inputName')
  const inputEmail = document.querySelector('.inputEmail')
  const phoneCode = document.querySelector('#inputCode')
  const inputPhone = document.querySelector('.inputPhone')
  const datalist = document.querySelector('#datalistOptions')

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

  inputEmail.addEventListener('input', () => {
    if (form.classList.contains('was-validated')) {
      checkEmail(inputEmail.parentNode.lastElementChild, inputEmail.value)
    }
  })

  phoneCode.addEventListener('input', () => {
    if (phoneCode.value[0] !== '+' || phoneCode.value.length < 1) {
      phoneCode.value = `+${phoneCode.value}`
    }
    if (!phoneCode.value[phoneCode.value.length - 1].match(/^[0-9]+/g)) {
      phoneCode.value = phoneCode.value.substring(0, phoneCode.value.length - 1);
    }
    if (phoneCode.value.substring(1, 4)) {
      let codeFlag = phoneCode.value.substring(1, 4)
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

  const setFlag = countryCode => {
    if (!countryCode) return
    inputPhone.style.backgroundImage = `url(https://flagcdn.com/16x12/${countryCode}.png)`
  }

  const setList = userCountry => {
    countries.forEach(e => {
      datalist.innerHTML += `<option value=+${e.number}>`
      if (e.country === userCountry) {
        phoneCode.value = `+${e.number}`
        setFlag(e.country.toLowerCase())
      }
    })
  }

  const checkFirstLastNames = (elem, data) => {
    if (data.length < 2) {
      setFeedbak(elem, 'Input required at least 2 letters')
    } else if (!data.match(/^[A-Za-zА-Яа-я]{2,35}$/gm)) {
      setFeedbak(elem, 'Input required only letters. No numbers and symbols')
    } else {
      elem.style.display = 'none'
    }
  }

  const checkEmail = (elem, data) => {
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

  const setFeedbak = (elem, message) => {
    elem.style.display = 'block'
    elem.innerHTML = message;
  }

}