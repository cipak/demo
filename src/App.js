import {useState, useRef, useCallback} from 'react';
import {WebexMeetingWidget} from '@webex/widgets';
import '@webex/widgets/dist/webexWidgets.css';
import './App.css';

const LAYOUT_TYPES = ['Single', 'Equal', 'ActivePresence', 'Prominent', 'OnePlusN'];

const useLocalStorage = (item, defval) => {
  const [stateValue, setStateValue] = useState(() => {
    const value = localStorage.getItem(item);
    return value !== null ? value : defval;
  });
  const setValue = useCallback((value) => {
    setStateValue(value);
    localStorage.setItem(item, value);
  }, [item]);

  return [stateValue, setValue];
};

function App() {
  const [token, setToken] = useLocalStorage('demo:access-token', '');
  const [destination, setDestination] = useLocalStorage('demo:meeting-destination', '');
  const [widget, setWidget] = useState(false);
  const [theme, setTheme] = useLocalStorage('demo:theme', 'dark');
  const [layout, setLayout] = useLocalStorage('demo:layout', 'Equal');
  const ref = useRef();

  const fullscreen = () => {
    if (!document.fullscreenElement) {
      ref.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const startLogs = () => {
    window.webexSDKAdapterSetLogLevel('debug');
  };

  const clearForm = () => {
    setToken('');
    setDestination('');
    setTheme('dark');
    setLayout('Equal');
  };

  return (
    <div className="App">
      <h1>Meeting Widget Demo</h1>
      <label className="label">
        <span>Token:</span>
        <input type="text" value={token} onChange={(event) => setToken(event.target.value)} />
      </label>
      <label className="label">
        <span>Destination: </span>
        <input type="text" value={destination} onChange={(event) => setDestination(event.target.value)} />
      </label>
      <label className="label">
        <span>Theme:</span>
        <select value={theme} onChange={(event) => setTheme(event.target.value)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <span className="live">(live)</span>
      </label>
      <label className="label">
        <span>Layout:</span>
        <select value={layout} onChange={(event) => setLayout(event.target.value)}>
          {LAYOUT_TYPES.map((layout) => <option key={layout} value={layout}>{layout}</option>)}
        </select>
        <span className="live">(live)</span>
      </label>
      <label className="label">
        <button type="button" onClick={() => setWidget(true)}>Load meeting widget</button>
        <button type="button" onClick={() => setWidget(false)}>Remove meeting widget</button>
        <button type="button" onClick={fullscreen}>Fullscreen</button>
        <button type="button" onClick={startLogs}>Activate debug logs</button>
        <button type="button" onClick={clearForm}>Clear form</button>
      </label>

      {widget && <div className={`widget-container wxc-theme-${theme}`} ref={ref}>
        <WebexMeetingWidget
          className="the-widget"
          accessToken={token}
          meetingDestination={destination}
          layout={layout}
        />
      </div>}
    </div>
  );
}

export default App;
