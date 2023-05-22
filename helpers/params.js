let getParamStatus = (param, property, defaultParam) => {
    if (param.hasOwnProperty(property) && param[property] !== undefined) {
        return param[property];
    }
    return defaultParam;
}
module.exports = {
    getParamStatus
}