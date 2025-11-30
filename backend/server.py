from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    address: str
    price: str
    bedrooms: int
    bathrooms: int
    sqft: int
    image: str
    description: str
    status: str = "Available"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertyCreate(BaseModel):
    title: str
    address: str
    price: str
    bedrooms: int
    bathrooms: int
    sqft: int
    image: str
    description: str
    status: str = "Available"

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "BH Investment API"}

# Property routes
@api_router.get("/properties", response_model=List[Property])
async def get_properties():
    properties = await db.properties.find({}, {"_id": 0}).to_list(1000)
    
    for prop in properties:
        if isinstance(prop.get('created_at'), str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
    
    return properties

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    property_data = await db.properties.find_one({"id": property_id}, {"_id": 0})
    
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if isinstance(property_data.get('created_at'), str):
        property_data['created_at'] = datetime.fromisoformat(property_data['created_at'])
    
    return property_data

@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    property_obj = Property(**property_data.model_dump())
    
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.properties.insert_one(doc)
    return property_obj

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"message": "Property deleted successfully"}

# Contact routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageCreate):
    message_obj = ContactMessage(**message_data.model_dump())
    
    doc = message_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    return message_obj

@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    
    return messages

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Seed initial data
@app.on_event("startup")
async def seed_data():
    # Check if properties exist
    count = await db.properties.count_documents({})
    if count == 0:
        sample_properties = [
            {
                "id": str(uuid.uuid4()),
                "title": "Modern Downtown Loft",
                "address": "123 Main St, Downtown",
                "price": "$450,000",
                "bedrooms": 2,
                "bathrooms": 2,
                "sqft": 1200,
                "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                "description": "Stunning modern loft in the heart of downtown with city views and premium finishes.",
                "status": "Available",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Suburban Family Home",
                "address": "456 Oak Avenue, Suburbs",
                "price": "$620,000",
                "bedrooms": 4,
                "bathrooms": 3,
                "sqft": 2400,
                "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
                "description": "Spacious family home with large backyard, perfect for growing families.",
                "status": "Available",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Luxury Waterfront Villa",
                "address": "789 Beach Road, Coastline",
                "price": "$1,250,000",
                "bedrooms": 5,
                "bathrooms": 4,
                "sqft": 3800,
                "image": "https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=800",
                "description": "Breathtaking waterfront property with panoramic ocean views and private beach access.",
                "status": "Available",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Cozy Urban Studio",
                "address": "321 City Center, Urban District",
                "price": "$280,000",
                "bedrooms": 1,
                "bathrooms": 1,
                "sqft": 650,
                "image": "https://images.unsplash.com/photo-1638541420159-cadd0634f08f?w=800",
                "description": "Efficient and stylish studio apartment in prime urban location with modern amenities.",
                "status": "Available",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Mountain View Retreat",
                "address": "555 Highland Drive, Mountain Area",
                "price": "$890,000",
                "bedrooms": 3,
                "bathrooms": 3,
                "sqft": 2800,
                "image": "https://images.unsplash.com/photo-1639145044835-ec083afa6ebb?w=800",
                "description": "Peaceful mountain retreat with stunning views and custom craftsmanship throughout.",
                "status": "Available",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Historic Renovated Townhouse",
                "address": "888 Heritage Lane, Old Town",
                "price": "$725,000",
                "bedrooms": 3,
                "bathrooms": 2,
                "sqft": 2100,
                "image": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?w=800",
                "description": "Beautifully renovated historic townhouse blending classic charm with modern comfort.",
                "status": "Available",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.properties.insert_many(sample_properties)
        logger.info("Sample properties seeded successfully")
