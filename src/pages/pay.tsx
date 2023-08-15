import { AreaChart, Card, Col, Grid, Title, Text, Select, SelectItem, Button, Flex, Callout, NumberInput, TextInput, Divider, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@tremor/react';
import Payments from '../components/payments';
import Plans from '../components/plans';
import { useEffect, useState } from 'react';
import { Account, Invoice, Plan } from '../types';
import axios from 'axios';
import { user } from '../config/user';
import { sendXRP } from '../utils/xrp';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import { centsToDollars, centsToXRP } from '../utils/money';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const data = [
  {
    Month: 'Jan 1',
    Price: 0.14
  },
  {
    Month: 'Feb 1',
    Price: 0.12
  },
  {
    Month: 'Mar 1',
    Price: 0.15
  },
  {
    Month: 'Apr 1',
    Price: 0.24
  },
  {
    Month: 'May 1',
    Price: 0.31
  },
  {
    Month: 'Jun 1',
    Price: 0.23
  },
  {
    Month: 'Jul 1',
    Price: 0.71
  },
  {
    Month: 'Aug 1',
    Price: 0.65
  }
];

export default function Pay() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nextInvoice, setNextInvoice] = useState<Invoice>({id: 0, pid: 0, email: "", due: new Date(), amnt_due: 1, total: 1, fulfilled: 0});
  const navigate = useNavigate()
  const toast = useToast()
  
  useEffect(() => {
    if (plan) {
      setLoading(true)
      axios.get(`https://assurex.vercel.app/api/invoice/plan/${plan.id}`)
        .then(response => {
          setNextInvoice(response.data.filter((invoice: { fulfilled: any; }) => invoice.fulfilled !== 1)
          .sort((a: { due: string | number | Date; }, b: { due: string | number | Date; }) => new Date(a.due).getTime() - new Date(b.due).getTime())[0])
        })
        .catch(error => {
          console.error("Error fetching invoices:", error);
        });
      setLoading(false)
    }
  }, [plan]);

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/account/${user.email}`)
      .then(response => {
        setAccounts(response.data);
      })
      .catch(error => {
        console.error("Error fetching accounts:", error);
      });
  }, []);

  const handleSend = async () => {
    if (value === "" || accounts[+value].balance < +centsToXRP(nextInvoice.amnt_due)) {
      console.log("L")
      return
    }

    setLoading(true)
    const hash = await sendXRP(nextInvoice.amnt_due);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const requestData = JSON.stringify({
        email: user.email,
        hash: hash,
        pid: plan?.id,
      });
  
      const response = await axios.post('https://assurex.vercel.app/api/payment/confirm', requestData, config);
      console.log(response)
      console.log("Success")
      setPlan(null);
      setValue("");
      toast({
        title: 'Payment successfully completed',
        status: 'success',
        isClosable: true,
        position: 'bottom-left',
      })
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: 'Error completing payment',
        status: 'error',
        isClosable: true,
        position: 'bottom-left',
      })
    }
    setLoading(false);
  };
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {loading ? (
        <Flex flexDirection='col' justifyContent='center' alignItems='center' style={{height: `calc(100vh - 144px)`}}>
          <ClipLoader
            color="#6366f1"
            size={50}
            aria-label="Loading Spinner"
          />
        </Flex>
      ) : (
        <>
          {plan ? (
            <>
              <Flex justifyContent="between" alignItems="center">
                <Title>Pay for Plan #{plan.id}</Title>
                <Button onClick={() => navigate(0)} color="rose">Cancel</Button>
              </Flex>
              <Flex alignItems="start">
                <Flex flexDirection='col' style={{flex: 2}} alignItems="start" className="pr-6">
                  <Flex justifyContent="between" alignItems="center">
                    <Flex flexDirection='col' className='mr-6' alignItems="start">
                      <Text className="mt-6">Currency</Text>
                      <Select defaultValue='1' disabled={true} className="mt-2">
                        <SelectItem value="1">XRP</SelectItem>
                      </Select>
                    </Flex>
                    <Flex flexDirection='col' className='mr-6' alignItems="start">
                      <Text className="mt-6">Amount ~ 1 XRP = 0.65 USD</Text>
                      <NumberInput 
                        className="mt-2"
                        value={centsToXRP(nextInvoice.amnt_due)}
                        disabled={true}
                      />
                    </Flex>
                    <Flex flexDirection='col' className='mr-6' alignItems="start">
                      <Text className="mt-6">Date</Text>
                      <TextInput 
                        className="mt-2" 
                        value={moment(Date.now()).format('YYYY-MM-DD')}
                        disabled={true}
                      />
                    </Flex>
                  </Flex>
                  <Text className="mt-6">Pay From</Text>
                  <Select value={value} onValueChange={setValue} className="mt-2" placeholder='Select account...'>
                    {accounts.map((account, index) => (
                      <SelectItem value={"" + index} key={account.address}>
                        {account.name} - {account.balance}
                      </SelectItem>
                    ))}
                  </Select>
                  <Callout className="mt-6" title="Reminder" icon={ExclamationTriangleIcon} color="orange">
                    By clicking the "Submit Payment" button, you authorize us to process the payment from your chosen account as specified in the payment plan.
                  </Callout>
                  <Button color="indigo" onClick={handleSend} className="mt-6">Submit Payment</Button>
                  <Text className='mt-6'>Refund and cancellation policies are in accordance with the terms outlined in the payment plan. Please review the cancellation policy carefully before proceeding.</Text>
                  <Text className='mt-2'>If you have questions or concerns about your payment or the payment plan, please contact our customer support at help@assurex.com.</Text>
                </Flex>
                <Card 
                  style={{flex: 1, height: "400px"}} 
                  className='mt-6' 
                  decoration="top"
                  decorationColor="indigo"
                >
                  <Title>Invoice Details</Title>
                  <Flex flexDirection='col' justifyContent='between' style={{height: "324px"}}>
                    <Flex flexDirection='col' alignItems='stretch'>
                      
                    </Flex>
                    <Flex flexDirection='col' alignItems='end'>
                      <Divider/>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeaderCell>Due Date</TableHeaderCell>
                            <TableHeaderCell>Amount</TableHeaderCell>
                          </TableRow>
                        </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Text>{moment(nextInvoice.due).format('YYYY-MM-DD')}</Text>
                              </TableCell>
                              <TableCell>
                                <Text>${centsToDollars(nextInvoice.amnt_due)}</Text>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                      </Table>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
            </>
          ) : (
          <>
            <Title>Pay</Title>
            <Grid numItemsSm={1} numItemsLg={3} className="gap-6 mt-6">
              <Col numColSpan={1} numColSpanLg={2}>
                <Card style={{height: "432px"}}>
                  <Text>XRP Price</Text>
                  <Title>USD$0.65</Title>
                  <AreaChart
                    className="mt-4 h-80"
                    data={data}
                    categories={['Price']}
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
              <Plans setPlan={setPlan} />
            </Card>
          </>
          )}
        </>
      )}
    </main>
  )
}