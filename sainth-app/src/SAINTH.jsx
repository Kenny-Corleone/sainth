import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, Cpu, Wifi, Shield, Home, MessageSquare, Brain, Zap, Phone, Search, Calendar, Camera, Power } from 'lucide-react';

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
  const [wakeWord, setWakeWord] = useState('сэйнт');
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

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
      takingPhoto: "Taking photo..."
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
      takingPhoto: "Делаю фото..."
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
      takingPhoto: "Şəkil çəkirəm..."
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
      takingPhoto: "Scattando foto..."
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

        const fullTranscript = (finalTranscript + interimTranscript).toLowerCase();

        // Check for wake word
        if (!isActivated && wakeWords[currentLanguage].some(word => fullTranscript.includes(word.toLowerCase()))) {
          setIsActivated(true);
          setAiState('listening');
          speak(t.wakeWordDetected);
          setConversation(prev => [...prev, { type: 'system', message: t.wakeWordDetected, timestamp: new Date() }]);
        } else if (isActivated && finalTranscript) {
          setUserInput(finalTranscript);
          processCommand(finalTranscript);
          setIsActivated(false);
        }
      };

      recognitionRef.current.onend = () => {
        if (isAlwaysListening) {
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (isAlwaysListening) {
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
      };
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize audio context for visualization
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Start with greeting and enable always listening
    setTimeout(() => {
      speak(t.greeting);
      setConversation([{ type: 'ai', message: t.greeting, timestamp: new Date() }]);
      setIsAlwaysListening(true);
    }, 1000);

    // Simulate system monitoring
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.max(20, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(100, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.random() > 0.1 ? 100 : Math.floor(Math.random() * 50 + 50),
        security: Math.max(90, Math.min(100, prev.security + (Math.random() - 0.5) * 2))
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, isAlwaysListening]);

  // Start always listening when enabled
  useEffect(() => {
    if (isAlwaysListening && recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    } else if (!isAlwaysListening && recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isAlwaysListening]);

  const speak = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languages[currentLanguage].code;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onstart = () => setAiState('responding');
      utterance.onend = () => setAiState('idle');
      synthRef.current.speak(utterance);
    }
  };

  const processCommand = async (input) => {
    setAiState('processing');

    const newMessage = { type: 'user', message: input, timestamp: new Date() };
    setConversation(prev => [...prev, newMessage]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = '';
    const lowerInput = input.toLowerCase();

    // Enhanced command processing
    if (lowerInput.includes('hello') || lowerInput.includes('привет') || lowerInput.includes('salam') || lowerInput.includes('ciao')) {
      response = t.greeting;
      setEmotionalState('happy');
    } else if (lowerInput.includes('call') || lowerInput.includes('позвони') || lowerInput.includes('zəng') || lowerInput.includes('chiama')) {
      response = t.callContact;
      setEmotionalState('focused');
      // Simulate phone call functionality
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location) {
          // This would trigger phone call in a real app
          console.log('Would make phone call here');
        }
      }, 2000);
    } else if (lowerInput.includes('search') || lowerInput.includes('найди') || lowerInput.includes('axtar') || lowerInput.includes('cerca')) {
      response = t.searchingWeb;
      setEmotionalState('focused');
    } else if (lowerInput.includes('photo') || lowerInput.includes('фото') || lowerInput.includes('şəkil') || lowerInput.includes('foto')) {
      response = t.takingPhoto;
      setEmotionalState('focused');
    } else if (lowerInput.includes('reminder') || lowerInput.includes('напомни') || lowerInput.includes('xatırlat') || lowerInput.includes('ricorda')) {
      response = t.settingReminder;
      setEmotionalState('focused');
    } else if (lowerInput.includes('weather') || lowerInput.includes('погода') || lowerInput.includes('hava') || lowerInput.includes('tempo')) {
      response = currentLanguage === 'en' ? `Weather in Baku: 23°C, partly cloudy with light winds. Perfect day for a walk!` :
                currentLanguage === 'ru' ? `Погода в Баку: 23°C, переменная облачность со слабым ветром. Отличный день для прогулки!` :
                currentLanguage === 'az' ? `Bakıda hava: 23°C, qismən buludlu, yüngül külək. Gəzinti üçün mükəmməl gün!` :
                `Tempo a Baku: 23°C, parzialmente nuvoloso con venti leggeri. Giornata perfetta per una passeggiata!`;
    } else if (lowerInput.includes('status') || lowerInput.includes('статус') || lowerInput.includes('vəziyyət') || lowerInput.includes('stato')) {
      response = currentLanguage === 'en' ? `All systems operational. CPU at ${systemStatus.cpu}%, network connection excellent. ${deviceConnections} devices connected and ready.` :
                currentLanguage === 'ru' ? `Все системы работают. ЦП на ${systemStatus.cpu}%, отличное сетевое соединение. ${deviceConnections} устройств подключено и готово.` :
                currentLanguage === 'az' ? `Bütün sistemlər işləyir. CPU ${systemStatus.cpu}%-də, şəbəkə əlaqəsi əla. ${deviceConnections} cihaz qoşulub və hazırdır.` :
                `Tutti i sistemi operativi. CPU al ${systemStatus.cpu}%, connessione di rete eccellente. ${deviceConnections} dispositivi connessi e pronti.`;
    } else {
      response = currentLanguage === 'en' ? "I understand your request. I'm processing and learning from this interaction. How else can I assist you?" :
                currentLanguage === 'ru' ? "Понимаю ваш запрос. Обрабатываю и изучаю это взаимодействие. Чем еще могу помочь?" :
                currentLanguage === 'az' ? "Sorğunuzu başa düşürəm. Bu qarşılıqlı əlaqəni emal edib öyrənirəm. Başqa necə kömək edə bilərəm?" :
                "Capisco la tua richiesta. Sto elaborando e imparando da questa interazione. Come posso aiutarti ancora?";
      setEmotionalState('focused');
    }

    const aiResponse = { type: 'ai', message: response, timestamp: new Date() };
    setConversation(prev => [...prev, aiResponse]);
    speak(response);
  };

  const handleTextSubmit = () => {
    if (userInput.trim()) {
      processCommand(userInput);
      setUserInput('');
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
      case 'processing': return 'animate-spin';
      case 'responding': return 'animate-bounce';
      default: return isActivated ? 'animate-pulse scale-105' : '';
    }
  };

  // Audio visualization rings
  const renderAudioRings = () => {
    const rings = [];
    for (let i = 0; i < 3; i++) {
      rings.push(
        <div
          key={i}
          className={`absolute rounded-full border-2 ${
            aiState === 'listening' ? 'border-blue-400' :
            aiState === 'processing' ? 'border-yellow-400' :
            aiState === 'responding' ? 'border-green-400' : 'border-purple-400'
          } ${aiState !== 'idle' ? 'animate-ping' : ''}`}
          style={{
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '2s'
          }}
        />
      );
    }
    return rings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-lg border-b border-blue-500/20 p-4">
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
                {isActivated ? 'ACTIVATED' : 'STANDBY'} • {aiState.toUpperCase()}
                {isAlwaysListening && <span className="ml-2 text-green-400">🎤 LIVE</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-black/50 border border-blue-500/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-blue-400"
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>{lang.name}</option>
              ))}
            </select>
            <button
              onClick={() => setIsAlwaysListening(!isAlwaysListening)}
              className={`p-2 rounded-lg transition-all ${
                isAlwaysListening ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}
              title={t.alwaysListening}
            >
              <Mic className="w-5 h-5" />
            </button>
            <Settings className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1" style={{minHeight: 'calc(100vh - 73px)'}}> {/* Adjust 73px based on actual header height */}
        {/* Sidebar */}
        <nav className="w-20 bg-black/20 backdrop-blur-lg border-r border-blue-500/20 p-4 flex flex-col items-center">
          <div className="space-y-6">
            {[
              { icon: Brain, id: 'assistant', label: t.assistant },
              { icon: Home, id: 'dashboard', label: t.dashboard },
              { icon: MessageSquare, id: 'chat', label: 'Chat' },
              { icon: Cpu, id: 'devices', label: t.devices },
              { icon: Shield, id: 'security', label: t.security }
            ].map(({ icon: Icon, id, label }) => (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
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

        {/* Assistant Interface */}
        {activeModule === 'assistant' && (
          <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
            <div className="relative flex items-center justify-center mb-8">
              {/* Audio visualization rings */}
              {renderAudioRings()}

              {/* Main AI Core */}
              <div className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${getAIStateColor()} ${getEmotionalGlow()} flex items-center justify-center ${getCoreAnimation()}`}>
                <div className="w-24 h-24 rounded-full bg-black/20 backdrop-blur-lg flex items-center justify-center">
                  {aiState === 'listening' && <Mic className="w-8 h-8" />}
                  {aiState === 'processing' && <Cpu className="w-8 h-8" />}
                  {aiState === 'responding' && <MessageSquare className="w-8 h-8" />}
                  {aiState === 'idle' && <Brain className="w-8 h-8" />}
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isActivated ? 'How can I help?' : `Say "${wakeWords[currentLanguage]?.[1] || 'Hey Saint'}" to activate`}
              </h2>
              <p className="text-gray-400 text-lg">
                {aiState === 'listening' && t.listening}
                {aiState === 'processing' && t.processing}
                {aiState === 'responding' && 'Speaking...'}
                {aiState === 'idle' && !isActivated && `Wake word: "${wakeWords[currentLanguage]?.[1] || 'Hey Saint'}"`}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Phone, label: currentLanguage === 'en' ? 'Call' : currentLanguage === 'ru' ? 'Звонок' : currentLanguage === 'az' ? 'Zəng' : 'Chiama', action: 'call' },
                { icon: Search, label: currentLanguage === 'en' ? 'Search' : currentLanguage === 'ru' ? 'Поиск' : currentLanguage === 'az' ? 'Axtarış' : 'Cerca', action: 'search' },
                { icon: Calendar, label: currentLanguage === 'en' ? 'Reminder' : currentLanguage === 'ru' ? 'Напоминание' : currentLanguage === 'az' ? 'Xatırlatma' : 'Promemoria', action: 'reminder' },
                { icon: Camera, label: currentLanguage === 'en' ? 'Photo' : currentLanguage === 'ru' ? 'Фото' : currentLanguage === 'az' ? 'Şəkil' : 'Foto', action: 'photo' }
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={action}
                  onClick={() => processCommand(action)}
                  className="p-4 bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            {/* Recent Conversations */}
            {conversation.length > 1 && (
              <div className="w-full max-w-2xl bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Interactions</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {conversation.slice(-3).map((msg, index) => (
                    <div key={index} className={`text-sm p-2 rounded ${
                      msg.type === 'user' ? 'bg-blue-500/20 text-blue-300' :
                      msg.type === 'ai' ? 'bg-green-500/20 text-green-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {msg.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

        {/* Dashboard */}
        {activeModule === 'dashboard' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* System Status */}
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
                        <span>{`${Math.round(value)}%`}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            value > 80 ? 'bg-green-500' : value > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Control Panel - Placeholder, to be completed based on user's request */}
              <div className="bg-black/30 backdrop-blur-lg border border-blue-500/20 rounded-xl p-6 hover:bg-black/40 transition-all lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  {t.deviceControl}
                </h3>
                <p className="text-gray-400">Device control panel will be implemented here.</p>
                {/* Example: Add mock device controls here later */}
              </div>

            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default SAINTH;
