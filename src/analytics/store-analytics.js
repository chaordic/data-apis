const PrestoClient = require('prestodb');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const prestoClient = new PrestoClient({
  url: 'http://presto.datalake.chaordicsystems.com',
  user: 'datalake-analytics-api'
});

const askAnalysis = (startDate, endDate, cnpjs, domains) => {
  if (cnpjs.length > 250) {
    throw 'Not allowed, you can query at most 200 cnpjs';
  }

  const cnpjsInClause = cnpjs.map(c => `'${c}'`).join(",");
  const domainInClause = domains.map(d => `'${d}'`).join(",");
  const yearMonthFilter = buildYearMonthFilter(startDate, endDate);

  const stmt = `
    SELECT
      st.cnpj,
      s.domain,
      date('${startDate}') as startDate,
      date('${endDate}') as endDate,

      count(*) as count_of_sales,

      sum(saletotalvalue) as sum_of_sale_total_value,
      avg(saletotalvalue) as avg_of_sale_total_value,
      max(saletotalvalue) as max_of_sale_total_value,
      min(saletotalvalue) as min_of_sale_total_value,

      sum(salequantity) as sum_of_sale_quantity,
      avg(salequantity) as avg_of_sale_quantity,
      max(salequantity) as max_of_sale_quantity,
      min(salequantity) as min_of_sale_quantity,

      sum(salediscountvalue) as sum_of_sale_discount_value,
      avg(salediscountvalue) as avg_of_sale_discount_value,
      max(salediscountvalue) as max_of_sale_discount_value,
      min(salediscountvalue) as min_of_sale_discount_value,

      sum(saleadditionvalue) as sum_of_sale_addition_value,
      avg(saleadditionvalue) as avg_of_sale_addition_value,
      max(saleadditionvalue) as max_of_sale_addition_value,
      min(saleadditionvalue) as min_of_sale_addition_value,

      sum(salechangevalue) as sum_of_sale_change_value,
      avg(salechangevalue) as avg_of_sale_change_value,
      max(salechangevalue) as max_of_sale_change_value,
      min(salechangevalue) as min_of_sale_change_value,

      sum(saleshippingvalue) as sum_of_sale_shipping_value,
      avg(saleshippingvalue) as avg_of_sale_shipping_value,
      max(saleshippingvalue) as max_of_sale_shipping_value,
      min(saleshippingvalue) as min_of_sale_shipping_value
    FROM
      hive.dw.sales s
    join
      hive.dw.stores st on st.storeid = s.sellerStoreId
    where
      domain in (${domainInClause})
    and
      (documentstatus = 'confirmed' or documentstatus is null)
    and
      st.cnpj in (${cnpjsInClause})
    and
      datetime between date('${startDate}') and date('${endDate}')
    and
      ${yearMonthFilter}
    group by
      st.cnpj, s.domain, s.documentStatus
    order by
      st.cnpj, s.domain
    limit
      2000
  `;

  console.log(stmt);

  return prestoClient
    .sendStatement(stmt)
    .then((result) => {
      console.log(result)

      const allAnaly = []
      let i, j
      for (i = 0; i < result.data.length; i++) {
        const cnpjAnaly = {}
        for (j = 0; j < result.data[i].length; j++) {
          cnpjAnaly[result.columns[j].name] = result.data[i][j]
        }
        allAnaly.push(cnpjAnaly)
      }
      console.log(allAnaly)
      return allAnaly;
    })
    .catch((error) => {
      console.error({ error })
    });
};

const buildYearMonthFilter = (startDate, endDate) => {
  const start = moment(startDate, 'YYYY-MM')
  const end   = moment(endDate, 'YYYY-MM')
  const range = moment.range(start, end)

  const arrayOfDates = Array.from(range.by('months'))
  const yearMonthFilter = arrayOfDates.map(x => `(year = ${x.year()} and month = ${x.month() + 1})`).join(" or ")

  return yearMonthFilter
};

exports.handler = async ({ request_uri_args: args }) => {
  const response = {
    statusCode: 200,
  };

  try {
    const { startDate, endDate, cnpj, domain } = args;
    const cnpjs = [].concat(cnpj);
    const domains = [].concat(domain);

    const analysis = await askAnalysis(startDate, endDate, cnpjs, domains);
    response.body = analysis;
  } catch (exception) {
    console.log(exception);
    response.statusCode = 404;
  }

  return response;
}
