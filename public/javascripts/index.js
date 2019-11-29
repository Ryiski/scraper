let closeButton = document.querySelectorAll('.delete-button');

document.querySelector('button')
    .addEventListener('click', async (e) => {
        e.preventDefault();

        closeButton = document.querySelector('.close');

        try {

            let url = document.querySelector('input');

            const id = await uuid();

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ previewUrl: url.value , id })
            };

            url.value = '';

            previewMarkUp(id);

            const response = await fetch('/addUrl', options);

            const data = await response.json();

            previewMarkUp(data);

        } catch (err) {

            console.log(err);

        }
    });

const removePreview = async (e) => {

    let li = e.parentElement;
    li.parentElement.removeChild(li);

    const id = li.getAttribute('data-id');
    await fetch(`/remove/${id}`, { method: 'POST' });

    
}


function previewMarkUp(data) {

    if(typeof data === "object"){

        const {
            id,
            url,
            img,
            title,
            description,
            domain
        } = data;

        const li = document.querySelector(`li[data-id="${id}"]`);
  
        li.classList.remove('loading');

        li.prepend(
            document.createRange()
            .createContextualFragment(
                `<svg class="delete-button" viewBox="0 0 24 24" onClick="removePreview(this)">
                    <polygon points="17.8,16.7 16.6,17.9 12,13.3 7.4,17.9 6.2,16.7 10.8,12.1 6.2,7.5 7.4,6.3 12,11 16.6,6.4 17.8,7.6 13.2,12.2">
                    </polygon>
                </svg>
                <a href="${url}" target="_blank">
                    <img class="preview-image" src="${img}" alt="preview image"/>
                    <div class="preview-info">
                        <h5 class="preview-title">${title}</h5>
                        <p class="preview-description">${description}</p>
                        <span class="preview-url">${domain}</span>
                    </div>
                
            </a>`
            , 'text/html'));
    }else{
        
        return document.querySelector(`ul`)
        .prepend(
            document
            .createRange()
            .createContextualFragment(
                `<li class="preview-container loading" data-id="${data}"></li>`
            , 'text/html'));
    }
}

function uuid(){
    let date = new Date().getTime();
    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (date + Math.random()*16)%16 | 0;
        date = Math.floor(date/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });

    return id;
}