document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "The purpose of our lives is to be happy.", category: "Philosophical" },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }

  newQuoteButton.addEventListener("click", showRandomQuote);

  window.addQuote = function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });

      const newQuoteElement = document.createElement('p');
      newQuoteElement.textContent = `"${newQuoteText}" - ${newQuoteCategory}`;

      const quoteList = document.getElementById("quoteList");
      quoteList.appendChild(newQuoteElement);

      document.getElementById("newQuoteText").value = '';
      document.getElementById("newQuoteCategory").value = '';

      alert("New quote added!");
    } else {
      alert("Please fill in both fields.");
    }
  };

  showRandomQuote();
});
