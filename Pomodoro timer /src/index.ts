// Define constants for time intervals
const WORK_INTERVAL: number = 25 * 60; // 25 minutes in seconds
const BREAK_INTERVAL: number  = 5 * 60; // 5 minutes in seconds
const SESSION_LENGTH: number = 4;

// Define interface for the timer options
interface TimerOptions {
  workTime: number;
  breakTime: number;
}

// Define class for the timer
class PomodoroTimer {
  private _workTime: number;
  private _breakTime: number;
  private _interval: number;
  private _timerId: NodeJS.Timeout | null;
  private _callback: Function | null;
  private _currentSession: 'work' | 'break';
  private _workSessionCompleted: number;
  private _breakSessionComplted: number;

  constructor(options: TimerOptions) {
    this._workTime = options.workTime || WORK_INTERVAL;
    this._breakTime = options.breakTime || BREAK_INTERVAL;
    this._interval = this._workTime;
    this._timerId = null;
    this._callback = null;
    this._currentSession = 'work';
    this._workSessionCompleted = 0;
    this._breakSessionComplted = 0;
  }

  start(callback?: Function): void {
    this._callback = callback || null;
    this._interval = this._workTime;
    this.tick();
    this._timerId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause(): void {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  reset(): void {
    this.pause();
    this._interval = this._workTime;
    this._currentSession = 'work';
    this._workSessionCompleted = 0;
    this._breakSessionComplted = 0;
    this.updateLabel();
    this.updateTime();
  }

  private tick(): void {
    this._interval--;
    if (this._interval === 0) {
      this.pause();
      if (this._callback) {
        this._callback();
      }
      if(this._currentSession === 'work'){
        this._interval = this._breakTime;
        this._currentSession = 'break';
        this._playNotificationSound(); // play notification sound when break interval ends
        this._workSessionCompleted++;
      }else{
        this._interval = this._workTime;
        this._currentSession = 'work';
        this._playNotificationSound(); // play notification sound when break interval ends
        this._breakSessionComplted++;
      }
      this.updateLabel();
      if(this._workSessionCompleted + this._breakSessionComplted === SESSION_LENGTH){
        this.reset();
      }else{
        this.start();
      }
    }
    this.updateTime();
  }


  private updateLabel(): void{
    const labelEl = document.querySelector('#timer-label');
    if(labelEl){
      labelEl.innerHTML = this._currentSession === 'work' ? 'Work' : 'Break';
    }
  }

  private updateTime(): void{
    const timeLeftEl = document.querySelector('#time-left');
    const sessionCounterEl = document.querySelector('#session-counter')
    if(timeLeftEl && sessionCounterEl){
      const minutes = Math.floor(this._interval / 60);
      const seconds = this._interval % 60;
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timeLeftEl.innerHTML = timeStr;

      const workSessionsCompleted = this._workSessionCompleted.toString().padStart(2, '0');
      const breakSessionsCompleted = this._breakSessionComplted.toString().padStart(2, '0');
      sessionCounterEl.innerHTML = `${workSessionsCompleted}/${breakSessionsCompleted}`;
    }
  }

  private _playNotificationSound(): void {
    const audioEl = document.querySelector('#audio') as HTMLAudioElement;
    audioEl.currentTime = 0;
    audioEl.play();
  }
}

// Usage example
const timer = new PomodoroTimer({
  workTime: 25 * 60, // 25 minutes in seconds
  breakTime: 5 * 60, // 5 minutes in seconds
});

const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resetBtn = document.querySelector('#reset-btn');

startBtn?.addEventListener('click', () => {
  timer.start();
});

pauseBtn?.addEventListener('click', () => {
  timer.pause();
});

resetBtn?.addEventListener('click', () => {
  timer.reset();
});