// This file contains functions to read from files
// and create diagram data based on it

import { dialog } from "electron";
import * as fs from "fs/promises";

export namespace diagramFile {
  const createDiagramData = (data: object): DiagramStructure.Diagram | undefined => {
    // Check if all properties and types are valid in data
    // After that, create diagram data and parse data into it

    // Exact number of items in each section
    const requiredDetailItemCount = 2;
    const requiredEntityItemCount = 2;
    const requiredEntityFieldItemCount = 4;
    const requiredRelationshipItemCount = 1;

    if (data && typeof data === "object") {
      if ("settings" in data && typeof data.settings === "object"
        && "details" in data && typeof data.details === "object"
        && "entities" in data && typeof data.entities === "object"
        && "relationships" in data && typeof data.relationships === "object"
      ) {
        console.log("Data Root: OK");
        
        // settings
        if (data.settings && data.details
          && data.entities && data.relationships
          && "diagramName" in data.settings
          && typeof data.settings.diagramName === "string"
          && "requiredOptionOutput" in data.settings
          && typeof data.settings.requiredOptionOutput === "string"
        ) {
          console.log("Settings: OK");

          // Create diagram data based on checked valid data
          const diagramData: DiagramStructure.Diagram = {
            settings: {
              diagramName: data.settings.diagramName,
              requiredOptionOutput: data.settings.requiredOptionOutput
            },
            details: [],
            entities: [],
            relationships: []
          };

          // details
          for (const item of Object.values(data.details)) {
            if (item && typeof item === "object"
              && "detail" in item && typeof item.detail === "string"
              && "description" in item && typeof item.description === "string"
            ) {
              // Check if there is valid number of props
              let detailItemCount = 0;

              for (const _value of Object.values(item)) {
                detailItemCount++;
              }

              // Push detail into diagram data
              if (detailItemCount === requiredDetailItemCount) {
                diagramData.details.push(item);
              }
              else return;
            }
            else return;
          }

          console.log("Details: OK");

          // entities
          for (const item of Object.values(data.entities)) {
            if (item && typeof item === "object"
              && "name" in item && typeof item.name === "string"
              && "fields" in item && typeof item.fields === "object"
              && item.fields
            ) {
              // Check for nested properties
              for (const field of Object.values(item.fields) as any) {
                if (field && typeof field === "object"
                  && "name" in field && typeof field.name === "string"
                  && "keyType" in field && typeof field.keyType === "string"
                  && "dataType" in field && typeof field.dataType === "string"
                  && "required" in field && typeof field.required === "boolean"
                ) {
                  // Check if there is valid number of props
                  let entityFieldItemCount = 0;

                  for (const _value of Object.values(field)) {
                    entityFieldItemCount++;
                  }

                  if (entityFieldItemCount !== requiredEntityFieldItemCount) return;
                }
                else return
              }

              // Check if there is valid number of props
              let entityItemCount = 0;

              for (const _value of Object.values(item)) {
                entityItemCount++;
              }

              // Push entity into diagram data
              if (entityItemCount === requiredEntityItemCount) {
                diagramData.entities.push(item);
              }
              else return;
            }
            else return;
          }

          console.log("Entities: OK");

          // relationships
          for (const item of Object.values(data.relationships)) {
            if (item && typeof item === "object"
              && "relationship" in item && typeof item.relationship === "string"
            ) {
              // Check if there is valid number of props
              let relationshipItemCount = 0;

              for (const _value of Object.values(item)) {
                relationshipItemCount++;
              }

              // Push detail into diagram data
              if (relationshipItemCount === requiredRelationshipItemCount) {
                diagramData.relationships.push(item);
              }
              else return;
            }
            else return;
          }

          console.log("Relationships: OK");

          // If everything was valid, return diagramData
          console.log(diagramData);
          return diagramData;
        }
      }
    }
  }
  
  export const readJSONFileAndCreateDiagramData = async (filePaths: string[]): Promise<unknown> => {
    // Read only the first file
    const firstFile = filePaths[0];

    let diagramData: unknown;

    // Read the contents
    await fs.readFile(firstFile, {
      encoding: "utf8"
    }).then(contents => {
      // convert from JSON string into object
      try {
        const data = JSON.parse(contents);

        // Check raw data
        // console.log(data);

        diagramData = createDiagramData(data);

        // If data was invalid, show warning
        if (diagramData === undefined) {
          dialog.showMessageBox({
            message: "Warning! Opened JSON file is not a valid Entity Relationship Diagram generation file."
              + " Make sure the file has correct syntax and fix typos.",
            type: "warning",
            title: "Failed to handle opened file!"
          });
        }

      } catch (err) {
        console.log(err);
        dialog.showErrorBox("Error reading file!", "File is not valid JSON.");
      }
    }).catch(err => {
      console.log(err);
      dialog.showErrorBox("Error reading file!", "Cannot read this file.");
    })

    return diagramData;
  }
}