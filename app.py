from flask import Flask, request, jsonify
import subprocess
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/generate_notes', methods=['POST'])
def generate_notes_endpoint():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400

    # Get parameters from request
    topic = request.form.get('topic', '')
    detail_level = request.form.get('detailLevel', 'slightly detailed')
    user_id = request.form.get('userId', 'guest')

    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        script_path = os.path.join('F:', 'FYP', 'note_gen.py')
        result = subprocess.run(
            [
                'python',
                script_path,
                file_path,
                topic,
                detail_level,
                user_id
            ],
            text=True,
            capture_output=True,
            encoding='utf-8'
        )

        # Debugging print statements
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        if result.returncode != 0:
            return jsonify({"success": False, "message": result.stderr.strip()}), 500

        return jsonify({"success": True, "notes": result.stdout.strip()})

    except Exception as e:
        print(f"Error: {str(e)}")  # Add debug logging
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)            
            
            
@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400

    # Get parameters from request
    topic = request.form.get('topic', '')
    quiz_type = request.form.get('quizType', 'true_false').lower()  # Ensure lowercase
    difficulty = request.form.get('difficulty', 'medium').lower()    # Ensure lowercase
    user_id = request.form.get('userId', 'guest')

    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        script_path = os.path.join('F:', 'FYP', 'quiz_gen.py')
        result = subprocess.run(
            [
                'python',
                script_path,
                file_path,
                topic,
                quiz_type,
                difficulty,
                user_id
            ],
            text=True,
            capture_output=True,
            encoding='utf-8'
        )

        # Debugging print statements
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        if result.returncode != 0:
            return jsonify({"success": False, "message": result.stderr.strip()}), 500

        return jsonify({"success": True, "quiz": result.stdout.strip()})

    except Exception as e:
        print(f"Error: {str(e)}")  # Add debug logging
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)
            
@app.route('/summarize_video', methods=['POST'])
def summarize_video():
    try:
        data = request.get_json()
        video_url = data.get('videoUrl')
        
        if not video_url:
            return jsonify({'success': False, 'message': 'Video URL is required'})

        script_path = os.path.join('F:', 'FYP', 'yt_summerization.py')
        result = subprocess.run(
            [
                'python',
                script_path,
                video_url
            ],
            text=True,
            capture_output=True,
            encoding='utf-8'
        )

        # Debugging print statements
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        if result.returncode != 0:
            return jsonify({"success": False, "message": result.stderr.strip()}), 500

        return jsonify({"success": True, "summary": result.stdout.strip()})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)})
    
    
if __name__ == '__main__':
    app.run(port=5001, debug=True)  # Debug mode enabled
