const againstButton = document.getElementById('against-button');
const favorButton = document.getElementById('favor-button');

const currentlyVotingImg = document.getElementById('currently-voting-img');
const currentlyVotingName = document.getElementById('currently-voting-name');

const favor = document.getElementById('favor');
const against = document.getElementById('against');

let currentlyVoting;
let voted;

let favorAmount = 0;
let againstAmount = 0;
let total = 0;

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

function loadVoting() {
    const toVote = [...countries];
    currentlyVoting = toVote.shift();

    currentlyVotingImg.src = `/global/flags/${currentlyVoting.flagCode.toLowerCase()}.png`;
}

loadVoting();