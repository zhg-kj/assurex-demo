import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title, Text, Button, Flex } from '@tremor/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { user } from '../config/user';
import { addAccount, getWalletDetails } from '../utils/xrp';
import { ClipLoader } from 'react-spinners';
import { useToast } from '@chakra-ui/react';

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newAccount, setNewAccount] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://assurex.vercel.app/api/account/${user.email}`);
        const enhancedAccounts = await Promise.all(response.data.map(async (account: { seed: any; }) => {
          const walletDetails = await getWalletDetails(account.seed);
          return {
            account: account,
            wallet: walletDetails?.wallet,
            balance: walletDetails?.balance
          };
        }));
        setAccounts(enhancedAccounts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setNewAccount(newAccount + 1)
        setLoading(false);
      }
    };
  
    fetchAccountData();
  }, [newAccount]);

  function generateName(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    
    return result;
  }

  const handleAdd = async () => {
    setLoading(true)
    const seed = await addAccount();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const requestData = {
      email: user.email,
      name: "Account #" + generateName(4),
      seed: seed
    };

    axios.post(`https://assurex.vercel.app/api/account/create`, requestData, config)
      .then(response => {
        setNewAccount(1);
        setNewAccount(1);
        toast({
          title: 'Account successfully added',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      })
      .catch(error => {
        console.error("Error creating accounts:", error);
        toast({
          title: 'Failed to ddd account',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      });
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
          <Flex justifyContent="between" alignItems="center">
            <Title>Accounts</Title>
            <Button color="indigo" onClick={handleAdd}>Add Account</Button>
          </Flex>
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
                  <TableRow key={account.account.seed}>
                    <TableCell>{account.account.name}</TableCell>
                    <TableCell>
                      <Text>{account.wallet.address}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{account.balance} XRP</Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </main>
  )
}