import { useState, useEffect } from 'react';
import './App.css';

function SearchBar({ searchHandler, searchTerm }) {
  return <section id="searchBar">
    <h1>Search Country</h1>
    <div className='input-group'>
      <input type="text" value={searchTerm} className="form-control" id="searchString" onChange={(evt) => searchHandler(evt.target.value)} />
      <button className="btn btn-light" type="button" id="button-addon2" onClick={() => searchHandler("")}>
        <span className="bi-backspace"></span>
      </button>
    </div>
  </section>
}

function CountryCard({ country, expandHandler }) {
  return <div className="card">
    <div className="card-header">
      {country.name} {country.flagEmoji}
      <button type="button" className="btn btn-dark btn-sm float-end" onClick={() => expandHandler(country)}>
        <span className="bi-arrows-angle-expand"></span>
      </button>
      <div className="officialName">{country.officialName === country.name ? "" : country.officialName}</div>
    </div>
    <div className='card-body'>
      <table className='table table-bordered'>
        <tbody>
          <tr>
            <th scope="row">Native Name</th>
            <td>{country.nativeName}</td>
          </tr>
          <tr>
            <th scope="row">Country Code</th>
            <td>{country.cca3}</td>
          </tr>
          <tr>
            <th scope="row">Currencies</th>
            <td>{country.currencies}</td>
          </tr>
          <tr>
            <th scope="row">Languages</th>
            <td>{country.languages}</td>
          </tr>
          </tbody>
      </table>
    </div>
  </div>
}

function ExpandedCard({ country, expandHandler }) {
  return <div className="row">
      <div className="col">
        <div className="card">
          <div className="card-header">
            {country.name} {country.flagEmoji}
            <button type="button" className="btn btn-dark btn-sm float-end" onClick={() => expandHandler(null)}>
              <span className="bi-backspace"></span>
            </button>
            <div className="officialName">{country.officialName === country.name ? "" : country.officialName}</div>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col col-12 col-md-6'>
                <table className='table table-bordered'>
                  <tbody>
                    <tr>
                      <th scope="row">Native Name</th>
                      <td>{country.nativeName}</td>
                    </tr>
                    <tr>
                      <th scope="row">Country Code</th>
                      <td>{country.cca3}</td>
                    </tr>
                    <tr>
                      <th scope="row">Currencies</th>
                      <td>{country.currencies}</td>
                    </tr>
                    <tr>
                      <th scope="row">Languages</th>
                      <td>{country.languages}</td>
                    </tr>
                    <tr>
                      <th scope="row">Region</th>
                      <td>{country.region} &gt; {country.subRegion}</td>
                    </tr>
                    <tr>
                      <th scope="row">Timezones</th>
                      <td>{country.region} &gt; {country.timeZones}</td>
                    </tr>
                    <tr>
                      <th scope="row">Population</th>
                      <td>{country.population}</td>
                    </tr>
                    </tbody>
                  </table>
              </div>
              <div className='col col-12 col-md-6'>
                <img src={country.flag} className="card-img-top" alt={country.flagAlt} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}

function CardContainer({ query, expandHandler }) {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => setSearchTerm(query), [query])

  useEffect(() => {
    const endPoint = searchTerm === "" ? "all?fields=name,cca3,currencies,region,subregion,languages,population,timezones,flags,flag" : `name/${searchTerm}`;
    fetch(`https://restcountries.com/v3.1/${endPoint}`)
      .then((res) => res.json())
      .then((data) => setCountries(data.map((country) => {
          return {
            name: country.name.common,
            officialName: country.name.official,
            nativeName: country.name.nativeName[Object.keys(country.name.nativeName)] ? country.name.nativeName[Object.keys(country.name.nativeName)[0]].common : "--",
            cca3: country.cca3,
            currencies: country.currencies ? Object.keys(country.currencies).toString() : "--",
            region: country.region,
            subRegion: country.subregion,
            languages: country.languages ? Object.values(country.languages).join(', ') : "--",
            population: country.population.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
            timeZones: Object.keys(country.timezones).toString(),
            flag: country.flags.svg,
            flagAlt: country.flags.alt,
            flagEmoji: country.flag
          }
        }).sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))))
  }, [searchTerm]);

  return <div className='row row-cols-1 row-cols-md-3 g-3'>
    {countries.map((country, i) => (
      <div key={i} className='col'>
        <CountryCard country={country} expandHandler={expandHandler} />
      </div>
    ))}
  </div>
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCountry, setExpandedCountry] = useState(null);

  return <div className='container-fluid container-bg'>
    {expandedCountry ? <>
      <ExpandedCard country={expandedCountry} expandHandler={setExpandedCountry} />
    </> : <>
      <SearchBar searchHandler={setSearchTerm} searchTerm={searchTerm} />
      <CardContainer query={searchTerm} expandHandler={setExpandedCountry} />
    </>}
  </div>
};

export default App;