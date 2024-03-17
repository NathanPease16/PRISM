// Get committees json from server
const committees = fetch('/committees.json').then(res => res.json());