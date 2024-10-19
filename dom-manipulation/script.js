document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('newQuoteText');
    const quoteCategory = document.getElementById('newQuoteCategory');
    const addBtn = document.getElementById('addQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const displayRandomQuote = document.getElementById('newQuote');

    let quotesArray = [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspirational" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];

    const showRandomQuote = function(){
        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        const randomQuote = quotesArray[randomIndex];

        quoteDisplay.innerHTML = `<p>${randomQuote.text} - Category: ${randomQuote.category}</p>`
    };

   const createAddQuoteForm = function(){

    if(quoteText.value === '' || quoteCategory.value === '' ){
        alert("Enter quote and quote category!");
    }else {
       displayQuote();
        
    }
    
   };

   const displayQuote = function(){
    const quoteTextValue = quoteText.value.trim();
    const quoteCategoryValue = quoteCategory.value.trim();

    const newQuote = {text: quoteTextValue, category: quoteCategoryValue};
    quotesArray.push(newQuote);

    console.log(quotesArray);
    quoteText.value = '';
    quoteCategory.value = '';
   };

   addBtn.addEventListener('click',createAddQuoteForm);
   displayRandomQuote.addEventListener('click', showRandomQuote);

});