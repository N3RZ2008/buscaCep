async function buscaEndereco(cep, goToHistory) {
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

        if (goToHistory) {
            addHistory(cep);
            renderHistory();
        }
    } catch (error) {
        const message = document.querySelector('#message');
        message.textContent = error.message;
        setTimeout(() => { message.textContent = "BuscaCEP"; }, 5000);
    }
}

function addHistory(info) {
    localStorage.setItem(`history${localStorage.length}`, info)
}

function useHistory(info) {
    document.querySelector('#input').value = info
    buscaEndereco(info, false)
}

function renderHistory  () {
    if (document.querySelector(".hResults").hasChildNodes()) {
        const div = document.querySelector(".hResults")

        while (div.hasChildNodes()) {
            div.removeChild(div.firstChild);
        }
    }
    for (let i = localStorage.length-1; i >= 0; i--) {
        btn = document.createElement("button")
        btn.textContent = `${localStorage.length-i}. ${localStorage.getItem(`history${i}`)}`
        btn.addEventListener("click", () => {
            useHistory(localStorage.getItem(`history${i}`))
        })
        document.querySelector('.hResults').appendChild(btn)
    }
}

function reset() {
    localStorage.clear();
    renderHistory();
}

window.onload = renderHistory;
            
