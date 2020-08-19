function populateUFs() { /*colocando o UF direto do site ibge*/
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {
        for (const state of states ) { //repeticao para listar todos
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}<option>`
        }
    } )
}
populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]") /*para mandar ao ser enviado o nome do uf e cidade e nao os numeros correspondentes*/

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>" //limpar as cidades quando for selecionada outra
    citySelect.disabled = true //se tirar o estado novamente

    fetch(url)
    .then( res => res.json() )
    .then( cities => {
        
        for (const city of cities ) { //repeticao para listar todos
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}<option>`
        }
        citySelect.disabled = false
    } )
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//Itens de coleta  , pegar todos os li  
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) { /*para cada li*/
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]")

let selectedItems = [];

function handleSelectedItem(event) {
    const itemLi = event.target
    // adicionar ou remover um classe com JS - conseguir selecionar os itens de coleta
    itemLi.classList.toggle("selected") //add se fosse adc, remove p tira, e toggle p dois

    const itemId = itemLi.dataset.id 


    //verificar se ha itens selecionados e pega-los
    const alreadySelected = selectedItems.findIndex( function(item) {
        return item == itemId //retornara true ou false
    } )

    
    //se ja estiver selecionado,
    if(alreadySelected != -1) {
        // tirar da seleçao
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId //false
            return itemIsDifferent
        })
        selectedItems = filteredItems
    } else {
        //se nao estiver selecionado, adicionar a seleçao
        selectedItems.push(itemId)
    }

    //atualizar o campo escondido com os itens selecionados
    //document.querySelector("input[name=items]")
    collectedItems.value = selectedItems
}