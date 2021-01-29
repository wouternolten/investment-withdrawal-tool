'use strict';

const DEFAULT_TITLE = 'BTC';
const DEFAULT_STEP_FACTOR = 1.2;
const DEFAULT_SELL_PART = 0.5;
const DEFAULTINITIAL_PRICE = 25000;
const DEFAULT_INITIAL_COINS = 1;
const DEFAULT_INITIAL_FIAT = 0;
const DEFAULT_NUM_OF_ITERATIONS = 10;
const DEFAULT_ROUNDING = 5;

const GLOBAL_INPUTS = [
    {
        name: 'title',
        title: 'Title',
        default: DEFAULT_TITLE
    },
    {
        name: 'stepFactor',
        title: 'Step Factor',
        default: DEFAULT_STEP_FACTOR
    },
    {
        name: 'sellPart',
        title: 'Percentage of coins to sell',
        default: DEFAULT_SELL_PART
    },
    {
        name: 'initialPrice',
        title: 'Initial price of coin',
        default: DEFAULTINITIAL_PRICE
    },
    {
        name: 'initialCoins',
        title: 'Initial coins in wallet',
        default: DEFAULT_INITIAL_COINS
    },
    {
        name: 'initialFiat',
        title: 'Initial fiat in wallet',
        default: DEFAULT_INITIAL_FIAT
    },
    {
        name: 'numOfIterations',
        title: 'Number of iterations',
        default: DEFAULT_NUM_OF_ITERATIONS
    },
    {
        name: 'rounding',
        title: 'Round numbers to',
        default: DEFAULT_ROUNDING
    }
]

class PriceIterator {
    constructor({ title, initialPrice, initialCoins, initialFiat, stepFactor, sellPart, numOfIterations, rounding }) {
        this.title = title;
        this.price = initialPrice;
        this.coins = initialCoins;
        this.fiat = initialFiat;
        this.stepFactor = stepFactor;
        this.sellPart = sellPart;
        this.numOfIterations = numOfIterations;
        this.rounding = rounding;
        this.priceData = [this.price];
        this.coinsData = [this.coins];
        this.fiatData = [this.fiat];
        this.priceFactorData = [this.price / DEFAULTINITIAL_PRICE];
        this.sellData = [this.sellPart * this.coins];
    }

    iterate(num = 0) {
        this.price *= this.stepFactor;
        this.fiat += this.price * this.coins * this.sellPart;
        this.coins *= (1 - this.sellPart);
        this.fiatData.push(+(this.fiat.toFixed(this.rounding)));
        this.priceData.push(+(this.price.toFixed(this.rounding)));
        this.coinsData.push(+(this.coins.toFixed(this.rounding)));
        this.priceFactorData.push(+((this.price / DEFAULTINITIAL_PRICE).toFixed(this.rounding)));
        this.sellData.push(+((this.sellPart * this.coins).toFixed(this.rounding)));

        num++;

        if (num === this.numOfIterations) {
            return;
        }

        return this.iterate(num);
    }

    draw() {
        let options = {
          series: [{
            name: 'Amount',
            data: this.fiatData
        }],
          chart: {
          height: 350,
          type: 'line',
          zoom: {enabled: false}
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: this.title,
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const p = priceIterator;
                return `
                    <div class="arrow_box">
                        <span> Current fiat: ${p.fiatData[dataPointIndex]} </span>
                        <span> Sell at: ${p.priceData[dataPointIndex]} </span>
                        <span> Amount of coins to sell: ${p.sellData[dataPointIndex]} </span>
                        <span> Profit for iteration: ${p.sellData[dataPointIndex] * p.priceData[dataPointIndex]} </span>
                        <span> Current coins: ${p.coinsData[dataPointIndex]} </span>
                        <span> Pricefactor: ${p.priceFactorData[dataPointIndex]} </span>
                    </div
                `;
            }
        },
        markers: {
            size: 5
        },
        xaxis: {
            categories: this.priceData.map((_, index) => index),
            title: {
                text: 'Iterations'
            }
        },
        yaxis: {
            title: {
                text: 'Fiat'
            }    
        }
        };

        var chart = new ApexCharts(document.querySelector('#chart'), options);
        chart.render();
    }
}

let priceIterator = new PriceIterator({
    title: DEFAULT_TITLE,
    initialPrice: DEFAULTINITIAL_PRICE,
    initialCoins: DEFAULT_INITIAL_COINS,
    initialFiat: DEFAULT_INITIAL_FIAT,
    stepFactor: DEFAULT_STEP_FACTOR,
    sellPart: DEFAULT_SELL_PART,
    numOfIterations: DEFAULT_NUM_OF_ITERATIONS
});

const submit = function() {
    const values = {};
    let success = true;
    
    document.querySelectorAll('#js-inputs input').forEach(input => {
        if (input.name !== 'title') {
            if (isNaN(input.value) || Number(input.value) < 0) {
                alert(`${input.placeholder} should be a number and higher than zero.`);
                success = false;
            } else {
                values[input.name] = Number(input.value);
            }

            return;
        }

        if (!input.value) {
            alert(`${input.value} is required.`);
            success = false;    
        }
        
        values[input.name] = input.value;
    });

    if (!success) {
        return;
    }

    document.getElementById('chart').innerHTML = null;

    priceIterator = new PriceIterator(values);
    priceIterator.iterate();
    priceIterator.draw();
}

function createInputs(inputs) {
    const inputContainer = document.getElementById('js-inputs');
    
    inputs.forEach((input) => {
    const inputDiv = document.createElement('div');
        inputDiv.classList.add('input');

        const label = document.createElement('label');
        label.htmlFor = input.name;
        label.appendChild(document.createTextNode(`${input.title}: `));

        inputDiv.appendChild(label);

        const inputElement = document.createElement('input');
        inputElement.name = input.name;
        inputElement.type = 'text';
        inputElement.value = input.default;
        inputElement.placeholder = input.title;

        inputDiv.appendChild(inputElement);

        inputContainer.appendChild(inputDiv);
    })

    const submitButton = document.createElement('button');
    submitButton.onclick = submit;
    submitButton.innerText = 'Submit';
    submitButton.id = 'formSubmitButton';

    inputContainer.appendChild(submitButton);
}

document.addEventListener('DOMContentLoaded', function () {
    createInputs(GLOBAL_INPUTS);
    document.querySelector('#formSubmitButton').click();
});