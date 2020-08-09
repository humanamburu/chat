const socket = io();

const messagesContainer = document.getElementById('messages');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const nameInput = document.getElementById('name');

const appendMessage = ({ message }) => {
    const newMessage = document.createElement('div');
    const newMsg = messagesContainer.appendChild(newMessage);

    newMsg.innerText = message;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const send = () => {
    const text = input.value;
    const name = nameInput.value;

    if (text) {
        const date = new Date();
        const messagePackage = { message: `${date.toLocaleTimeString()} :: ${name} :: ${text}` };

        socket.emit('message', messagePackage);

        appendMessage(messagePackage);
    }

    input.value = '';

    return false;
};

const start = () => {
    nameInput.value = localStorage.getItem('name');

    socket.on('message', appendMessage);

    socket.on('history', (history) => {
        messagesContainer.innerHTML = '';
        history.forEach(appendMessage);
    });

    sendButton.addEventListener('click', send);
    nameInput.addEventListener('change', () => localStorage.setItem('name', nameInput.value));

    document.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            send();
        }
    });
};

start();
