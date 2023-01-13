// Declare global types here. Export preload.ts API types here.
// Renderer process can use these types.

export namespace PreloadProcess {
    export interface DarkMode {
        toggle: () => Promise<void>,
        system: () => Promise<void>,
        toggleDark: () => Promise<void>,
        toggleLight: () => Promise<void>,
    }
    
    export interface SystemDialog {
        openJSONFile: () => Promise<void>,
    }
    
    export interface OpenWindow {
        createEntity: () => Promise<void>,
    }
    
    export interface MenuItemFunctionality {
        onCreateTestEntity: (callback: () => void) => void
    }
}
  
declare global {
    // Make preload script API types available to renderer process
    interface Window {
        darkMode: PreloadProcess.DarkMode,
        systemDialog: PreloadProcess.SystemDialog,
        openWindow: PreloadProcess.OpenWindow,
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
            customization: {
                theme: string
            },
            details: DiagramDetail[],
            entities: DiagramEntity[],
            relationships: {
        
            }
        }
        
        interface DiagramDetail {
            detail: string,
            description: string
        }
        
        interface DiagramEntity {
            name: string,
            id: number,
            fields: IDiagramEntityField[]
        }
        
        interface DiagramEntityField {
            name: string,
            isPK: boolean,
            dataType: string,
            required: boolean
        }
    }
}