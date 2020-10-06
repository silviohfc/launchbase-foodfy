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
    
    if (buttonName === 'ingredient') {
        ingredients.appendChild(newField)
    } else {
        steps.appendChild(newField)
    }

}

document.querySelectorAll(".add-input").forEach(button => button.addEventListener("click", addInput))