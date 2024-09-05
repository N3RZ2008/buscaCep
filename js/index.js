async function buscaEndereco(cep) {
    const rua = document.querySelector('#rua');
    const bairro = document.querySelector('#bairro');
    const cidade = document.querySelector('#cidade');
    const estado = document.querySelector('#estado');

    try {
        if (!/^[0-9]{8}$/.test(cep)) {
            throw new Error("CEP Inválido");
        }

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
        if (!response.ok) throw new Error("Erro na busca");

        const data = await response.json();
        if (data.erro) throw new Error("CEP não existente");

        rua.textContent = `Rua: ${data.logradouro}`;
        bairro.textContent = `Bairro: ${data.bairro}`;
        cidade.textContent = `Cidade: ${data.localidade}`;
        estado.textContent = `Estado: ${data.uf}`;

        addHistory(cep);
        renderHistory();
    } catch (error) {
        const message = document.querySelector('#message');
        message.textContent = error.message;
        setTimeout(() => { message.textContent = "BuscaCEP"; }, 5000);
    }
}

function addHistory(cep) {
    if (!localStorage.getItem(cep)) {
        localStorage.setItem(cep, cep);
    }
}

function renderHistory() {
    const historyDiv = document.querySelector(".hResults");
    historyDiv.innerHTML = ""; // Limpa o histórico antes de adicionar

    Object.keys(localStorage).forEach((key, index) => {
        const historyItem = document.createElement("p");
        historyItem.textContent = `${index + 1}. ${key}`;
        historyItem.onclick = () => { document.querySelector('#input').value = key; };
        historyDiv.appendChild(historyItem);
    });
}

function reset() {
    localStorage.clear();
    renderHistory();
}

window.onload = renderHistory;
            
