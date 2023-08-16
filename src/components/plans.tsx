import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { useEffect, useState } from "react";
import { user } from '../config/user';
import { Plan } from "../types";
import axios from "axios";
import PlanRow from "./planRow";

export default function Plans({ setPlan }: { setPlan: any }) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [error, setError] = useState<number>(0)

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/plan/email/${user.email}`)
      .then(response => {
        setPlans(response.data);
      })
      .catch(error => {
        console.error("Error fetching plans:", error);
        setError(1)
      });
  }, [error]);
  
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Start Date</TableHeaderCell>
          <TableHeaderCell>Principal</TableHeaderCell>
          <TableHeaderCell>Next Payment Date</TableHeaderCell>
          <TableHeaderCell>Next Payment Amount</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {plans.map((plan) => (
          <PlanRow key={plan.id} plan={plan} setPlan={setPlan} />
        ))}
      </TableBody>
    </Table>
  )
}