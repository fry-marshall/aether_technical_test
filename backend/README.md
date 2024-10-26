# Aether Backend technical test

[Project details](./AetherBack-endTakeHome(3)(1).pdf)

## Table of Contents

- [Features](#features)
- [Installation](#installation)

## Features

- Part one ( I've used easy calculation method for that):
    - Enter a US address to search for energy tariffs.
    - Input kWh consumption values (ranging from 1000 to 10000).
    -  Specify a percentage escalator between 4% and 10%.
    - Display the most likely tariffs and selected tariffs.
    - Chart the energy tariffs based on input data.
    - Table of retrieved tariffs for detailed analysis.

- Part Two
    - Create api rest to store data


## Installation

To install and run the application, follow these steps:

- Part One
    - Install NodeJS:

        ```bash
        https://nodejs.org/en/learn/getting-started/how-to-install-nodejs
   
    - Clone repository & install dependencies:

        ```bash
        git clone https://github.com/fry-marshall/aether_technical_test.git
        cd backend
        cd part-one
        cd frontend
        npm install

    - Run the app

    ```bash
        npm start

- Part two
    - Go to directtory

        ```bash
        cd partTwo

    - Install Django & Django REST Framework (Optional)
        ```bash
        pip install django
        pip install djangorestframework

    - Run the server
        ```bash
        python manage.py runserver