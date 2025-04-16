  const quotes = [
    "How far would you go to fulfill your dream?",
    "How much does it mean to you?",
    "How far would you go for what you desire?"
  ];

  export function handleQuotesTyping(selector = '#text') {    
    new Typed(selector, {
        strings: [...quotes, "Good luck!"],
        typeSpeed: 75,
        startDelay: 1500,
        backSpeed: 75,
        smartBackspace: true,
        shuffle: false,
        backDelay: 1500,
      });
  }