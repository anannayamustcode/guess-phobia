'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap, Heart, Target, Rocket, Brain, Timer, TrendingUp, Circle, Square, Triangle } from 'lucide-react';

interface Question {
  question: string;
  answer: number;
  hint: string;
  type: string;
}

interface Achievement {
  message: string;
  type: string;
}

interface LevelConfig {
  [key: number]: {
    name: string;
    range: number[];
    color: string;
  };
}

interface GameMode {
  name: string;
  icon: React.ComponentType<any>;
  desc: string;
}

export default function MathGamePage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [mood, setMood] = useState('neutral');
  const [pulseEffect, setPulseEffect] = useState(false);
  const [gameMode, setGameMode] = useState('classic');

  const levelConfig: LevelConfig = {
    1: { name: 'Starter', range: [1, 10], color: 'bg-green-400' },
    2: { name: 'Warmed Up', range: [1, 25], color: 'bg-blue-400' },
    3: { name: 'Getting Hot', range: [1, 50], color: 'bg-purple-400' },
    4: { name: 'On Fire', range: [1, 100], color: 'bg-orange-400' },
    5: { name: 'Math Demon', range: [1, 1000], color: 'bg-red-400' },
    6: { name: 'Calculation God', range: [1, 10000], color: 'bg-pink-400' }
  };

  const gameModes: { [key: string]: GameMode } = {
    classic: { name: 'Classic', icon: Brain, desc: 'Standard gameplay' },
    blitz: { name: 'Blitz', icon: Zap, desc: 'Quick fire questions' },
    zen: { name: 'Zen', icon: Circle, desc: 'No time pressure' },
    challenge: { name: 'Challenge', icon: Target, desc: 'Harder questions' }
  };

  const moodColors: { [key: string]: string } = {
    neutral: 'text-gray-600',
    happy: 'text-green-500',
    excited: 'text-blue-500',
    focused: 'text-purple-500',
    confused: 'text-orange-500'
  };

  const generateQuestion = (): Question => {
    const config = levelConfig[level];
    const [min, max] = config.range;
    
    const questionBank = [
      // Mystery boxes
      () => {
        const total = Math.floor(Math.random() * max) + min;
        const visible = Math.floor(Math.random() * total);
        return {
          question: `There are ${total} items total. You can see ${visible}. How many are hidden?`,
          answer: total - visible,
          hint: `Total minus visible: ${total} - ${visible}`,
          type: 'mystery'
        };
      },
      // Speed calculations
      () => {
        const distance = Math.floor(Math.random() * 20) + 10;
        const time = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        return {
          question: `Travel ${distance} km in ${time} hours. What's your speed per hour?`,
          answer: Math.floor(distance / time),
          hint: `Distance divided by time: ${distance} ÷ ${time}`,
          type: 'speed'
        };
      },
      // Growing patterns
      () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const multiplier = [2, 3][Math.floor(Math.random() * 2)];
        const steps = 3;
        return {
          question: `Pattern: ${start}, ${start * multiplier}, ${start * multiplier * multiplier}. Next number?`,
          answer: start * Math.pow(multiplier, steps),
          hint: `Each number is multiplied by ${multiplier}`,
          type: 'pattern'
        };
      },
      // Resource management
      () => {
        const workers = Math.floor(Math.random() * 8) + 2;
        const output = Math.floor(Math.random() * 5) + 2;
        const hours = Math.floor(Math.random() * 4) + 2;
        return {
          question: `${workers} workers each make ${output} items per hour. Total in ${hours} hours?`,
          answer: workers * output * hours,
          hint: `Workers × output × hours: ${workers} × ${output} × ${hours}`,
          type: 'production'
        };
      },
      // Scaling problems
      () => {
        if (level < 3) return null;
        const original = Math.floor(Math.random() * 20) + 5;
        const scale = [2, 3, 4][Math.floor(Math.random() * 3)];
        return {
          question: `Original size: ${original}. Scale it up ${scale}x. New size?`,
          answer: original * scale,
          hint: `Multiply by scale factor: ${original} × ${scale}`,
          type: 'scaling'
        };
      },
      // Probability basics
      () => {
        if (level < 4) return null;
        const total = [10, 20, 100][Math.floor(Math.random() * 3)];
        const favorable = Math.floor(total / [2, 4, 5][Math.floor(Math.random() * 3)]);
        return {
          question: `${favorable} winning tickets out of ${total} total. What percentage wins?`,
          answer: Math.round((favorable / total) * 100),
          hint: `(Winning ÷ Total) × 100: (${favorable} ÷ ${total}) × 100`,
          type: 'probability'
        };
      },
      // Compound operations
      () => {
        if (level < 2) return null;
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 8) + 2;
        return {
          question: `${a} + ${b} × ${c} = ?`,
          answer: a + (b * c),
          hint: `Multiplication first: ${a} + (${b} × ${c}) = ${a} + ${b * c}`,
          type: 'order_ops'
        };
      },
      // Inverse operations
      () => {
        const result = Math.floor(Math.random() * max) + min;
        const subtracted = Math.floor(Math.random() * result);
        return {
          question: `Some number minus ${subtracted} equals ${result - subtracted}. What's the number?`,
          answer: result,
          hint: `Add back what was subtracted: ${result - subtracted} + ${subtracted}`,
          type: 'inverse'
        };
      },
      // Ratio problems
      () => {
        if (level < 3) return null;
        const ratio1 = Math.floor(Math.random() * 5) + 1;
        const ratio2 = Math.floor(Math.random() * 5) + 1;
        const multiplier = Math.floor(Math.random() * 8) + 2;
        return {
          question: `Ratio is ${ratio1}:${ratio2}. If first part is ${ratio1 * multiplier}, what's second part?`,
          answer: ratio2 * multiplier,
          hint: `Keep the same ratio: ${ratio1 * multiplier} ÷ ${ratio1} = ${multiplier}, so ${ratio2} × ${multiplier}`,
          type: 'ratio'
        };
      },
      // Sequence gaps
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = [3, 4, 5, 7][Math.floor(Math.random() * 4)];
        const position = 4;
        return {
          question: `Sequence: ${start}, ${start + step}, ${start + 2*step}, ?, ${start + 4*step}. Missing number?`,
          answer: start + 3*step,
          hint: `Increases by ${step} each time`,
          type: 'sequence'
        };
      },
      // Multi-step word problems
      () => {
        if (level < 5) return null;
        const factories = Math.floor(Math.random() * 5) + 3;
        const machinesPerFactory = Math.floor(Math.random() * 8) + 4;
        const itemsPerMachine = Math.floor(Math.random() * 12) + 6;
        const hoursPerDay = Math.floor(Math.random() * 4) + 8;
        const days = Math.floor(Math.random() * 3) + 2;
        const defectRate = Math.floor(Math.random() * 15) + 5;
        
        const totalItems = factories * machinesPerFactory * itemsPerMachine * hoursPerDay * days;
        const defective = Math.floor(totalItems * defectRate / 100);
        const goodItems = totalItems - defective;
        
        return {
          question: `${factories} factories, ${machinesPerFactory} machines each, ${itemsPerMachine} items/machine/hour, ${hoursPerDay}h/day for ${days} days. ${defectRate}% defective. Good items?`,
          answer: goodItems,
          hint: `Total items = ${factories}×${machinesPerFactory}×${itemsPerMachine}×${hoursPerDay}×${days} = ${totalItems}. Defective = ${defectRate}% of ${totalItems} = ${defective}`,
          type: 'mega_word'
        };
      },
      // Exponential growth madness
      () => {
        if (level < 5) return null;
        const initial = Math.floor(Math.random() * 8) + 2;
        const rate = [2, 3, 4][Math.floor(Math.random() * 3)];
        const time = Math.floor(Math.random() * 4) + 4;
        
        return {
          question: `Population starts at ${initial}, ${rate}x every period. After ${time} periods?`,
          answer: initial * Math.pow(rate, time),
          hint: `${initial} × ${rate}^${time} = ${initial} × ${Math.pow(rate, time)}`,
          type: 'exponential'
        };
      },
      // Percentage chain calculations
      () => {
        if (level < 5) return null;
        const start = Math.floor(Math.random() * 400) + 100;
        const increase1 = Math.floor(Math.random() * 30) + 20;
        const decrease = Math.floor(Math.random() * 25) + 15;
        const increase2 = Math.floor(Math.random() * 35) + 25;
        
        const step1 = Math.floor(start * (100 + increase1) / 100);
        const step2 = Math.floor(step1 * (100 - decrease) / 100);
        const final = Math.floor(step2 * (100 + increase2) / 100);
        
        return {
          question: `Start: ${start}. +${increase1}%, then -${decrease}%, then +${increase2}%. Final value?`,
          answer: final,
          hint: `${start} → ${step1} → ${step2} → ${final}`,
          type: 'percentage_chain'
        };
      },
      // Complex ratios and proportions
      () => {
        if (level < 5) return null;
        const a = Math.floor(Math.random() * 7) + 3;
        const b = Math.floor(Math.random() * 9) + 4;
        const c = Math.floor(Math.random() * 6) + 2;
        const total = Math.floor(Math.random() * 200) + 150;
        
        const sum = a + b + c;
        const aValue = Math.floor((a * total) / sum);
        
        return {
          question: `Ratio ${a}:${b}:${c}. Total is ${total}. First part equals?`,
          answer: aValue,
          hint: `Sum of ratio = ${sum}. First part = (${a}/${sum}) × ${total}`,
          type: 'complex_ratio'
        };
      },
      // System of equations (disguised)
      () => {
        if (level < 6) return null;
        const x = Math.floor(Math.random() * 15) + 5;
        const y = Math.floor(Math.random() * 12) + 3;
        const sum = x + y;
        const diff = Math.abs(x - y);
        
        return {
          question: `Two numbers sum to ${sum}. Their difference is ${diff}. What is the larger number?`,
          answer: Math.max(x, y),
          hint: `If sum = ${sum} and difference = ${diff}, then larger = (${sum} + ${diff})/2`,
          type: 'system_disguised'
        };
      },
      // Prime factor mayhem
      () => {
        if (level < 6) return null;
        const primes = [2, 3, 5, 7, 11, 13];
        const p1 = primes[Math.floor(Math.random() * 4)];
        const p2 = primes[Math.floor(Math.random() * 4) + 2];
        const exp1 = Math.floor(Math.random() * 3) + 2;
        const exp2 = Math.floor(Math.random() * 2) + 1;
        
        const number = Math.pow(p1, exp1) * Math.pow(p2, exp2);
        const factorCount = (exp1 + 1) * (exp2 + 1);
        
        return {
          question: `${number} = ${p1}^${exp1} × ${p2}^${exp2}. How many total factors does ${number} have?`,
          answer: factorCount,
          hint: `For p^a × q^b, factors = (a+1)(b+1) = (${exp1}+1)(${exp2}+1)`,
          type: 'prime_factors'
        };
      },
      // Compound interest nightmare
      () => {
        if (level < 6) return null;
        const principal = Math.floor(Math.random() * 500) + 100;
        const rate = [5, 8, 10, 12][Math.floor(Math.random() * 4)];
        const time = Math.floor(Math.random() * 3) + 2;
        
        const amount = Math.floor(principal * Math.pow(1 + rate/100, time));
        const interest = amount - principal;
        
        return {
          question: `$${principal} at ${rate}% compound interest for ${time} years. Total interest earned?`,
          answer: interest,
          hint: `Amount = ${principal}(1.${rate/100})^${time} = ${amount}. Interest = ${amount} - ${principal}`,
          type: 'compound_interest'
        };
      },
      // Geometric series
      () => {
        if (level < 6) return null;
        const first = Math.floor(Math.random() * 6) + 2;
        const ratio = [2, 3][Math.floor(Math.random() * 2)];
        const terms = Math.floor(Math.random() * 3) + 4;
        
        let sum = 0;
        for (let i = 0; i < terms; i++) {
          sum += first * Math.pow(ratio, i);
        }
        
        return {
          question: `Series: ${first} + ${first*ratio} + ${first*ratio*ratio} + ... (${terms} terms). Sum?`,
          answer: sum,
          hint: `Geometric series: ${first}(${ratio}^${terms} - 1)/(${ratio} - 1)`,
          type: 'geometric_series'
        };
      },
      // Modular arithmetic
      () => {
        if (level < 6) return null;
        const base = Math.floor(Math.random() * 80) + 50;
        const mod = [7, 11, 13][Math.floor(Math.random() * 3)];
        
        return {
          question: `What is ${base} mod ${mod}? (remainder when ${base} is divided by ${mod})`,
          answer: base % mod,
          hint: `${base} ÷ ${mod} = ${Math.floor(base/mod)} remainder ${base % mod}`,
          type: 'modular'
        };
      },
      // Combinatorics basics
      () => {
        if (level < 6) return null;
        const total = Math.floor(Math.random() * 5) + 6;
        const choose = Math.floor(Math.random() * 3) + 2;
        
        let result = 1;
        for (let i = 0; i < choose; i++) {
          result = result * (total - i) / (i + 1);
        }
        
        return {
          question: `Choose ${choose} items from ${total} items. How many ways?`,
          answer: Math.round(result),
          hint: `C(${total},${choose}) = ${total}!/(${choose}! × ${total-choose}!)`,
          type: 'combinations'
        };
      }
    ];

    let question: Question | null = null;
    let attempts = 0;
    while (!question && attempts < 20) {
      const generator = questionBank[Math.floor(Math.random() * questionBank.length)];
      const generated = generator();
      if (generated) {
        question = generated;
      }
      attempts++;
    }

    return question || {
      question: `${Math.floor(Math.random() * max) + min} + ${Math.floor(Math.random() * max) + min}`,
      answer: 0,
      hint: 'Add the two numbers together',
      type: 'basic'
    };
  };

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setStreak(0);
    setEnergy(100);
    setLevel(1);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTimeLeft(gameMode === 'zen' ? 999 : gameMode === 'blitz' ? 30 : 60);
    setCurrentQuestion(generateQuestion());
    setFeedback('');
    setShowHint(false);
    setMood('neutral');
  };

  const submitAnswer = () => {
    if (!currentQuestion || userAnswer === '') return;

    const isCorrect = parseFloat(userAnswer) === currentQuestion.answer;
    setTotalQuestions(prev => prev + 1);
    setShowHint(false);
    
    if (isCorrect) {
      const basePoints = 50;
      const levelBonus = level * 10;
      const streakBonus = streak * 5;
      const points = basePoints + levelBonus + streakBonus;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
      setEnergy(prev => Math.min(100, prev + 5));
      
      setMood('happy');
      setFeedback(['Nice!', 'Great!', 'Excellent!', 'Perfect!', 'Brilliant!'][Math.floor(Math.random() * 5)]);
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 300);
      
      const levelUpThreshold = level < 4 ? 5 : level === 4 ? 8 : 12;
      if (correctAnswers > 0 && correctAnswers % levelUpThreshold === 0 && level < 6) {
        setLevel(prev => prev + 1);
        setMood('excited');
        setFeedback(level >= 4 ? 'INSANE LEVEL UP!' : 'Level Up!');
      }
      
      checkAchievements();
    } else {
      setStreak(0);
      const energyLoss = level >= 5 ? 25 : 15;
      setEnergy(prev => Math.max(0, prev - energyLoss));
      setMood('confused');
      setFeedback(`Answer: ${currentQuestion.answer}`);
      
      if (energy <= energyLoss) {
        setIsGameActive(false);
        setMood('neutral');
        return;
      }
    }

    setUserAnswer('');
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
      setFeedback('');
      setMood('focused');
    }, 1500);
  };

  const getHint = () => {
    if (!currentQuestion) return;
    
    setShowHint(true);
    const scorePenalty = level >= 5 ? 25 : 10;
    const energyPenalty = level >= 5 ? 10 : 5;
    setScore(prev => Math.max(0, prev - scorePenalty));
    setEnergy(prev => Math.max(0, prev - energyPenalty));
  };

  const checkAchievements = () => {
    const newAchievements: Achievement[] = [];
    
    if (streak === 5) newAchievements.push({ message: 'Streak Master', type: 'streak' });
    if (streak === 10) newAchievements.push({ message: 'On Fire', type: 'fire' });
    if (streak === 20) newAchievements.push({ message: 'UNSTOPPABLE FORCE', type: 'mega_fire' });
    if (score >= 1000) newAchievements.push({ message: 'Score Hunter', type: 'score' });
    if (score >= 5000) newAchievements.push({ message: 'SCORE DESTROYER', type: 'mega_score' });
    if (level >= 4) newAchievements.push({ message: 'Level Crusher', type: 'level' });
    if (level >= 5) newAchievements.push({ message: 'MATH DEMON UNLOCKED', type: 'demon' });
    if (level >= 6) newAchievements.push({ message: 'CALCULATION GOD MODE', type: 'god' });
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0 && gameMode !== 'zen') {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
    return () => clearInterval(interval);
  }, [isGameActive, timeLeft, gameMode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isGameActive) {
        submitAnswer();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [userAnswer, currentQuestion, isGameActive]);

  const currentConfig = levelConfig[level];

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4">
      {/* Floating shapes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const shapes = [Circle, Square, Triangle];
          const Shape = shapes[i % 3];
          return (
            <Shape
              key={i}
              className="absolute text-blue-200 opacity-20 animate-float"
              size={24}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            />
          );
        })}
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-1 sm:px-0">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-800 mb-2">
            MATH<span className="text-blue-500">FLOW</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600">Advik this game is for you</p>
        </div>

        {!isGameActive ? (
          /* Setup Screen */
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 text-center">Choose Your Flow</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {Object.entries(gameModes).map(([key, mode]) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setGameMode(key)}
                      className={`p-2 sm:p-4 rounded-xl font-semibold transition-all text-xs sm:text-base ${
                        gameMode === key 
                          ? 'bg-blue-500 text-white shadow-lg scale-105' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon size={20} className="mx-auto mb-1 sm:mb-2" />
                      <div className="text-xs sm:text-sm">{mode.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl sm:text-2xl font-bold py-4 sm:py-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Flow
            </button>
          </div>
        ) : (
          /* Game Screen */
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{score}</div>
                  <div className="text-sm text-slate-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{streak}</div>
                  <div className="text-sm text-slate-600">Streak</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${currentConfig.color.replace('bg-', 'text-')}`}>
                    L{level}
                  </div>
                  <div className="text-sm text-slate-600">{currentConfig.name}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{energy}%</div>
                  <div className="text-sm text-slate-600">Energy</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{width: `${energy}%`}}
                    />
                  </div>
                </div>
                {gameMode !== 'zen' && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{timeLeft}</div>
                    <div className="text-sm text-slate-600">Time</div>
                  </div>
                )}
              </div>
            </div>

            {/* Question Card */}
            <div className={`bg-white rounded-3xl p-4 sm:p-8 shadow-xl border-2 transition-all ${
              pulseEffect ? 'border-green-400 scale-105' : 'border-slate-200'
            }`}>
              {currentQuestion && (
                <>
                  <div className="text-center mb-6">
                    <Brain className={`mx-auto ${moodColors[mood]} transition-colors`} size={48} />
                  </div>
                  
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 mb-6 sm:mb-8 text-center leading-relaxed">
                    {currentQuestion.question}
                  </div>
                  <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Your answer"
                      className="w-full p-3 sm:p-4 text-lg sm:text-2xl text-center rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={submitAnswer}
                        disabled={userAnswer === ''}
                        className="flex-1 bg-blue-500 text-white font-bold py-2 sm:py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-base sm:text-lg"
                      >
                        Submit
                      </button>
                      <button
                        onClick={getHint}
                        className="bg-orange-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:bg-orange-600 transition-colors"
                      >
                        <Lightbulb size={18} className="sm:size-20" />
                      </button>
                    </div>
                    {showHint && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4 text-orange-800">
                        <div className="font-medium">{currentQuestion.hint}</div>
                        <div className="text-xs sm:text-sm text-orange-600 mt-1">
                          -{level >= 5 ? 25 : 10} points, -{level >= 5 ? 10 : 5} energy
                        </div>
                      </div>
                    )}
                  </div>

                  {feedback && (
                    <div className={`mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-center ${
                      feedback.includes('Level') || ['Nice!', 'Great!', 'Excellent!', 'Perfect!', 'Brilliant!'].some(word => feedback.includes(word))
                        ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {feedback}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* End Game */}
            <div className="text-center">
              <button
                onClick={() => setIsGameActive(false)}
                className="bg-slate-200 text-slate-600 px-4 sm:px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm sm:text-base"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="fixed top-2 right-2 sm:top-4 sm:right-4 space-y-2 z-50">
            {achievements.slice(-3).map((achievement, index) => (
              <div key={index} className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-bold animate-bounce text-xs sm:text-base">
                <Target className="inline mr-2" size={14} />
                {achievement.message}
              </div>
            ))}
          </div>
        )}

        {/* Final Stats */}
        {!isGameActive && totalQuestions > 0 && (
          <div className="mt-4 sm:mt-6 bg-white rounded-2xl p-3 sm:p-6 shadow-lg border border-slate-200">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 text-center">Session Complete</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-500">{score}</div>
                <div className="text-slate-600 text-xs sm:text-base">Final Score</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-500">{Math.max(streak, 0)}</div>
                <div className="text-slate-600 text-xs sm:text-base">Best Streak</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-green-500">{correctAnswers}/{totalQuestions}</div>
                <div className="text-slate-600 text-xs sm:text-base">Solved</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-500">
                  {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                </div>
                <div className="text-slate-600 text-xs sm:text-base">Accuracy</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
