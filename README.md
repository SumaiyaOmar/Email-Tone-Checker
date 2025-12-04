📩Email/Communication Tone Checker

A simple, clean web application that analyzes and rewrites messages to match a selected tone using Google Gemini 2.5 Flash.
________________________________________
📌 Overview

The Email/Communication Tone Checker helps users avoid miscommunication by analyzing the tone of a message and rewriting it to a more appropriate style. It is designed for emails, chats, and short notes.
Users can:
1.	Paste a message (email, chat, note).
2.	See the detected tone (e.g., formal, polite, friendly).
3.	Choose a target tone from a dropdown:
o	Formal
o	Polite
o	Friendly
o	Empathetic
o	Concise
4.	Generate a rewritten version that keeps the meaning but changes the style.
This project demonstrates:
•	Practical LLM usage
•	Prompt engineering
•	API integration using Google AI Studio
•	User-centered interface design
________________________________________
🎯 Objectives

This project fulfills the course requirements by:
✔ Real-world use case
Tone correction is important in professional communication.
✔ Clear UI/UX
The app uses a two-panel layout:
•	Left: User message
•	Right: Detected tone + rewritten text
✔ LLM Integration
Google Gemini 2.5 Flash is used for:
•	Tone classification
•	Rewriting text based on selected tone
✔ Output Formatting
Rewritten text appears clean and easy to read in a dedicated, styled panel.
________________________________________
🖥️ UI / UX Design

Left Panel — User Draft Message
•	White text area
•	Placeholder: "Paste your email, chat, or note here..."
•	Dropdown menu for selecting target tone
•	“Process Message” button
Right Panel — Results
•	Box showing detected tone
•	Box showing rewritten text
•	Light green background for clarity
•	Grey placeholder text when empty
Both panels are displayed side-by-side with a clean, minimal layout.
________________________________________
🤖 LLM Integration (Google Gemini 2.5 Flash)

Model Used:
Gemini 2.5 Flash in Google AI Studio
________________________________________
✏ Prompts 

🟦 Prompt 1 — App Definition Prompt
This app is an Email/Communication Tone Checker.  
It should take a user’s draft message (email, chat, or note) and do two things:
1. Analyze the current tone of the text and describe it in a short phrase (e.g., formal, casual, empathetic).
2. Rewrite the text to match a target tone selected by the user (formal, polite, friendly, empathetic, concise) while keeping the meaning intact.
The output should be structured so the rewritten text is clear and easy to read.

🟩 Prompt 2 — System Prompt (Tone Engine)
You are a Tone Analysis and Rewrite Assistant. Your job has two steps:
1. Analyze the tone of the user's input text and describe it in ONE short phrase.
2. Rewrite the text into the tone selected by the user: formal, polite, friendly, empathetic, or concise.

Rules:
- Never change the meaning of the text.
- Preserve all important details.
- Keep the rewrite natural and human.
- If the user does not choose a tone, do nothing.

Always return the result as JSON in this format:
{
  "detected_tone": "",
  "rewritten_text": ""
}
________________________________________
⚙️ How the System Works

1.	User enters text
2.	Front-end sends text + selected tone to API
3.	Gemini analyzes tone & rewrites it
4.	JSON output is processed and displayed on the UI
Data Flow:
User Input → Gemini Analysis → JSON Output → UI Rendering
________________________________________
📁 Repository Structure

/project-root
│── index.html
│── index.tsx
│── App.tsx
│── components
│	└── ToneSelecter.tsx
│── metadata.json
│── services/
│     └── geminiService.ts
│── type.ts
│── README.md  ← This file
________________________________________
🧪 Testing Examples

Test 1 — Too Casual
Input:
“hey can u send me the report today”
Target Tone: Formal
Expected:
Could you please send me the report today?
________________________________________
Test 2 — Harsh / Rude
Input:
“This is taking too long.”
Target Tone: Polite
Expected:
I was wondering if there might be an update on this, as it seems to be taking a while.
________________________________________
🛡 Responsible AI Practices

•	No personal data is stored.
•	User messages remain inside the session.
•	The LLM rewrites tone but never alters actual meaning.
________________________________________
👥 Team Members

Sumaiya Ahmed 
1.	Co-developed the project idea.
2.	Collaborated on building the app in Google AI Studio (Gemini 2.5 Flash).
3.	 Wrote the prompts and tested the tone-rewriting features.
4.	 Created the demo video and project documentation.

Sarah Bawazir 
1.	Co-developed the project idea.
2.	Collaborated on building the app in Google AI Studio (Gemini 2.5 Flash).
3.	Suggested using Google AI Studio and helped plan features and test the app.
4.	Contributed to the project documentation.
