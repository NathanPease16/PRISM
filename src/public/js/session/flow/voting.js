/**
 * Handles voting by allowing countries to vote in
 * favor, against, or abstain in a vote, unless they are 
 * PV in which case they can only vote for or against. 
 * Vote can also be set to a one-half or two-thirds majority
 * 
 * @summary Handles voting in committee session
 * 
 * @author Nathan Pease
 */

// Get elements from document
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

/**
 * Update the vote graphic to reflect the vote type (simple or super majority),
 * as well as the actual results of the vote
 */
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
    // Move in the circles to reflect the vote percentages
    } else {
        favor.style.right = `${(1 - (favorAmount / total)) * 100}%`;
        against.style.right = `${(1 - (againstAmount / total)) * 100}%`;
    }

    // Set text to reflect how many people have voted and in what ways
    favorText.textContent = `Favor ${favorAmount}`;
    againstText.textContent = `Against ${againstAmount}`;
    abstainText.textContent = `Abstain ${abstainAmount}`;
    majorityText.textContent = `Majority ${majorityAmount}`;
}

/**
 * Load the voting queue for all countries
 * @param {*} votingCountries Countries that will be voting
 * @returns 
 */
function loadVoting(votingCountries) {
    upcomingCountries.innerHTML = '';

    // If no countries are voting, set to defaults
    if (votingCountries.length == 0) {
        currentlyVotingImg.src = '/global/flags/xx.png';
        currentlyVotingName.textContent = '';

        // Disable all buttons
        favorButton.classList.add('disabled');
        againstButton.classList.add('disabled');
        abstainButton.classList.add('disabled');

        // If the number of countries is over 0, but the
        // number of countries left to vote is 0 then the
        // vote is over
        if (total > 0) {
            const popup = new Popup();

            // If vote succeeded
            if (favorAmount >= majorityAmount) {
                popup.addSmallHeader('Congratulations!');
                popup.addText('This vote passed!');
                popup.addButton('Close', 'green', () => {
                    popup.remove();
                });
            // If vote did not succeed
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

    // All people that still need to vote
    const toVote = [...votingCountries];
    // The country that is currently voting (done in alphabetical order)
    const currentlyVoting = toVote.shift();

    currentlyVotingImg.src = `/global/flags/${currentlyVoting.flagCode.toLowerCase()}.png`;
    currentlyVotingName.textContent = currentlyVoting.title;

    // Instantiate each country
    for (const country of toVote) {
        instantiate('country', upcomingCountries, {
            flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png` }, 
        }, {
            name: { textContent: country.title },
        });
    }

    // If they vote in favor
    const favorEvent = () => {
        favorButton.removeEventListener('click', favorEvent);
        favorAmount++;
        updateVoteGraphic();
        loadVoting(toVote);
    }

    
    favorButton.addEventListener('click', favorEvent);
    previousFavor = favorEvent;

    // If they vote against
    const againstEvent = () => {
        againstButton.removeEventListener('click', againstEvent);
        againstAmount++;
        updateVoteGraphic();
        loadVoting(toVote);
    }
    
    againstButton.addEventListener('click', againstEvent);
    previousAgainst = againstEvent;

    // If they aren't present & voting and decide to abstain
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

// Reset all voting values and update graphics accordingly
function resetVoting() {
    favorAmount = 0;
    againstAmount = 0;
    abstainAmount = 0;
    updateVoteGraphic();
    loadVoting(countries);
}

// Reset voting on button click
resetVote.addEventListener('click', () => {
    resetVoting();
});

// Configure the vote to either be a simple majority
// or a super majority based on what is selected
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