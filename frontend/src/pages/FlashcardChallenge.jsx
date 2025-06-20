import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FlashcardChallenge() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [prevNum, setPrevNum] = useState(0);
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setMessage('');
    setAnswer('');
    roll();
  };

  const handleAnswer = (inputAnswer) => {
    if (message) return; // Prevent answering while message is displayed

    const selectedAnswer = inputAnswer;
    setAnswer(selectedAnswer);

    const correct = selectedAnswer === question;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      setMessage('Correct!');
    } else {
      setMessage(`Incorrect. This belongs in the ${question} bin.`);
    }

    setTimeout(() => {
      setAnswer('');
      setIsCorrect(null);
      setMessage('');
      roll();
    }, 1500);
  };

  const getRandomNumber = (prevNum) => {
    let number;
    do {
      number = Math.floor(Math.random() * 5) + 1;
    } while (number === prevNum);
    return number;
  };

  const roll = () => {
    const n = getRandomNumber(prevNum);
    let category = '';
    switch (n) {
      case 1: category = 'Organic'; break;
      case 2: category = 'Paper'; break;
      case 3: category = 'PMD'; break;
      case 4: category = 'Residual'; break;
      case 5: category = 'Glass'; break;
      default: category = 'Unknown'; break;
    }
    setQuestion(category);
    selectImage(category);
    setPrevNum(n);
  };

  const rollImage = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const selectImage = (category) => {
    const num = rollImage(1, 2);
    const fileName = `${category.toLowerCase()}${num}.png`;
    setImage(`/images/flashcards/${fileName}`);
  };

  const binData = [
    { name: 'Organic', file: 'greenbin.png' },
    { name: 'Paper', file: 'bluebin.png' },
    { name: 'PMD', file: 'orangebin.png' },
    { name: 'Residual', file: 'greybin.png' },
    { name: 'Glass', file: 'yellowbin.png' },
  ];

  return (
    <div className="font-inter antialiased text-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 bg-[#d3f5ee]">
        {!isPlaying ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-24 px-6">
            <h1 className="text-4xl font-extrabold text-[#205374] mb-4">Flashcard Challenge</h1>
            <p className="text-gray-700 mb-8 max-w-xl">
              Ready to test your recycling knowledge? Click start to begin the challenge and see how high you can score!
            </p>
            <button 
              onClick={startGame}
              className="bg-[#205374] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#1b4561] transition-transform transform hover:scale-105 text-xl"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
            <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 relative mt-12 sm:mt-0">
              <div className="absolute sm:top-5 sm:right-5 bg-green-400 text-white px-5 py-2 rounded-lg shadow-sm z-10 
                            top-[-50px] left-1/2 -translate-x-1/2 w-40 text-center sm:w-auto sm:left-auto sm:translate-x-0">
                <p className="font-bold text-lg tracking-wide">Score: {score}</p>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#205374] text-center mb-6">In which bin does this item go?</h2>
              
              <div className="relative bg-white w-full max-w-md h-64 sm:h-80 p-4 rounded-xl shadow-inner mx-auto mb-8">
                <img src={image} alt="Trash item" className='w-full h-full object-contain' />
                {message && (
                  <div className={`absolute inset-0 rounded-xl flex items-center justify-center text-white text-4xl font-extrabold transition-opacity duration-300 ${isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                    <span className="text-center p-2">{message}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
                {binData.map((bin) => (
                  <div 
                    key={bin.name} 
                    className="relative group bg-white/70 p-2 sm:p-4 rounded-xl shadow-md flex justify-center items-center cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() => handleAnswer(bin.name)}
                  >
                    <img src={`/images/flashcards/${bin.file}`} alt={`${bin.name} bin`} className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
                    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center text-lg sm:text-xl font-bold rounded-xl transition-opacity opacity-100 sm:opacity-0 group-hover:opacity-100">
                      <span className="text-center">{bin.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 