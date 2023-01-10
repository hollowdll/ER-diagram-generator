// Define types for the diagram structure here

export interface IDiagram {
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

export interface IDiagramDetail {
    detail: string,
    description: string
}

export interface IDiagramEntity {
    name: string,
    id: number,
    fields: IDiagramEntityField[]
}

export interface IDiagramEntityField {
    name: string,
    isPK: boolean,
    dataType: string,
    required: boolean
}

