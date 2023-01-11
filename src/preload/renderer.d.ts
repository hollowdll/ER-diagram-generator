// Declare global types here. Export preload.ts API types here.
// Renderer process can use these types.

export interface IDarkMode {
    toggle: () => Promise<void>,
    system: () => Promise<void>,
    toggleDark: () => Promise<void>,
    toggleLight: () => Promise<void>,
}

export interface ISystemDialog {
    openJSONFile: () => Promise<void>,
}
  
declare global {
    // Make preload script API types available to renderer process
    interface Window {
        darkMode: IDarkMode,
        systemDialog: ISystemDialog,
    }

    // Make this namespace available to renderer process
    // Contains types for diagram data
    namespace DiagramStructure {
        interface IDiagram {
            settings: {
                diagramName: string,
                requiredOptionOutput: string
            },
            customization: {
                theme: string
            },
            details: IDiagramDetail[],
            entities: IDiagramEntity[],
            relationships: {
        
            }
        }
        
        interface IDiagramDetail {
            detail: string,
            description: string
        }
        
        interface IDiagramEntity {
            name: string,
            id: number,
            fields: IDiagramEntityField[]
        }
        
        interface IDiagramEntityField {
            name: string,
            isPK: boolean,
            dataType: string,
            required: boolean
        }
    }
}