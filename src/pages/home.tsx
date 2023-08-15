import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title, Text } from '@tremor/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Account } from '../types';
import { user } from '../config/user';

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/account/${user.email}`)
      .then(response => {
        setAccounts(response.data);
      })
      .catch(error => {
        console.error("Error fetching accounts:", error);
      });
  }, []);
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Accounts</Title>
      <Card className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Balance</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.address}>
                <TableCell>{account.name}</TableCell>
                <TableCell>
                  <Text>{account.address}</Text>
                </TableCell>
                <TableCell>
                  <Text>{account.balance}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  )
}