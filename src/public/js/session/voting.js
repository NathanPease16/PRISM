const againstButton = document.getElementById('against-button');
const favorButton = document.getElementById('favor-button');

let favorAmount = 0;
let againstAmount = 0;
const total = 20;

const favor = document.getElementById('favor');
const against = document.getElementById('against');

const updateVoteGraphic = () => {
    if (total == 0) {
        favor.style.right = '100%';
        against.style.right = '100%';
    } else {
        favor.style.right = `${(1 - (favorAmount / total)) * 99.99}%`;
        against.style.right = `${(1 - (againstAmount / total)) * 100}%`;
    }
}

updateVoteGraphic();

againstButton.addEventListener('click', () => {
    againstAmount++;
    updateVoteGraphic();
});

favorButton.addEventListener('click', () => {
    favorAmount++;
    updateVoteGraphic();
});