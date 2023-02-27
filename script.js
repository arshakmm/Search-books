const input = document.getElementById("input");
const btn = document.getElementById("btn");
const booksConatiner = document.getElementById("title");
const pagesButton = document.getElementById('pagesButton')
const loaderContainer = document.querySelector('.loader-container')

let totalPages
let isLoading = false
let searchValue = ''
let currentPage = 1
function searchBook() {
  if (input.value) {
    isLoading = true
    searchValue = input.value
    pagesButton.innerHTML = ""
    if (isLoading) {
      booksConatiner.innerHTML = 'Loading...'
    }

    fetch(`http://openlibrary.org/search.json?q=${input.value}&page=`)
      .then((response) => response.json())
      .then((data) => {
        isLoading = false
        if (data.docs.length) {
          totalPages = Math.ceil(data.numFound / 100)
          render(data)
          createPagination(1)

        }
        if (data.docs.length === 0) {
          booksConatiner.innerHTML = 'No result...'
        }

      }).catch((error) => {
        isLoading = false
        console.log(error, 'mi ban arra')
      });
  } else {
    pagesButton.innerHTML = ""
    booksConatiner.innerHTML = ''
  }
}

btn.addEventListener("click", () => {
  searchBook()
});

input.addEventListener('keyup', (e) => {
  if (e.which === 13) {
    searchBook()
  }
})

function changePages(currentPage) {
  if (searchValue) {
    isLoading = true
    pagesButton.innerHTML = ""
    if (isLoading) {
      booksConatiner.innerHTML = 'Loading...'
    }
    createPagination(currentPage)
    fetch(`http://openlibrary.org/search.json?q=${searchValue}&page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => render(data))
  }
}

function render(data) {
  booksConatiner.innerHTML = ''
  data.docs.forEach((item, index) => {
    const book = document.createElement('li');
    if(currentPage>1){
      book.value = currentPage * 100 + index;
    }
    book.classList.add('listBookTtle')
    book.innerHTML = item.title
    booksConatiner.appendChild(book)
  })
  scrollToTop()

}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createPagination(page) {
  pagesButton.innerHTML = ""
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) {
    let numPage = document.createElement('button')
    numPage.classList.add('searchButton')
    numPage.onclick = () => {
      currentPage = beforePage
      changePages(beforePage)
    }
    numPage.innerHTML = 'Prev'
    pagesButton.appendChild(numPage)
  }

  if (page > 2) {
    let numPage = document.createElement('button')
    numPage.classList.add('searchButton')
    numPage.onclick = () => {
      changePages(1)
      currentPage = 1
    }
    numPage.innerHTML = 1
    pagesButton.appendChild(numPage)
    if (page > 3) {
      let numPage = document.createElement('button')
      numPage.classList.add('searchButton')
      numPage.innerHTML = '...'
      pagesButton.appendChild(numPage)
    }
  }

  if (page === totalPages && totalPages > 2) {
    beforePage = beforePage - 1;
  } else if (page === totalPages - 1 && totalPages > 2) {
    beforePage = beforePage - 1;
  }
  if (page === 1 && totalPages > 2) {
    afterPage = afterPage + 2;
  } else if (page === 2) {
    afterPage = afterPage + 1;
  }

  for (let i = beforePage; i <= afterPage; i++) {
    let active = "";

    if (i > totalPages) {
      continue
    }
    if (i == 0) {
      i = i + 1;
    }
    if (page === i) {
      active = "active";
    } else {
      active = "";
    }
    let numPage = document.createElement('button')
    numPage.onclick = () =>{ 
      changePages(i)
      currentPage =i
    }
    numPage.innerHTML = i
    numPage.classList.add('searchButton')
    if (active) {
      numPage.classList.add(active)
    }
    pagesButton.appendChild(numPage)
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      let numPage = document.createElement('button')
      numPage.classList.add('searchButton')
      numPage.innerHTML = '...'
      pagesButton.appendChild(numPage)
    }
    let numPage = document.createElement('button')
    numPage.classList.add('searchButton')
    numPage.onclick = () => {
      changePages(totalPages)
      changePages=totalPages
    }
    numPage.innerHTML = totalPages
    pagesButton.appendChild(numPage)
  }

  if (page < totalPages) {
    let numPage = document.createElement('button')
    numPage.classList.add('searchButton')
    numPage.onclick = () => {
      changePages(afterPage)
      changePages=afterPage
    }
    numPage.innerHTML = 'Next'
    pagesButton.appendChild(numPage)
  }
}
