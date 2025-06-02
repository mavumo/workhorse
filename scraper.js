import requests
from bs4 import BeautifulSoup
import json

url = "https://remoteok.com/"
headers = {"User-Agent": "Mozilla/5.0"}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

jobs = []
for job in soup.find_all('tr', class_='job'):
    title = job.find('h2', itemprop='title')
    company = job.find('h3', itemprop='name')
    link = job.get('data-href')

    if title and company and link:
        jobs.append({
            'title': title.text.strip(),
            'company': company.text.strip(),
            'link': f"https://remoteok.com{link}"
        })

# Save to JSON
with open("remote_jobs.json", "w") as f:
    json.dump(jobs, f, indent=2)
