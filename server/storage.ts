import { type User, type InsertUser, type Property, type InsertProperty, type Client, type InsertClient, type Activity, type InsertActivity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  searchProperties(query: string): Promise<Property[]>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  searchClients(query: string): Promise<Client[]>;

  // Activities
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Analytics
  getDashboardMetrics(): Promise<{
    totalProperties: number;
    activeListings: number;
    totalRevenue: number;
    activeClients: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private properties: Map<string, Property>;
  private clients: Map<string, Client>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.clients = new Map();
    this.activities = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample user
    const sampleUser = await this.createUser({
      username: "sarah.johnson",
      password: "password123",
      name: "Sarah Johnson",
      email: "sarah.johnson@ecc-genesis.com",
      role: "Senior Agent",
    });

    // Create sample properties
    await this.createProperty({
      title: "Modern Downtown Apartment",
      description: "Luxurious modern apartment with city views",
      address: "123 Main Street",
      city: "Downtown",
      state: "CA",
      zipCode: "90210",
      price: "450000",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      propertyType: "apartment",
      status: "active",
      agentId: sampleUser.id,
    });

    await this.createProperty({
      title: "Suburban Family Home",
      description: "Beautiful family home in quiet neighborhood",
      address: "456 Oak Avenue",
      city: "Maple Heights",
      state: "CA",
      zipCode: "90211",
      price: "675000",
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2400,
      propertyType: "house",
      status: "pending",
      agentId: sampleUser.id,
    });

    await this.createProperty({
      title: "Luxury High-Rise Condo",
      description: "Premium condo with panoramic city views",
      address: "789 Skyline Drive",
      city: "Skyline District",
      state: "CA",
      zipCode: "90212",
      price: "850000",
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1100,
      propertyType: "condo",
      status: "active",
      agentId: sampleUser.id,
    });

    // Create sample clients
    await this.createClient({
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      budget: "400000",
      preferredLocation: "Downtown",
      propertyType: "apartment",
      minBedrooms: 2,
      maxBedrooms: 3,
      notes: "Looking for modern apartment with good transit access",
      agentId: sampleUser.id,
    });

    await this.createClient({
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.rodriguez@email.com",
      phone: "(555) 234-5678",
      budget: "650000",
      preferredLocation: "Skyline District",
      propertyType: "condo",
      minBedrooms: 2,
      maxBedrooms: 3,
      notes: "Prefers luxury amenities and city views",
      agentId: sampleUser.id,
    });

    // Create sample activities
    await this.createActivity({
      type: "listing_added",
      title: "New property listed",
      description: "Modern 3BR apartment in Downtown - $450,000",
      entityId: Array.from(this.properties.values())[0]?.id,
      agentId: sampleUser.id,
    });

    await this.createActivity({
      type: "deal_closed",
      title: "Deal closed",
      description: "Luxury condo sold to Maria Rodriguez - $650,000",
      entityId: Array.from(this.properties.values())[2]?.id,
      agentId: sampleUser.id,
    });

    await this.createActivity({
      type: "client_added",
      title: "New client registered",
      description: "John Smith - Looking for 2BR apartment, budget $300-400k",
      entityId: Array.from(this.clients.values())[0]?.id,
      agentId: sampleUser.id,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      role: insertUser.role || "agent",
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const now = new Date();
    const newProperty: Property = { 
      ...property,
      status: property.status || "active",
      description: property.description || null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;

    const updatedProperty: Property = {
      ...property,
      ...updates,
      updatedAt: new Date(),
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  async searchProperties(query: string): Promise<Property[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.properties.values()).filter(property =>
      property.title.toLowerCase().includes(lowerQuery) ||
      property.address.toLowerCase().includes(lowerQuery) ||
      property.city.toLowerCase().includes(lowerQuery) ||
      property.propertyType.toLowerCase().includes(lowerQuery)
    );
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = randomUUID();
    const now = new Date();
    const newClient: Client = { 
      ...client,
      status: client.status || "active",
      phone: client.phone || null,
      budget: client.budget || null,
      preferredLocation: client.preferredLocation || null,
      propertyType: client.propertyType || null,
      minBedrooms: client.minBedrooms || null,
      maxBedrooms: client.maxBedrooms || null,
      notes: client.notes || null,
      agentId: client.agentId || null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updatedClient: Client = {
      ...client,
      ...updates,
      updatedAt: new Date(),
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  async searchClients(query: string): Promise<Client[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.clients.values()).filter(client =>
      client.firstName.toLowerCase().includes(lowerQuery) ||
      client.lastName.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery)
    );
  }

  async getRecentActivities(limit = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { 
      ...activity,
      description: activity.description || null,
      entityId: activity.entityId || null,
      agentId: activity.agentId || null,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getDashboardMetrics(): Promise<{
    totalProperties: number;
    activeListings: number;
    totalRevenue: number;
    activeClients: number;
  }> {
    const properties = Array.from(this.properties.values());
    const clients = Array.from(this.clients.values());
    
    const totalProperties = properties.length;
    const activeListings = properties.filter(p => p.status === "active").length;
    const totalRevenue = properties
      .filter(p => p.status === "sold")
      .reduce((sum, p) => sum + parseFloat(p.price), 0);
    const activeClients = clients.filter(c => c.status === "active").length;

    return {
      totalProperties,
      activeListings,
      totalRevenue,
      activeClients,
    };
  }
}

export const storage = new MemStorage();
