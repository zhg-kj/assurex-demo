import { Badge, Button, TableCell, TableRow, Text } from "@tremor/react";
import { Invoice, Plan } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import { centsToDollars, centsToXRP } from "../utils/money";

export default function PlanRow({ plan, setPlan }: { plan: Plan, setPlan: any }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    axios.get(`https://assurex.vercel.app/api/invoice/plan/${plan.id}`)
      .then(response => {
        setInvoices(response.data);
      })
      .catch(error => {
        console.error("Error fetching invoices:", error);
      });
  }, [plan]);

  const nextInvoice = invoices
    .filter(invoice => !invoice.fulfilled)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())[0];

  const today = new Date();
  
  let badgeColor: any, badgeLabel;
  
  if (!nextInvoice) {
    badgeColor = 'teal';
    badgeLabel = 'Complete';
  } else if (new Date(nextInvoice.due).getTime() - today.getTime() <= 0) {
    badgeColor = 'rose';
    badgeLabel = 'Overdue';
  } else if (new Date(nextInvoice.due).getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
    badgeColor = 'rose';
    badgeLabel = 'Due';
  } else {
    badgeColor = 'orange';
    badgeLabel = 'In Progress';
  }

  return (
    <TableRow>
      <TableCell>{plan.name}</TableCell>
      <TableCell>
        <Badge size="md" color={badgeColor}>{badgeLabel}</Badge>
      </TableCell>
      <TableCell>
        <Text>{moment(plan.date).add(24, 'hour').format('YYYY-MM-DD')}</Text>
      </TableCell>
      <TableCell>
        <Text>${centsToDollars(plan.principal)}</Text>
      </TableCell>
      <TableCell>
        <Text>{nextInvoice ? moment(nextInvoice.due).add(24, 'hour').format('YYYY-MM-DD') : "N/A"}</Text>
      </TableCell>
      <TableCell>
        <Text>{nextInvoice ? centsToXRP(nextInvoice.amnt_due) + " XRP" : "N/A"}</Text>
      </TableCell>
      <TableCell>
        <Button color="indigo" onClick={() => setPlan(plan)} disabled={!nextInvoice}>Pay</Button>
      </TableCell>
    </TableRow>
  )
}