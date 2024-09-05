async function buscaEndereco(cep) {
    const rua = document.querySelector('#rua');
    const bairro = document.querySelector('#bairro');
    const cidade = document.querySelector('#cidade');
    const estado = document.querySelector('#estado');

    try {
        const validator = /^[0-9]{8}$/;
        if (!validator.test(cep)) {
            throw { cep_error: "CEP Inválido" };
        }

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
        if (!response.ok) {
            throw await response.json();
        }
        const responseCep = await response.json();
        if (responseCep.erro) {
            throw { cep_error: "CEP não existente" };
        }

        rua.innerHTML = `Rua: ${responseCep.logradouro}`;
        bairro.innerHTML = `Bairro: ${responseCep.bairro}`;
        cidade.innerHTML = `Cidade: ${responseCep.localidade}`;
        estado.innerHTML = `Estado: ${responseCep.uf}`;

        addHistory(cep)
    } catch (error) {
        if (error?.cep_error) {
            const message = document.querySelector('#message');
            message.innerHTML = error.cep_error;
            setTimeout(() => {
                message.innerHTML = "BuscaCEP";
            }, 5000);
            // alert(error.cep_error);
        }
    } 
}

function addHistory(info) {
    localStorage.setItem(`history${localStorage.length}`, info)
}

function historyShow() {
    for (let i = 0; i < localStorage.length; i++) {
        console.log(localStorage.getItem(`history${i}`))

        p = document.createElement("p")
        p.innerHTML = `CEP: ${localStorage.getItem(`history${i}`)}`
        document.querySelector('.hResults').appendChild(p)
    }
}

function reset() {
    // const div = document.querySelector(".results")

    // while (div.hasChildNodes()) {
    //     div.removeChild(div.firstChild);
    // }

    localStorage.clear()
}