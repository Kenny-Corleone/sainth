import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, Cpu, Wifi, Shield, Home, MessageSquare, Brain, Zap, Phone, Search, Calendar, Camera, Power, Tv, Thermometer, Lightbulb } from 'lucide-react';

const SAINTH = () => {
  const [isListening, setIsListening] = useState(false);
  const [isAlwaysListening, setIsAlwaysListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 85,
    memory: 62,
    network: 100,
    security: 98
  });
  const [aiState, setAiState] = useState('idle'); // idle, listening, processing, responding
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [deviceConnections, setDeviceConnections] = useState(3);
  const [activeModule, setActiveModule] = useState('assistant');
  const [isActivated, setIsActivated] = useState(false);
  // const [wakeWord, setWakeWord] = useState('сэйнт'); // This state is not used, wakeWords object is used instead
  const [audioLevel, setAudioLevel] = useState(0); // This state is declared but not updated or used.

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  // const animationRef = useRef(null); // This ref is declared but not used.
  // const audioContextRef = useRef(null); // This ref is declared but not used.
  // const analyserRef = useRef(null); // This ref is declared but not used.

  // Multilingual support
  const languages = {
    en: { code: 'en-US', name: 'English' },
    ru: { code: 'ru-RU', name: 'Русский' },
    az: { code: 'az-AZ', name: 'Azərbaycan' },
    it: { code: 'it-IT', name: 'Italiano' }
  };

  const wakeWords = {
    en: ['jarvis', 'saint', 'hey saint'],
    ru: ['джарвис', 'сэйнт', 'эй сэйнт'],
    az: ['jarvis', 'saint', 'hey saint'],
    it: ['jarvis', 'saint', 'ciao saint']
  };

  const translations = {
    en: {
      greeting: "Hello, I'm SAINTH. Voice activation enabled. Say 'Hey Saint' to wake me up.",
      listening: "Listening...",
      processing: "Processing your request...",
      wakeWordDetected: "Yes? How can I help you?",
      settings: "Settings",
      dashboard: "Dashboard",
      devices: "Devices",
      security: "Security",
      assistant: "Assistant",
      systemStatus: "System Status",
      voiceInput: "Voice Input",
      textInput: "Type your message...",
      send: "Send",
      aiCore: "AI Core",
      networkStatus: "Network",
      deviceControl: "Device Control",
      connectedDevices: "Connected Devices",
      alwaysListening: "Always Listening",
      wakeWord: "Wake Word",
      callContact: "Calling contact...",
      searchingWeb: "Searching the web...",
      openingApp: "Opening application...",
      settingReminder: "Setting reminder...",
      takingPhoto: "Taking photo...",
      chat: "Chat",
      smartTv: "Smart TV",
      thermostat: "Thermostat",
      livingRoomLight: "Living Room Light",
      officeLight: "Office Light",
      on: "On",
      off: "Off",
      temperature: "Temperature",
      brightness: "Brightness",
    },
    ru: {
      greeting: "Привет, я SAINTH. Голосовая активация включена. Скажи 'Эй Сэйнт' чтобы разбудить меня.",
      listening: "Слушаю...",
      processing: "Обрабатываю запрос...",
      wakeWordDetected: "Да? Как могу помочь?",
      settings: "Настройки",
      dashboard: "Панель",
      devices: "Устройства",
      security: "Безопасность",
      assistant: "Ассистент",
      systemStatus: "Статус системы",
      voiceInput: "Голосовой ввод",
      textInput: "Введите сообщение...",
      send: "Отправить",
      aiCore: "ИИ Ядро",
      networkStatus: "Сеть",
      deviceControl: "Управление устройствами",
      connectedDevices: "Подключенные устройства",
      alwaysListening: "Постоянное прослушивание",
      wakeWord: "Слово-активатор",
      callContact: "Звоню контакту...",
      searchingWeb: "Ищу в интернете...",
      openingApp: "Открываю приложение...",
      settingReminder: "Устанавливаю напоминание...",
      takingPhoto: "Делаю фото...",
      chat: "Чат",
      smartTv: "Смарт ТВ",
      thermostat: "Термостат",
      livingRoomLight: "Свет в гостиной",
      officeLight: "Свет в офисе",
      on: "Вкл",
      off: "Выкл",
      temperature: "Температура",
      brightness: "Яркость",
    },
    az: {
      greeting: "Salam, mən SAINTH-am. Səs aktivasiyası aktiv. 'Hey Saint' deyin ki məni oyandırın.",
      listening: "Dinləyirəm...",
      processing: "Sorğunuzu emal edirəm...",
      wakeWordDetected: "Bəli? Necə kömək edə bilərəm?",
      settings: "Tənzimləmələr",
      dashboard: "Panel",
      devices: "Cihazlar",
      security: "Təhlükəsizlik",
      assistant: "Asistent",
      systemStatus: "Sistem statusu",
      voiceInput: "Səs girişi",
      textInput: "Mesajınızı yazın...",
      send: "Göndər",
      aiCore: "AI Nüvə",
      networkStatus: "Şəbəkə",
      deviceControl: "Cihaz idarəetməsi",
      connectedDevices: "Qoşulmuş cihazlar",
      alwaysListening: "Həmişə dinləmə",
      wakeWord: "Oyandırma sözü",
      callContact: "Əlaqə zəng edirəm...",
      searchingWeb: "İnternetdə axtarıram...",
      openingApp: "Tətbiqi açıram...",
      settingReminder: "Xatırlatma qoyuram...",
      takingPhoto: "Şəkil çəkirəm...",
      chat: "Söhbət",
      smartTv: "Ağıllı TV",
      thermostat: "Termostat",
      livingRoomLight: "Qonaq otağı işığı",
      officeLight: "Ofis işığı",
      on: "Açıq",
      off: "Bağlı",
      temperature: "Temperatur",
      brightness: "Parlaqlıq",
    },
    it: {
      greeting: "Ciao, sono SAINTH. Attivazione vocale abilitata. Dì 'Ciao Saint' per svegliarmi.",
      listening: "Sto ascoltando...",
      processing: "Elaborando la tua richiesta...",
      wakeWordDetected: "Sì? Come posso aiutarti?",
      settings: "Impostazioni",
      dashboard: "Dashboard",
      devices: "Dispositivi",
      security: "Sicurezza",
      assistant: "Assistente",
      systemStatus: "Stato del sistema",
      voiceInput: "Input vocale",
      textInput: "Scrivi il tuo messaggio...",
      send: "Invia",
      aiCore: "Nucleo AI",
      networkStatus: "Rete",
      deviceControl: "Controllo dispositivi",
      connectedDevices: "Dispositivi connessi",
      alwaysListening: "Sempre in ascolto",
      wakeWord: "Parola di attivazione",
      callContact: "Chiamando contatto...",
      searchingWeb: "Cercando sul web...",
      openingApp: "Aprendo applicazione...",
      settingReminder: "Impostando promemoria...",
      takingPhoto: "Scattando foto...",
      chat: "Chat",
      smartTv: "Smart TV",
      thermostat: "Termostato",
      livingRoomLight: "Luce soggiorno",
      officeLight: "Luce ufficio",
      on: "Acceso",
      off: "Spento",
      temperature: "Temperatura",
      brightness: "Luminosità",
    }
  };

  const t = translations[currentLanguage];

  // Initialize speech recognition with wake word detection
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = languages[currentLanguage].code;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).toLowerCase().trim();

        // Check for wake word
        if (!isActivated && wakeWords[currentLanguage].some(word => fullTranscript.includes(word.toLowerCase()))) {
          setIsActivated(true);
          setAiState('listening');
          speak(t.wakeWordDetected);
          setConversation(prev => [...prev, { type: 'system', message: t.wakeWordDetected, timestamp: new Date() }]);
          // Clear the transcript after wake word detection to prevent processing it as a command
          if (recognitionRef.current) {
            // recognitionRef.current.abort(); // Abort current recognition
            // setTimeout(() => recognitionRef.current.start(), 0); // Restart immediately
          }
        } else if (isActivated && finalTranscript) {
          setUserInput(finalTranscript);
          processCommand(finalTranscript);
          setIsActivated(false); // Deactivate after processing a command
        }
      };

      recognitionRef.current.onend = () => {
        if (isAlwaysListening && recognitionRef.current) { // Ensure ref is still valid
          try {
            recognitionRef.current.start();
          } catch (error) {
            // console.error("Error restarting recognition onend (isAlwaysListening):", error);
            // Potentially handle specific errors like "not-allowed" or "aborted" differently
            // For now, just try restarting after a delay if it's not an "aborted" error (which might be intentional)
            if (error.name !== 'aborted') {
              setTimeout(() => {
                if (recognitionRef.current) recognitionRef.current.start();
              }, 100);
            }
          }
        } else {
          setIsListening(false);
        }
      };


      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Avoid continuous restart loops for critical errors like "not-allowed" or "service-not-allowed"
        if (event.error !== 'no-speech' && event.error !== 'aborted' && isAlwaysListening) {
          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error("Error restarting recognition on error:", e);
              }
            }
          }, 1000);
        } else {
          setIsListening(false); // Stop listening if there's a critical error or not always listening
        }
      };
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Start with greeting and enable always listening
    setTimeout(() => {
      speak(t.greeting);
      setConversation([{ type: 'ai', message: t.greeting, timestamp: new Date() }]);
      if (!isAlwaysListening) { // Only set if it's not already true, to avoid loop with useEffect
        setIsAlwaysListening(true);
      }
    }, 1000);

    // Simulate system monitoring
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.max(20, Math.min(100, Math.round(prev.cpu + (Math.random() - 0.5) * 10))),
        memory: Math.max(20, Math.min(100, Math.round(prev.memory + (Math.random() - 0.5) * 8))),
        network: Math.random() > 0.1 ? 100 : Math.floor(Math.random() * 50 + 50),
        security: Math.max(90, Math.min(100, Math.round(prev.security + (Math.random() - 0.5) * 2)))
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort(); // Use abort instead of stop for more immediate effect
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage, t.greeting, t.wakeWordDetected]); // isAlwaysListening removed to prevent loop, manage it with its own useEffect

  // Start/Stop listening based on isAlwaysListening and isListening state
  useEffect(() => {
    if (recognitionRef.current) {
      if (isAlwaysListening && !isListening) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Error starting recognition (isAlwaysListening effect):", error);
          // Handle cases where start() might fail, e.g., mic permissions not granted yet
          if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
            setIsAlwaysListening(false); // Turn off if permission is denied
            // Optionally, inform the user about the mic permission issue
          }
        }
      } else if (!isAlwaysListening && isListening) {
        recognitionRef.current.stop(); // Stop will trigger onend, which will not restart if isAlwaysListening is false
      }
    }
  }, [isAlwaysListening, isListening]);


  const speak = (text) => {
    if (synthRef.current && text) {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languages[currentLanguage].code;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onstart = () => setAiState('responding');
      utterance.onend = () => {
        setAiState('idle');
        // If activated, and not set to always listening, turn off activation
        // if (isActivated && !isAlwaysListening) {
        //   setIsActivated(false);
        // }
      };
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setAiState('idle'); // Reset state on error
      };
      synthRef.current.speak(utterance);
    } else {
      setAiState('idle'); // If no synth or no text, go to idle
    }
  };

  const processCommand = async (input) => {
    if (!input || input.trim() === '') {
      setIsActivated(false); // If input is empty, just deactivate
      setAiState('idle');
      return;
    }

    setAiState('processing');

    const newMessage = { type: 'user', message: input, timestamp: new Date() };
    setConversation(prev => [...prev, newMessage]);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    let response = '';
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('hello') || lowerInput.includes('привет') || lowerInput.includes('salam') || lowerInput.includes('ciao')) {
      response = t.greeting.split('.')[0]; // Shorter greeting
      setEmotionalState('happy');
    } else if (lowerInput.includes('call') || lowerInput.includes('позвони') || lowerInput.includes('zəng') || lowerInput.includes('chiama')) {
      response = t.callContact;
      setEmotionalState('focused');
      // Simulate phone call functionality - This is a placeholder
      console.log('Simulating phone call initiation...');
    } else if (lowerInput.includes('search') || lowerInput.includes('найди') || lowerInput.includes('axtar') || lowerInput.includes('cerca')) {
      response = t.searchingWeb;
      setEmotionalState('focused');
      // Simulate web search - Placeholder
      console.log('Simulating web search...');
    } else if (lowerInput.includes('photo') || lowerInput.includes('фото') || lowerInput.includes('şəkil') || lowerInput.includes('foto')) {
      response = t.takingPhoto;
      setEmotionalState('focused');
       // Simulate taking photo - Placeholder
      console.log('Simulating taking a photo...');
    } else if (lowerInput.includes('reminder') || lowerInput.includes('напомни') || lowerInput.includes('xatırlat') || lowerInput.includes('ricorda')) {
      response = t.settingReminder;
      setEmotionalState('focused');
      // Simulate setting reminder - Placeholder
      console.log('Simulating setting a reminder...');
    } else if (lowerInput.includes('weather') || lowerInput.includes('погода') || lowerInput.includes('hava') || lowerInput.includes('tempo')) {
      response = currentLanguage === 'en' ? `The weather in Baku is currently 23°C, partly cloudy with light winds. It's a perfect day for a walk!` :
                currentLanguage === 'ru' ? `Погода в Баку сейчас 23°C, переменная облачность, слабый ветер. Отличный день для прогулки!` :
                currentLanguage === 'az' ? `Bakıda hava hazırda 23°C, qismən buludlu, yüngül küləkdir. Gəzinti üçün mükəmməl gündür!` :
                `Il tempo a Baku è attualmente di 23°C, parzialmente nuvoloso con venti leggeri. È una giornata perfetta per una passeggiata!`;
      setEmotionalState('neutral');
    } else if (lowerInput.includes('status') || lowerInput.includes('статус') || lowerInput.includes('vəziyyət') || lowerInput.includes('stato')) {
      response = currentLanguage === 'en' ? `All systems are operational. CPU is at ${systemStatus.cpu}%, network connection is excellent. ${deviceConnections} devices are connected and ready.` :
                currentLanguage === 'ru' ? `Все системы работают. ЦП на ${systemStatus.cpu}%, сетевое соединение отличное. ${deviceConnections} устройств подключено и готово.` :
                currentLanguage === 'az' ? `Bütün sistemlər işləyir. CPU ${systemStatus.cpu}%-də, şəbəkə əlaqəsi əla. ${deviceConnections} cihaz qoşulub və hazırdır.` :
                `Tutti i sistemi sono operativi. CPU al ${systemStatus.cpu}%, connessione di rete eccellente. ${deviceConnections} dispositivi connessi e pronti.`;
      setEmotionalState('neutral');
    } else {
      response = currentLanguage === 'en' ? `I've processed your request: "${input}". I'm learning from this. How else can I assist?` :
                currentLanguage === 'ru' ? `Я обработал ваш запрос: "${input}". Я учусь на этом. Чем еще могу помочь?` :
                currentLanguage === 'az' ? `Sorğunuzu emal etdim: "${input}". Bundan öyrənirəm. Başqa necə kömək edə bilərəm?` :
                `Ho elaborato la tua richiesta: "${input}". Sto imparando da questo. Come posso aiutarti ancora?`;
      setEmotionalState('focused');
    }

    const aiResponse = { type: 'ai', message: response, timestamp: new Date() };
    setConversation(prev => [...prev, aiResponse]);
    speak(response);
    // setIsActivated(false); // Deactivate after responding, managed by onend of speech or if !isAlwaysListening
  };

  const handleTextSubmit = (e) => {
    e.preventDefault(); // Prevent form submission page reload
    if (userInput.trim()) {
      setIsActivated(true); // Manually activate for text input
      processCommand(userInput);
      setUserInput('');
      // setIsActivated(false) will be handled by speech onend or if not always listening
    }
  };

  const getAIStateColor = () => {
    switch (aiState) {
      case 'listening': return 'from-blue-400 to-cyan-500';
      case 'processing': return 'from-yellow-400 to-orange-500';
      case 'responding': return 'from-green-400 to-emerald-500';
      default: return isActivated ? 'from-purple-400 to-pink-500' : 'from-gray-400 to-gray-600';
    }
  };

  const getEmotionalGlow = () => {
    switch (emotionalState) {
      case 'happy': return 'shadow-green-500/50 shadow-2xl';
      case 'focused': return 'shadow-blue-500/50 shadow-2xl';
      case 'alert': return 'shadow-red-500/50 shadow-2xl';
      default: return 'shadow-purple-500/50 shadow-xl';
    }
  };

  const getCoreAnimation = () => {
    switch (aiState) {
      case 'listening': return 'animate-pulse scale-110';
      case 'processing': return 'animate-spin'; // Using Tailwind's built-in spin
      case 'responding': return 'animate-bounce';
      default: return isActivated ? 'animate-pulse scale-105' : '';
    }
  };

  const renderAudioRings = () => {
    const rings = [];
    const baseSize = 120;
    const increment = 40;
    for (let i = 0; i < 3; i++) {
      rings.push(
        <div
          key={i}
          className={`absolute rounded-full border-2 ${
            aiState === 'listening' ? 'border-blue-400' :
            aiState === 'processing' ? 'border-yellow-400' :
            aiState === 'responding' ? 'border-green-400' : 'border-purple-400'
          } ${aiState !== 'idle' && aiState !== 'processing' ? 'animate-ping' : ''}`} // Ping for listening/responding
          style={{
            width: `${baseSize + i * increment}px`,
            height: `${baseSize + i * increment}px`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: aiState === 'processing' ? '1s' : '2s', // Faster for processing if it had a specific animation
            opacity: 1 - i * 0.2, // Fade outer rings
          }}
        />
      );
    }
    return rings;
  };

  // Dummy device state
  const [devices, setDevices] = useState([
    { id: 'tv', name: t.smartTv, icon: Tv, type: 'toggle', state: false, room: 'Living Room' },
    { id: 'thermostat', name: t.thermostat, icon: Thermometer, type: 'range', state: 22, unit: '°C', room: 'General' },
    { id: 'lrLight', name: t.livingRoomLight, icon: Lightbulb, type: 'toggle', state: true, room: 'Living Room' },
    { id: 'officeLight', name: t.officeLight, icon: Lightbulb, type: 'range', state: 75, unit: '%', room: 'Office' },
  ]);

  useEffect(() => {
    setDevices(prevDevices => prevDevices.map(d => {
      if (d.id === 'tv') return {...d, name: t.smartTv};
      if (d.id === 'thermostat') return {...d, name: t.thermostat};
      if (d.id === 'lrLight') return {...d, name: t.livingRoomLight};
      if (d.id === 'officeLight') return {...d, name: t.officeLight};
      return d;
    }));
  }, [t.smartTv, t.thermostat, t.livingRoomLight, t.officeLight]);


  const toggleDevice = (id) => {
    setDevices(devices.map(d => d.id === id ? { ...d, state: !d.state } : d));
  };

  const changeDeviceValue = (id, value) => {
    setDevices(devices.map(d => d.id === id ? { ...d, state: value } : d));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-blue-500/20 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getAIStateColor()} ${getEmotionalGlow()} shadow-lg flex items-center justify-center ${getCoreAnimation()}`}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SAINTH
              </h1>
              <p className="text-sm text-gray-400">
                {isActivated ? 'ACTIVATED' : 'STANDBY'} &bull; {aiState.toUpperCase()}
                {isAlwaysListening && <span className="ml-2 text-green-400">🎤 LIVE</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-black/50 border border-blue-500/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-blue-400 appearance-none"
              title="Select Language"
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>{lang.name}</option>
              ))}
            </select>
            <button
              onClick={() => setIsAlwaysListening(!isAlwaysListening)}
              className={`p-2 rounded-lg transition-all ${
                isAlwaysListening ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              }`}
              title={t.alwaysListening}
            >
              {isAlwaysListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <Settings className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" title={t.settings} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 overflow-hidden"> {/* Added overflow-hidden here */}
        {/* Sidebar */}
        <nav className="w-20 bg-black/20 backdrop-blur-lg border-r border-blue-500/20 p-4 flex-shrink-0">
          <div className="space-y-6">
            {[
              { icon: Brain, id: 'assistant', label: t.assistant },
              { icon: Home, id: 'dashboard', label: t.dashboard },
              { icon: MessageSquare, id: 'chat', label: t.chat },
              { icon: Zap, id: 'devices', label: t.devices }, // Changed icon for devices
              { icon: Shield, id: 'security', label: t.security }
            ].map(({ icon: Icon, id, label }) => (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ease-in-out transform ${
                  activeModule === id
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25 scale-110'
                    : 'hover:bg-white/10 text-gray-400 hover:scale-105'
                }`}
                title={label}
              >
                <Icon className="w-6 h-6" />
              </button>
            ))}
          </div>
        </nav>

        {/* Main Panel - Takes remaining space and scrolls if needed */}
        <div className="flex-1 overflow-y-auto p-6"> {/* Added overflow-y-auto and padding */}
          {activeModule === 'assistant' && (
            <main className="flex flex-col items-center justify-center h-full"> {/* Ensure assistant takes full height of its container */}
              <div className="relative flex items-center justify-center mb-8">
                {renderAudioRings()}
                <div className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${getAIStateColor()} ${getEmotionalGlow()} flex items-center justify-center ${getCoreAnimation()}`}>
                  <div className="w-24 h-24 rounded-full bg-black/20 backdrop-blur-lg flex items-center justify-center">
                    {aiState === 'listening' && <Mic className="w-8 h-8" />}
                    {aiState === 'processing' && <Cpu className="w-8 h-8 animate-spin" />} {/* Added animate-spin directly */}
                    {aiState === 'responding' && <MessageSquare className="w-8 h-8" />}
                    {aiState === 'idle' && (isActivated ? <Brain className="w-8 h-8 animate-pulse" /> : <Power className="w-8 h-8" />) }
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isActivated ? t.wakeWordDetected : `${t.greeting.split('.')[0]}. ${currentLanguage === 'en' ? `Say '${wakeWords[currentLanguage][1]}' to activate` : ''}`}
                </h2>
                <p className="text-gray-400 text-lg">
                  {aiState === 'listening' && t.listening}
                  {aiState === 'processing' && t.processing}
                  {aiState === 'responding' && 'Speaking...'}
                  {aiState === 'idle' && !isActivated && `${t.wakeWord}: "${wakeWords[currentLanguage][1]}"`}
                </p>
              </div>

              {/* Text Input for Assistant */}
              <form onSubmit={handleTextSubmit} className="w-full max-w-lg flex items-center space-x-2 mb-8">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={t.textInput}
                  className="flex-grow bg-black/30 border border-blue-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {t.send}
                </button>
              </form>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
                {[
                  { icon: Phone, label: currentLanguage === 'en' ? 'Call' : currentLanguage === 'ru' ? 'Звонок' : currentLanguage === 'az' ? 'Zəng' : 'Chiama', action: 'call someone' },
                  { icon: Search, label: currentLanguage === 'en' ? 'Search' : currentLanguage === 'ru' ? 'Поиск' : currentLanguage === 'az' ? 'Axtarış' : 'Cerca', action: 'search for news' },
                  { icon: Calendar, label: currentLanguage === 'en' ? 'Reminder' : currentLanguage === 'ru' ? 'Напоминание' : currentLanguage === 'az' ? 'Xatırlatma' : 'Promemoria', action: 'set a reminder' },
                  { icon: Camera, label: currentLanguage === 'en' ? 'Photo' : currentLanguage === 'ru' ? 'Фото' : currentLanguage === 'az' ? 'Şəkil' : 'Foto', action: 'take a photo' }
                ].map(({ icon: Icon, label, action }) => (
                  <button
                    key={action}
                    onClick={() => { setIsActivated(true); processCommand(action);}}
                    className="p-4 bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>

              {conversation.length > 1 && (
                <div className="w-full max-w-2xl bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Interactions</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto"> {/* Increased max height */}
                    {conversation.slice().reverse().slice(0, 5).map((msg, index) => ( // Show latest 5, reversed
                      <div key={index} className={`text-sm p-2 rounded-lg ${
                        msg.type === 'user' ? 'bg-blue-500/20 text-blue-300 self-end' :
                        msg.type === 'ai' ? 'bg-green-500/20 text-green-300 self-start' :
                        'bg-yellow-500/20 text-yellow-300 self-center text-center' // System messages
                      }`}>
                        <strong>{msg.type === 'user' ? 'You' : msg.type === 'ai' ? 'SAINTH' : 'System'}:</strong> {msg.message}
                        <span className="block text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          )}

          {activeModule === 'dashboard' && (
            <main> {/* Removed flex for dashboard, padding is on parent */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-6 hover:bg-black/40 transition-all">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    {t.systemStatus}
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(systemStatus).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5"> {/* Increased height slightly */}
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${ // Smoother transition
                              value > 80 ? 'bg-green-500' : value > 50 ? 'bg-yellow-500' : 'bg-red-500' // Adjusted thresholds
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Control Panel - Completed */}
                <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-6 hover:bg-black/40 transition-all md:col-span-2"> {/* Span 2 columns on medium screens */}
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2" /> {/* Changed icon */}
                    {t.deviceControl}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {devices.map(device => (
                      <div key={device.id} className="bg-black/20 p-4 rounded-lg border border-blue-500/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <device.icon className={`w-5 h-5 mr-2 ${device.state && device.type === 'toggle' ? 'text-green-400' : 'text-gray-400'}`} />
                            <span className="font-medium">{device.name}</span>
                          </div>
                          {device.type === 'toggle' && (
                            <button
                              onClick={() => toggleDevice(device.id)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                                device.state ? 'bg-green-500/30 text-green-300 hover:bg-green-500/40' : 'bg-gray-600/30 text-gray-300 hover:bg-gray-600/40'
                              }`}
                            >
                              {device.state ? t.on : t.off}
                            </button>
                          )}
                        </div>
                        {device.type === 'range' && (
                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{device.state}{device.unit}</span>
                              <span>{device.id.includes('Light') ? t.brightness : t.temperature}</span>
                            </div>
                            <input
                              type="range"
                              min={device.id.includes('Light') ? 0 : 15}
                              max={device.id.includes('Light') ? 100 : 30}
                              value={device.state}
                              onChange={(e) => changeDeviceValue(device.id, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>
                        )}
                         <p className="text-xs text-gray-500 mt-1">{device.room}</p>
                      </div>
                    ))}
                  </div>
                   <p className="text-sm text-gray-400 mt-4">{`${t.connectedDevices}: ${devices.length}`}</p>
                </div>
                {/* End Device Control Panel */}
              </div>
            </main>
          )}

          {/* Placeholder for Chat Module */}
          {activeModule === 'chat' && (
            <main className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-500">{t.chat} {currentLanguage === 'en' ? 'Module Coming Soon' : ''}</h2>
            </main>
          )}

          {/* Placeholder for Security Module */}
          {activeModule === 'security' && (
            <main className="flex flex-col items-center justify-center h-full">
              <Shield className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-500">{t.security} {currentLanguage === 'en' ? 'Module Coming Soon' : ''}</h2>
              <div className="mt-6 bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-6 w-full max-w-md text-center">
                <h3 className="text-lg font-semibold mb-2">Security Status</h3>
                <p className={`text-2xl font-bold ${systemStatus.security > 95 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {systemStatus.security}% Protected
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${
                      systemStatus.security > 95 ? 'bg-green-500' : systemStatus.security > 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${systemStatus.security}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Last scan: Just now</p>
              </div>
            </main>
          )}

        </div> {/* End Main Panel */}
      </div> {/* End Main Content Area */}
    </div>
  );
};

export default SAINTH;
