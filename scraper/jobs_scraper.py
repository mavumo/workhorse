import json
from datetime import datetime

def scrape_jobs():
    # Example data structure
    jobs = [
        {
            "title": "Legal Intern",
            "company": "Redemption Law Group",
            "location": "Remote",
            "url": "https://careers.jobbyist.co.za/jobs/legal-intern",
            "posted": datetime.utcnow().isoformat()
        }
    ]
    with open("jobs/jobs.json", "w") as f:
        json.dump(jobs, f, indent=2)

if __name__ == "__main__":
    scrape_jobs()
