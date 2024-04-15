/**
 * Adds logs to the document and updates as new logs come in,
 * differentiating between information, warnings, and errors
 * 
 * @summary Adds logs to the document
 * 
 * @author Nathan Pease
 */

const logsDiv = document.getElementById('logs');

/**
 * Adds a log to the document
 * @param {*} components The type (error, warning, etc.), the timestamp, and the message
 */
const addLog = (components) => {
    if (components.length != 3) {
        return;
    }

    const p = document.createElement('p');
    p.className = `log-${components[0]}`;
    p.textContent = `${components[1]} : ${components[2]}`;

    logsDiv.appendChild(p);
}

(async () => {
    const logsFile = await fetch('/logs.prism');
    const logsText = await logsFile.text();
    const logs = logsText.split('\n');

    // Add all pre-existing logs to the document
    for (const log of logs) {
        const components = [...log.matchAll(/\[(.*?)\]/g)].map(m => m[1]);
        
        addLog(components);
    }

    logsDiv.scrollTo(0, logsDiv.scrollHeight);
})();

// Add any new logs that come in
socket.on('log', (log) => {
    addLog(log);
})