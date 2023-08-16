import { Title, TextInput, Text, Button, Card, Flex, Select, SelectItem, NumberInput, Callout, Badge, Table, TableRow, TableHead, TableHeaderCell, TableBody, TableCell, Divider, Grid, Metric, BarList } from '@tremor/react';
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from 'react';
import { user } from '../config/user';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { centsToDollars, dollarsToCents } from '../utils/money';
import { useToast } from '@chakra-ui/react';
import Scatter from '../components/filler/scatter';

const website = [
  { name: '/lorem', value: 1230 },
  { name: '/ipsum', value: 751 },
  { name: '/lorem', value: 471 },
  { name: '/ipsum', value: 280 },
  { name: '/lorem', value: 78 }
];

const shop = [
  { name: '/lorem', value: 453 },
  { name: '/ipsum', value: 351 },
  { name: '/lorem', value: 271 },
  { name: '/ipsum', value: 191 }
];

const app = [
  { name: '/lorem', value: 789 },
  { name: '/ipsum', value: 676 },
  { name: '/lorem', value: 564 },
  { name: '/ipsum', value: 234 },
  { name: '/lorem', value: 191 }
];

const data = [
  {
    category: 'Chart',
    stat: '10,234',
    data: website
  },
  {
    category: 'Chart',
    stat: '12,543',
    data: shop
  },
  {
    category: 'Chart',
    stat: '2,543',
    data: app
  }
];

export default function Purchase() {
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const [plans, setPlans] = useState<any[] | null>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(-1);
  const [request, setRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast()

  async function getPlans() {
    if (name !== "" && quantity && price && tax) {
      setError(false);
      setLoading(true);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        const requestData = JSON.stringify({
          email: user.email,
          name: name,
          principal: dollarsToCents(price + tax),
        });
    
        const response = await axios.post('https://assurex.vercel.app/api/plan/request', requestData, config);
    
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
      setLoading(false);
    } else {
      setError(true);
      toast({
        title: 'Missing fields.',
        status: 'error',
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }

  async function createPlanRequest() {
    setLoading(true)
    if (selectedPlanIndex !== null && plans) {
      try {
        const selectedPlan = plans[selectedPlanIndex];
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const requestData = {
          email: user.email,
          date: selectedPlan.date,
          name: selectedPlan.name,
          base: selectedPlan.base,
          principal: selectedPlan.principal,
          interest: selectedPlan.interestRate,
          installments: selectedPlan.installments,
        };
  
        await axios.post('https://assurex.vercel.app/api/plan/create', requestData, config);
  
        toast({
          title: 'Plan successfully created. Please navigate to Pay to complete your first payment and initialize the plan.',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
        setName("");
        setQuantity(0);
        setPrice(0);
        setTax(0);
        setUrl("");
        setError(false);

        setPlans(null);
        setSelectedPlanIndex(-1);
        setRequest(false);
      } catch (error) {
        console.error('Error creating plan request:', error);
        toast({
          title: 'Error creating plan request.',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      }
    }
    setLoading(false)
  }

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
          {request ? (
            <>
              <Flex justifyContent="between" alignItems="center">
                <Title>Request a New Plan</Title>
                <Button onClick={() => {setRequest(false); setPlans(null); setSelectedPlanIndex(-1);}} color="rose">Cancel</Button>
              </Flex>
              <Flex alignItems="start">
                <Flex flexDirection='col' style={{flex: 2}} alignItems="start" className="pr-6">
                  <Flex justifyContent="between" alignItems="center">
                    <Flex flexDirection='col' className='mr-6' alignItems="start" style={{flex: 3}}>
                      <Text className="mt-6">Item Name</Text>
                      <TextInput 
                        placeholder="Name of the purchase this plan is for..."
                        className="mt-2" 
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)} 
                        disabled={!(plans == null)}
                      />
                    </Flex>
                    <Flex flexDirection='col' alignItems="start" style={{flex: 1}}>
                      <Text className="mt-6">Quantity</Text>
                      <NumberInput 
                        placeholder="e.g. 2"
                        className="mt-2"
                        value={quantity}
                        onValueChange={(value) => setQuantity(value)}
                        disabled={!(plans == null)}
                      />
                    </Flex>
                  </Flex>
                  <Flex justifyContent="between" alignItems="center">
                    <Flex flexDirection='col' className='mr-6' alignItems="start">
                      <Text className="mt-6">Currency</Text>
                      <Select defaultValue='1' disabled={!(plans == null)} className="mt-2">
                        <SelectItem value="1">USD</SelectItem>
                        <SelectItem value="2">CAD</SelectItem>
                        <SelectItem value="3">XRP</SelectItem>
                      </Select>
                    </Flex>
                    <Flex flexDirection='col' className='mr-6' alignItems="start">
                      <Text className="mt-6">Price</Text>
                      <NumberInput 
                        placeholder="e.g. 99.99"
                        className="mt-2"
                        value={price}
                        onValueChange={(value) => setPrice(value)}
                        disabled={!(plans == null)}
                      />
                    </Flex>
                    <Flex flexDirection='col' alignItems="start">
                      <Text className="mt-6">Tax</Text>
                      <NumberInput 
                        placeholder="e.g. 3.14"
                        className="mt-2"
                        value={tax}
                        onValueChange={(value) => setTax(value)}
                        disabled={!(plans == null)}
                      />
                    </Flex>
                  </Flex>
                  <Text className="mt-6">{"Item URL (Optional)"}</Text>
                  <TextInput 
                    placeholder="e.g. http://assurex.com/pencil"
                    className="mt-2" 
                    type='url'
                    value={url}
                    onChange={(e) => setUrl(e.currentTarget.value)}
                    disabled={!(plans == null)}
                  />
                  {plans ? (
                    <Callout
                      className="mt-6"
                      title="Success"
                      icon={CheckCircleIcon}
                      color="teal"
                    >
                      Your request has been approved. Please select from the list of available plans on the right to proceed. 
                    </Callout>
                  ) : error ? (
                    <Callout
                      className="mt-6"
                      title="Missing Required Fields"
                      icon={ExclamationTriangleIcon}
                      color="rose"
                    >
                      Please ensure all information above is filled out correctly. Upon clicking View Plans we will review your request and, should your request be accepted, respond with multiple installment options for you select from. Note that if you continue with incomplete/incorrect information this may delay the review process or result in a rejection.
                    </Callout>
                  ) : (
                    <Callout className="mt-6" title="Warning" icon={ExclamationTriangleIcon} color="orange">
                      Please ensure all information above is filled out correctly. Upon clicking View Plans we will review your request and, should your request be accepted, respond with multiple installment options for you select from. Note that if you continue with incomplete/incorrect information this may delay the review process or result in a rejection.
                    </Callout>
                  )}
                  {plans ? (
                    <Button color="indigo" className="mt-6" onClick={createPlanRequest} disabled={selectedPlanIndex === -1}>{selectedPlanIndex === -1 ? 'Select a Plan' : 'Start Plan'}</Button>
                  ) : (
                    <Button color="indigo" className="mt-6" onClick={getPlans}>View Plans</Button>
                  )}
                  <Text className='mt-6'>Fees and interest rates associated with the payment plan will be disclosed upfront. Failure to make payments on time may result in additional fees and interest charges. Any changes to fees or interest rates will be communicated to you in advance.</Text>
                  <Text className='mt-2'>We may perform a credit check as part of the application process for the payment plan. By using the Service, you consent to our use of your credit information for this purpose. Additionally, information about your payment activity may be reported to credit bureaus.</Text>
                  <Text className='mt-2'>Late payments may result in penalties, increased interest rates, or suspension of the payment plan. In the event of default, we reserve the right to pursue all available legal remedies, including collection efforts and reporting to credit bureaus.</Text>
                </Flex>
                <Card 
                  style={{flex: 1, height: "508px"}} 
                  className='mt-6' 
                  decoration="top"
                  decorationColor="indigo"
                >
                  <Title>Plan Details</Title>
                  {plans ? (
                    <>
                      <Text className="mt-6">Select a Plan</Text>
                      <Select className='mt-2' value={"" + selectedPlanIndex} onValueChange={(value) => setSelectedPlanIndex(+value)}>
                        {plans.map((plan, index) => (
                          <SelectItem
                            value={"" + index}
                          >
                            {plan.installments} months
                          </SelectItem>
                        ))}
                      </Select>
                      {selectedPlanIndex !== -1 ? (
                        <Flex flexDirection='col' justifyContent='between' style={{height: "342px"}}>
                          <Flex flexDirection='col' alignItems='stretch'>
                            <Flex className="justify-between items-center mb-2 mt-6">
                              <Title>${centsToDollars(plans[selectedPlanIndex].base) + ' /month'}</Title>
                              <Badge size="md">{plans[selectedPlanIndex].installments} months</Badge>
                            </Flex>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableHeaderCell>APR</TableHeaderCell>
                                  <TableHeaderCell>Interest</TableHeaderCell>
                                  <TableHeaderCell>Total</TableHeaderCell>
                                </TableRow>
                              </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>{plans[selectedPlanIndex].interest}%</TableCell>
                                    <TableCell>
                                      <Text>${centsToDollars(plans[selectedPlanIndex].base * plans[selectedPlanIndex].installments - plans[selectedPlanIndex].principal)}</Text>
                                    </TableCell>
                                    <TableCell>
                                      <Text>${centsToDollars(plans[selectedPlanIndex].base * plans[selectedPlanIndex].installments)}</Text>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                            </Table>
                          </Flex>
                          <Flex flexDirection='col' alignItems='end'>
                            <Divider/>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableHeaderCell>Total Loaned</TableHeaderCell>
                                  <TableHeaderCell>Due Today</TableHeaderCell>
                                </TableRow>
                              </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>${centsToDollars(plans[selectedPlanIndex].principal)}</TableCell>
                                    <TableCell>
                                      <Text>${centsToDollars(plans[selectedPlanIndex].base)}</Text>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                            </Table>
                          </Flex>
                        </Flex>
                      ) : (
                        <>
                        </>
                      )}
                    </>
                  ) : (
                    <>

                    </>
                  )}
                </Card>
              </Flex>
            </>
          ) : (
            <>
              <Flex justifyContent="between" alignItems="center">
                <Title>Purchase</Title>
                <Button color="indigo" onClick={() => setRequest(true)}>Request a New Plan</Button>
              </Flex>
              <Scatter />
              <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">
                {data.map((item) => (
                  <Card key={item.category}>
                    <Title>{item.category}</Title>
                    <Flex
                      justifyContent="start"
                      alignItems="baseline"
                      className="space-x-2"
                    >
                      <Metric>{item.stat}</Metric>
                      <Text>Total views</Text>
                    </Flex>
                    <Flex className="mt-6">
                      <Text>Pages</Text>
                      <Text className="text-right">Views</Text>
                    </Flex>
                    <BarList
                      data={item.data}
                      valueFormatter={(number: number) =>
                        Intl.NumberFormat('us').format(number).toString()
                      }
                      className="mt-2"
                    />
                  </Card>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </main>
  );
}