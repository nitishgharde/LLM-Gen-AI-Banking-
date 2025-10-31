from flask import Flask, render_template, request, jsonify, session
from qna_engine import get_answer, get_conversation_history, clear_conversation_history
import uuid
import os
from config import *

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key

@app.route('/')
def index():
    """Main page with chat interface"""
    # Initialize session if not exists
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    
    return render_template('index.html', 
                         project_name=PAGE_TITLE,
                         quick_questions=QUICK_QUESTIONS)

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        user_input = data.get('message', '').strip()
        user_id = session.get('user_id', str(uuid.uuid4()))
        
        if not user_input:
            return jsonify({'error': 'Empty message'}), 400
        
        # Get AI response
        response = get_answer(user_input, user_id)
        
        return jsonify({
            'answer': response['answer'],
            'sources': response.get('sources', [])
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history')
def get_history():
    """Get conversation history for current user"""
    try:
        user_id = session.get('user_id', str(uuid.uuid4()))
        history = get_conversation_history(user_id, limit=10)
        return jsonify(history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clear_history', methods=['POST'])
def clear_history():
    """Clear conversation history for current user"""
    try:
        user_id = session.get('user_id', str(uuid.uuid4()))
        clear_conversation_history(user_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/export_history')
def export_history():
    """Export conversation history as JSON"""
    try:
        user_id = session.get('user_id', str(uuid.uuid4()))
        history = get_conversation_history(user_id)
        return jsonify(history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Validate configuration before starting
    try:
        validate_config()
        print("✅ Configuration validated successfully")
        print("🚀 Starting Flask application...")
        print("📱 Open your browser and go to: http://localhost:5000")
        app.run(debug=True, host='127.0.0.1', port=5000)
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        print("Please check your .env file and ensure GOOGLE_API_KEY is set")