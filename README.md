# Investment helping tool

A simple tool to help you calculate when to sell portions of your investment.

## DISCLAIMER

I'm not a financial advisor. Use this tool at your own risk. Conduct your own due diligence, or consult a licensed financial advisor or broker before making any and all investment decisions. Any investments, trades, speculations, or decisions made on the basis of any information provided by this tool, expressed or implied herein, are committed at your own risk, financial or otherwise.

## How to install

Clone this repo.

Download the [apexCharts library](https://apexcharts.com/) and put the minified js, together with the css in a new folder called 'dist'.

Open index.html in a browser of choice.

## How it works

Calculating the options happens in iterations. An iteration is not a set date, it's a set price to sell. Each iteration, the parameters are applied and a price to sell rolls out.

## Input parameters

- Title: title for the graph (coin name)
- Step factor: step factor in pricing. A step factor of 1.2 means that everytime you would like to sell, it's 20% higher than the previous prices.
- Percentage of coins to sell: choose the percentage you want to sell each iteraton
- Initial price of a coin: the price you want to start off with. For instance, you could start with the current price of the coin, or your average buying price.
- Initial coins in wallet: the initial amount of coins in your wallet. This will be used to calculate how much to sell each iteration.
- Initial fiat in wallet: just for reference, so you know what you have in total on each iteration.
