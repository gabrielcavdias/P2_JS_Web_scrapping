document.onload = carregarnoticias()
//alert("Dicas de pesquisa: Dragon ball, Bleach ou Ninku")
document.querySelector('.buscar').addEventListener('click', () => {
    let busca = document.querySelector('#busca-anime')
    buscar(busca.value)
})  
//Variáveis globais
const output = document.querySelector('.output')
//Funções
function carregarnoticias(){
    let linkaninws = 'https://enigmatic-sierra-60542.herokuapp.com/https://www.animenewsnetwork.com/'
    fetch(linkaninws).then(resp => resp.text()).then(DOManidb =>{
        let dom = new DOMParser()
        let doc = dom.parseFromString(DOManidb,"text/html")
        let noticias = doc.querySelectorAll('.herald.box.news')
        let boxNoticias = document.querySelector('.noticias')
        for(let i=0;i<5;i++){
            boxNoticias.appendChild(noticias[i])
        }
        //Arrumando os links
        document.querySelectorAll('.noticias h3 a').forEach(link => {
            let anterior = link.attributes[0].value
            let novo = 'https://www.animenewsnetwork.com'+anterior
            link.setAttribute('href', novo)
            link.setAttribute('target', '_blank')
        })
    })
}
function buscar(texto){
    //Limpa o resultado das pesquisas anteriores
    if(document.querySelector('.output ul')!=null){
        document.querySelector('.output ul').remove()
    }
    let link = `https://enigmatic-sierra-60542.herokuapp.com/https://anidb.net/search/anime/?adb.search=${texto.replace(' ','%20')}&do.search=1&entity.animetb=1`
    fetch(link).then(resp => resp.text()).then(DOManidb =>{
        let dom = new DOMParser()
        let doc = dom.parseFromString(DOManidb,"text/html")
        //Cria uma ul
        output.appendChild(document.createElement('ul'))
        
        doc.querySelectorAll('.relid a').forEach(link =>{
            let li = document.createElement('li')
            li.appendChild(link)
            let resultado = document.querySelector('.output ul')
            resultado.appendChild(li)   
        })
        //Captura os links e retira as ancoras
        let listItems = document.querySelectorAll('.output li a')
        listItems.forEach(link =>{
            let parametro = link.attributes[0].textContent
            link.removeAttribute('href')
            link.setAttribute('onclick', `informacoes("${parametro}")`)
        })
    })
}
function informacoes(caminho){
    let linkanidb = `https://enigmatic-sierra-60542.herokuapp.com/https://anidb.net${caminho}`
    //Junta as informações em um Objeto
    fetch(linkanidb).then(resp => resp.text()).then(DOManidb =>{
        let dom = new DOMParser()
        let doc = dom.parseFromString(DOManidb,"text/html")
        //Captura dos dados do Anidb
        let anime = {
            "titulo": doc.querySelectorAll('td.value label')[0].innerText,
            "equipe": doc.querySelector('#stafflist'),
            "descricao":doc.querySelector('[itemprop="description"]'),
            "personagens": doc.querySelectorAll('.medium'),
            "imagem":doc.querySelector('.g_image').attributes[1].value
        }
        console.log(anime)
        montapagina(anime)
    })   
}
function abrirmodal(){
    let caixamodal = document.createElement('div')
    caixamodal.classList.add('ModalAnime')
    let conteudo = document.createElement('div')
    conteudo.classList.add('ConteudoAnime')
    let fechar = conteudo.appendChild(document.createElement('span'))
    fechar.appendChild(document.createTextNode("Fechar"))
    fechar.setAttribute('onclick', 'fecharModal()')
    fechar.classList.add('fechar')
    caixamodal.appendChild(conteudo)
    document.body.appendChild(caixamodal)
}
function fecharModal(){
    let modal = document.querySelector('.ModalAnime')
    modal.remove()
}
function montapagina(objanime){ 
    abrirmodal()
    let modal = document.querySelector('.ConteudoAnime')
    let title = document.createElement('h2')
    title.appendChild(document.createTextNode(objanime.titulo))
    modal.appendChild(title)
    let img = document.createElement('img')
    img.setAttribute('src', `${objanime.imagem}`)
    modal.appendChild(img)
    modal.appendChild(objanime.descricao)
    let personagens = document.createElement('div')
    personagens.classList.add('personagens')
    objanime.personagens.forEach(div => personagens.appendChild(div))
    modal.appendChild(personagens)
    modal.appendChild(objanime.equipe)
    //Arruma os links
    document.querySelectorAll('.stripe a').forEach(link => {
        let anterior = link.attributes['href'].value
        let novo = 'https://anidb.net'+anterior
        link.setAttribute('href', novo)
        link.setAttribute('target', '_blank')
    })
}