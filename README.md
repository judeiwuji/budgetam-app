# BudgetamApp Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.




# BudgetamApp Backend

## Installing the necessary packages
`pip install -u pip && pip install -r backend\flask_web_app\requirements.txt`
## Running the backend
By default the server will run on `0.0.0.0:5000` but if you want to run it on a different port and host set in the environment variable the `HOST` and `PORT`.
### In the terminal
`python -m api.v0.entrypoint`

## Running tests


### In the terminal
`python -m pytest -v`

### Using coverage
`coverage run -m pytest -v && coverage report -m`
