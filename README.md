# ER-diagram-generator
Generate Entity Relationship Diagrams by giving the application instructions in a JSON file.

This project is a cross-platform desktop application made with electron framework and TypeScript.

> **Note**
> 
> Development focuses on Windows systems. Therefore the application might function differently on MacOS and Linux.

# Tools and tech
- Electron framework
- NodeJS backend with TypeScript
- Frontend with TypeScript
- UI with Vanilla HTML and CSS
- End to end type safety

# How to build
To build this project, you need NodeJS on your system (LTS version recommended). NodeJS is a JavaScript runtime. [You can download it here.][NodeJS_download]

Next clone this repository and open your terminal.

Run npm install in the directory root where `package.json` is to install dependencies
```
npm install
```

Open app in development mode
```
npm start
```

# How to use

You can switch between light and dark mode in `Settings`

![Theme Color](./documentation/images/theme_color.JPG?raw=true)

In `Diagram` > `Create New Diagram` you can generate a diagram from JSON file. This will open a file explorer on your system.

> **Note**
> 
> Diagram file needs to have a specific structure in order to generate a diagram from it! Otherwise you will get in-app warnings/error messages.

![Generate From JSON](./documentation/images/generate_from_json.JPG?raw=true)

In `Diagram` > `Options` you will find some extra features

![Options](./documentation/images/diagram_options.JPG?raw=true)


# JSON file structure
WIP


# Development
> **Note**
> 
> This project is in early development.

**Current version is 0.1.0.**

[NodeJS_download]: https://nodejs.org/en/