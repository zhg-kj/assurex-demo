import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { Payment } from "../types";
import { user } from '../config/user';
import axios from "axios";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/payment/email/${user.email}`)
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error("Error fetching plans:", error);
      });
  }, []);
  
  return (
    <>
      <Title>Recent Payments</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Plan</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
          <TableBody>
            {payments.slice(0, 6).map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.pid}</TableCell>
                <TableCell>
                  <Text>{}</Text>
                </TableCell>
                <TableCell>
                  <Text>{payment.amount}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </>
  )
}