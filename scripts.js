const modal = document.querySelector('.modal-overlay')
const cards = document.querySelectorAll('.recipeCard')

for (card of cards) {
    card.addEventListener('click', () => {
        modal.classList.add('active')
    })
}

modal.querySelector('span').addEventListener('click', () => {
    modal.classList.remove('active')
})