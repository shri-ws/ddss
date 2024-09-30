from flask import Flask, render_template, url_for
import os
import requests
from bs4 import BeautifulSoup
import urllib3

app = Flask(__name__)

# Disable warnings for insecure SSL connections
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Function to scrape registration-related content
def search_registration_keywords():
    url = 'https://www.sangeetnatak.gov.in/'
    response = requests.get(url, verify=False)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        keywords = ['registration', 'register', 'enroll', 'signup']
        results = []

        for keyword in keywords:
            for element in soup.find_all(text=lambda text: text and keyword.lower() in text.lower()):
                parent_tag = element.parent
                link = parent_tag.find('a')['href'] if parent_tag.find('a') else None
                results.append({
                    'context': parent_tag.get_text(strip=True),
                    'link': link if link else url
                })
        return results
    else:
        print(f"Failed to access the website. Status code: {response.status_code}")
        return []

# Route for homepage
@app.route('/')
def home():
    slideshow_folder = os.path.join(app.static_folder, 'img/slideshow')
    
    # List all image files in the slideshow folder
    slideshow_images = [url_for('static', filename=f'img/slideshow/{file}') 
                        for file in os.listdir(slideshow_folder) 
                        if file.endswith(('jpg', 'jpeg', 'png', 'gif'))]
    
    # Scraper content
    registration_content = search_registration_keywords()

    return render_template('index.html', slideshow_images=slideshow_images, registration_content=registration_content)

# Routes for other pages
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/classes')
def classes():
    return render_template('classes.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
