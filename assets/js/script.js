import country_list from "./country-list.js";

const dropList = document.querySelectorAll('.drop-list select'),
exchangeBtn = document.querySelector('.exchange-btn'),
amountEle = document.querySelector('.amount input'),
fromCountry = document.querySelector('.from select'),
toCountry = document.querySelector('.to select'),
exchangeRateView = document.querySelector('.exchange-rate-view'),
exchangeIcon = document.querySelector('.drop-list .exchange-icon');

const loadFlag = element => { // function to load flag to img tag
    for(const currency_code in country_list) {
        if(currency_code == element.value) { // if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector('img') // selecting img tag of partial select element
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://flagsapi.com/${country_list[currency_code]}/flat/64.png`
            getExchangeRate() // calling 'getExchangeRate' to retrive the result once flag has been changed
        }
    }
}

dropList.forEach((selectTag, i) => { // looping over both select tag 
    for(const currency_code in country_list) {
        let selected;
        if(i == 0) {
            selected = currency_code == 'USD' ? 'selected' : '';
        } else if(i == 1) {
            selected = currency_code == 'BDT' ? 'selected' : '';
        }
        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`
        selectTag.insertAdjacentHTML('beforeend', optionTag)
    }
    selectTag.addEventListener('change', e => {
        loadFlag(e.target) // calling loadFlag with passing target element as argument
    })
})

const gererateHtmlResult = (inputAmount, totalExchange, fromCountry, toCountry) => {
    // insert all values to result tag to show the final exchange
    exchangeRateView.innerText = `${inputAmount} ${fromCountry} = ${totalExchange} ${toCountry}`
}

const getExchangeRate = e => {
    // e.preventDefault();
    exchangeRateView.innerText = 'Loading...'
    let inputAmount = amountEle.value;
    if(inputAmount == '' || inputAmount == 0) { // setting default value to 1 if the input value is empty or zero
        amountEle.value = 1
        inputAmount = 1
    }
    // passing the country code to the api url as an parameter
    let url = `https://v6.exchangerate-api.com/v6/3d01ee05e572097c5fdf1009/latest/${fromCountry.value}`;
    fetch(url) // calling the promise to get requested data
    .then(res => res.json())
    .then(data => { // response of the request
        const exchangeRate = data.conversion_rates[toCountry.value] // exchange rate of giver value throug input tag
        const totalExchange = (inputAmount * exchangeRate).toFixed(2) // calculation the total exchange of given value
        // calling generateHtmlResult to insert all values to result tag to show the final exchange
        gererateHtmlResult(inputAmount, totalExchange, fromCountry.value, toCountry.value)
    })
    .catch(err => {
        // if user is offline or any other error occured while fetching data then catch function will run
        alert('Somthing went wrong!')
    })

}

// adding event litener to exchange button to call the getExchangeRate function
exchangeBtn.addEventListener('click', getExchangeRate)

exchangeIcon.addEventListener('click', () => {
    let tempFromCountry = fromCountry.value; // temporary currency code of FROM droplist
    fromCountry.value = toCountry.value; // passing TO currency code to FROM currency code
    toCountry.value = tempFromCountry; // passing FROM currency code to TO currency code
    loadFlag(fromCountry) // calling loadFlag with passing select element (fromCurrrency) of FROM
    loadFlag(toCountry) // calling loadFlag with passing select element (toCurrency) of TO
})

// calling getExchangeRate initially to show the default exchange rate on windows reload
getExchangeRate()