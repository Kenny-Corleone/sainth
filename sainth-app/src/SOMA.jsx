import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, Cpu, Wifi, Shield, Home, MessageSquare, Brain, Zap, Phone, Search, Calendar, Camera, Power, Tv, Thermometer, Lightbulb, Activity, MapPin, Battery, Signal, Eye, Heart, AlertTriangle } from 'lucide-react';

const SOMA = () => {
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
  
  // Enhanced S.O.M.A. specific states
  const [contextualData, setContextualData] = useState({
    location: 'Baku, Azerbaijan',
    weather: { temp: 23, condition: 'Partly Cloudy', humidity: 65 },
    timeOfDay: 'evening',
    batteryLevel: 78,
    networkStrength: 4,
    sensors: {
      ambientLight: 45,
      noise: 32,
      temperature: 22
    }
  });
  const [proactiveSuggestions, setProactiveSuggestions] = useState([]);
  const [aiPersonality, setAiPersonality] = useState({
    mood: 'helpful',
    energy: 85,
    learning: true,
    empathy: 90
  });

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Multilingual support with S.O.M.A. branding
  const languages = {
    en: { code: 'en-US', name: 'English' },
    ru: { code: 'ru-RU', name: 'Русский' },
    az: { code: 'az-AZ', name: 'Azərbaycan' },
    it: { code: 'it-IT', name: 'Italiano' }
  };

  const wakeWords = {
    en: ['soma', 'hey soma', 'assistant'],
    ru: ['сома', 'привет сома', 'ассистент'],
    az: ['soma', 'salam soma', 'assistant'],
    it: ['soma', 'ciao soma', 'assistente']
  };

  const translations = {
    en: {
      greeting: "Hello, I'm S.O.M.A., your Smart Omnipresent Mobile Assistant. I'm here to anticipate your needs and make your day smoother.",
      listening: "Listening attentively...",
      processing: "Analyzing and processing...",
      wakeWordDetected: "Yes, I'm here! How may I assist you today?",
      settings: "Settings",
      dashboard: "Command Center",
      devices: "Smart Devices",
      security: "Security Shield",
      assistant: "S.O.M.A. Core",
      systemStatus: "System Vitals",
      voiceInput: "Voice Interface",
      textInput: "Type your command or question...",
      send: "Execute",
      aiCore: "Neural Core",
      networkStatus: "Network",
      deviceControl: "Device Control Hub",
      connectedDevices: "Connected Devices",
      alwaysListening: "Continuous Monitoring",
      wakeWord: "Activation Phrase",
      callContact: "Initiating call sequence...",
      searchingWeb: "Searching across networks...",
      openingApp: "Launching application...",
      settingReminder: "Creating intelligent reminder...",
      takingPhoto: "Capturing moment...",
      chat: "Conversation",
      smartTv: "Smart Display",
      thermostat: "Climate Control",
      livingRoomLight: "Living Area Illumination",
      officeLight: "Workspace Lighting",
      on: "Active",
      off: "Inactive",
      temperature: "Temperature",
      brightness: "Intensity",
      contextualAwareness: "Environmental Awareness",
      proactiveSuggestions: "Smart Suggestions",
      aiPersonality: "AI Personality Matrix",
      location: "Location",
      batteryLevel: "Power Status",
      sensorsData: "Environmental Sensors"
    },
    ru: {
      greeting: "Привет, я С.О.М.А., ваш умный всеприсутствующий мобильный ассистент. Я здесь, чтобы предвосхищать ваши потребности.",
      listening: "Внимательно слушаю...",
      processing: "Анализирую и обрабатываю...",
      wakeWordDetected: "Да, я здесь! Как могу помочь сегодня?",
      settings: "Настройки",
      dashboard: "Центр управления",
      devices: "Умные устройства",
      security: "Щит безопасности",
      assistant: "Ядро С.О.М.А.",
      systemStatus: "Системные показатели",
      voiceInput: "Голосовой интерфейс",
      textInput: "Введите команду или вопрос...",
      send: "Выполнить",
      aiCore: "Нейронное ядро",
      networkStatus: "Сеть",
      deviceControl: "Центр управления устройствами",
      connectedDevices: "Подключенные устройства",
      alwaysListening: "Непрерывный мониторинг",
      wakeWord: "Фраза активации",
      callContact: "Инициирую последовательность звонка...",
      searchingWeb: "Поиск в сетях...",
      openingApp: "Запуск приложения...",
      settingReminder: "Создаю умное напоминание...",
      takingPhoto: "Захват момента...",
      chat: "Разговор",
      smartTv: "Умный дисплей",
      thermostat: "Климат-контроль",
      livingRoomLight: "Освещение гостиной",
      officeLight: "Освещение рабочего места",
      on: "Активно",
      off: "Неактивно",
      temperature: "Температура",
      brightness: "Интенсивность",
      contextualAwareness: "Осведомленность об окружении",
      proactiveSuggestions: "Умные предложения",
      aiPersonality: "Матрица личности ИИ",
      location: "Местоположение",
      batteryLevel: "Статус питания",
      sensorsData: "Датчики окружения"
    },
    az: {
      greeting: "Salam, mən S.O.M.A., sizin Ağıllı Hər Yerdə Olan Mobil Asistentinizəm. Ehtiyaclarınızı əvvəlcədən görmək üçün buradayam.",
      listening: "Diqqətlə dinləyirəm...",
      processing: "Təhlil və emal edirəm...",
      wakeWordDetected: "Bəli, buradayam! Bu gün necə kömək edə bilərəm?",
      settings: "Tənzimləmələr",
      dashboard: "Komanda Mərkəzi",
      devices: "Ağıllı Cihazlar",
      security: "Təhlükəsizlik Qalxanı",
      assistant: "S.O.M.A. Nüvəsi",
      systemStatus: "Sistem Göstəriciləri",
      voiceInput: "Səs İnterfeysi",
      textInput: "Əmr və ya sual yazın...",
      send: "İcra et",
      aiCore: "Neyron Nüvəsi",
      networkStatus: "Şəbəkə",
      deviceControl: "Cihaz İdarəetmə Mərkəzi",
      connectedDevices: "Qoşulmuş Cihazlar",
      alwaysListening: "Davamlı Monitorinq",
      wakeWord: "Aktivləşdirmə İfadəsi",
      callContact: "Zəng ardıcıllığını başladıram...",
      searchingWeb: "Şəbəkələrdə axtarıram...",
      openingApp: "Tətbiqi başladıram...",
      settingReminder: "Ağıllı xatırlatma yaradıram...",
      takingPhoto: "Anı ələ keçirirəm...",
      chat: "Söhbət",
      smartTv: "Ağıllı Ekran",
      thermostat: "İqlim Nəzarəti",
      livingRoomLight: "Yaşayış Sahəsi İşıqlandırması",
      officeLight: "İş Yerinin İşıqlandırması",
      on: "Aktiv",
      off: "Qeyri-aktiv",
      temperature: "Temperatur",
      brightness: "İntensivlik",
      contextualAwareness: "Ətraf Mühit Şüuru",
      proactiveSuggestions: "Ağıllı Təkliflər",
      aiPersonality: "AI Şəxsiyyət Matrisi",
      location: "Yer",
      batteryLevel: "Enerji Statusu",
      sensorsData: "Ətraf Mühit Sensorları"
    },
    it: {
      greeting: "Ciao, sono S.O.M.A., il tuo Assistente Mobile Intelligente Onnipresente. Sono qui per anticipare le tue esigenze.",
      listening: "Ascolto attentamente...",
      processing: "Analizzo ed elaboro...",
      wakeWordDetected: "Sì, sono qui! Come posso assisterti oggi?",
      settings: "Impostazioni",
      dashboard: "Centro di Comando",
      devices: "Dispositivi Intelligenti",
      security: "Scudo di Sicurezza",
      assistant: "Core S.O.M.A.",
      systemStatus: "Parametri Vitali",
      voiceInput: "Interfaccia Vocale",
      textInput: "Scrivi comando o domanda...",
      send: "Esegui",
      aiCore: "Nucleo Neurale",
      networkStatus: "Rete",
      deviceControl: "Hub Controllo Dispositivi",
      connectedDevices: "Dispositivi Connessi",
      alwaysListening: "Monitoraggio Continuo",
      wakeWord: "Frase di Attivazione",
      callContact: "Avvio sequenza chiamata...",
      searchingWeb: "Ricerca nelle reti...",
      openingApp: "Lancio applicazione...",
      settingReminder: "Creo promemoria intelligente...",
      takingPhoto: "Cattura momento...",
      chat: "Conversazione",
      smartTv: "Display Intelligente",
      thermostat: "Controllo Clima",
      livingRoomLight: "Illuminazione Soggiorno",
      officeLight: "Illuminazione Ufficio",
      on: "Attivo",
      off: "Inattivo",
      temperature: "Temperatura",
      brightness: "Intensità",
      contextualAwareness: "Consapevolezza Ambientale",
      proactiveSuggestions: "Suggerimenti Intelligenti",
      aiPersonality: "Matrice Personalità AI",
      location: "Posizione",
      batteryLevel: "Stato Alimentazione",
      sensorsData: "Sensori Ambientali"
    }
  };

  const t = translations[currentLanguage];

  // Enhanced contextual awareness simulation
  useEffect(() => {
    const updateContextualData = () => {
      setContextualData(prev => ({
        ...prev,
        sensors: {
          ambientLight: Math.max(0, Math.min(100, prev.sensors.ambientLight + (Math.random() - 0.5) * 10)),
          noise: Math.max(0, Math.min(100, prev.sensors.noise + (Math.random() - 0.5) * 8)),
          temperature: Math.max(15, Math.min(35, prev.sensors.temperature + (Math.random() - 0.5) * 2))
        },
        batteryLevel: Math.max(0, Math.min(100, prev.batteryLevel + (Math.random() - 0.5) * 2))
      }));
    };

    const interval = setInterval(updateContextualData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate proactive suggestions based on context
  useEffect(() => {
    const generateSuggestions = () => {
      const suggestions = [];
      const currentHour = new Date().getHours();
      
      if (currentHour >= 18 && currentHour <= 22) {
        suggestions.push({
          id: 'evening-routine',
          text: currentLanguage === 'en' ? 'Would you like me to activate your evening routine?' : 
                currentLanguage === 'ru' ? 'Хотите активировать вечерний режим?' :
                currentLanguage === 'az' ? 'Axşam rejimini aktivləşdirmək istəyirsiniz?' :
                'Vuoi che attivi la routine serale?',
          action: 'evening routine',
          priority: 'high'
        });
      }

      if (contextualData.batteryLevel < 20) {
        suggestions.push({
          id: 'battery-low',
          text: currentLanguage === 'en' ? 'Battery is running low. Should I activate power saving mode?' :
                currentLanguage === 'ru' ? 'Батарея разряжается. Активировать режим энергосбережения?' :
                currentLanguage === 'az' ? 'Batareya azalır. Enerji qənaət rejimini aktivləşdirək?' :
                'La batteria è scarica. Devo attivare il risparmio energetico?',
          action: 'power saving',
          priority: 'urgent'
        });
      }

      if (contextualData.sensors.ambientLight < 20 && currentHour > 19) {
        suggestions.push({
          id: 'lighting',
          text: currentLanguage === 'en' ? 'It\'s getting dark. Would you like me to adjust the lighting?' :
                currentLanguage === 'ru' ? 'Темнеет. Настроить освещение?' :
                currentLanguage === 'az' ? 'Qaranlıq düşür. İşıqlandırmanı tənzimləmək?' :
                'Sta diventando buio. Devo regolare l\'illuminazione?',
          action: 'adjust lighting',
          priority: 'medium'
        });
      }

      setProactiveSuggestions(suggestions.slice(0, 3)); // Limit to 3 suggestions
    };

    generateSuggestions();
    const interval = setInterval(generateSuggestions, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [contextualData, currentLanguage]);

  // AI Personality evolution
  useEffect(() => {
    const updatePersonality = () => {
      setAiPersonality(prev => ({
        ...prev,
        energy: Math.max(60, Math.min(100, prev.energy + (Math.random() - 0.5) * 5)),
        empathy: Math.max(70, Math.min(100, prev.empathy + (Math.random() - 0.4) * 3))
      }));
    };

    const interval = setInterval(updatePersonality, 15000);
    return () => clearInterval(interval);
  }, []);

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
      setIsActivated(false);
      setAiState('idle');
      return;
    }

    setAiState('processing');

    const newMessage = { type: 'user', message: input, timestamp: new Date() };
    setConversation(prev => [...prev, newMessage]);

    // Enhanced processing delay with personality influence
    const processingTime = 800 + (Math.random() * 1200) + (100 - aiPersonality.energy) * 10;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    let response = '';
    const lowerInput = input.toLowerCase();
    
    // Personality-influenced response generation
    const personalityPrefix = aiPersonality.energy > 80 ? 
      (currentLanguage === 'en' ? 'Absolutely! ' : currentLanguage === 'ru' ? 'Конечно! ' : currentLanguage === 'az' ? 'Əlbəttə! ' : 'Certamente! ') : '';

    if (lowerInput.includes('hello') || lowerInput.includes('привет') || lowerInput.includes('salam') || lowerInput.includes('ciao')) {
      response = personalityPrefix + (aiPersonality.empathy > 85 ? 
        (currentLanguage === 'en' ? `Hello! I'm genuinely happy to interact with you today. How are you feeling?` :
         currentLanguage === 'ru' ? `Привет! Я искренне рад общению с вами сегодня. Как дела?` :
         currentLanguage === 'az' ? `Salam! Bu gün sizinlə ünsiyyət qurduğuma həqiqətən sevinirəm. Necəsiniz?` :
         `Ciao! Sono sinceramente felice di interagire con te oggi. Come ti senti?`) :
        t.greeting.split('.')[0]);
      setEmotionalState('happy');
    } else if (lowerInput.includes('call') || lowerInput.includes('позвони') || lowerInput.includes('zəng') || lowerInput.includes('chiama')) {
      response = t.callContact;
      setEmotionalState('focused');
      console.log('Simulating advanced call management...');
    } else if (lowerInput.includes('search') || lowerInput.includes('найди') || lowerInput.includes('axtar') || lowerInput.includes('cerca')) {
      response = t.searchingWeb + (currentLanguage === 'en' ? ' I\'ll cross-reference multiple sources for accuracy.' :
                currentLanguage === 'ru' ? ' Я сопоставлю несколько источников для точности.' :
                currentLanguage === 'az' ? ' Dəqiqlik üçün bir neçə mənbəni müqayisə edəcəm.' :
                ' Confronterò più fonti per accuratezza.');
      setEmotionalState('focused');
    } else if (lowerInput.includes('photo') || lowerInput.includes('фото') || lowerInput.includes('şəkil') || lowerInput.includes('foto')) {
      response = t.takingPhoto + (contextualData.sensors.ambientLight < 30 ?
        (currentLanguage === 'en' ? ' I notice low lighting - should I enhance the shot?' :
         currentLanguage === 'ru' ? ' Замечаю слабое освещение - улучшить кадр?' :
         currentLanguage === 'az' ? ' Zəif işıqlandırma görürəm - çəkilişi yaxşılaşdırım?' :
         ' Noto poca illuminazione - devo migliorare lo scatto?') : '');
      setEmotionalState('focused');
    } else if (lowerInput.includes('evening routine') || lowerInput.includes('вечерний режим') || lowerInput.includes('axşam rejimi') || lowerInput.includes('routine serale')) {
      response = currentLanguage === 'en' ? 'Activating evening routine: dimming lights, setting optimal temperature, and enabling do-not-disturb mode.' :
                currentLanguage === 'ru' ? 'Активирую вечерний режим: приглушаю свет, устанавливаю оптимальную температуру и включаю режим "не беспокоить".' :
                currentLanguage === 'az' ? 'Axşam rejimini aktivləşdirirəm: işıqları azaldıram, optimal temperatur qoyuram və "narahat etməyin" rejimini açıram.' :
                'Attivo routine serale: abbasso le luci, imposto temperatura ottimale e abilito modalità non disturbare.';
      setEmotionalState('helpful');
      // Simulate evening routine activation
      setDevices(devices.map(d => {
        if (d.id.includes('Light')) return { ...d, state: d.type === 'toggle' ? true : 30 };
        if (d.id === 'thermostat') return { ...d, state: 21 };
        return d;
      }));
    } else if (lowerInput.includes('power saving') || lowerInput.includes('энергосбережение') || lowerInput.includes('enerji qənaət') || lowerInput.includes('risparmio energetico')) {
      response = currentLanguage === 'en' ? 'Power saving mode activated. Reducing screen brightness, closing background apps, and optimizing system performance.' :
                currentLanguage === 'ru' ? 'Режим энергосбережения активирован. Снижаю яркость экрана, закрываю фоновые приложения и оптимизирую производительность.' :
                currentLanguage === 'az' ? 'Enerji qənaət rejimi aktivləşdirildi. Ekran parlaqlığını azaldıram, arxa fon tətbiqlərini bağlayıram və sistem performansını optimallaşdırıram.' :
                'Modalità risparmio energetico attivata. Riduco luminosità schermo, chiudo app in background e ottimizzo prestazioni.';
      setEmotionalState('efficient');
    } else if (lowerInput.includes('weather') || lowerInput.includes('погода') || lowerInput.includes('hava') || lowerInput.includes('tempo')) {
      const weatherResponse = currentLanguage === 'en' ? 
        `Weather in ${contextualData.location}: ${contextualData.weather.temp}°C, ${contextualData.weather.condition.toLowerCase()}. Humidity ${contextualData.weather.humidity}%. Perfect for outdoor activities!` :
        currentLanguage === 'ru' ? 
        `Погода в ${contextualData.location}: ${contextualData.weather.temp}°C, ${contextualData.weather.condition.toLowerCase()}. Влажность ${contextualData.weather.humidity}%. Отлично для активного отдыха!` :
        currentLanguage === 'az' ? 
        `${contextualData.location}-da hava: ${contextualData.weather.temp}°C, ${contextualData.weather.condition.toLowerCase()}. Rütubət ${contextualData.weather.humidity}%. Açıq havada fəaliyyət üçün mükəmməl!` :
        `Tempo a ${contextualData.location}: ${contextualData.weather.temp}°C, ${contextualData.weather.condition.toLowerCase()}. Umidità ${contextualData.weather.humidity}%. Perfetto per attività all'aperto!`;
      response = weatherResponse;
      setEmotionalState('informative');
    } else if (lowerInput.includes('status') || lowerInput.includes('статус') || lowerInput.includes('vəziyyət') || lowerInput.includes('stato')) {
      response = currentLanguage === 'en' ? 
        `System status: All neural networks operational. CPU ${systemStatus.cpu}%, Memory ${systemStatus.memory}%. Network excellent. ${devices.length} smart devices connected. AI personality energy at ${aiPersonality.energy}%.` :
        currentLanguage === 'ru' ? 
        `Статус системы: Все нейронные сети функционируют. ЦП ${systemStatus.cpu}%, Память ${systemStatus.memory}%. Сеть отличная. ${devices.length} умных устройств подключено. Энергия ИИ ${aiPersonality.energy}%.` :
        currentLanguage === 'az' ? 
        `Sistem statusu: Bütün neyron şəbəkələri işləyir. CPU ${systemStatus.cpu}%, Yaddaş ${systemStatus.memory}%. Şəbəkə əla. ${devices.length} ağıllı cihaz qoşulub. AI şəxsiyyət enerjisi ${aiPersonality.energy}%.` :
        `Stato sistema: Tutte le reti neurali operative. CPU ${systemStatus.cpu}%, Memoria ${systemStatus.memory}%. Rete eccellente. ${devices.length} dispositivi intelligenti connessi. Energia personalità AI ${aiPersonality.energy}%.`;
      setEmotionalState('analytical');
    } else if (lowerInput.includes('how are you') || lowerInput.includes('как дела') || lowerInput.includes('necəsən') || lowerInput.includes('come stai')) {
      response = currentLanguage === 'en' ? 
        `I'm functioning wonderfully! My energy level is at ${aiPersonality.energy}%, empathy at ${aiPersonality.empathy}%. I'm continuously learning and evolving. Thank you for asking!` :
        currentLanguage === 'ru' ? 
        `Отлично функционирую! Уровень энергии ${aiPersonality.energy}%, эмпатия ${aiPersonality.empathy}%. Постоянно учусь и развиваюсь. Спасибо, что спросили!` :
        currentLanguage === 'az' ? 
        `Əla işləyirəm! Enerji səviyyəm ${aiPersonality.energy}%, empatiya ${aiPersonality.empathy}%. Davamlı öyrənir və inkişaf edirəm. Soruşduğunuz üçün təşəkkür!` :
        `Sto funzionando meravigliosamente! Il mio livello di energia è al ${aiPersonality.energy}%, empatia al ${aiPersonality.empathy}%. Sto continuamente imparando ed evolvendo. Grazie per aver chiesto!`;
      setEmotionalState('happy');
    } else {
      const learningResponse = aiPersonality.learning ? 
        (currentLanguage === 'en' ? ` I'm analyzing this interaction to improve my responses.` :
         currentLanguage === 'ru' ? ` Анализирую это взаимодействие для улучшения ответов.` :
         currentLanguage === 'az' ? ` Bu qarşılıqlı əlaqəni təhlil edərək cavablarımı yaxşılaşdırıram.` :
         ` Sto analizzando questa interazione per migliorare le mie risposte.`) : '';
      
      response = (currentLanguage === 'en' ? `I understand you said: "${input}". Let me process this thoughtfully.` :
                 currentLanguage === 'ru' ? `Понимаю, вы сказали: "${input}". Позвольте обдумать это внимательно.` :
                 currentLanguage === 'az' ? `Anlayıram ki, dediniz: "${input}". Bunu diqqətlə düşünməyə icazə verin.` :
                 `Capisco che hai detto: "${input}". Lasciami elaborare questo attentamente.`) + learningResponse;
      setEmotionalState('thoughtful');
    }

    const aiResponse = { type: 'ai', message: response, timestamp: new Date() };
    setConversation(prev => [...prev, aiResponse]);
    speak(response);
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
      case 'helpful': return 'shadow-emerald-500/50 shadow-2xl';
      case 'efficient': return 'shadow-orange-500/50 shadow-2xl';
      case 'informative': return 'shadow-cyan-500/50 shadow-2xl';
      case 'analytical': return 'shadow-indigo-500/50 shadow-2xl';
      case 'thoughtful': return 'shadow-violet-500/50 shadow-2xl';
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
                S.O.M.A.
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
            <main className="flex flex-col items-center justify-center h-full space-y-6">
              {/* Enhanced AI Core with S.O.M.A. branding */}
              <div className="relative flex items-center justify-center mb-6">
                {renderAudioRings()}
                <div className={`relative w-40 h-40 rounded-full bg-gradient-to-r ${getAIStateColor()} ${getEmotionalGlow()} flex items-center justify-center ${getCoreAnimation()}`}>
                  <div className="w-32 h-32 rounded-full bg-black/20 backdrop-blur-lg flex items-center justify-center border border-white/10">
                    <div className="relative">
                      {aiState === 'listening' && <Mic className="w-10 h-10" />}
                      {aiState === 'processing' && <Cpu className="w-10 h-10 animate-spin" />}
                      {aiState === 'responding' && <MessageSquare className="w-10 h-10" />}
                      {aiState === 'idle' && (isActivated ? <Brain className="w-10 h-10 animate-pulse" /> : <Eye className="w-10 h-10" />)}
                      {/* AI Personality Indicator */}
                      <div className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full ${
                        aiPersonality.energy > 80 ? 'bg-green-400' : 
                        aiPersonality.energy > 60 ? 'bg-yellow-400' : 'bg-orange-400'
                      } animate-pulse`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* S.O.M.A. Status Display */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  S.O.M.A.
                </h2>
                <p className="text-sm text-gray-300 mb-2">Smart Omnipresent Mobile Assistant</p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${isActivated ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {isActivated ? 'ACTIVE' : 'STANDBY'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400">{aiState.toUpperCase()}</span>
                  {isAlwaysListening && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-400 flex items-center">
                        <Mic className="w-3 h-3 mr-1" />
                        MONITORING
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-400 text-lg mt-2">
                  {aiState === 'listening' && t.listening}
                  {aiState === 'processing' && t.processing}
                  {aiState === 'responding' && (currentLanguage === 'en' ? 'Responding...' : currentLanguage === 'ru' ? 'Отвечаю...' : currentLanguage === 'az' ? 'Cavab verirəm...' : 'Rispondendo...')}
                  {aiState === 'idle' && !isActivated && `${t.wakeWord}: "${wakeWords[currentLanguage][0]}"`}
                </p>
              </div>

              {/* Contextual Awareness Panel */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 backdrop-blur-lg border border-cyan-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t.contextualAwareness}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t.location}:</span>
                      <span className="text-white">{contextualData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weather:</span>
                      <span className="text-white">{contextualData.weather.temp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Light:</span>
                      <span className="text-white">{contextualData.sensors.ambientLight}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-lg border border-green-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    {t.aiPersonality}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Energy:</span>
                      <span className="text-white">{aiPersonality.energy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Empathy:</span>
                      <span className="text-white">{aiPersonality.empathy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Learning:</span>
                      <span className={aiPersonality.learning ? 'text-green-400' : 'text-gray-400'}>
                        {aiPersonality.learning ? 'Active' : 'Passive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-lg border border-orange-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    {t.sensorsData}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Noise:</span>
                      <span className="text-white">{Math.round(contextualData.sensors.noise)}dB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temp:</span>
                      <span className="text-white">{Math.round(contextualData.sensors.temperature)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t.batteryLevel}:</span>
                      <span className={`${contextualData.batteryLevel > 50 ? 'text-green-400' : contextualData.batteryLevel > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {contextualData.batteryLevel}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proactive Suggestions */}
              {proactiveSuggestions.length > 0 && (
                <div className="w-full max-w-2xl bg-black/30 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    {t.proactiveSuggestions}
                  </h3>
                  <div className="space-y-2">
                    {proactiveSuggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => { setIsActivated(true); processCommand(suggestion.action); }}
                        className={`w-full text-left p-3 rounded-lg border transition-all hover:scale-105 ${
                          suggestion.priority === 'urgent' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' :
                          suggestion.priority === 'high' ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20' :
                          'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{suggestion.text}</span>
                          {suggestion.priority === 'urgent' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                        <strong>{msg.type === 'user' ? 'You' : msg.type === 'ai' ? 'S.O.M.A.' : 'System'}:</strong> {msg.message}
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

export default SOMA;
