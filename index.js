// import parseXlsx from 'excel';

const XLSX = require('xlsx')
const workbook = XLSX.readFile('/home/bee/activities.xlsx')
const sheets = workbook.SheetNames
const emailJson = require('../../user')
const R = require('ramda')

const sheetsJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]])

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});


const xlsJson = sheetsJson.map(function (data) {
  return {
    'name': data['Organisation'],
    'org_id': data['Organisation_id'],
    'act_id': data['Activity ID'],
  }
});

const log = x => console.log(x)

const groupByOrgId = groupBy('org_id')
const orgIdGroup = groupByOrgId(xlsJson)

const getEmail = groupBy('org_id')
const orgIdEmail = getEmail(emailJson)

const reduceXlsData = arr => arr.reduce((acc, obj) =>
  ({
    name: obj.name,
    org_id: obj.org_id,
    act_id: [...acc.act_id, obj.act_id],
  }), {
  name: '',
  org_id: '',
  act_id: []
})

const formatData = R.compose(R.map(reduceXlsData), Object.values)
const formattedData = formatData(orgIdGroup)


const reduceEmailData = arr => arr.reduce((acc, obj) =>
  ({
    org_id: obj.org_id,
    email: [...acc.email, obj.email]
  }), {
  org_id: '',
  email: []
})

const formatEmailData = R.compose(R.map(reduceEmailData), Object.values)
const formattedEmailData = formatEmailData(orgIdEmail)

const groupedByOrgId = R.groupBy(R.prop('org_id'), formattedData)
const finalData = R.map(data => R.merge(data, groupedByOrgId[data.org_id][0]), formattedEmailData)

module.exports = finalData;



