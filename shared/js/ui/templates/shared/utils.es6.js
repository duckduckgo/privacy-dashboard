const offset = 'a'.charCodeAt(0)
const colorCount = 16
function getColorId(value) {
    const characters = value.toLowerCase().split('')
    const sum = characters.reduce((total, character) => total + character.charCodeAt(0) - offset, 0)
    return Math.abs((sum % colorCount) + 1)
}

export { getColorId }
