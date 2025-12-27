import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { validationMiddleware } from './middlewares/validation.middleware';

import { AuthController } from './controllers/auth.controller';
import { VehicleController } from './controllers/vehicle.controller';
import { MileageController } from './controllers/mileage.controller';
import { SpendingController } from './controllers/spending.controller';

import { VehicleEntity } from './entities/vehicle.entity';
import { MileageEntity } from './entities/mileage.entity';
import { SpendingEntity } from './entities/spending.entity';
import fs from "fs";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Vehicle Tracker API Documentation'
}));

// Controllers
const authController = new AuthController();
const vehicleController = new VehicleController();
const mileageController = new MileageController();
const spendingController = new SpendingController();

/**
 * @swagger
 * /auth/apple:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authentification avec Apple
 *     description: Authentifie un utilisateur via Apple Sign In
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identityToken
 *             properties:
 *               identityToken:
 *                 type: string
 *                 description: Token d'identité Apple
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/apple', authController.appleAuth);

/**
 * @swagger
 * /auth/refresh-token/{refreshToken}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Rafraîchir les tokens d'authentification
 *     description: Génère un nouveau token et refreshToken à partir d'un refreshToken valide
 *     security: []
 *     parameters:
 *       - in: path
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Le refresh token à utiliser pour générer de nouveaux tokens
 *     responses:
 *       200:
 *         description: Tokens rafraîchis avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Refresh token invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/auth/refresh-token/:refreshToken', authController.refreshToken);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authentification avec Google
 *     description: Authentifie un utilisateur via Google Sign In
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identityToken
 *             properties:
 *               identityToken:
 *                 type: string
 *                 description: Token d'identité Google
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/google', authController.googleAuth);

/**
 * @swagger
 * /vehicles:
 *   get:
 *     tags:
 *       - Vehicles
 *     summary: Liste tous les véhicules
 *     description: Récupère tous les véhicules de l'utilisateur connecté
 *     responses:
 *       200:
 *         description: Liste des véhicules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Vehicles
 *     summary: Crée un nouveau véhicule
 *     description: Ajoute un nouveau véhicule pour l'utilisateur connecté
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       201:
 *         description: Véhicule créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/vehicles', authMiddleware, vehicleController.getAll);
app.post('/vehicles', authMiddleware, validationMiddleware(VehicleEntity), vehicleController.create);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     tags:
 *       - Vehicles
 *     summary: Récupère un véhicule par ID
 *     description: Récupère les détails d'un véhicule spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Détails du véhicule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Véhicule non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Vehicles
 *     summary: Met à jour un véhicule
 *     description: Modifie les informations d'un véhicule existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       200:
 *         description: Véhicule mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Véhicule non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Vehicles
 *     summary: Supprime un véhicule
 *     description: Supprime définitivement un véhicule et toutes ses données associées
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     responses:
 *       204:
 *         description: Véhicule supprimé avec succès
 *       404:
 *         description: Véhicule non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/vehicles/:id', authMiddleware, vehicleController.getById);
app.put('/vehicles/:id', authMiddleware, validationMiddleware(VehicleEntity), vehicleController.update);
app.delete('/vehicles/:id', authMiddleware, vehicleController.delete);

/**
 * @swagger
 * /vehicles/{vehicleId}/mileages:
 *   get:
 *     tags:
 *       - Mileages
 *     summary: Liste tous les kilométrages d'un véhicule
 *     description: Récupère l'historique des kilométrages d'un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Liste des kilométrages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mileage'
 *       404:
 *         description: Véhicule non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Mileages
 *     summary: Ajoute un nouveau kilométrage
 *     description: Enregistre un nouveau kilométrage pour un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MileageInput'
 *     responses:
 *       201:
 *         description: Kilométrage créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mileage'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/vehicles/:vehicleId/mileages', authMiddleware, mileageController.getAll);
app.post('/vehicles/:vehicleId/mileages', authMiddleware, validationMiddleware(MileageEntity), mileageController.create);

/**
 * @swagger
 * /vehicles/{vehicleId}/mileages/{id}:
 *   get:
 *     tags:
 *       - Mileages
 *     summary: Récupère un kilométrage spécifique
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Détails du kilométrage
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mileage'
 *       404:
 *         description: Kilométrage non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Mileages
 *     summary: Met à jour un kilométrage
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MileageInput'
 *     responses:
 *       200:
 *         description: Kilométrage mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mileage'
 *   delete:
 *     tags:
 *       - Mileages
 *     summary: Supprime un kilométrage
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Kilométrage supprimé
 */
app.get('/vehicles/:vehicleId/mileages/:id', authMiddleware, mileageController.getById);
app.put('/vehicles/:vehicleId/mileages/:id', authMiddleware, validationMiddleware(MileageEntity), mileageController.update);
app.delete('/vehicles/:vehicleId/mileages/:id', authMiddleware, mileageController.delete);

/**
 * @swagger
 * /vehicles/{vehicleId}/spendings:
 *   get:
 *     tags:
 *       - Spendings
 *     summary: Liste toutes les dépenses d'un véhicule
 *     description: Récupère l'historique des dépenses d'un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Liste des dépenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Spending'
 *   post:
 *     tags:
 *       - Spendings
 *     summary: Ajoute une nouvelle dépense
 *     description: Enregistre une nouvelle dépense pour un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du véhicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpendingInput'
 *     responses:
 *       201:
 *         description: Dépense créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spending'
 */
app.get('/vehicles/:vehicleId/spendings', authMiddleware, spendingController.getAll);
app.post('/vehicles/:vehicleId/spendings', authMiddleware, validationMiddleware(SpendingEntity), spendingController.create);

/**
 * @swagger
 * /vehicles/{vehicleId}/spendings/{id}:
 *   get:
 *     tags:
 *       - Spendings
 *     summary: Récupère une dépense spécifique
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Détails de la dépense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spending'
 *   put:
 *     tags:
 *       - Spendings
 *     summary: Met à jour une dépense
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpendingInput'
 *     responses:
 *       200:
 *         description: Dépense mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spending'
 *   delete:
 *     tags:
 *       - Spendings
 *     summary: Supprime une dépense
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Dépense supprimée
 */
app.get('/vehicles/:vehicleId/spendings/:id', authMiddleware, spendingController.getById);
app.put('/vehicles/:vehicleId/spendings/:id', authMiddleware, validationMiddleware(SpendingEntity), spendingController.update);
app.delete('/vehicles/:vehicleId/spendings/:id', authMiddleware, spendingController.delete);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: fs.readFileSync('./public/swagger-custom.css', 'utf8'),
    customSiteTitle: 'CarKit',
    customfavIcon: '/favicon.ico'
}));

// Error middleware (must be last)
app.use(errorMiddleware);

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log('✅ Database connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection error:', error);
    });

export default app;