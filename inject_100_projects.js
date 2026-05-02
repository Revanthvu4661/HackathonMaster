const fs = require('fs');

const rawInput = `
AI & Machine Learning
AI-based Resume Screening System
Smart Interview Preparation Assistant
AI Mental Health Chatbot
Fake News Detection Platform
AI-powered Attendance System
Deepfake Detection Tool
AI-based Crop Disease Detection
Voice-controlled Virtual Assistant
AI for Personalized Learning
AI-based Road Damage Detection

Healthcare & MedTech
Virtual Triage Assistant
Remote Patient Monitoring System
Emergency Ambulance Tracking
AI Symptom Checker
Medicine Reminder App
Blood Donation Network Platform
Hospital Queue Management
Women Safety Health Tracker
Smart Medical Record System
Elderly Care Monitoring System

Smart Cities
Smart Parking Management
Intelligent Traffic Monitoring
Waste Segregation using AI
Smart Street Light Automation
Smart Water Leakage Detection
Air Pollution Monitoring System
Smart Energy Consumption Tracker
Public Complaint Management System
Smart Public Transport Tracker
Urban Flood Prediction System

Education Technology
Gamified Learning Platform
AI-based Exam Proctoring
Student Skill Tracking Dashboard
Smart Timetable Generator
Digital Classroom Management
Personalized Study Planner
AI Doubt Solving Assistant
Campus Navigation App
Automated Assignment Evaluator
Online Lab Simulation Platform

Agriculture & Rural Development
Precision Irrigation System
Smart Soil Health Analyzer
Farmer Marketplace Platform
Livestock Monitoring System
Weather Prediction for Farmers
Crop Yield Prediction System
Smart Fertilizer Recommendation
Farm Equipment Rental App
AI Pest Detection System
Rural Healthcare Connectivity Platform

Cybersecurity & Blockchain
Phishing Detection Tool
Blockchain-based Voting System
Secure Digital Identity Platform
Cyber Threat Monitoring Dashboard
Passwordless Authentication System
Secure Cloud File Sharing
Blockchain Supply Chain Tracking
Fraud Transaction Detection
Privacy-focused Social Network
Smart Contract Vulnerability Scanner

FinTech
AI Personal Finance Advisor
Expense Tracking App
UPI Fraud Detection System
Digital Loan Eligibility Checker
Student Budget Planner
Smart Investment Recommendation Tool
Blockchain-based Banking App
Financial Literacy Platform
Automated Tax Calculator
QR-based Payment Analytics Dashboard

Environment & Sustainability
Carbon Footprint Tracker
Renewable Energy Optimization
Smart Recycling Assistant
Plastic Waste Collection System
Green Transportation App
Food Waste Reduction Platform
Water Conservation Monitoring
Smart Forest Fire Detection
Sustainable Shopping Recommendation App
Climate Change Awareness Platform

IoT & Hardware
Smart Home Automation
IoT-based Smart Helmet
Smart Blind Navigation Device
Smart Gas Leakage Detector
Wearable Health Monitoring Device
Smart Fire Alarm System
IoT Smart Classroom
Smart Inventory Tracking using RFID
Smart Electricity Meter
IoT-based Industrial Safety System

Social Impact & Governance
Women Safety SOS App
Disaster Management Platform
Missing Person Identification System
NGO Donation Transparency Platform
Civic Issue Reporting System
Accessibility App for Disabled Users
Smart Election Monitoring System
Digital Legal Aid Platform
Community Volunteer Coordination App
Real-time Disaster Relief Tracking System
`;

// Parse the text
const lines = rawInput.trim().split('\n').filter(l => l.trim() !== '');
const newProjects = [];
let currentCategory = 'Full Stack';
let currentRepo = 'shadcn-ui/taxonomy';
let currentTags = ['React', 'Next.js', 'Tailwind'];

const categoryMapping = {
  'AI & Machine Learning': { cat: 'AI/ML', repo: 'Nutlope/roomGPT', tags: ['AI', 'Python', 'React'] },
  'Healthcare & MedTech': { cat: 'Full Stack', repo: 'adrianhajdin/project_medical_pager', tags: ['Healthcare', 'React', 'Firebase'] },
  'Smart Cities': { cat: 'Full Stack', repo: 'adrianhajdin/project_syncfusion_dashboard', tags: ['Dashboard', 'IoT', 'React'] },
  'Education Technology': { cat: 'University', repo: 'timlrx/tailwind-nextjs-starter-blog', tags: ['Education', 'Next.js', 'EdTech'] },
  'Agriculture & Rural Development': { cat: 'AI/ML', repo: 'soumyajit4419/Plant_AI', tags: ['Agriculture', 'Machine Learning', 'Python'] },
  'Cybersecurity & Blockchain': { cat: 'Web3', repo: 'scaffold-eth/scaffold-eth-2', tags: ['Web3', 'Blockchain', 'Security'] },
  'FinTech': { cat: 'SaaS', repo: 'vercel/nextjs-subscription-payments', tags: ['Finance', 'Stripe', 'Next.js'] },
  'Environment & Sustainability': { cat: 'Full Stack', repo: 'saintslab/carbontracker', tags: ['Environment', 'Green Tech', 'React'] },
  'IoT & Hardware': { cat: 'Dev Tools', repo: 'appwrite/appwrite', tags: ['IoT', 'Hardware', 'Sensors'] },
  'Social Impact & Governance': { cat: 'University', repo: 'adrianhajdin/evently', tags: ['Social Good', 'Community', 'Platform'] }
};

for (const line of lines) {
  const t = line.trim();
  if (categoryMapping[t]) {
    currentCategory = categoryMapping[t].cat;
    currentRepo = categoryMapping[t].repo;
    currentTags = categoryMapping[t].tags;
  } else {
    newProjects.push({
      title: t,
      desc: "A robust starter template highly optimized for building a " + t + ". Includes necessary frontend and backend infrastructure.",
      tags: currentTags,
      category: currentCategory,
      repo: currentRepo,
      branch: 'main'
    });
  }
}

// Load existing projects
let currentJS = fs.readFileSync('projects_app.js', 'utf8');
const regex = /const allProjects = (\[[\s\S]*?\]);/m;
let existing = [];
let match = currentJS.match(regex);
if(match) {
  existing = eval(match[1]);
}

// Filter out any new projects that might already exist by exact title
const existingTitles = new Set(existing.map(p => p.title.toLowerCase()));
const finalNewProjects = newProjects.filter(p => !existingTitles.has(p.title.toLowerCase()));

// Merge and save
const combined = [...finalNewProjects, ...existing];
const newContent = currentJS.replace(regex, "const allProjects = " + JSON.stringify(combined, null, 2) + ";");
fs.writeFileSync('projects_app.js', newContent);

// Update placeholder in projects.html to reflect roughly 665 projects now
let html = fs.readFileSync('projects.html', 'utf8');
html = html.replace(/Search 500\+ projects/g, 'Search 650+ projects');
fs.writeFileSync('projects.html', html);

console.log("Successfully added " + finalNewProjects.length + " new curated hackathon topics!");
