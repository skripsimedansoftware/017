window.getTimezone = () => {
  return localStorage.getItem('server-timezone') || moment.tz.guess();
};

window.getQueryParams = (key = undefined) => {
  const search = window.location.search.substring(1);
  return search.split('&').reduce((queryParams, param) => {
    const [i, value] = param.split('=');
    queryParams[i] = decodeURIComponent(value);
    if (queryParams[key]) {
      return queryParams[key];
    }

    return i.length > 0 ? queryParams : undefined;
  }, {});
};

const SwalToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 6000,
});

jQuery(() => {
  if (!localStorage.getItem('server-timezone')) {
    $.ajax({
      url: '/api',
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      success: (response) => {
        localStorage.setItem('server-timezone', response.timezone);
      },
    });
  }
});
