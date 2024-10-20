document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('newQuoteText');
    const quoteCategory = document.getElementById('newQuoteCategory');
    const addBtn = document.getElementById('addQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const displayRandomQuote = document.getElementById('newQuote');
    const exportButton = document.getElementById('exportButton');
    const importFiles = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const syncStatus = document.getElementById('syncStatus');
    // Array of quote objects with text and category
    let quotesArray = JSON.parse(localStorage.getItem('Quotes')) || [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspirational" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];

    const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

    const fetchQuotesFromServer = async () => {
        try{
            const response = await fetch(serverUrl);
            const data = await response.json();
            const serverQuotes = data.map(item => ({text: item.body, category: "General" }));
            syncQuotes(serverQuotes);
        }catch(error) {
            console.error("Error fetching data from server:",error);
        }
    };

    const postQuoteToServer = async (quote) => {
        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Define the content type as JSON
                },
                body: JSON.stringify({
                    title: quote.text, // Sending as "title" (server expects a "title")
                    body: quote.text,  // Using the quote as the body text for simplicity
                    userId: 1          // Some mock API requires a userId, so we're adding it
                })
            });

            if (response.ok) {
                const newQuote = await response.json();

                syncStatus.textContent = "Quotes synced with server!";
                
                setTimeout(() => {
                    syncStatus.textContent = '';
                }, 3000);

                console.log("Quote successfully posted:", newQuote);
            } else {
                console.error('Error posting quote:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const syncQuotes = (serverQuotes) => {
        let localQuotes = JSON.parse(localStorage.getItem('Quotes')) || [];
        let conflict = false;

        const mergedQuotes = serverQuotes.map(serverQuote => {
            const localQuote = localQuotes.find(localQuote => {
                return localQuote.text === serverQuote.text;
            });
            if(localQuote){
                conflict = true;
                const userChoice = confirm(`Conflict detected for quote: "${serverQuote.text}". OK to keep server version, Cancel to keep local.`);
                return userChoice ? serverQuote : localQuote;
            }

            return serverQuote;
        });

        const uniqueLocalQuotes = localQuotes.filter(localQuote => !serverQuotes.some(serverQuote => serverQuote.text === localQuote.text ));
        mergedQuotes.push(...uniqueLocalQuotes);

        localStorage.setItem('Quotes', JSON.stringify(mergedQuotes));
        displayAllQuotes();

        if(conflict){
            alert("Conflicts were resolved based on your inputs.")
        }
    };

    window.onload = function(){
        displayAllQuotes();
        populateCategories();

        const savedCategory = localStorage.getItem('SelectedCategory');
        categoryFilter.value = savedCategory;
        filterQuotes();
    };

    // Function to display a random quote
    const showRandomQuote = function(){
        // Get a random index from the quotes array
        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        const randomQuote = quotesArray[randomIndex];

        // Display the quote text in the DOM
        quoteDisplay.innerHTML = `<p>${randomQuote.text} - Category: ${randomQuote.category}</p>`
    };


    // Function to handle adding a new quote
   const createAddQuoteForm = function(){

    // Check if inputs are not empty
    if(quoteText.value === '' || quoteCategory.value === '' ){
        alert("Enter quote and quote category!");
    }else {
        
       displayQuote();
        displayAllQuotes();
        populateCategories();
        postQuoteToServer()
    }
    
   };

   const displayQuote = function(){
    const quoteTextValue = quoteText.value.trim();
    const quoteCategoryValue = quoteCategory.value.trim();
    const quoteDisplay = document.getElementById('quoteDisplay');

    const quoteList = document.createElement('p');
    quoteList.classList.add('quotes');

    // Create a new quote object
    const newQuote = {text: quoteTextValue, category: quoteCategoryValue};
    
    // Add the new quote to the quotes array
    quotesArray.push(newQuote);

    //Add the quote to the page .
    quoteList.innerHTML = `<p>${quoteTextValue} - ${quoteCategoryValue}</p>`
    quoteDisplay.appendChild(quoteList);

    localStorage.setItem('Quotes', JSON.stringify(quotesArray));

    console.log(quotesArray);
    // Clear the input fields
    quoteText.value = '';
    quoteCategory.value = '';
   };

   const displayAllQuotes = function(){
    const listedQuotes = document.getElementById('quotes-container');
    listedQuotes.innerHTML ='';

    quotesArray.forEach(quote => {
        const li = document.createElement('li');
        li.textContent = `${quote.text} - Category: ${quote.category}`;
        listedQuotes.appendChild(li);
    });

   };

   const exportQuotesToJson = function(){
    const dataStr = JSON.stringify(quotesArray, null, 2);
    const blob = new Blob([dataStr], {type : "application/json"});
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = "quotesArray.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
   }

   const importFromJsonFile = function(event){
    const fileReader = new FileReader();
    fileReader.onload = function(event){
        const importedQuotes = JSON.parse(event.target.result);
        quotesArray.push(...importedQuotes);
        
        localStorage.setItem('Quotes', JSON.stringify(quotesArray));

        displayAllQuotes();
        alert('Quotes imported successfully!');
    }

    fileReader.readAsText(event.target.files[0]);
   };

   const populateCategories = function(){
        const uniqueCategories = [...new Set(quotesArray.map(quote => {
            return quote.category;
        }))];

        categoryFilter.innerHTML = '<option value="all">All Categories</option>';

        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
   };

   const filterQuotes = function(){
        const selectedCategory = categoryFilter.value;
        const listedQuotes = document.getElementById('quotes-container');
        listedQuotes.innerHTML = '';

        let filteredQuotes;
        if(selectedCategory === 'all'){
            filteredQuotes = quotesArray;
        }else {
            filteredQuotes = quotesArray.filter(quote => {
                return quote.category === selectedCategory
            });
        }

        filteredQuotes.forEach(quote => {
            const li = document.createElement('li');
            li.textContent = `${quote.text} - Category: ${quote.category}`;
            listedQuotes.appendChild(li);
        });

        localStorage.setItem('SelectedCategory', selectedCategory);

   }

   addBtn.addEventListener('click',createAddQuoteForm);
   displayRandomQuote.addEventListener('click', showRandomQuote);
   quoteCategory.addEventListener('keypress', (event) => {
    if(event.key === 'Enter'){
        createAddQuoteForm();
    }
   });
   exportButton.addEventListener('click', exportQuotesToJson);
   importFiles.addEventListener('change', importFromJsonFile);
   categoryFilter.addEventListener('change', filterQuotes);

   fetchQuotesFromServer();
   setInterval(fetchQuotesFromServer, 30000);

});