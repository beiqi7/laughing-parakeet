from flask import Flask, request, Response, jsonify, render_template
from flask_cors import CORS
import openai
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 设置 OpenAI API 密钥
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        model = data.get('model', 'gpt-3.5-turbo')
        max_tokens = data.get('max_tokens', 1000)
        temperature = data.get('temperature', 0.7)
        stream = data.get('stream', False)

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        if stream:
            return Response(generate_stream(prompt, model, max_tokens, temperature),
                          mimetype='text/plain')

        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature
        )

        return jsonify({
            'text': response.choices[0].message.content.strip()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_stream(prompt, model, max_tokens, temperature):
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True
        )

        for chunk in response:
            if chunk.choices[0].delta.get('content'):
                yield f"data: {json.dumps({'text': chunk.choices[0].delta.content})}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)