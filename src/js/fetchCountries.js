const fetchCountries = name => {
  if (name.length === 0) {
    console.log('Please enter a country name');
  } else {
    return fetch(
      `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`,
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
};
export { fetchCountries };
