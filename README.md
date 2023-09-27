# SwipeablePanel

## Development server

Run `nx serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx generate component component-name` to generate a new component. You can also use `nx generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `nx build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `nx test` to execute the unit tests via [Jest](https://github.com/jestjs/jest).

## Running end-to-end tests

Run `nx e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Nx CLI use `nx help` or go check out the [Nx](https://nx.dev) page.

# TS config

"esModuleInterop": true, // otherwise Jest will output a lot of warnings in the console
"emitDecoratorMetadata": true, // otherwise Angular DI won't work with Jest
