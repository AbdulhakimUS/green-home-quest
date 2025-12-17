import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ru" | "en" | "uz";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Login Screen
    "app.title": "Эко Дом",
    "app.subtitle": "Создайте самый экологичный дом!",
    "login.join": "Присоединиться к игре",
    "login.joinDesc": "Введите 6-значный код игры и никнейм",
    "login.code": "Код игры (6 цифр)",
    "login.nickname": "Ваш никнейм",
    "login.start": "Начать игру",
    "login.loading": "Загрузка...",
    "login.createAdmin": "Создать игру (админ)",
    "login.adminTitle": "Вход администратора",
    "login.adminDesc": "Войдите для управления игрой",
    "login.login": "Логин",
    "login.password": "Пароль",
    "login.enter": "Войти",
    "login.back": "Назад",
    "login.gameControl": "Управление игрой",
    "login.selectAction": "Выберите действие",
    "login.createRoom": "Создать новую комнату",
    "login.joinExisting": "Присоединиться к существующей",
    "login.createRoomDesc": "Создать новую игровую комнату",
    "login.initialBalance": "Начальный баланс игроков ($)",
    "login.creating": "Создание...",
    "login.roomCode": "Код комнаты (6 цифр)",
    "login.joining": "Загрузка...",
    "login.joinRoom": "Присоединиться",
    
    // Errors
    "error.title": "Ошибка",
    "error.fillFields": "Заполните все поля",
    "error.codeFormat": "Код должен состоять из 6 цифр",
    "error.gameNotFound": "Игра с таким кодом не найдена",
    "error.gameStarted": "Игра уже началась. Присоединиться нельзя.",
    "error.nicknameTaken": "Этот никнейм уже занят",
    "error.createPlayer": "Не удалось создать игрока",
    "error.wrongCredentials": "Неверный логин или пароль",
    "error.createGame": "Не удалось создать игру",
    "error.invalidBalance": "Введите корректный начальный баланс",
    "error.invalidCode": "Введите корректный 6-значный код",
    
    // Success
    "success.title": "Успешно!",
    "success.welcome": "Добро пожаловать",
    "success.welcomeAdmin": "Добро пожаловать, администратор",
    "success.gameCreated": "Игра создана!",
    "success.gameCode": "Код игры",
    "success.joinedGame": "Присоединились к игре",
    
    // Navigation
    "nav.home": "Дом",
    "nav.shop": "Магазин",
    "nav.cards": "Карты",
    "nav.market": "Рынок",
    "nav.missions": "Миссии",
    "nav.history": "История",
    "nav.level": "Ур.",
    "nav.maxLevel": "Макс",
    "nav.exitRoom": "Выйти из комнаты",
    
    // Exit Dialog
    "exit.title": "Выйти из комнаты?",
    "exit.message": "Вы точно хотите выйти из игры? Ваш прогресс будет потерян.",
    "exit.cancel": "Отмена",
    "exit.confirm": "Выйти",
    
    // Rules Dialog
    "rules.title": "Правила игры «Эко Дом»",
    "rules.objective": "Цель игры",
    "rules.objectiveDesc": "Создайте максимально экологичный дом, достигнув 25 уровня.",
    "rules.winner": "Победитель:",
    "rules.winnerDesc": "Выигрывает тот, кто достиг максимального уровня дома и сохранил больше всего денег!",
    "rules.howToPlay": "Как играть",
    "rules.step1": "Выберите карту — Энергия, Вода или Зелень",
    "rules.step2": "Покупайте предметы в магазине для выбранной категории",
    "rules.step3": "Повышайте уровень дома — каждая покупка увеличивает уровень",
    "rules.step4": "Выполняйте миссии для получения бонусных денег",
    "rules.shop": "Магазин",
    "rules.shopItems": "30 предметов в каждой категории (Энергия, Вода, Зелень)",
    "rules.shopExpensive": "Дорогие предметы дают больше уровня и более экологичны",
    "rules.shopUpgrade": "Можно улучшать предметы, покупая их повторно",
    "rules.shopPrice": "Цена растёт с каждым уровнем предмета",
    "rules.market": "Рынок игроков",
    "rules.marketSell": "Продавайте свои предметы другим игрокам",
    "rules.marketPrice": "Максимальная цена — 75% от базовой стоимости",
    "rules.marketFee": "Комиссия рынка — 7%",
    "rules.marketLimit": "Максимум 5 лотов на категорию",
    "rules.bonuses": "Бонусы и награды",
    "rules.missions": "Миссии — выполняйте задания за деньги",
    "rules.treasures": "Клады — 4 скрытых сокровища (+$5,000 каждый)",
    "rules.allTreasures": "Бонус за все клады — +$20,000",
    "rules.itemRewards": "Награды за предметы — бонусы за 50, 75, 100 предметов",
    "rules.tips": "Советы",
    "rules.tip1": "💡 Выбирайте более экологичные предметы — они эффективнее",
    "rules.tip2": "💡 Следите за балансом — не тратьте всё сразу",
    "rules.tip3": "💡 Выполняйте миссии для дополнительного дохода",
    "rules.tip4": "💡 Используйте рынок для выгодных сделок",
    "rules.goodLuck": "Удачи в создании экологичного дома! 🌿🏠",
    
    // Footer
    "footer.developer": "Разработчик",
  },
  en: {
    // Login Screen
    "app.title": "Eco Home",
    "app.subtitle": "Create the most eco-friendly home!",
    "login.join": "Join Game",
    "login.joinDesc": "Enter 6-digit game code and nickname",
    "login.code": "Game code (6 digits)",
    "login.nickname": "Your nickname",
    "login.start": "Start Game",
    "login.loading": "Loading...",
    "login.createAdmin": "Create game (admin)",
    "login.adminTitle": "Admin Login",
    "login.adminDesc": "Login to manage the game",
    "login.login": "Login",
    "login.password": "Password",
    "login.enter": "Enter",
    "login.back": "Back",
    "login.gameControl": "Game Control",
    "login.selectAction": "Select action",
    "login.createRoom": "Create new room",
    "login.joinExisting": "Join existing room",
    "login.createRoomDesc": "Create a new game room",
    "login.initialBalance": "Players' starting balance ($)",
    "login.creating": "Creating...",
    "login.roomCode": "Room code (6 digits)",
    "login.joining": "Loading...",
    "login.joinRoom": "Join",
    
    // Errors
    "error.title": "Error",
    "error.fillFields": "Fill in all fields",
    "error.codeFormat": "Code must be 6 digits",
    "error.gameNotFound": "Game with this code not found",
    "error.gameStarted": "Game already started. Cannot join.",
    "error.nicknameTaken": "This nickname is taken",
    "error.createPlayer": "Failed to create player",
    "error.wrongCredentials": "Wrong login or password",
    "error.createGame": "Failed to create game",
    "error.invalidBalance": "Enter valid starting balance",
    "error.invalidCode": "Enter valid 6-digit code",
    
    // Success
    "success.title": "Success!",
    "success.welcome": "Welcome",
    "success.welcomeAdmin": "Welcome, administrator",
    "success.gameCreated": "Game created!",
    "success.gameCode": "Game code",
    "success.joinedGame": "Joined game",
    
    // Navigation
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.cards": "Cards",
    "nav.market": "Market",
    "nav.missions": "Missions",
    "nav.history": "History",
    "nav.level": "Lv.",
    "nav.maxLevel": "Max",
    "nav.exitRoom": "Exit room",
    
    // Exit Dialog
    "exit.title": "Exit room?",
    "exit.message": "Are you sure you want to exit? Your progress will be lost.",
    "exit.cancel": "Cancel",
    "exit.confirm": "Exit",
    
    // Rules Dialog
    "rules.title": "Game Rules «Eco Home»",
    "rules.objective": "Objective",
    "rules.objectiveDesc": "Create the most eco-friendly home by reaching level 25.",
    "rules.winner": "Winner:",
    "rules.winnerDesc": "The winner is the one who reached the maximum house level and saved the most money!",
    "rules.howToPlay": "How to Play",
    "rules.step1": "Choose a card — Energy, Water, or Greenery",
    "rules.step2": "Buy items in the shop for your category",
    "rules.step3": "Level up your house — each purchase increases the level",
    "rules.step4": "Complete missions to earn bonus money",
    "rules.shop": "Shop",
    "rules.shopItems": "30 items in each category (Energy, Water, Greenery)",
    "rules.shopExpensive": "Expensive items give more level and are more eco-friendly",
    "rules.shopUpgrade": "You can upgrade items by buying them again",
    "rules.shopPrice": "Price increases with each item level",
    "rules.market": "Player Market",
    "rules.marketSell": "Sell your items to other players",
    "rules.marketPrice": "Maximum price — 75% of base cost",
    "rules.marketFee": "Market fee — 7%",
    "rules.marketLimit": "Maximum 5 listings per category",
    "rules.bonuses": "Bonuses and Rewards",
    "rules.missions": "Missions — complete tasks for money",
    "rules.treasures": "Treasures — 4 hidden treasures (+$5,000 each)",
    "rules.allTreasures": "All treasures bonus — +$20,000",
    "rules.itemRewards": "Item rewards — bonuses for 50, 75, 100 items",
    "rules.tips": "Tips",
    "rules.tip1": "💡 Choose more eco-friendly items — they're more effective",
    "rules.tip2": "💡 Watch your balance — don't spend everything at once",
    "rules.tip3": "💡 Complete missions for extra income",
    "rules.tip4": "💡 Use the market for profitable deals",
    "rules.goodLuck": "Good luck building your eco home! 🌿🏠",
    
    // Footer
    "footer.developer": "Developer",
  },
  uz: {
    // Login Screen
    "app.title": "Eko Uy",
    "app.subtitle": "Eng ekologik uyni yarating!",
    "login.join": "O'yinga qo'shilish",
    "login.joinDesc": "6 raqamli o'yin kodi va taxallusni kiriting",
    "login.code": "O'yin kodi (6 raqam)",
    "login.nickname": "Taxallusingiz",
    "login.start": "O'yinni boshlash",
    "login.loading": "Yuklanmoqda...",
    "login.createAdmin": "O'yin yaratish (admin)",
    "login.adminTitle": "Admin kirishi",
    "login.adminDesc": "O'yinni boshqarish uchun kiring",
    "login.login": "Login",
    "login.password": "Parol",
    "login.enter": "Kirish",
    "login.back": "Orqaga",
    "login.gameControl": "O'yinni boshqarish",
    "login.selectAction": "Amalni tanlang",
    "login.createRoom": "Yangi xona yaratish",
    "login.joinExisting": "Mavjud xonaga qo'shilish",
    "login.createRoomDesc": "Yangi o'yin xonasini yaratish",
    "login.initialBalance": "O'yinchilarning boshlang'ich balansi ($)",
    "login.creating": "Yaratilmoqda...",
    "login.roomCode": "Xona kodi (6 raqam)",
    "login.joining": "Yuklanmoqda...",
    "login.joinRoom": "Qo'shilish",
    
    // Errors
    "error.title": "Xato",
    "error.fillFields": "Barcha maydonlarni to'ldiring",
    "error.codeFormat": "Kod 6 raqamdan iborat bo'lishi kerak",
    "error.gameNotFound": "Bu kodli o'yin topilmadi",
    "error.gameStarted": "O'yin allaqachon boshlangan. Qo'shilish mumkin emas.",
    "error.nicknameTaken": "Bu taxallus band",
    "error.createPlayer": "O'yinchini yaratib bo'lmadi",
    "error.wrongCredentials": "Noto'g'ri login yoki parol",
    "error.createGame": "O'yinni yaratib bo'lmadi",
    "error.invalidBalance": "To'g'ri boshlang'ich balansni kiriting",
    "error.invalidCode": "To'g'ri 6 raqamli kodni kiriting",
    
    // Success
    "success.title": "Muvaffaqiyatli!",
    "success.welcome": "Xush kelibsiz",
    "success.welcomeAdmin": "Xush kelibsiz, administrator",
    "success.gameCreated": "O'yin yaratildi!",
    "success.gameCode": "O'yin kodi",
    "success.joinedGame": "O'yinga qo'shildingiz",
    
    // Navigation
    "nav.home": "Uy",
    "nav.shop": "Do'kon",
    "nav.cards": "Kartalar",
    "nav.market": "Bozor",
    "nav.missions": "Vazifalar",
    "nav.history": "Tarix",
    "nav.level": "Dar.",
    "nav.maxLevel": "Maks",
    "nav.exitRoom": "Xonadan chiqish",
    
    // Exit Dialog
    "exit.title": "Xonadan chiqasizmi?",
    "exit.message": "Haqiqatan ham o'yindan chiqmoqchimisiz? Jarayoningiz yo'qoladi.",
    "exit.cancel": "Bekor qilish",
    "exit.confirm": "Chiqish",
    
    // Rules Dialog
    "rules.title": "«Eko Uy» o'yin qoidalari",
    "rules.objective": "Maqsad",
    "rules.objectiveDesc": "25-darajaga yetib, eng ekologik uyni yarating.",
    "rules.winner": "G'olib:",
    "rules.winnerDesc": "Eng yuqori uy darajasiga yetgan va eng ko'p pul saqlab qolgan g'olib bo'ladi!",
    "rules.howToPlay": "Qanday o'ynash kerak",
    "rules.step1": "Kartani tanlang — Energiya, Suv yoki Ko'katlar",
    "rules.step2": "Tanlangan kategoriya uchun do'kondan narsalar sotib oling",
    "rules.step3": "Uy darajasini oshiring — har bir xarid darajani oshiradi",
    "rules.step4": "Bonus pul olish uchun vazifalarni bajaring",
    "rules.shop": "Do'kon",
    "rules.shopItems": "Har bir kategoriyada 30 ta narsa (Energiya, Suv, Ko'katlar)",
    "rules.shopExpensive": "Qimmat narsalar ko'proq daraja beradi va ekologikroq",
    "rules.shopUpgrade": "Narsalarni qayta sotib olib yaxshilash mumkin",
    "rules.shopPrice": "Narx har bir daraja bilan oshadi",
    "rules.market": "O'yinchilar bozori",
    "rules.marketSell": "Narsalaringizni boshqa o'yinchilarga soting",
    "rules.marketPrice": "Maksimal narx — asosiy qiymatning 75%",
    "rules.marketFee": "Bozor komissiyasi — 7%",
    "rules.marketLimit": "Har bir kategoriyada maksimum 5 ta e'lon",
    "rules.bonuses": "Bonuslar va mukofotlar",
    "rules.missions": "Vazifalar — pul uchun vazifalarni bajaring",
    "rules.treasures": "Xazinalar — 4 ta yashirin xazina (har biri +$5,000)",
    "rules.allTreasures": "Barcha xazinalar bonusi — +$20,000",
    "rules.itemRewards": "Narsalar uchun mukofotlar — 50, 75, 100 narsa uchun bonuslar",
    "rules.tips": "Maslahatlar",
    "rules.tip1": "💡 Ekologikroq narsalarni tanlang — ular samaraliroq",
    "rules.tip2": "💡 Balansga e'tibor bering — hammasini birdan sarflamang",
    "rules.tip3": "💡 Qo'shimcha daromad uchun vazifalarni bajaring",
    "rules.tip4": "💡 Foydali bitimlar uchun bozordan foydalaning",
    "rules.goodLuck": "Ekologik uy qurishda omad! 🌿🏠",
    
    // Footer
    "footer.developer": "Dasturchi",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("eco_home_language");
    return (saved as Language) || "ru";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("eco_home_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
