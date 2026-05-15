# Budget Tool

A tool for tracking your transactions/financial budgets made using Vue + Typescript + [ShadcnVue](https://www.shadcn-vue.com/). Built for my wife and I as a replacement for an old google sheets budgeting template that became frustrating to maintain. This app relies on you to manually enter your information as you see fit so that you can see how each transaction affects your financial situation in real time. 

## Features 
- Granular budget categories
  - Each budget has a parent category and individual subcategories to keep things organized and easy to read (i.e., Bills -> Mortgage)
- Budgeting by month
  - Apply budgets for any given month. Designed so that you can easily apply any unbudgeted funds for a given month to a future month(s) 
- Savings / Debt goals
  - Set individual goals for any budget. Goals will track progress using the transactions you add and display your progress (and provide a little dopamine confetti explosion when you complete them)
- Import/Export Data
  - The app includes utilities allow you both import and export all the data you've entered into the application. (This was designed to allow for easy sharing between spouses/partners: you can export and swap your data as needed, then merge the data into your device so you can reconcile transactions they entered separately but might still affect your overall budget). 
- PWA support
    - App has been set up as a PWA and has full offline support. All data is stored in localstorage as well. (Nobody needs an internet connection to be able to quickly log your burrito transaction on the fly.)
- Mobile/Desktop Responsiveness
    - Intended to work well in both mobile and desktop browsers with careful decisions made on UI for mobile vs desktop

## Planned Features 
 - Support for importing a bank .csv file directly to ease the initial setup, if desired
 - Sync support (via dropbox and/or syncthing)
		
## Screenshots

Budget Page

| Mobile| Desktop |
| -------- | -------- |
| <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/budgets_mobile.png"> | <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/budgets_desktop.png"> |

Transactions

| Mobile| Desktop |
| -------- | -------- |
| <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/transactions_mobile.PNG"> | <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/transactions_desktop.png"> |

Goals

| Mobile| Desktop |
| -------- | -------- |
| <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/goals_mobile.png"> | <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/goals_desktop.png" > |

Settings 

| Mobile| Desktop |
| -------- | -------- |
| <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/settings_mobile.png"> | <img src="https://raw.githubusercontent.com/erikgoranson/budget-tool/refs/heads/develop/screenshots/settings_desktop.png"> |

## Demo

Live demo available at: [https://eg-budget-tool.vercel.app](https://eg-budget-tool.vercel.app/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```


