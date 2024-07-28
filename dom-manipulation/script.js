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
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  }

  newQuoteButton.addEventListener("click", showRandomQuote);

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

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

document.getElementById('exportQuotes').addEventListener('click', () => {
  const data = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importFile').addEventListener('change', importFromJsonFile);
    
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    const existingQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes = [...existingQuotes, ...importedQuotes];
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
 }

 showRandomQuote();
});
