const ImagesUpload = {
    input: "",
    preview: document.querySelector('.preview'),
    uploadLimit: 5,
    files: [],

    handleFileInput(event) {
        const { files: fileList } = event.target
        ImagesUpload.input = event.target
        
        if (ImagesUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            ImagesUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = ImagesUpload.getContainer(image)

                ImagesUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })
    
        ImagesUpload.input.files = ImagesUpload.getAllFiles()
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = ImagesUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} imagens!`)
            event.preventDefault()
            return true
        }

        const imagesDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "image-item") {
                imagesDiv.push(item)
            }
        })

        const totalImages = fileList.length + imagesDiv.length

        if (totalImages > uploadLimit) {
            alert("Você atingiu o limite máximo de imagens!")
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        ImagesUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('image-item')

        div.onclick = ImagesUpload.removeImage

        div.appendChild(image)
        div.appendChild(ImagesUpload.getRemoveButton())

        return div
    },

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"

        return button
    },

    removeImage(event) {
        const imageDiv = event.target.parentNode
        const imagesArray = Array.from(ImagesUpload.preview.children)
        const index = imagesArray.indexOf(imageDiv)

        ImagesUpload.files.splice(index, 1)
        ImagesUpload.input.files = ImagesUpload.getAllFiles()

        imageDiv.remove()
    },

    removeOldImage(event) {
        const imageDiv = event.target.parentNode

        if (imageDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${imageDiv.id},`
            }
        }

        imageDiv.remove()
    },

    verifyLength(event) {
        const totalImages = document.querySelector('.preview').childElementCount

        if (totalImages == 0) {
            alert("Por favor, insira ao menos uma imagem!")
            event.preventDefault()
        }
    }
}

const ImageGallery = {
    previews: document.querySelectorAll('.gallery-preview img'),
    highlight: document.querySelector('.gallery .highlight > img'),
    setImage(event) {
        const { target } = event

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

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