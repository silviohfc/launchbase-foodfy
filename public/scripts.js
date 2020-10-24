const descToggles = document.querySelectorAll('.descToggle')
const cards = document.querySelectorAll('.recipeCard')

for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => {
       window.location.href = `/recipes/${cards[i].id}`
    })
}

for (let i = 0; i < descToggles.length; i++) {

    descToggles[i].addEventListener('click', () => {
        const parentId = descToggles[i].parentNode.parentNode.id
        const parentEl = document.querySelector(`#${parentId}`)
        const description = parentEl.querySelector('.description')
        
        if (!description.classList.contains('active')){
            description.classList.add('active')
            descToggles[i].innerText = "ESCONDER"
        }else {
            description.classList.remove('active')
            descToggles[i].innerText = "MOSTRAR"
        }
        
    })

}

function addInput(event) {
    const buttonName = event.target.name
    const ingredients = document.querySelector("#ingredients")
    const steps = document.querySelector("#steps")
    const fieldContainer = document.querySelectorAll(`.${buttonName}`)

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    if (newField.children[0].value = "") return false

    newField.children[0].value = ""
    newField.children[0].placeholder = ""
    
    if (buttonName === 'ingredient') {
        ingredients.appendChild(newField)
    } else {
        steps.appendChild(newField)
    }

}

document.querySelectorAll(".add-input").forEach(button => button.addEventListener("click", addInput))

const menuItems = document.querySelectorAll(".menu a")

for (item of menuItems) {
    if (location.pathname.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)
            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {
    const search = pagination.dataset.search
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)
    
    let elements = ""
    
    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (search) {
                elements += `<a href="?page=${page}&search=${search}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    
    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}