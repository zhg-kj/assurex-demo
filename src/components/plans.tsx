import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text } from "@tremor/react";
import { useEffect, useState } from "react";
import { user } from '../config/user';
import { Plan } from "../types";
import axios from "axios";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/plan/email/${user.email}`)
      .then(response => {
        setPlans(response.data);
      })
      .catch(error => {
        console.error("Error fetching plans:", error);
      });
  }, []);
  
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Start Date</TableHeaderCell>
          <TableHeaderCell>Principal</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>{plan.name}</TableCell>
            <TableCell>
              <Text>{}</Text>
            </TableCell>
            <TableCell>
              <Text>{plan.principal}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}