import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CarKit API',
            version: '1.0.0',
            description: 'CarKit API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            },
            {
                url: 'https://carkit.lazyy.fr',
                description: 'Serveur de production'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Entrez votre token JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        providerUserId: { type: 'string' },
                        provider: { type: 'string', enum: ['apple', 'google'] },
                        email: { type: 'string', format: 'email' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' },
                        refreshToken: { type: 'string' }
                    }
                },
                Vehicle: {
                    type: 'object',
                    required: ['brand', 'model', 'customName', 'motorization'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        brand: { type: 'string', example: 'Toyota' },
                        model: { type: 'string', example: 'Corolla' },
                        customName: { type: 'string', example: 'Ma voiture' },
                        motorization: {
                            type: 'string',
                            enum: ['thermal', 'hybrid', 'electric'],
                            example: 'hybrid'
                        },
                        imageUrl: { type: 'string', format: 'uri', nullable: true },
                        year: { type: 'number', minimum: 1900, maximum: 2026, nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                VehicleInput: {
                    type: 'object',
                    required: ['brand', 'model', 'customName', 'motorization'],
                    properties: {
                        brand: { type: 'string', example: 'Toyota' },
                        model: { type: 'string', example: 'Corolla' },
                        customName: { type: 'string', example: 'Ma voiture' },
                        motorization: {
                            type: 'string',
                            enum: ['thermal', 'hybrid', 'electric'],
                            example: 'hybrid'
                        },
                        imageUrl: { type: 'string', format: 'uri' },
                        year: { type: 'number', minimum: 1900, maximum: 2026 }
                    }
                },
                Mileage: {
                    type: 'object',
                    required: ['mileage', 'date'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        mileage: { type: 'number', minimum: 0, example: 15000 },
                        date: { type: 'string', format: 'date', example: '2024-01-15' },
                        isSetupEntry: { type: 'boolean', default: false },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                MileageInput: {
                    type: 'object',
                    required: ['mileage', 'date'],
                    properties: {
                        mileage: { type: 'number', minimum: 0, example: 15000 },
                        date: { type: 'string', format: 'date', example: '2024-01-15' },
                        isSetupEntry: { type: 'boolean', default: false }
                    }
                },
                Spending: {
                    type: 'object',
                    required: ['date', 'recurrence', 'type', 'currencyCode'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        amount: { type: 'number', minimum: 0, example: 50.00 },
                        date: { type: 'string', format: 'date', example: '2024-01-15' },
                        recurrence: {
                            type: 'string',
                            enum: ['none', 'weekly', 'monthly', 'yearly'],
                            example: 'none'
                        },
                        type: {
                            type: 'string',
                            enum: ['vehiclePart', 'service', 'fuel', 'insurance', 'subscription', 'accessories', 'sparePart', 'other'],
                            example: 'fuel'
                        },
                        currencyCode: { type: 'string', minLength: 3, maxLength: 3, example: 'EUR' },
                        name: { type: 'string', example: 'Plein d\'essence' },
                        service: {
                            type: 'string',
                            enum: ['carWash', 'oilChange', 'vacuum'],
                            nullable: true
                        },
                        literQuantity: { type: 'number', minimum: 0 },
                        elecQuantity: { type: 'number', minimum: 0 },
                        literUnit: { type: 'string', example: 'L' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                SpendingInput: {
                    type: 'object',
                    required: ['date', 'recurrence', 'type', 'currencyCode'],
                    properties: {
                        amount: { type: 'number', minimum: 0, example: 50.00 },
                        date: { type: 'string', format: 'date', example: '2024-01-15' },
                        recurrence: {
                            type: 'string',
                            enum: ['none', 'weekly', 'monthly', 'yearly'],
                            example: 'none'
                        },
                        type: {
                            type: 'string',
                            enum: ['vehiclePart', 'service', 'fuel', 'insurance', 'subscription', 'accessories', 'sparePart', 'other'],
                            example: 'fuel'
                        },
                        currencyCode: { type: 'string', minLength: 3, maxLength: 3, example: 'EUR' },
                        name: { type: 'string', example: 'Plein d\'essence' },
                        service: {
                            type: 'string',
                            enum: ['carWash', 'oilChange', 'vacuum']
                        },
                        literQuantity: { type: 'number', minimum: 0 },
                        elecQuantity: { type: 'number', minimum: 0 },
                        literUnit: { type: 'string', example: 'L' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/app.ts']
};

export const swaggerSpec = swaggerJsdoc(options);