const socket = io();

const messagesContainer = document.getElementById('messages');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');

const appendMessage = ({ message }) => {
    const newMessage = document.createElement('li');
    const newMsg = messagesContainer.appendChild(newMessage);

    newMsg.innerText = message;
}

const send = () => {
    const text = input.value;

    if (text) {
        const messagePackage = { message: text };

        socket.emit('message', messagePackage);
        appendMessage(messagePackage);
    }

    input.value = '';

    return false;
}

socket.on('message', appendMessage);
socket.on('history', (history) => history.forEach(appendMessage));

sendButton.addEventListener('click', send);
