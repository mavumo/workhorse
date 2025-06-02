# jobs_scraper.py

import requests
from bs4 import BeautifulSoup
import json

def scrape_careers24():
    url = "https://www.careers24.com/jobs/lc-south-africa/kw-remote/"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    jobs = []
    for job_card in soup.select(".job-title"):
        title = job_card.text.strip()
        link = job_card['href']
        jobs.append({
            "title": title,
            "link": "https://www.careers24.com" + link,
            "source": "Careers24"
        })
    return jobs

if __name__ == "__main__":
    all_jobs = scrape_careers24()
    with open("jobs.json", "w") as f:
        json.dump(all_jobs, f, indent=2)
