import country_list from "./country-list.js";

const dropList = document.querySelectorAll('.drop-list select'),
exchangeBtn = document.querySelector('.exchange-btn'),
amountEle = document.querySelector('.amount input'),
fromCountry = document.querySelector('.from select'),
toCountry = document.querySelector('.to select'),
exchangeRateView = document.querySelector('.exchange-rate-view');


dropList.forEach((selectTag, i) => {
    for(const currency_code in country_list) {
        let selected;
        if(i == 0) {
            selected = currency_code == 'USD' ? 'selected' : '';
        } else if(i == 1) {
            selected = currency_code == 'BDT' ? 'selected' : '';
        }

        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`
        selectTag.insertAdjacentHTML('beforeend', optionTag)
    }
})

const gererateHtmlResult = (inputAmount, totalExchange, fromCountry, toCountry) => {
    exchangeRateView.innerText = `${inputAmount} ${fromCountry} = ${totalExchange} ${toCountry}`
}

const getExchangeRate = e => {
    // e.preventDefault();
    exchangeRateView.innerText = 'Loading...'
    let inputAmount = amountEle.value;
    if(inputAmount == '' || inputAmount == 0) {
        amountEle.value = 1
        inputAmount = 1
    }
    let url = ` https://v6.exchangerate-api.com/v6/3d01ee05e572097c5fdf1009/latest/${fromCountry.value}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const exchangeRate = data.conversion_rates[toCountry.value]
        const totalExchange = (inputAmount * exchangeRate).toFixed(2)
        gererateHtmlResult(inputAmount, totalExchange, fromCountry.value, toCountry.value)
    })
    .catch(err => {
        alert('Somthing went wrong!')
    })

}
exchangeBtn.addEventListener('click', getExchangeRate)

getExchangeRate()