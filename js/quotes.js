  const quotes = [
    "How far would you go to fulfill your dream?",
    "How much does it mean to you?",
    "How far would you go for what you desire?"
  ];

  export function handleQuotesTyping(selector = '#text') {
    const allQuotes =  [...quotes, "Good luck!"];

    new Typed(selector, {
        strings: allQuotes,
        typeSpeed: 75,
        startDelay: 1500,
        backSpeed: 75,
        smartBackspace: true,
        shuffle: false,
        backDelay: 1500,
        preStringTyped: (arrayPos, self) => {
          const nextQuote = allQuotes[arrayPos];
          console.log('Next quote:', nextQuote);
        }
      });
  }