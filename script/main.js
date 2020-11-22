document.onload = carregarnoticias()
//alert("Dicas de pesquisa: Dragon ball, Bleach ou Ninku")
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
    })
}

document.querySelector('.buscar').addEventListener('click', () => {
    let busca = document.querySelector('#busca-anime')
    buscar(busca.value)
})
const output = document.querySelector('.output')
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
    let anime = {}
    //Junta as informações em um Objeto
    fetch(linkanidb).then(resp => resp.text()).then(DOManidb =>{
        let dom = new DOMParser()
        let doc = dom.parseFromString(DOManidb,"text/html")
        //Captura dos dados do Anidb
        anime.titulo = doc.querySelectorAll('td.value label')[0].innerText
        anime.equipe = doc.querySelector('#stafflist')
        anime.descricao = doc.querySelector('[itemprop="description"]')
        anime.personagens = doc.querySelectorAll('.medium')
        anime.imagem = doc.querySelector('.g_image').attributes[1].value
    })
    
    /*
    //Pega a abertura do anime no Youtube
    let linkytb = `https://enigmatic-sierra-60542.herokuapp.com/https://www.youtube.com/results?search_query=${anime.titulo.replace(' ','+')}+opening`
    fetch(linkytb).then(resp => resp.text()).then(DOMytb =>{
        let dom = new DOMParser()
        let doc = dom.parseFromString(DOMytb,"text/html")
        //Pega o primeiro link de vídeo, captura o href, o replace é usado para que o vídeo funcione no embed lá na frente na hora de preencher a página
        let href = doc.querySelector('a#video-title').attributes[3].value.replace('watch?v=', 'embed/')
        anime.abertura = `https://www.youtube.com${href}`
    })*/    
    console.log(anime.imagem)

    return montapagina(anime)
}
function abrirmodal(){
    let caixamodal = document.createElement('div')
    caixamodal.classList.add('ModalAnime')
    let conteudo = document.createElement('div')
    conteudo.classList.add('ConteudoAnime')
    caixamodal.appendChild(conteudo)
    document.body.appendChild(caixamodal)
}
function montapagina(objanime){
    abrirmodal()
    let modal = document.querySelector('.ConteudoAnime')
    let img = document.createElement('img')
    img.setAttribute('src', `${objanime.imagem}`)
    modal.appendChild(img)
    console.log(modal.innerHTML)
}