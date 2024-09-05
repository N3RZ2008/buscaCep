async function buscaCEP() {
    try {
        const estado = document.querySelector('#estado');
        const cidade = document.querySelector('#cidade');
        const rua = document.querySelector('#rua');

        if (cidade.value.length < 3 || rua.value.length < 3) {
            throw { cep_error : "Cidade e rua necessitam de 3 ou mais caracteres" };
        }

        const response = await fetch(`https://viacep.com.br/ws/${estado.value}/${cidade.value}/${rua.value}/json`);
        if (!response.ok) {
            throw await response.json();
        }
        const responseCep = await response.json();

        if (document.querySelector(".results").hasChildNodes()) {
            resetDiv();
        }

        responseCep.forEach(data => {
            div = document.createElement("div");
            div.className = "result";

            labels = ["Cep: ", "Estado: ", "Cidade: ", "Rua: "]
            items = [data.cep, data.estado, data.localidade, data.logradouro]

            for (let i = 0; i<4; i++) {
                p = document.createElement("p")
                p.innerHTML = `${labels[i]}${items[i]}`
                div.appendChild(p)
            }
            
            document.querySelector(".results").appendChild(div);
        });

        if (!document.querySelector(".results").hasChildNodes()) {
            throw { cep_error : "Cidade ou rua inválidos" };
        }
    } catch (error) {
        if (error?.cep_error) {
            const message = document.querySelector('#message');
            message.innerHTML = error.cep_error;
            setTimeout(() => {
                message.innerHTML = "BuscaCEP";
            }, 5000);
        } 
    }
}
function resetDiv() {
    const div = document.querySelector(".results")

    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
}