const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EnergySaver - Smart Home Energy Manager API',
      version: '1.0.0',
      description:
        'Backend API strictly tailored to Case Study requirements: User & Home registration, Smart Devices, Energy Readings, Real-time Socket.io, Limits & Alerts, Neighborhood Comparison, Monthly Reports, Tips, and Admin Management.',
      contact: {
        name: 'Pratik Swain',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Local development server',
      },
      {
        url: '/',
        description: 'Current host',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: '1. Auth', description: 'Register & login users' },
      { name: '2. Homes', description: 'Register & view homes' },
      { name: '3. Devices', description: 'Add & view smart devices' },
      { name: '4. Readings', description: 'Record energy consumption readings' },
      { name: '5. Limits', description: 'Set & view energy usage limits' },
      { name: '6. Alerts', description: 'View limit breach alerts' },
      { name: '7. Compare', description: 'Compare with neighborhood averages' },
      { name: '8. Reports', description: 'Generate monthly reports' },
      { name: '9. Tips', description: 'Get energy-saving tips' },
      { name: '10. Admin', description: 'Admin manage device templates & tips' },
      { name: '11. Notifications', description: 'Send system push notifications' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['1. Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Pratik Swain' },
                    email: { type: 'string', example: 'pratik@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation error or duplicate email' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['1. Auth'],
          summary: 'Login user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'pratik@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/homes': {
        get: {
          tags: ['2. Homes'],
          summary: 'View registered homes',
          responses: { 200: { description: 'List of registered homes' } },
        },
        post: {
          tags: ['2. Homes'],
          summary: 'Register a home',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'address', 'city', 'neighborhood'],
                  properties: {
                    name: { type: 'string', example: 'My Smart Home' },
                    address: { type: 'string', example: '123 Green Street' },
                    city: { type: 'string', example: 'Bhubaneswar' },
                    neighborhood: { type: 'string', example: 'Greenfield' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Home registered successfully' } },
        },
      },
      '/api/devices': {
        get: {
          tags: ['3. Devices'],
          summary: 'View smart devices in homes',
          responses: { 200: { description: 'List of devices' } },
        },
        post: {
          tags: ['3. Devices'],
          summary: 'Add smart device to home',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['home', 'name', 'type', 'powerRating'],
                  properties: {
                    home: { type: 'string', example: 'homeObjectId' },
                    name: { type: 'string', example: 'Living Room AC' },
                    type: { type: 'string', example: 'AC' },
                    brand: { type: 'string', example: 'Daikin' },
                    powerRating: { type: 'number', example: 1500 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Device added successfully' } },
        },
      },
      '/api/readings': {
        get: {
          tags: ['4. Readings'],
          summary: 'View energy consumption readings history',
          responses: { 200: { description: 'List of energy readings' } },
        },
        post: {
          tags: ['4. Readings'],
          summary: 'Record energy consumption reading (emits real-time socket & checks limits)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['device', 'energyConsumed'],
                  properties: {
                    device: { type: 'string', example: 'deviceObjectId' },
                    energyConsumed: { type: 'number', example: 2.5 },
                    voltage: { type: 'number', example: 230 },
                    current: { type: 'number', example: 5 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Reading recorded' } },
        },
      },
      '/api/limits': {
        get: {
          tags: ['5. Limits'],
          summary: 'View energy usage limits',
          responses: { 200: { description: 'List of limits' } },
        },
        post: {
          tags: ['5. Limits'],
          summary: 'Set energy usage limit',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['home', 'limitType', 'limitValue'],
                  properties: {
                    home: { type: 'string', example: 'homeObjectId' },
                    device: { type: 'string', example: 'optionalDeviceObjectId' },
                    limitType: { type: 'string', example: 'daily' },
                    limitValue: { type: 'number', example: 10 },
                    alertPercentage: { type: 'number', example: 90 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Limit created successfully' } },
        },
      },
      '/api/alerts': {
        get: {
          tags: ['6. Alerts'],
          summary: 'View alerts generated when limits are reached',
          responses: { 200: { description: 'List of alerts' } },
        },
      },
      '/api/compare/neighborhood': {
        get: {
          tags: ['7. Compare'],
          summary: 'Compare usage with neighborhood averages',
          responses: { 200: { description: 'Neighborhood comparison analytics' } },
        },
      },
      '/api/reports/monthly': {
        get: {
          tags: ['8. Reports'],
          summary: 'Generate monthly energy reports',
          responses: { 200: { description: 'Monthly report with consumption breakdown' } },
        },
      },
      '/api/tips': {
        get: {
          tags: ['9. Tips'],
          summary: 'Get energy-saving tips',
          responses: { 200: { description: 'List of energy tips' } },
        },
        post: {
          tags: ['10. Admin'],
          summary: 'Admin create energy-saving tip',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description'],
                  properties: {
                    title: { type: 'string', example: 'Optimize AC temperature' },
                    description: { type: 'string', example: 'Set AC to 24°C to save up to 20% on electricity.' },
                    category: { type: 'string', example: 'cooling' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Tip created by admin' } },
        },
      },
      '/api/admin/templates': {
        get: {
          tags: ['10. Admin'],
          summary: 'View device templates (Admin)',
          responses: { 200: { description: 'List of templates' } },
        },
        post: {
          tags: ['10. Admin'],
          summary: 'Manage / Create device template (Admin)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'type', 'defaultPowerRating'],
                  properties: {
                    name: { type: 'string', example: 'Smart Inverter AC' },
                    type: { type: 'string', example: 'AC' },
                    defaultPowerRating: { type: 'number', example: 1500 },
                    description: { type: 'string', example: 'Energy star rated AC' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Template created successfully' } },
        },
      },
      '/api/notifications/send': {
        post: {
          tags: ['11. Notifications'],
          summary: 'Send system push notification',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'title', 'message'],
                  properties: {
                    token: { type: 'string', example: 'device-token-123' },
                    title: { type: 'string', example: 'Energy Limit Alert' },
                    message: { type: 'string', example: 'You have consumed 90% of your daily limit.' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Push notification sent successfully' } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at /api-docs');
};

module.exports = setupSwagger;
