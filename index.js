const fs = require('fs')


const {config} = require('./config');

const { flatten } = require('lodash');


const readInput = (filePath) => {
    const countriesRaw = fs.readFileSync(filePath);
    const countries = JSON.parse(countriesRaw)
    return countries;
}


const generateCountriesList = (countriesData) => {
    // print list of countries
    const countriesList = countriesData.features.map(feature => {
        return feature.properties.ADMIN
    })

    fs.writeFile('./output/countries.json', JSON.stringify(countriesList), () =>{})
}

const generateGeoJson = (countriesData) => {
    /*
    desired output: {
        type: "FeatureCollection",
        features: [
            {properties: {region: ''}, geometry: {type: 'Polygon', coordinates: [...mergedCountryCoordinates]}}
        ]
    }
    */

    const regions = config.regions;

    const countryFeatures = regions.map((region) => {
        const countriesInRegion = countriesData.features.filter(feature => {
            return region.countries.includes(feature.properties.ADMIN)
        })

        return countriesInRegion.map(countryFeature => {
            return {
                ...countryFeature,
                properties: {
                    ...countryFeature.properties,
                    regionId: region.id,
                    regionName: region.name

                },
            }
        })

        // const filteredCountryCoordinates = filteredCountryFeatures.map(feature => feature.geometry.coordinates)
        // const flattenedCoordinates = flatten(filteredCountryCoordinates);

    })
    const output = {
        "type": "FeatureCollection",                                                             
        "features": flatten(countryFeatures)
    
    }
    fs.writeFile('./output/output.geojson', JSON.stringify(output), () =>{})    
    
   

}








const countriesData = readInput('./input/countries.geojson');
generateCountriesList(countriesData);
generateGeoJson(countriesData);