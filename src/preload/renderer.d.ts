// Declare global types here. Export preload.ts API types here.
// Renderer process can use these types.

export namespace PreloadProcess {
    export interface DarkMode {
        system: () => Promise<void>,
        toggleDark: () => Promise<void>,
        toggleLight: () => Promise<void>,
    }
    
    export interface SystemDialog {
        openJSONFile: () => Promise<DiagramStructure.Diagram | undefined>,
    }
    
    export interface MenuItemFunctionality {
        onCreateTestEntity: (callback: () => void) => void,
        onCreateDiagramFromJSON: (callback: () => void) => void,
        onResetDiagram: (callback: () => void) => void,
        onShowRenderArea: (callback: () => void) => void,
        onHideRenderArea: (callback: () => void) => void,
    }
}
  
declare global {
    // Make preload script API types available to renderer process
    interface Window {
        darkMode: PreloadProcess.DarkMode,
        systemDialog: PreloadProcess.SystemDialog,
        menuItemFunctionality: PreloadProcess.MenuItemFunctionality,
    }

    // Make this namespace available to renderer process
    // Contains types for diagram data
    namespace DiagramStructure {
        interface Diagram {
            settings: {
                diagramName: string,
                requiredOptionOutput: string
            },
            details: DiagramDetail[],
            entities: DiagramEntity[],
            relationships: DiagramRelationship[]
        }
        
        interface DiagramDetail {
            detail: string,
            description: string
        }
        
        interface DiagramEntity {
            name: string,
            fields: DiagramEntityField[]
        }
        
        interface DiagramEntityField {
            name: string,
            keyType: string,
            dataType: string,
            required: boolean
        }

        interface DiagramRelationship {
            relationship: string
        }
    }
}