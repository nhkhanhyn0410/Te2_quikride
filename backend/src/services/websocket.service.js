const { Server } = require('socket.io');
const SeatService = require('./seat.service');
const AuthService = require('./auth.service');

/**
 * WebSocket Service
 * Real-time seat availability updates
 */
class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Map(); // tripId -> Set of socket IDs
  }

  /**
   * Initialize WebSocket server
   * @param {Object} server - HTTP server
   */
  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();

    console.log('✅ WebSocket Server Initialized');
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle authentication (optional)
      socket.on('authenticate', async (data) => {
        try {
          const { token } = data;
          if (token) {
            const decoded = AuthService.verifyToken(token);
            socket.userId = decoded.userId;
            socket.authenticated = true;
            console.log(`✅ Socket ${socket.id} authenticated as user ${socket.userId}`);
          }
        } catch (error) {
          console.error('Socket authentication error:', error.message);
          socket.authenticated = false;
        }
      });

      // Join trip room to receive seat updates
      socket.on('join-trip', async (data) => {
        try {
          const { tripId } = data;

          if (!tripId) {
            return socket.emit('error', { message: 'Trip ID is required' });
          }

          // Join the room
          socket.join(`trip:${tripId}`);
          socket.currentTripId = tripId;

          // Track this connection
          if (!this.connectedClients.has(tripId)) {
            this.connectedClients.set(tripId, new Set());
          }
          this.connectedClients.get(tripId).add(socket.id);

          console.log(`📍 Socket ${socket.id} joined trip ${tripId}`);

          // Send initial seat status
          const seatStatus = await SeatService.getTripSeatStatus(tripId);
          const availableCount = await SeatService.getTripAvailableSeatCount(tripId);

          socket.emit('seat-status', {
            tripId,
            seatStatus,
            availableCount,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('Error joining trip:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Leave trip room
      socket.on('leave-trip', (data) => {
        try {
          const { tripId } = data;

          if (tripId) {
            socket.leave(`trip:${tripId}`);

            // Remove from tracking
            if (this.connectedClients.has(tripId)) {
              this.connectedClients.get(tripId).delete(socket.id);
              if (this.connectedClients.get(tripId).size === 0) {
                this.connectedClients.delete(tripId);
              }
            }

            console.log(`📍 Socket ${socket.id} left trip ${tripId}`);
          }
        } catch (error) {
          console.error('Error leaving trip:', error);
        }
      });

      // Request seat status update
      socket.on('request-seat-status', async (data) => {
        try {
          const { tripId } = data;

          if (!tripId) {
            return socket.emit('error', { message: 'Trip ID is required' });
          }

          const seatStatus = await SeatService.getTripSeatStatus(tripId);
          const availableCount = await SeatService.getTripAvailableSeatCount(tripId);

          socket.emit('seat-status', {
            tripId,
            seatStatus,
            availableCount,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('Error requesting seat status:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);

        // Remove from all trip rooms
        if (socket.currentTripId) {
          if (this.connectedClients.has(socket.currentTripId)) {
            this.connectedClients.get(socket.currentTripId).delete(socket.id);
            if (this.connectedClients.get(socket.currentTripId).size === 0) {
              this.connectedClients.delete(socket.currentTripId);
            }
          }
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  /**
   * Broadcast seat status update to all clients watching a trip
   * @param {String} tripId - Trip ID
   */
  async broadcastSeatUpdate(tripId) {
    try {
      if (!this.io) {
        console.warn('WebSocket server not initialized');
        return;
      }

      const seatStatus = await SeatService.getTripSeatStatus(tripId);
      const availableCount = await SeatService.getTripAvailableSeatCount(tripId);

      // Emit to all clients in the trip room
      this.io.to(`trip:${tripId}`).emit('seat-status', {
        tripId,
        seatStatus,
        availableCount,
        timestamp: new Date(),
      });

      console.log(`📢 Broadcasted seat update for trip ${tripId} to ${this.connectedClients.get(tripId)?.size || 0} clients`);
    } catch (error) {
      console.error('Error broadcasting seat update:', error);
    }
  }

  /**
   * Broadcast specific seat lock event
   * @param {String} tripId - Trip ID
   * @param {Array<String>} seats - Seat numbers
   * @param {String} action - 'locked', 'unlocked', 'booked'
   */
  async broadcastSeatAction(tripId, seats, action) {
    try {
      if (!this.io) {
        console.warn('WebSocket server not initialized');
        return;
      }

      this.io.to(`trip:${tripId}`).emit('seat-action', {
        tripId,
        seats,
        action,
        timestamp: new Date(),
      });

      // Also send full seat status
      await this.broadcastSeatUpdate(tripId);
    } catch (error) {
      console.error('Error broadcasting seat action:', error);
    }
  }

  /**
   * Get number of clients watching a trip
   * @param {String} tripId - Trip ID
   * @returns {Number}
   */
  getWatchingCount(tripId) {
    return this.connectedClients.get(tripId)?.size || 0;
  }

  /**
   * Get all trips being watched
   * @returns {Array<String>}
   */
  getWatchedTrips() {
    return Array.from(this.connectedClients.keys());
  }

  /**
   * Get IO instance
   * @returns {Object}
   */
  getIO() {
    return this.io;
  }
}

// Singleton instance
const websocketService = new WebSocketService();

module.exports = websocketService;
