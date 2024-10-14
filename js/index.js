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

        buscaClima(`${data.localidade}`);

        // console.log(buscaClima(`${data.localidade}`));

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

function showDiv(cls) {
    if (document.querySelector(cls).style.zIndex == 1) {
        document.querySelector(cls).style.zIndex = -1;
        document.querySelector(cls).style.left = "0";
        document.querySelector(cls).style.right = "0";
        return
    }
    document.querySelector(cls).style.left = "70vw";
    document.querySelector(cls).style.zIndex = 1;
}

async function buscaClima(cidade) {
    try {
        const id = "3be15358a47ddfa8abaccade84230edf";
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cidade},%20BR&appid=${id}`);
        if (!response.ok) throw new Error("Erro na busca");

        const data = await response.json();
        if (data.erro) throw new Error("Conversão errada");

        values = [data[0].lat, data[0].lon];
    } catch (error) {
        console.log(error.message);
    }
    try {
        const id = "3be15358a47ddfa8abaccade84230edf";
        const lat = values[0];
        const lon = values[1];
        const temp = document.querySelector('#temp');
        const img = document.querySelector('#img');

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${id}&units=metric`);
        if (!response.ok) throw new Error("Erro na busca");

        const data = await response.json();
        if (data.erro) throw new Error("Pesquisa falha");

        temp.textContent = `Temperatura: ${data.main.temp}`;
        // console.log(data.weather[0].icon);
        img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    } catch (error) {
        console.log(error.message)
    }
}

window.onload = renderHistory;
            
