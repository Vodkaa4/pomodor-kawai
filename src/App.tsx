import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sun, Moon, Target, Flame } from 'lucide-react';
import './App.css';

interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
}

function App() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isActive: false,
    isBreak: false,
    sessionCount: 0
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [completedSessions, setCompletedSessions] = useState(2);
  const [streak, setStreak] = useState(7);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mascotMood, setMascotMood] = useState<'idle' | 'working' | 'break' | 'sleeping' | 'happy'>('idle');

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timer.isActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer.seconds === 0) {
            if (prevTimer.minutes === 0) {
              // Timer finished
              handleTimerComplete();
              return {
                ...prevTimer,
                isActive: false,
                minutes: prevTimer.isBreak ? 25 : 5,
                seconds: 0,
                isBreak: !prevTimer.isBreak,
                sessionCount: prevTimer.isBreak ? prevTimer.sessionCount : prevTimer.sessionCount + 1
              };
            } else {
              return {
                ...prevTimer,
                minutes: prevTimer.minutes - 1,
                seconds: 59
              };
            }
          } else {
            return {
              ...prevTimer,
              seconds: prevTimer.seconds - 1
            };
          }
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isActive]);

  // Mascot mood based on timer state
  useEffect(() => {
    if (timer.isActive) {
      setMascotMood(timer.isBreak ? 'break' : 'working');
    } else if (timer.minutes === 0 && timer.seconds === 0) {
      setMascotMood('happy');
    } else {
      setMascotMood('idle');
    }
  }, [timer.isActive, timer.isBreak, timer.minutes, timer.seconds]);

  const handleTimerComplete = () => {
    if (!timer.isBreak) {
      setCompletedSessions(prev => prev + 1);
      if (completedSessions + 1 >= dailyGoal) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
    setMascotMood('happy');
    
    if (soundEnabled) {
      // Sound effect would play here
      console.log('Ding! Timer complete');
    }
  };

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.isBreak ? 5 : 25,
      seconds: 0,
      isActive: false
    }));
    setMascotMood('idle');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Calculate progress for circular timer
  const totalTime = timer.isBreak ? 5 * 60 : 25 * 60;
  const currentTime = timer.minutes * 60 + timer.seconds;
  const progress = ((totalTime - currentTime) / totalTime) * 100;

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className="background">
        <div className="clouds">
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
          <div className="cloud cloud3"></div>
        </div>
        <div className="stars">
          <div className="star star1"></div>
          <div className="star star2"></div>
          <div className="star star3"></div>
          <div className="star star4"></div>
          <div className="star star5"></div>
        </div>
      </div>

      {/* Header with stats */}
      <header className="header">
        <div className="stats">
          <div className="stat-card">
            <Target className="stat-icon" size={20} />
            <div className="stat-content">
              <div className="stat-label">Goal</div>
              <div className="stat-value">{completedSessions}/{dailyGoal}</div>
            </div>
          </div>
          <div className="stat-card">
            <Flame className="stat-icon" size={20} />
            <div className="stat-content">
              <div className="stat-label">Streak</div>
              <div className="stat-value">{streak} days</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Timer Section */}
      <main className="main-content">
        {/* Tomato Mascot */}
        <div className={`mascot mascot-${mascotMood}`}>
          <div className="tomato-body">
            <div className="tomato-face">
              <div className="eyes">
                <div className="eye left-eye"></div>
                <div className="eye right-eye"></div>
              </div>
              <div className="mouth"></div>
            </div>
            <div className="tomato-leaf"></div>
          </div>
        </div>

        {/* Circular Timer */}
        <div className="timer-container">
          <div className="circular-timer">
            <svg className="progress-ring" width="280" height="280">
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="progress-background"
              />
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="progress-bar"
                style={{
                  strokeDasharray: `${2 * Math.PI * 120}`,
                  strokeDashoffset: `${2 * Math.PI * 120 * (1 - progress / 100)}`,
                }}
              />
            </svg>
            <div className="timer-display">
              <div className="time">
                {String(timer.minutes).padStart(2, '0')}:
                {String(timer.seconds).padStart(2, '0')}
              </div>
              <div className="session-type">
                {timer.isBreak ? 'Break Time' : 'Focus Time'}
              </div>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="timer-controls">
          <button className="control-btn secondary" onClick={resetTimer}>
            <RotateCcw size={24} />
          </button>
          <button className="control-btn primary" onClick={toggleTimer}>
            {timer.isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button className="control-btn secondary" onClick={toggleSound}>
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        {/* Motivational Message */}
        <div className="motivation-message">
          {timer.isActive && !timer.isBreak && "You're doing amazing! Keep it up! 🍅"}
          {timer.isActive && timer.isBreak && "Take a well-deserved break! 😌"}
          {!timer.isActive && "Ready to start your next session? 💪"}
        </div>
      </main>

      {/* Goal Progress */}
      <div className="goal-progress">
        <div className="progress-label">Daily Goal Progress</div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${(completedSessions / dailyGoal) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">{completedSessions} of {dailyGoal} sessions</div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-btn">
          <div className="nav-icon">🍅</div>
          <div className="nav-label">Timer</div>
        </button>
        <button className="nav-btn">
          <div className="nav-icon">📊</div>
          <div className="nav-label">Stats</div>
        </button>
        <button className="nav-btn" onClick={toggleTheme}>
          <div className="nav-icon">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>
          <div className="nav-label">Theme</div>
        </button>
        <button className="nav-btn">
          <div className="nav-icon">⚙️</div>
          <div className="nav-label">Settings</div>
        </button>
      </nav>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="celebration-modal">
          <div className="celebration-content">
            <div className="celebration-emoji">🎉</div>
            <h2>Goal Achieved!</h2>
            <p>You've completed your daily goal! Amazing work!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;