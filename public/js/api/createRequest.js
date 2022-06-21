/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (xhr.status != 200) {
      options.callback(xhr.statusText, null);
    } else {
      options.callback(null, xhr.response);
    }   
  }

  let requestUrl = options.url;
  const formData = new FormData();
  
  if (options.method != 'GET') {
    Object.keys(options.data).forEach((key) => {
        formData.append(key, options.data[key])
    });

  } else {

    requestUrl = requestUrl + '?'

    for (key in options.data) {
      requestUrl += `${key}=${options.data[key]}&`
    }

    requestUrl = requestUrl.replace(/\&$/, '');    
  }
  xhr.open(options.method, requestUrl);
  xhr.send(formData);
}
