# Aether Backend technical test


## Installation

To install and run the application, follow these steps:

- Run a virtual environment
    ```bash
        python3 -m venv env
        source env/bin/activate
   
- Install dependencies:

    ```bash
        pip install django
        pip install djangorestframework
        pip install django-cors-headers

- Run the migrations

    ```bash
        python3 manage.py makemigrations
        python3 manage.py migrate

- Run server
    ```bash
        python3 manage.py runserver

- Run react app
    ```bash
        cd frontend
        npm install
        npm start