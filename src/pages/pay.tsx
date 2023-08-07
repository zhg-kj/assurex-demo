import { AreaChart, Card, Col, Grid, Title, Text } from '@tremor/react';
import Payments from '../components/payments';
import Plans from '../components/plans';

const data = [
  {
    Month: 'Jan 21',
    Sales: 2890,
    Profit: 2400
  },
  {
    Month: 'Feb 21',
    Sales: 1890,
    Profit: 1398
  },
  {
    Month: 'Jan 22',
    Sales: 3890,
    Profit: 2980
  }
];

export default function Pay() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Pay</Title>
      <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mt-6">
        <Col numColSpan={1} numColSpanLg={2}>
          <Card style={{height: "432px"}}>
            <Title>Performance</Title>
            <Text>Comparison between Sales and Profit</Text>
            <AreaChart
              className="mt-4 h-80"
              data={data}
              categories={['Sales', 'Profit']}
              index="Month"
              colors={['indigo', 'fuchsia']}
              valueFormatter={(number: number) =>
                `$ ${Intl.NumberFormat('us').format(number).toString()}`
              }
              yAxisWidth={60}
            />
          </Card>
        </Col>
        <Col numColSpan={1}>
          <Card style={{height: "432px"}}>
            <Payments />
          </Card>
        </Col>
      </Grid>
      <Title className="mt-6">Plans</Title>
      <Card className="mt-6">
        <Plans />
      </Card>
    </main>
  )
}