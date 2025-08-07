import React from 'react';
import './Page.css';
const profileImg = process.env.PUBLIC_URL + '/images/profile.jpg';

function Home() {
    return (
        <div className="page demon-page">
            <h1 className="demon-heading">Welcome to My Sample App</h1>
            <p>Hello! My name is Alexander Stokes. Most of you know who I am!!!!!!!!!!!</p>
            <p>This project showcases my ability to integrate React and Spring Boot into a single cohesive application.</p>
            <img src={profileImg} alt="Profile" className="image demon-shadow" />
        </div>
    );
}

export default Home;