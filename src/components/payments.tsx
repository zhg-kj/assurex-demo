import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { Payment } from "../types";
import { user } from '../config/user';
import axios from "axios";
import moment from "moment";
import { centsToXRP, dropsToXRP } from "../utils/money";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/payment/email/${user.email}`)
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error("Error fetching payments:", error);
        setPayments([])
      });
  }, [payments]);
  
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
                  <Text>{moment(payment.date).format('YYYY-MM-DD')}</Text>
                </TableCell>
                <TableCell>
                  <Text>{dropsToXRP(centsToXRP(payment.amount))} XRP</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </>
  )
}