import { Title, TextInput, Select, SelectItem, Text, Button, Card } from '@tremor/react';
import { useState } from 'react';
import { user } from '../config/user';
import axios from 'axios';

export default function Purchase() {
  const [item, setItem] = useState<string>("");
  const [principal, setPrincipal] = useState<string>("");
  const [options, setOptions] = useState<any[]>();

  async function getPlans() {
    try {
      const response = await axios.post('https://assurex.vercel.app/api/plan/request', {
        email: user.email,
        principal: principal,
      });

      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Purchase</Title>
      <Card className="mt-6">
        {options ? (
          <>
            <Title>Select a Plan</Title>
            <Select>
              {options.map((option, index) => (
                <SelectItem key={index} value={'' + index}>
                  {option.installments} installments - {option.interestRate}% interest
                </SelectItem>
              ))}
            </Select>
          </>
        ) : (
          <>
            <Title>Request a New Plan</Title>
            <Text className="mt-6">What is this plan for?</Text>
            <TextInput className="mt-2" />
            <Text className="mt-6">How much are you requesting? Please enter the total after tax.</Text>
            <TextInput className="mt-2" value={'' + principal} onChange={(e) => setPrincipal(e.currentTarget.value)} />
            <Button className="mt-6" onClick={getPlans}>View Plans</Button>
          </>
        )}
      </Card>
    </main>
  );
}