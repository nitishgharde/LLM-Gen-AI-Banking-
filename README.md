# 🏦 Smart Bank Assistant with LangChain & Vector Embeddings

A sophisticated AI-powered banking chatbot that uses LangChain, vector embeddings, and conversation memory to provide intelligent, contextual responses to banking-related queries.

## ✨ Features

### 🤖 AI-Powered Responses
- **LangChain Integration**: Uses LangChain framework for advanced conversation management
- **Google Gemini AI**: Powered by Google's latest Gemini 2.0 Flash model
- **Vector Embeddings**: Semantic search using HuggingFace embeddings for better context understanding

### 💾 Conversation Memory
- **Persistent History**: All conversations are saved locally and persist between sessions
- **User-Specific Memory**: Each user has their own conversation history
- **Context Awareness**: The AI remembers previous interactions for more coherent conversations
- **Memory Window**: Maintains context from the last 5 exchanges

### 🔍 Advanced Search
- **Vector Database**: Uses ChromaDB for efficient similarity search
- **FAQ Integration**: Automatically retrieves relevant banking FAQs
- **Source Attribution**: Shows which FAQ sources were used for each response

### 🎨 Modern UI
- **Flask Web Interface**: Beautiful, responsive web application with HTML templates
- **Real-time Chat**: Live conversation display with message history
- **Quick Actions**: Pre-defined common banking questions
- **Export Functionality**: Download conversation history as JSON
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Google API key for Gemini AI

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. **Prepare your FAQ data**:
   Ensure you have a `BankFAQs.csv` file with columns:
   - `Question`: The FAQ question
   - `Answer`: The FAQ answer

5. **Run the application**:
   ```bash
   python app.py
   ```
   Or use the provided batch file:
   ```bash
   run_flask.bat
   ```

6. **Open your browser** and navigate to `http://localhost:5000`

## 📁 Project Structure

```
Gen AI in bank/
├── app.py                 # Main Flask application
├── qna_engine.py         # LangChain-powered Q&A engine
├── BankFAQs.csv          # Banking FAQ dataset
├── requirements.txt      # Python dependencies
├── run_flask.bat         # Windows batch file to start the app
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # CSS styles
│   └── script.js         # JavaScript functionality
├── README.md            # This file
├── .env                 # Environment variables (create this)
├── chroma_db/           # Vector database (auto-created)
└── conversation_history.json  # Conversation storage (auto-created)
```

## 🔧 How It Works

### 1. Vector Embeddings
- FAQ data is converted into vector embeddings using the `all-MiniLM-L6-v2` model
- User questions are embedded and compared against FAQ embeddings
- Most similar FAQs are retrieved for context

### 2. LangChain Integration
- **ConversationalRetrievalChain**: Combines LLM responses with document retrieval
- **ConversationBufferWindowMemory**: Maintains conversation context
- **Chroma Vector Store**: Efficient similarity search and storage

### 3. Memory Management
- Conversations are stored in JSON format with timestamps
- User-specific conversation histories
- Automatic persistence between sessions

## 🎯 Usage Guide

### Basic Chat
1. Enter your question in the chat input
2. Click "Send" or press Enter
3. View the AI response with source attribution

### Quick Actions
- Use the pre-defined quick questions in the sidebar
- Click any quick action button for instant responses

### Conversation History
- View previous conversations in the sidebar
- Expand conversation entries to see full Q&A
- Export conversation history as JSON

### User Management
- Set a unique User ID to maintain separate conversation histories
- Clear conversation history for any user
- Switch between users seamlessly

## 🔒 Privacy & Security

- **Local Storage**: All conversation data is stored locally
- **No External Sharing**: Conversations are not sent to external services
- **User Isolation**: Each user's data is kept separate
- **Secure API**: Only your Google API key is used for AI responses

## 🛠️ Customization

### Adding New FAQs
1. Update your `BankFAQs.csv` file
2. Restart the application
3. The vector database will automatically rebuild

### Modifying AI Behavior
- Adjust temperature in `qna_engine.py` (line 18)
- Change memory window size (line 47)
- Modify retrieval parameters (line 52)

### UI Customization
- Edit CSS styles in `static/style.css`
- Modify HTML templates in `templates/index.html`
- Add new quick actions in `config.py` (QUICK_QUESTIONS list)
- Update JavaScript functionality in `static/script.js`

## 📊 Performance Features

- **Efficient Vector Search**: ChromaDB provides fast similarity search
- **Memory Optimization**: Conversation window limits memory usage
- **Caching**: Vector embeddings are cached for faster responses
- **Async Processing**: Non-blocking UI during AI processing

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**:
   - Ensure your `.env` file contains the correct Google API key
   - Verify the API key has access to Gemini models

2. **Missing Dependencies**:
   - Run `pip install -r requirements.txt`
   - Check Python version compatibility

3. **Vector Database Issues**:
   - Delete the `chroma_db` folder to rebuild
   - Ensure `BankFAQs.csv` is properly formatted

4. **Memory Issues**:
   - Clear conversation history if memory usage is high
   - Reduce memory window size in settings

### Performance Tips

- Use specific questions for better responses
- Clear conversation history periodically
- Ensure stable internet connection for API calls

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with banking APIs
- [ ] Advanced analytics dashboard
- [ ] Custom training on bank-specific data
- [ ] Real-time document processing

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Ensure all dependencies are installed
4. Verify your API key configuration

## 📄 License

This project is for educational and demonstration purposes. Please ensure compliance with your organization's data handling policies when using in production environments.

---

**Built with ❤️ using LangChain, Flask, and Google Gemini AI**
If any quries or problem in running the repository contact on "taskingboy12345@gmail.com"
