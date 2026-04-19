from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow Node.js to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    my_teach: List[str]
    my_learn: List[str]
    their_teach: List[str]
    their_learn: List[str]

@app.get("/")
def root():
    return {"message": "SkillSwap Matching Service is running! 🐍"}

@app.post("/match-score")
def match_score(data: MatchRequest):
    # How many of what I teach matches what they want to learn
    teach_matches = len(set(data.my_teach) & set(data.their_learn))
    # How many of what I want to learn matches what they teach
    learn_matches = len(set(data.my_learn) & set(data.their_teach))

    total = len(data.my_teach) + len(data.my_learn)
    matched = teach_matches + learn_matches

    score = round((matched / total) * 100) if total > 0 else 0

    return {
        "match_score": score,
        "teach_matches": teach_matches,
        "learn_matches": learn_matches,
        "verdict": "Great match! 🎉" if score >= 50 else "Partial match 👍"
    }