document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('newQuoteText');
    const quoteCategory = document.getElementById('newQuoteCategory');
    const addBtn = document.getElementById('addQuote');
    const quoteDisplay = document.getElementById('quoteDisplay');


    let quoteArray = [];
    let quoteObject = {};

   const addQuote = function(){

    if(quoteText.value === '' || quoteCategory.value === '' ){
        alert("Enter quote and quote category!");
    }else {
       showRandomQuote();
        
    }
    
   };

   const showRandomQuote = function(){
    const quoteTextValue = quoteText.value.trim();
    const quoteCategoryValue = quoteCategory.value.trim();

    quoteObject[quoteTextValue] = quoteCategoryValue;
    console.log(quoteObject);

    const quoteList = document.createElement('li');
    quoteList.classList.add('quotes');

    const categoryList = document.createElement('h4');
    categoryList.classList.add('quote-category');

    quoteList.textContent = quoteTextValue;
    categoryList.textContent = quoteCategoryValue;

    quoteList.appendChild(categoryList);
    quoteDisplay.appendChild(quoteList);

    quoteText.value = '';
    quoteCategory.value = '';
   };

   addBtn.addEventListener('click',addQuote);

});