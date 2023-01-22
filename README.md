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

You can switch between light and dark mode in `Settings` > `Theme Color.`

![Theme Color](./documentation/images/theme_color.JPG?raw=true)

In `Diagram` > `Create New Diagram` you can generate a diagram from JSON file. This will open a file explorer on your system.

> **Note**
> 
> Diagram file needs to have a specific structure in order to generate a diagram from it! Otherwise you will get in-app warnings/error messages.

![Generate From JSON](./documentation/images/generate_from_json.JPG?raw=true)

In `Diagram` > `Options` you will find some extra features

![Options](./documentation/images/diagram_options.JPG?raw=true)


# JSON file structure

The diagram file needs to be a `JSON file` (.json extension). It also needs to have the following structure:
```json
{
    "settings": {
        "diagramName": "Some diagram",
        "requiredOptionOutput": "NN"
    },
    "details": [
        {
            "detail": "NN",
            "description": "Not Null"
        }
    ],
    "entities": [
        {
            "name": "Example",
            "fields": [
                {
                    "name": "example_field_1",
                    "keyType": "PK",
                    "dataType": "serial",
                    "required": true
                },
                {
                    "name": "example_field_2",
                    "keyType": "",
                    "dataType": "text",
                    "required": true
                },
                {
                    "name": "example_field_3",
                    "keyType": "FK",
                    "dataType": "integer",
                    "required": true
                }
            ]
        }
    ],
    "relationships": [
        {
            "relationship": "(FK) ExampleEntity2.field_4 << (PK) ExampleEntity.field_1"
        }
    ]
}
```

## Important

`Key` names must be the same, but `values` you can modify how you like!

`details`, `entities` and `relationships` can have several objects, but `settings` must be like above. Example above has only one object in each section.

> **Warning**
> 
> When you try to generate a diagram, the application will give you warnings and errors if your JSON file doesn't have the above structure.


## Syntax

`diagramName` is the name of the diagram

`requiredOptionOutput` is what `required` option in entity fields will show in rendered diagram, if it is set to `true`.

`keyType` can be PK (Primary Key), FK (Foreign Key) or nothing.

`relationship` values can be anything. Above is just one example.

> **Note**
> 
> If `required` is set to `false` in entity fields, it won't show anything in rendered diagram.


## Examples

Check `diagram_files` folder for example diagram files.


# Example Diagrams

Here are how examples in `diagram_files` folder look like in the app after they have been generated.

`test-diagram-1.json` in dark mode:

![test-diagram-1.json in dark mode](./documentation/images/test_diagram_1_dark.JPG?raw=true)

`structure.json` in light mode:

![structure.json in light mode](./documentation/images/structure_light.JPG?raw=true)


# Development

This project is in early development.

**Current version is 0.1.0.**

[NodeJS_download]: https://nodejs.org/en/