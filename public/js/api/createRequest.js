/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    if (options.method != 'GET') {
        const formData = new FormData();
        
        Object.keys(options.data).forEach((key) => {
            console.log(options.data[key]);
            formData.append(key, options.data[key])
        });
        
        xhr.open(options.method, options.url);

        xhr.send(formData);

        xhr.onload = () => {

            if (xhr.status != 200) {
                options.callback(xhr.statusText);
            } else {
                options.callback(null, xhr.response);
            }       
        }
        
        return
    }

    let request = options.url + '?'

    let counter = 0

    for (item in options.data) {
        counter++
    }
    
    let iter = 0

    for (key in options.data) {
        request += `${key}=${options.data[key]}`

        if (iter < counter) {
            request += '&'
            iter++
        }

        iter++
    }

    xhr.open(options.method, request);

    xhr.send();

    xhr.onload = () => {

        if (xhr.status != 200) {
            options.callback(xhr.statusText);
        } else {
            options.callback(null, xhr.response);
        }       
    }
    
};
