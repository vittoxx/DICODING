document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  let books = [];

  const storedBooks = localStorage.getItem('books');
  if (storedBooks) {
      books = JSON.parse(storedBooks);
  }

  function saveBooksToLocalStorage() {
      localStorage.setItem('books', JSON.stringify(books));
  }

  inputBook.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputBookTitle = document.getElementById('inputBookTitle').value;
      const inputBookAuthor = document.getElementById('inputBookAuthor').value;
      const inputBookDate = new Date(document.getElementById('inputBookYear').value);
      const inputBookYear = inputBookDate.getFullYear(); 
      const inputBookMonth = inputBookDate.getMonth(); 
      const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

      const isDuplicate = books.some(book => book.title === inputBookTitle);
      if (isDuplicate) {
          alert('Buku dengan judul yang sama sudah ada dalam daftar.');
      } else {
          const book = {
              id: new Date().getTime(),
              title: inputBookTitle,
              author: inputBookAuthor,
              year: inputBookYear,
              month: inputBookMonth, 
              isComplete: inputBookIsComplete,
          };
          books.push(book);
          saveBooksToLocalStorage();
          updateBookshelf();
          inputBook.reset(); 
      }
  });

  function updateBookshelf() {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
      for (const book of books) {
          const bookItem = createBookItem(book);
          if (book.isComplete) {
              completeBookshelfList.appendChild(bookItem);
          } else {
              incompleteBookshelfList.appendChild(bookItem);
          }
      }
  }

  function removeBook(id) {
      books = books.filter(book => book.id !== id);
      saveBooksToLocalStorage();
      updateBookshelf();
  }

  function toggleIsComplete(id) {
      const index = books.findIndex(book => book.id === id);
      if (index !== -1) {
          books[index].isComplete = !books[index].isComplete;
          saveBooksToLocalStorage();
          updateBookshelf();
      }
  }

  
  function getMonthName(month) {
      const monthNames = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return monthNames[month];
  }

  function createBookItem(book) {
      const bookItem = document.createElement('article');
      bookItem.classList.add('book_item');

      const title = document.createElement('h3');
      title.textContent = book.title;
      title.style.color = 'black';

      const author = document.createElement('p');
      author.textContent = 'Penulis : ' + book.author;

      const year = document.createElement('p');
      year.textContent = 'Tahun : ' + book.year;

      const month = document.createElement('p');
      month.textContent = 'Bulan : ' + getMonthName(book.month); 

      const removeButton = createActionButton('Hapus buku', 'red', () => {
          removeBook(book.id);
      });

      const toggleButton = createActionButton(
          book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca',
          'green',
          () => {
              toggleIsComplete(book.id);
          }
      );

      bookItem.appendChild(title);
      bookItem.appendChild(author);
      bookItem.appendChild(year);
      bookItem.appendChild(month);
      bookItem.appendChild(removeButton);
      bookItem.appendChild(toggleButton);

      return bookItem;
  }

  function createActionButton(text, className, clickHandler) {
      const button = document.createElement('button');
      button.textContent = text;
      button.classList.add(className);
      button.addEventListener('click', clickHandler);
      return button;
  }

  updateBookshelf();
});
