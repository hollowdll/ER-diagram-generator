// Declare global types here. Export preload.ts API types here.
// Renderer process can use these types.

export namespace PreloadProcess {
  export interface SystemDialog {
    openJSONFile: () => Promise<DiagramStructure.Diagram | undefined>,
  }

  export interface MenuItemFunctionality {
    onCreateDiagramFromJSON: (callback: () => void) => void,
    onResetDiagram: (callback: () => void) => void,
    onShowRenderArea: (callback: () => void) => void,
    onHideRenderArea: (callback: () => void) => void,
    onShowDetails: (callback: () => void) => void,
    onHideDetails: (callback: () => void) => void,
    onShowRelationships: (callback: () => void) => void,
    onHideRelationships: (callback: () => void) => void,
  }

  export interface DiagramCustomizaion {
    applyColors: (colors: DiagramItemColors) => Promise<void>,
    onApplyColors: (callback: (
      event: Electron.IpcRendererEvent,
      colors: DiagramItemColors
    ) => void) => Promise<void>,
    onGetCurrentColors: (callback: (
      event: Electron.IpcRendererEvent,
      windowId: number
    ) => void) => void,
    onSendCurrentColors: (callback: (
      event: Electron.IpcRendererEvent,
      colors: DiagramItemColors
    ) => void) => void,
  }
}

declare global {
  // Make preload script API types available to renderer process
  interface Window {
    darkMode: PreloadProcess.DarkMode,
    systemDialog: PreloadProcess.SystemDialog,
    menuItemFunctionality: PreloadProcess.MenuItemFunctionality,
    diagramCustomization: PreloadProcess.DiagramCustomizaion,
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