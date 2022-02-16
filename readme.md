# Install / init npm

`npm install`

`npm init`

This will generate your package.json, and other crucial NodeJS files

# Install node-sass compiler

`npm install node-sass`

# Create a shortcut command in package.json

You can create a shortcut for compiling scss by adding it to the scripts in package.json:

`"scss": "node-sass --watch public/assets/styling/main.scss -o public/assets/styling/"`

Note: the --watch command is optional.

Note: You can name the command anything you want. The above script command can be run with:

`npm run scss`
