#!/usr/bin/env python
"""Demo integration script for PainPointRadar.

This script runs the Flask dashboard (app.py) and the main pipeline (src/main.py)
end-to-end using demo outputs. It demonstrates the full workflow from data
fetching to dashboard visualization.

Usage:
    python demo_integration.py [--no-server]

Options:
    --no-server    Run only the pipeline without starting the Flask server.

Example:
    # Run full demo with Flask server
    python demo_integration.py
    
    # Run only the pipeline
    python demo_integration.py --no-server
"""
import subprocess
import sys
import time
import os
import signal
import argparse


def run_pipeline():
    """Run the main scraping and analysis pipeline."""
    print("=" * 60)
    print("Running PainPointRadar Pipeline...")
    print("=" * 60)
    
    cmd = [sys.executable, "-m", "src.main", "--subreddits", "SaaS,startups", "--limit", "5"]
    result = subprocess.run(cmd, capture_output=False)
    
    if result.returncode != 0:
        print("Pipeline failed!")
        return False
    
    print("\nPipeline completed successfully!")
    print("Output files should be in the 'output/' directory:")
    
    output_dir = "output"
    if os.path.exists(output_dir):
        for f in os.listdir(output_dir):
            print(f"  - {f}")
    
    return True


def start_flask_server():
    """Start the Flask dashboard server."""
    print("\n" + "=" * 60)
    print("Starting Flask Dashboard Server...")
    print("=" * 60)
    
    # Change to dashboard directory and start Flask
    flask_process = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd="dashboard",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    
    print("Flask server starting on http://localhost:5000")
    print("Press Ctrl+C to stop the server.\n")
    
    return flask_process


def main():
    parser = argparse.ArgumentParser(description="PainPointRadar Demo Integration")
    parser.add_argument("--no-server", action="store_true", help="Run only the pipeline without Flask server")
    args = parser.parse_args()
    
    print("\n" + "=" * 60)
    print("  PainPointRadar Demo Integration")
    print("=" * 60 + "\n")
    
    # Step 1: Run the pipeline
    if not run_pipeline():
        sys.exit(1)
    
    # Step 2: Start Flask server (if not disabled)
    if not args.no_server:
        flask_process = start_flask_server()
        
        try:
            # Give server time to start
            time.sleep(2)
            
            # Print access instructions
            print("Dashboard is now running!")
            print("Open http://localhost:5000 in your browser to view the results.")
            print("\nAvailable endpoints:")
            print("  - http://localhost:5000/        Dashboard with data table")
            print("  - http://localhost:5000/report  Validation report")
            print("\nPress Ctrl+C to stop the server...")
            
            # Wait for user interrupt
            while True:
                time.sleep(1)
                
        except KeyboardInterrupt:
            print("\n\nShutting down Flask server...")
            flask_process.terminate()
            flask_process.wait()
            print("Server stopped.")
    else:
        print("\nDemo complete! To view the dashboard, run:")
        print("  cd dashboard && python app.py")


if __name__ == "__main__":
    main()
