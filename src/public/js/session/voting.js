const configureVote = document.getElementById('configure-vote');
const resetVote = document.getElementById('reset-vote');

const againstButton = document.getElementById('against-button');
const favorButton = document.getElementById('favor-button');
const abstainButton = document.getElementById('abstain-button');

const currentlyVotingImg = document.getElementById('currently-voting-img');
const currentlyVotingName = document.getElementById('currently-voting-name');

const upcomingCountries = document.getElementById('upcoming-countries');

const favor = document.getElementById('favor');
const against = document.getElementById('against');

const voteAmount = document.getElementById('vote-amount-line');

const favorText = document.getElementById('favor-text');
const againstText = document.getElementById('against-text');
const abstainText = document.getElementById('abstain-text');
const majorityText = document.getElementById('majority-text');

let voteMajority = 'simple';

let favorAmount = 0;
let againstAmount = 0;
let abstainAmount = 0;
let majorityAmount = 0;
let total = 0;

let previousFavor;
let previousAgainst;
let previousAbstain;

const updateVoteGraphic = () => {
    total = countries.length;

    if (voteMajority === 'simple') {
        majorityAmount = total == 0 ? 0 : Math.floor(total/2) + 1;
        voteAmount.className = 'one-half-vote';
    } else if (voteMajority === 'super') {
        majorityAmount = Math.ceil(total * 2 / 3);
        voteAmount.className = 'two-thirds-vote';
    }

    if (total == 0) {
        favor.style.right = '100%';
        against.style.right = '100%';
    } else {
        favor.style.right = `${(1 - (favorAmount / total)) * 100}%`;
        against.style.right = `${(1 - (againstAmount / total)) * 100}%`;
    }

    favorText.textContent = `Favor ${favorAmount}`;
    againstText.textContent = `Against ${againstAmount}`;
    abstainText.textContent = `Abstain ${abstainAmount}`;
    majorityText.textContent = `Majority ${majorityAmount}`;
}

function loadVoting(votingCountries) {
    upcomingCountries.innerHTML = '';

    if (votingCountries.length == 0) {
        currentlyVotingImg.src = '/global/flags/xx.png';
        currentlyVotingName.textContent = '';

        favorButton.classList.add('disabled');
        againstButton.classList.add('disabled');
        abstainButton.classList.add('disabled');

        if (total > 0) {
            const popup = new Popup();

            if (favorAmount >= majorityAmount) {
                popup.addSmallHeader('Congratulations!');
                popup.addText('This vote passed!');
                popup.addButton('Close', 'green', () => {
                    popup.remove();
                });
            } else {
                popup.addSmallHeader('Sorry!');
                popup.addText('This vote did not pass...');
                popup.addButton('Close', 'red', () => {
                    popup.remove();
                });
            }

            popup.show();
        }

        return;
    }
    
    favorButton.classList.remove('disabled');
    againstButton.classList.remove('disabled');
    abstainButton.classList.remove('disabled');

    // Remove all previous event listeners
    favorButton.removeEventListener('click', previousFavor);
    againstButton.removeEventListener('click', previousAgainst);
    abstainButton.removeEventListener('click', previousAbstain);

    const toVote = [...votingCountries];
    const currentlyVoting = toVote.shift();

    currentlyVotingImg.src = `/global/flags/${currentlyVoting.flagCode.toLowerCase()}.png`;
    currentlyVotingName.textContent = currentlyVoting.title;

    for (const country of toVote) {
        instantiate('country', upcomingCountries, {
            flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png` }, 
        }, {
            name: { textContent: country.title },
        });
    }

    const favorEvent = () => {
        favorButton.removeEventListener('click', favorEvent);
        favorAmount++;
        updateVoteGraphic();
        loadVoting(toVote);
    }

    
    favorButton.addEventListener('click', favorEvent);
    previousFavor = favorEvent;

    const againstEvent = () => {
        againstButton.removeEventListener('click', againstEvent);
        againstAmount++;
        updateVoteGraphic();
        loadVoting(toVote);
    }
    
    againstButton.addEventListener('click', againstEvent);
    previousAgainst = againstEvent;

    if (currentlyVoting.attendance != 'PV') {
        const abstainEvent = () => {
            abstainButton.removeEventListener('click', abstainEvent);
            abstainAmount++;
            updateVoteGraphic();
            loadVoting(toVote);
        }
        
        abstainButton.addEventListener('click', abstainEvent);
        previousAbstain = abstainEvent;
    } else {
        abstainButton.classList.add('disabled');
    }
}

function resetVoting() {
    favorAmount = 0;
    againstAmount = 0;
    loadVoting(countries);
    updateVoteGraphic();
}

resetVote.addEventListener('click', () => {
    resetVoting();
});

configureVote.addEventListener('click', () => {
    const popup = new Popup();
    popup.addSmallHeader('Configure Vote');

    const simpleDiv = document.createElement('div');
    simpleDiv.className = 'radio-button-container';

    const simpleMajority = document.createElement('input');
    simpleMajority.type = 'radio';
    simpleMajority.value = 'simple';
    simpleMajority.name = 'majority';
    simpleMajority.className = 'vote-type';

    if (voteMajority === 'simple') {
        simpleMajority.checked = true;
    } else {
        simpleMajority.checked = false;
    }

    const simpleText = document.createElement('p');
    simpleText.className = 'vote-type-text';
    simpleText.textContent = 'Simple Majority';

    simpleDiv.appendChild(simpleMajority);
    simpleDiv.appendChild(simpleText);

    const superDiv = document.createElement('div');
    superDiv.className = 'radio-button-container';

    const superMajority = document.createElement('input');
    superMajority.type = 'radio';
    superMajority.value = 'super';
    superMajority.name = 'majority';
    superMajority.className = 'vote-type';

    if (voteMajority === 'super') {
        superMajority.checked = true;
    } else {
        superMajority.checked = false;
    }

    const superText = document.createElement('p');
    superText.className = 'vote-type-text';
    superText.textContent = 'Super Majority';

    superDiv.appendChild(superMajority);
    superDiv.appendChild(superText);

    popup.addElement(simpleDiv);
    popup.addElement(superDiv);

    popup.addButton('Confirm', 'blue', () => {
        if (superMajority.checked) {
            voteMajority = superMajority.value;
        } else {
            voteMajority = simpleMajority.value;
        }

        resetVoting();

        popup.remove();
    });
    popup.show();
});

resetVoting();