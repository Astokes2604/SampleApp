import React from 'react';
import './Page.css';
const stackImg = process.env.PUBLIC_URL + '/images/techStack.png';

function AboutStack() {
    return (
        <div className="page demon-page">
            <h1 className="demon-heading">About My Solution Stack</h1>
            <ul>
                <li>Frontend: React.js</li>
                <li>Backend: Spring Boot</li>
                <li>Database: H2 (Dev) / MongoDB (Optional)</li>
                <li>Styling: CSS</li>
                <li>Build Tools: Maven & npm</li>
            </ul>
            <img src={stackImg} alt="Stack Diagram" className="image demon-shadow" />
        </div>
    );
}

export default AboutStack;