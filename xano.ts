import sys
import json
import requests
import time

# Model priority list — ordered: best first, then Gemma fallbacks (separate quota)
MODELS_TO_TRY = [
    "gemini-1.5-flash", 
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-preview",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemma-3-27b-it",
    "gemma-3-12b-it",
    "gemma-3-4b-it",
    "gemma-3-1b-it",
    "gemma-3n-e4b-it",
    "gemma-3n-e2b-it",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-3-flash-preview",
    "gemini-robotics-er-1.5-preview",
]

# 🚀 Refactored for FastAPI Direct Import
def generate_magic_job(prompt_input, api_key, preferences=None):
    if preferences is None:
        preferences = {}
        
    wants_ai_video = preferences.get('aiVideo', False)
    
    video_instructions = (
        "Generate exactly 3-5 behavioral interview questions specifically tailored to this role. "
        "These questions MUST be designed to elicit STAR method (Situation, Task, Action, Result) responses. "
        "Include these in a 'questions' array of strings in your JSON output."
    ) if wants_ai_video else (
        "Do NOT generate any video interview questions. Add a 'questions' array that is strictly empty: []."
    )

    prompt_text = f"""
    You are an Expert Corporate and Technical Recruiter. The employer wants to post a job based on the following input: "{prompt_input}".
    
    CRITICAL: Look for "Target Experience Level" in the input (e.g., Fresher, Entry Level, Mid Level, Senior Level, Lead). You MUST strictly align the job responsibilities, required skills, and the complexity of behavioral interview questions to this specific level:
    - **Fresher / Entry Level**: Focus questions on learning potential, basic problem-solving, teamwork in college/internships, and foundational knowledge.
    - **Mid Level**: Focus questions on project execution, technical troubleshooting, collaborating within a team, and taking ownership of modules.
    - **Senior Level**: Focus questions on system design, complex problem-solving, mentoring others, and architectural trade-offs.
    - **Lead / Management**: Focus questions on leadership, strategic vision, resource planning, and cross-functional stakeholder management.

    IMPORTANT: This job can belong to ANY industry (e.g., IT, Sales, Marketing, Mechanical, Finance, Healthcare). You must adapt the tone, terminology, responsibilities, and required skills to perfectly match the specific domain and job title provided.

    Based on the input, generate a highly professional, ready-to-publish job posting. 
    Analyze the job description and automatically select the MOST relevant sub-topics for the Aptitude and Technical rounds from the strict lists provided below.
    Pick up to 1 category for Aptitude and up to 3 topics for Technical.

    VALID APTITUDE TOPICS: "General Aptitude", "Logical Reasoning", "Verbal Ability", "Quantitative", "Sales Aptitude", "Marketing Aptitude", "Finance"
    VALID TECHNICAL TOPICS: "Java", "Python", "JavaScript", "C++", "SQL", "React", "Node.js", "System Design", "Data Structures", "Algorithms", "DSA MCQs", "Output Prediction", "Debugging", "Database Concepts", "Objection Handling", "Customer Communication", "Lead Qualification", "Campaign Analysis", "Branding", "SEO Concepts", "Financial Analysis", "Accounting", "Other"

    ASSESSMENT PIPELINE INSTRUCTIONS:
    {video_instructions}

    Return ONLY a raw JSON object (no markdown, no backticks) with this exact schema:
    {{
      "jobTitle": "Clean, Professional Job Title (e.g., Senior Mechanical Engineer, Regional Sales Manager)",
      "jobDomain": "The precise Industry Domain",
      "jd": "Write a short, engaging introductory summary (1-2 sentences), followed by a clear bulleted list of 5-7 key responsibilities and day-to-day tasks (use '\\n- ' for bullets).",
      "experience": "Fresher" | "Entry Level" | "Mid Level" | "Senior Level" | "Lead",
      "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
      "suggestedRounds": {{
          "aptitude": {{ "topics": ["Selected Topic"] }},
          "technical": {{ "topics": ["Selected Tech 1", "Selected Tech 2"] }}
      }},
      "location": "City, State or Remote",
      "package": "Estimated Salary Range (e.g. ₹3,00,000 - ₹6,00,000)",
      "education": "Relevant Degree Required (e.g., B.Tech / B.E., MBA, B.Sc, B.Com)",
      "questions": ["STAR Question 1", "STAR Question 2", "STAR Question 3"]
    }}
    """

    payload = {"contents": [{"parts": [{"text": prompt_text}]}]}

    last_error = ""

    for model_name in MODELS_TO_TRY:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

        try:
            print(f"   🤖 [job_generator] Trying model: {model_name}")
            response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=15)

            if response.status_code == 429:
                print(f"   ⏭️  [job_generator] 429/Quota on {model_name} — skipping")
                continue

            if response.status_code != 200:
                print(f"   ⚠️  [job_generator] Model {model_name} failed with status {response.status_code}")
                continue

            data = response.json()
            try:
                text_response = data['candidates'][0]['content']['parts'][0]['text'].strip()

                # Cleanup Markdown
                if "```json" in text_response: text_response = text_response.split("```json")[1].split("```")[0]
                elif "```" in text_response: text_response = text_response.split("```")[1].split("```")[0]

                json_output = json.loads(text_response.strip())

                # 💰 Extract token usage from REST response
                total_tokens = data.get("usageMetadata", {}).get("totalTokenCount", 0)

                print(f"   ✅ [job_generator] Success with model: {model_name} | Tokens: {total_tokens}")
                return {
                    "jobData": json_output,
                    "usage_metadata": {"total_tokens": total_tokens, "model": model_name}
                }

            except Exception as parse_err:
                print(f"   ❌ [job_generator] Model {model_name} returned invalid JSON: {parse_err}")
                continue

        except Exception as e:
            print(f"   ⚠️  [job_generator] Network error with {model_name}: {e}")
            continue

    # Fallback — same { jobData, usage_metadata } shape
    print(f"   [ERROR] All models failed in job_generator. Returning fallback.")
    
    dummy_questions = [
        "Tell me about a time you faced a significant technical challenge in your role. How did you handle it?",
        "Describe a situation where you had to learn a new skill quickly to complete a task.",
        "Give an example of a time you worked successfully as part of a team to achieve a difficult goal."
    ] if wants_ai_video else []
    
    return {
        "jobData": {
            "jobTitle": "Software Engineer",
            "jobDomain": "Information Technology (IT)",
            "jd": f"We are looking for a professional based on your prompt: {prompt_input}.",
            "experience": "Mid Level",
            "skills": ["Communication", "Problem Solving"],
            "suggestedRounds": {
                "aptitude": { "topics": ["General Aptitude"] },
                "technical": { "topics": ["Algorithms", "Data Structures"] }
            },
            "location": "Remote",
            "package": "Not Specified",
            "education": "Degree Relevant to Role",
            "questions": dummy_questions
        },
        "usage_metadata": {"total_tokens": 0, "model": "fallback"}
    }

# For CLI usage
if __name__ == "__main__":
    if len(sys.argv) > 2:
        prefs = {}
        if len(sys.argv) > 3:
            try:
                prefs = json.loads(sys.argv[3]) # <--- Now parses preferences from terminal
            except Exception:
                pass
        res = generate_magic_job(sys.argv[2], sys.argv[1], prefs)
        print(json.dumps(res))
    else:
        print(json.dumps({"error": "Missing args"}))
