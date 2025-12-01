from flask import Flask, render_template, send_from_directory
import pandas as pd
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output')

@app.route('/')
def index():
    csv_path = os.path.join(OUTPUT_DIR, 'sample_output.csv')
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
        except Exception:
            df = pd.DataFrame()
        counts = df['category'].value_counts().to_dict() if 'category' in df.columns else {}
        pain_avg = float(df['pain_score'].mean()) if 'pain_score' in df.columns and not df['pain_score'].isna().all() else None
        table_html = df.head(200).to_html(classes='table table-sm', index=False) if not df.empty else "<p>No rows.</p>"
    else:
        counts = {}
        pain_avg = None
        table_html = "<p>No output found yet. Run the pipeline first to generate output/sample_output.csv.</p>"
    return render_template('index.html', counts=counts, pain_avg=pain_avg, table_html=table_html)

@app.route('/report')
def report():
    report_path = os.path.join(OUTPUT_DIR, 'validation_report.html')
    if os.path.exists(report_path):
        return send_from_directory(OUTPUT_DIR, 'validation_report.html')
    return "No report available", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
