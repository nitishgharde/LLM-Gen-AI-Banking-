"""
Configuration settings for the Smart Bank Assistant
"""

import os
from dotenv import load_dotenv

load_dotenv()

# AI Model Configuration
AI_MODEL = "gemini-2.0-flash-exp"
AI_TEMPERATURE = 0.7
AI_MAX_TOKENS = 1000

# Vector Embeddings Configuration
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
VECTOR_DB_PERSIST_DIR = "./chroma_db"
RETRIEVAL_K = 3  # Number of similar documents to retrieve

# Memory Configuration
MEMORY_WINDOW_SIZE = 5  # Number of conversation exchanges to remember
CONVERSATION_HISTORY_FILE = "conversation_history.json"

# UI Configuration
PAGE_TITLE = "🏦 Smart Bank Assistant"
PAGE_ICON = "🏦"
LAYOUT = "wide"
SIDEBAR_STATE = "expanded"

# Quick Actions
QUICK_QUESTIONS = [
    "What are your banking hours?",
    "How do I open a new account?",
    "What are the fees for wire transfers?",
    "How do I reset my online banking password?",
    "What documents do I need for a loan?",
    "How do I transfer money between accounts?",
    "What are the ATM withdrawal limits?",
    "How do I report a lost card?"
]

# File Paths
FAQ_FILE = "BankFAQs.csv"

# API Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Validation
def validate_config():
    """Validate configuration settings"""
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    if not os.path.exists(FAQ_FILE):
        raise FileNotFoundError(f"FAQ file '{FAQ_FILE}' not found")
    
    return True
