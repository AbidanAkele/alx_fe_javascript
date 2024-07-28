document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "The purpose of our lives is to be happy.", category: "Philosophical" },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const categoryFilter = document.getElementById("categoryFilter");
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';

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
      postQuoteToServer(newQuote);
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

 function populateCategories() {
   const categories = [...new Set(quotes.map(quote => quote.category))];
   categoryFilter.innerHTML = '<option value="all">All Categories</option>';
   categories.forEach(category => {
     const option = document.createElement('option');
     option.value = category;
     option.textContent = category;
     categoryFilter.appendChild(option);
   });
   categoryFilter.value = lastSelectedCategory;  
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
    const quoteList = document.getElementById("quoteList");
    quoteList.innerHTML = '';
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('p');
      quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
      quoteList.appendChild(quoteElement);
    });
    localStorage.setItem('lastSelectedCategory', selectedCategory);
 }

 function mergeQuotes(localQuotes, importedQuotes) {
   const combinedQuotes = [...localQuotes];
   importedQuotes.forEach(importedQuote => {
     if (!localQuotes.some(localQuote => localQuote.text === importedQuote.text)) {
       combinedQuotes.push(importedQuote);
     }
   });
   return combinedQuotes;
 }

 async function fetchQuotesFromServer() {
   try {
     const response = await fetch(apiEndpoint);
     const data = await response.json();
     const serverQuotes = data.map(item => ({ text: item.title, category: "Server" }));
     quotes = mergeQuotes(quotes, serverQuotes);
     saveQuotes();
     notification.textContent = "Quotes have been updated from the server.";
   } catch (error) {
     console.error('Error fetching quotes:', error);
     notification.textContent = "Failed to update quotes from the server.";
   }
 }

 async function postQuoteToServer(quote) {
   try {
     const response = await fetch(apiEndpoint, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(quote)
     });
     if (response.ok) {
       console.log('Quotes synced with server!', quote);
     } else {
       console.error('Failed to post quote: ', response.statusText);
     }
   } catch (error) {
     console.error('Error posting quote: ', error);
   }
 }

 async function syncQuotes() {
   await fetchQuotesFromServer();
   for (let quote of quotes) {
     await postQuoteToServer(quote);
   }
 }

 setInterval(fetchQuotesFromServer, 60000);

 showRandomQuote();
 populateCategories();
 filterQuotes();
});
