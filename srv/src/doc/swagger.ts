import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc'

const swaggerDefinition: OAS3Definition = {
    "openapi": "3.0.3",
    "info": {
        "title": "Prontos pagos | API REST",
        "description": "Documentation to expose API REST endpoints and its HTTP requests.",
        "version": "0.0.1"
    },
    "tags": [
        {
            "name": "Test",
            "description": "Check if server is available."
        },
        {
            "name": "Application instance",
        }
    ],
    "servers": [
        {
            "url": "https://prontospagosserviceqa.cfapps.us10.hana.ondemand.com"
        },
        {
            "url": "http://localhost:5000"
        }
    ],
    "paths": {
        "/ping": {
            "get": {
                "tags": [
                    "Test"
                ],
                "summary": "",
                "description": "null",
                "operationId": "ping",
                "responses": {
                    "200": {
                        "description": "Response OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "string",
                                    "example": "Pong 🏓"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications": {
            "post": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "Creates an application instance (wf, hana).",
                "operationId": "createApplication",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ApplicationToCreate"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Response OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Application"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Bad request"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            },
            "get": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "Retrieves the list of application entries (wf, hana).",
                "operationId": "getApplications",
                "responses": {
                    "200": {
                        "description": "Response OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "$ref": "#/components/schemas/Application"
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications/{id}": {
            "get": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "Retrieves an application given its 'id' (wf, hana).",
                "operationId": "getSingleApplication",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Response OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Application"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "404": {
                        "description": "No application instance matches with this ID"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications/{id}/cancel": {
            "put": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "",
                "operationId": "cancelApplication",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "reason": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "204": {
                        "description": "Response OK"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "404": {
                        "description": "Given application ID does not match with a RUNNING instance. Check if application exists or it has a final status."
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications/{id}/reject": {
            "put": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "",
                "operationId": "rejectApplication",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "reason": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "204": {
                        "description": "Response OK"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "404": {
                        "description": "Given application ID does not match with a RUNNING instance. Check if application exists or it has a final status."
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications/{id}/approveLevel": {
            "put": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "Set the current level (workflow task) to 'COMPLETED'.",
                "operationId": "approveApplicationLevel",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "reason": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "204": {
                        "description": "Response OK"
                    },
                    "400": {
                        "description": "This application instance already has a final status."
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "404": {
                        "description": "This application instance does not exists."
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications/own": {
            "get": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "Retrieves applications by logged user on BTP'.",
                "operationId": "getOwnApplications",
                "responses": {
                    "200": {
                        "description": "Response OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "$ref": "#/components/schemas/Application"
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        },
        "/api/applications/toApprove": {
            "get": {
                "tags": [
                    "Application instance"
                ],
                "summary": "",
                "description": "Retrieves applications to approve by logged user (approver) on BTP'.",
                "operationId": "getApplicationsToApprove",
                "responses": {
                    "200": {
                        "description": "Response OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "$ref": "#/components/schemas/Application"
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                },
                "security": [
                    {
                        "XSUAA": []
                    }
                ]
            }
        }
    },
    "components": {
        "schemas": {
            "ApplicationWfContext": {
                "type": "object",
                "properties": {
                    "society": {
                        "type": "string",
                        "example": "Society SRL"
                    },
                    "user": {
                        "type": "string",
                    },
                    "document": {
                        "type": "string",
                        "example": "test"
                    },
                    "supplier": {
                        "type": "string",
                        "example": "Supplier SRL"
                    },
                    "sociedadDesc": {
                        "type": "string",
                    },
                    "proveedorDesc": {
                        "type": "string",
                    },
                    "moneda": {
                        "type": "string",
                    },
                    "ceco": {
                        "type": "string",
                        "description": "Costs center."
                    },
                    "amount": {
                        "type": "string",
                        "example": "30100.2"
                    },
                    "filed": {
                        "type": "string",
                    },
                    "paymentDate": {
                        "type": "string",
                        "format": "date",
                        "example": "2024/03/11"
                    },
                    "reason": {
                        "type": "string",
                        "example": "Motivo corto."
                    },
                    "applicantID": {
                        "type": "number",
                    },
                    "applicantEmail": {
                        "type": "string",
                    },
                    "allApprovers": {
                        "type": "string",
                    },
                    "referencia": {
                        "type": "string",
                    },
                    "areaSolicitante": {
                        "type": "string",
                    },
                    "operacionNivel1": {
                    },
                    "operacionNivel2": {
                    },
                    "operacionNivel3": {
                    },
                    "operacionNivel4": {
                    },
                    "approversNivel1": {
                        "type": "string",
                    },
                    "approversNivel2": {
                        "type": "string",
                    },
                    "approversNivel3": {
                        "type": "string",
                    },
                    "approversNivel4": {
                        "type": "string",
                    },
                }
            },
            "ApplicationWfInstance": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string",
                        "format": "uuid",
                        "example": "23f728a1-dfbc-11ee-bca2-eeee0a93b641"
                    },
                    "subject": {
                        "type": "string",
                        "example": "Solicitud de Pronto Pago 12"
                    },
                    "status": {
                        "description": "Workflow instance status.",
                        "schema": {
                            "$ref": "#/components/schemas/WF_INSTANCE_STATUS"
                        }   
                    },
                    "completedAt": {
                        "type": "string",
                        "example": null
                    },
                    "startedAt": {
                        "type": "string",
                        "format": "date",
                        "example": "2024-03-11T15:29:24.531Z"
                    }
                }
            },
            "ApplicationWfData": {
                "type": "object",
                "properties": {
                    "instance": {
                        "type": "object",
                        "$ref": "#/components/schemas/ApplicationWfInstance"
                    },
                    "context": {
                        "type": "object",
                        "$ref": "#/components/schemas/ApplicationWfContext"
                    }
                }
            },
            "Application": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "number",
                        "description": "Hana entry ID.",
                        "example": 1
                    },
                    "paymentId": {
                        "type": "string",
                        "description": "Main service entry ID."
                    },
                    "stateId": {
                        "description": "Hana master ID.",
                        "schema": {
                            "$ref": "#/components/schemas/HANA_APPLICATION_STATUS"
                        }                        
                    },
                    "wf": {
                        "type": "object",
                        "$ref": "#/components/schemas/ApplicationWfData"
                    }
                }
            },
            "ApplicationToCreate": {
                "type": "object",
                "required": [
                    "society",
                    "document",
                    "ceco",
                    "supplier",
                    "money",
                    "paymentDate",
                    "reason"
                ],
                "properties": {
                    "society": {
                        "type": "string",
                        "maxLength": 10,
                        "example": "Society",
                    },
                    "document": {
                        "type": "string",
                        "maxLength": 10,
                        "example": "Test",
                    },
                    "ceco": {
                        "type": "string",
                        "maxLength": 20,
                        "example": "B",
                        "description": "Costs center."
                    },
                    "supplier": {
                        "type": "string",
                        "example": "Supplier",
                        "maxLength": 20,
                    },
                    "money": {
                        "type": "string",
                        "example": "1500.75",
                    },
                    "folio": {
                        "type": "string",
                        "maxLength": 10,
                    },
                    "paymentDate": {
                        "type": "string",
                        "format": "date",
                        "example": "2024/03/11"
                    },
                    "reason": {
                        "type": "string",
                        "maxLength": 255,
                    },
                    "sociedaddesc": {
                        "type": "string",
                        "maxLength": 255,
                    },
                    "supplierdesc": {
                        "type": "string",
                        "maxLength": 255,
                    },
                    "moneda": {
                        "type": "string",
                        "maxLength": 10,
                    },
                    "monedadesc": {
                        "type": "string",
                        "maxLength": 40,
                    },
                    "apuntecontable": {
                        "type": "string",
                        "maxLength": 10,
                    },
                    "aniocontable": {
                        "type": "string",
                        "maxLength": 10,
                    },
                    "idioma": {
                        "type": "string",
                        "maxLength": 10,
                    },
                    "ordencompra": {
                        "type": "string",
                        "maxLength": 20,
                    },
                    "fechapartida": {
                        "type": "string",
                        "format": "date",
                        "example": "2024/03/11"
                    },
                    "fechavencimiento": {
                        "type": "string",
                        "format": "date",
                        "example": "2024/03/11"
                    },
                    "referencia": {
                        "type": "string",
                        "maxLength": 255,
                    },
                    "areasolicitante": {
                        "type": "string",
                        "maxLength": 20,
                        "example": "Innovation",
                    },
                    "mandante": {
                        "type": "string",
                        "maxLength": 10,
                    },
                }
            },
            "HANA_APPLICATION_STATUS": {
                "type": "string",
                "description": "These values are mapped to 1, 2, 3, 4",
                "enum": [
                    "APPROVEMENT_PENDING",
                    "REJECTED",
                    "CANCELED",
                    "FINISHED",
                ]
            },
            "WF_TASK_STATUS": {
                "type": "string",
                "enum": [
                    "READY",
                    "COMPLETED",
                    "CANCELED",
                ]
            },
            "WF_INSTANCE_STATUS": {
                "type": "string",
                "enum": [
                    "RUNNING",
                    "COMPLETED",
                    "CANCELED",
                ]
            }
        },
        "securitySchemes": {
            "XSUAA": {
                "type": "oauth2",
                "description": "Authorization and Trust Management Service - XSUAA - SAP BTP",
                "flows": {
                    "password": {
                        "tokenUrl": "https://cotcfdev.authentication.us10.hana.ondemand.com/oauth/token",
                        "scopes": {}
                    }
                }
            }
        }
    },
    "security": [
        {
            "XSUAA": []
        }
    ]
}

// TO AVOID INPUT KEYS
// "XSUAA": {
//     "type": "http",
//     "scheme": "bearer",
//     "bearerFormat": "JWT",
//     "in": "header",
//     "description": "Authorization and Trust Management Service - SAP BTP"
// }
// WITH KEYS
// "XSUAA": {
//     "type": "oauth2",
//     "scheme": "bearer",
//     "description": "Authorization and Trust Management Service - XSUAA - SAP BTP",
//     "flows": {
//         "password": {
//             "tokenUrl": "https://cotcfdev.authentication.us10.hana.ondemand.com/oauth/token",
//             "scopes": {}
//         }
//     }
// }

const swaggerOptions: OAS3Options = {
    swaggerDefinition,
    apis: ['./src/infraestructure/routes/*.ts']
}

export default swaggerJSDoc(swaggerOptions)