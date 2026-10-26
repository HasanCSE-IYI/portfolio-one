import React, { useEffect, useState } from 'react';
import Loader from 'react-loaders';
import AnimatedLetters from '../AnimatedLetters';
import './index.scss';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import portfolioData from '../../data/portfolio.json';

const Portfolio = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    getPortfolio();
  }, []);

  const getPortfolio = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      if (querySnapshot.docs.length > 0) {
        setPortfolio(querySnapshot.docs.map((doc) => doc.data()));
      } else {
        setPortfolio(portfolioData.portfolio);
      }
    } catch (error) {
      console.warn('Firebase portfolio fetch failed, falling back to local data:', error);
      setPortfolio(portfolioData.portfolio);
    }
  };

  const renderPortfolio = (portfolioList) => {
    return (
      <div className="images-container">
        {portfolioList.map((port, idx) => {
          const imgSrc = port.image || (port.cover ? `${process.env.PUBLIC_URL}${port.cover}` : '');
          const title = port.name || port.title;

          return (
            <div className="image-box" key={idx}>
              {imgSrc && (
                <img
                  src={imgSrc}
                  className="portfolio-image"
                  alt={title || 'Portfolio item'}
                />
              )}
              <div className="content">
                <p className="title">{title}</p>
                <h4 className="description">{port.description}</h4>
                {port.url && (
                  <button
                    className="btn"
                    onClick={() => window.open(port.url, '_blank', 'noopener,noreferrer')}
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div className="project-links">
          <a
            className="portfolio-page"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/StoreApi"
          >
            Store API [ASP.NET Core / EF Core]
          </a>
          <a
            className="portfolio-page"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/Hamd-Shop"
          >
            Hamd-Shop [Laravel E-Commerce]
          </a>
          <a
            className="portfolio-page"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/HasanCSE-IYI/Student-Management-System"
          >
            Student Management System
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container portfolio-page">
        <h1 className="page-title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Portfolio'.split('')}
            idx={15}
          />
        </h1>
        <div>{renderPortfolio(portfolio)}</div>
      </div>
      <Loader type="pacman" />
    </>
  );
};

export default Portfolio;
